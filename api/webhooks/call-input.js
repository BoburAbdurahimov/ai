// Webhook endpoint: Call Input
// Handles DTMF input and user speech during the call
const { z } = require('zod');
const { updateCall, logCallEvent, getCall, appendToTranscript } = require('../../lib/supabase');
const { getChatResponse } = require('../../lib/llm');
const { speechToText, textToSpeech } = require('../../lib/yandex');
const { checkRateLimit } = require('../lib/rate-limiter');

const requestSchema = z.object({
  callId: z.string().min(1),
  inputType: z.enum(['dtmf', 'speech']),
  input: z.string().optional(),
  audioData: z.string().optional()
});

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate input shape early
    const parsed = requestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid payload', details: parsed.error.flatten() });
    }

    const { callId, inputType, input, audioData } = parsed.data;

    // Rate limit per call and caller (requires REDIS_URL)
    const rateResult = await checkRateLimit(`call:${callId}`, {
      windowMs: 10_000,
      maxRequests: 15,
      keyPrefix: 'call-input'
    });
    if (!rateResult.allowed) {
      return res.status(429).json({
        error: 'Too many requests',
        retryAfter: rateResult.retryAfter
      });
    }

    if (!callId) {
      return res.status(400).json({ error: 'Missing callId' });
    }

    console.log(`[CALL INPUT] Call ID: ${callId}, Type: ${inputType}, Input: ${input}`);

    // Handle DTMF input (language selection)
    if (inputType === 'dtmf') {
      return await handleDTMFInput(callId, input, res);
    }

    // Handle speech input (Russian AI conversation)
    if (inputType === 'speech') {
      return await handleSpeechInput(callId, audioData, res);
    }

    res.status(400).json({ error: 'Invalid input type' });
  } catch (error) {
    console.error('[CALL INPUT ERROR]', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
};

/**
 * Handle DTMF language selection
 */
async function handleDTMFInput(callId, digit, res) {
  await logCallEvent(callId, 'dtmf_input', { digit });

  // Press 1 = Russian (AI handles)
  if (digit === '1') {
    await updateCall(callId, {
      language: 'RU',
      handled_by: 'AI'
    });

    await logCallEvent(callId, 'language_selected', { language: 'RU', flow: 'AI' });

    // Start Russian AI conversation
    return res.status(200).json({
      success: true,
      action: 'start_conversation',
      message: {
        text: 'Здравствуйте! Я ваш виртуальный помощник. Чем могу помочь?',
        language: 'ru-RU',
        voice: 'alena'
      },
      config: {
        stt_enabled: true,
        stt_language: 'ru-RU',
        continuous_listening: true
      }
    });
  }

  // Press 2 = Uzbek (transfer to human)
  if (digit === '2') {
    await updateCall(callId, {
      language: 'UZ',
      handled_by: 'HUMAN',
      outcome: 'transfer'
    });

    await logCallEvent(callId, 'language_selected', { language: 'UZ', flow: 'HUMAN' });

    // Transfer to operator
    const operatorNumber = process.env.OPERATOR_PHONE_NUMBER;

    return res.status(200).json({
      success: true,
      action: 'transfer',
      message: {
        text: 'Iltimos kuting, sizni operator bilan bog\'laymiz.',
        language: 'uz-UZ',
        voice: 'default'
      },
      transfer: {
        to: operatorNumber,
        type: 'blind', // One-way transfer, no return
        timeout: 30
      }
    });
  }

  // Invalid input
  return res.status(200).json({
    success: false,
    action: 'retry',
    message: {
      text: 'Неверный выбор. Нажмите 1 для русского или 2 для узбекского.',
      language: 'ru-RU',
      voice: 'alena'
    }
  });
}

/**
 * Handle speech input for Russian AI conversation
 */
async function handleSpeechInput(callId, audioData, res) {
  try {
    // Get call to retrieve conversation history
    const call = await getCall(callId);
    if (!call) {
      return res.status(404).json({ error: 'Call not found' });
    }

    // Transcribe speech using Yandex STT
    const audioBuffer = Buffer.from(audioData, 'base64');
    const sttResult = await speechToText(audioBuffer);

    if (!sttResult.success || !sttResult.text) {
      await logCallEvent(callId, 'stt_error', { error: sttResult.error });
      return res.status(200).json({
        success: true,
        action: 'continue',
        message: {
          text: 'Извините, я не расслышал. Можете повторить?',
          language: 'ru-RU',
          voice: 'alena'
        }
      });
    }

    const userText = sttResult.text;
    console.log(`[STT] User said: ${userText}`);

    // Add user message to transcript
    await appendToTranscript(callId, {
      role: 'user',
      content: userText
    });

    await logCallEvent(callId, 'user_speech', { text: userText });

    // Get conversation history
    const conversationHistory = call.conversation_transcript || [];

    // Get LLM response with safety guardrails
    const llmResult = await getChatResponse(conversationHistory, userText);

    if (!llmResult.success) {
      await logCallEvent(callId, 'llm_error', { error: llmResult.error });
      return res.status(200).json({
        success: true,
        action: 'continue',
        message: {
          text: 'Извините, произошла ошибка. Пожалуйста, повторите.',
          language: 'ru-RU',
          voice: 'alena'
        }
      });
    }

    const aiResponse = llmResult.message;
    console.log(`[LLM] AI responded: ${aiResponse}`);

    // Add AI response to transcript
    await appendToTranscript(callId, {
      role: 'assistant',
      content: aiResponse
    });

    await logCallEvent(callId, 'ai_response', { text: aiResponse });

    // Detect booking intent (simple keyword detection for MVP)
    const isBooking = detectBookingIntent(userText, aiResponse);
    if (isBooking) {
      await updateCall(callId, { outcome: 'booking' });
    }

    // Return AI response for TTS
    return res.status(200).json({
      success: true,
      action: 'continue',
      message: {
        text: aiResponse,
        language: 'ru-RU',
        voice: 'alena'
      },
      config: {
        continue_listening: true
      }
    });

  } catch (error) {
    console.error('[SPEECH INPUT ERROR]', error);
    await logCallEvent(callId, 'speech_processing_error', { error: error.message });
    
    return res.status(200).json({
      success: true,
      action: 'continue',
      message: {
        text: 'Извините, произошла ошибка. Чем еще могу помочь?',
        language: 'ru-RU',
        voice: 'alena'
      }
    });
  }
}

/**
 * Simple booking intent detection (MVP approach)
 */
function detectBookingIntent(userText, aiResponse) {
  const bookingKeywords = [
    'запись',
    'записаться',
    'забронировать',
    'бронирование',
    'appointment',
    'booking',
    'время',
    'дата'
  ];

  const combinedText = (userText + ' ' + aiResponse).toLowerCase();
  return bookingKeywords.some(keyword => combinedText.includes(keyword));
}
