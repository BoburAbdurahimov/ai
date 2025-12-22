// Webhook endpoint: Call Start
// Triggered when a new call comes in
const { createCall, logCallEvent } = require('../../lib/supabase');

module.exports = async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { callId, callerNumber, timestamp } = req.body;

    if (!callId) {
      return res.status(400).json({ error: 'Missing callId' });
    }

    console.log(`[CALL START] Call ID: ${callId}, Caller: ${callerNumber}`);

    // Create initial call record (language unknown at this point)
    await createCall({
      callId,
      callerNumber,
      language: 'RU', // Default, will be updated after DTMF
      handledBy: 'AI', // Default, will be updated if Uzbek
      outcome: 'info', // Default
      status: 'active'
    });

    // Log the start event
    await logCallEvent(callId, 'start', {
      caller_number: callerNumber,
      timestamp: timestamp || new Date().toISOString()
    });

    // Return DTMF menu configuration
    // This tells the call provider (e.g., Vapi) to play the language menu
    const response = {
      success: true,
      action: 'gather',
      message: {
        type: 'dtmf_menu',
        prompt: {
          text: 'Здравствуйте! Для русского языка нажмите 1. O\'zbek tili uchun 2 ni bosing.',
          language: 'ru-RU',
          voice: 'alena'
        },
        options: [
          {
            digit: '1',
            action: 'russian_flow',
            label: 'Russian'
          },
          {
            digit: '2',
            action: 'uzbek_transfer',
            label: 'Uzbek'
          }
        ],
        timeout: 10,
        numDigits: 1,
        retries: 2,
        invalidPrompt: 'Неверный выбор. Пожалуйста, нажмите 1 для русского или 2 для узбекского.'
      }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('[CALL START ERROR]', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
};
