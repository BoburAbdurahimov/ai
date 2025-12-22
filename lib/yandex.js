// Yandex SpeechKit integration for Russian language calls
const axios = require('axios');

const YANDEX_API_KEY = process.env.YANDEX_API_KEY;
const YANDEX_FOLDER_ID = process.env.YANDEX_FOLDER_ID;

/**
 * Yandex SpeechKit STT (Speech-to-Text)
 * Converts audio to text for Russian language
 */
async function speechToText(audioBuffer, options = {}) {
  if (!YANDEX_API_KEY || !YANDEX_FOLDER_ID) {
    throw new Error('Yandex credentials not configured');
  }

  const url = 'https://stt.api.cloud.yandex.net/speech/v1/stt:recognize';

  try {
    const response = await axios.post(url, audioBuffer, {
      headers: {
        'Authorization': `Api-Key ${YANDEX_API_KEY}`,
        'Content-Type': 'audio/ogg',
      },
      params: {
        folderId: YANDEX_FOLDER_ID,
        lang: 'ru-RU',
        format: 'oggopus', // Phone quality format
        sampleRateHertz: options.sampleRate || 8000,
        ...options
      }
    });

    return {
      success: true,
      text: response.data.result,
      raw: response.data
    };
  } catch (error) {
    console.error('Yandex STT error:', error.message);
    return {
      success: false,
      error: error.message,
      text: ''
    };
  }
}

/**
 * Yandex SpeechKit TTS (Text-to-Speech)
 * Converts text to natural Russian speech
 */
async function textToSpeech(text, options = {}) {
  if (!YANDEX_API_KEY || !YANDEX_FOLDER_ID) {
    throw new Error('Yandex credentials not configured');
  }

  const url = 'https://tts.api.cloud.yandex.net/speech/v1/tts:synthesize';

  try {
    const response = await axios.post(url, null, {
      headers: {
        'Authorization': `Api-Key ${YANDEX_API_KEY}`,
      },
      params: {
        folderId: YANDEX_FOLDER_ID,
        text: text,
        lang: 'ru-RU',
        voice: options.voice || 'alena', // Natural Russian female voice
        format: 'oggopus',
        sampleRateHertz: options.sampleRate || 8000,
        emotion: options.emotion || 'neutral',
        speed: options.speed || 1.0,
        ...options
      },
      responseType: 'arraybuffer'
    });

    return {
      success: true,
      audio: response.data,
      format: 'oggopus'
    };
  } catch (error) {
    console.error('Yandex TTS error:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Streaming STT for real-time transcription (for future use)
 */
async function streamingSpeechToText(audioStream) {
  // Placeholder for streaming implementation
  // Yandex supports streaming via gRPC - would need @grpc/grpc-js
  throw new Error('Streaming STT not yet implemented');
}

module.exports = {
  speechToText,
  textToSpeech,
  streamingSpeechToText
};
