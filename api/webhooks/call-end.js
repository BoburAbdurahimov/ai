// Webhook endpoint: Call End
// Triggered when a call ends
const { updateCall, logCallEvent, getCall } = require('../../lib/supabase');
const { notifyCall } = require('../../lib/n8n');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { callId, duration, endReason, timestamp } = req.body;

    if (!callId) {
      return res.status(400).json({ error: 'Missing callId' });
    }

    console.log(`[CALL END] Call ID: ${callId}, Duration: ${duration}s, Reason: ${endReason}`);

    // Get call data
    const call = await getCall(callId);
    if (!call) {
      return res.status(404).json({ error: 'Call not found' });
    }

    // Determine if call was missed
    const isMissed = endReason === 'no_answer' || endReason === 'rejected' || duration < 5;
    const outcome = isMissed ? 'missed' : (call.outcome || 'info');

    // Update call record
    const updatedCall = await updateCall(callId, {
      call_duration_seconds: duration,
      status: 'completed',
      outcome: outcome
    });

    // Log end event
    await logCallEvent(callId, 'end', {
      duration,
      end_reason: endReason,
      timestamp: timestamp || new Date().toISOString(),
      final_outcome: outcome
    });

    console.log(`[CALL END] Final outcome: ${outcome}, Language: ${call.language}, Handler: ${call.handled_by}`);

    // Trigger n8n notifications
    // This will:
    // 1. Update Google Sheets
    // 2. Send Telegram alerts (for bookings, missed calls, human transfers)
    await notifyCall({
      call_id: updatedCall.call_id,
      language: updatedCall.language,
      handled_by: updatedCall.handled_by,
      outcome: updatedCall.outcome,
      call_duration_seconds: updatedCall.call_duration_seconds,
      timestamp: updatedCall.timestamp,
      caller_number: updatedCall.caller_number
    });

    // Mark as notified
    await updateCall(callId, {
      n8n_notified: true,
      n8n_notified_at: new Date().toISOString()
    });

    res.status(200).json({
      success: true,
      message: 'Call ended and logged successfully',
      call_id: callId,
      outcome: outcome,
      duration: duration
    });
  } catch (error) {
    console.error('[CALL END ERROR]', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
};
