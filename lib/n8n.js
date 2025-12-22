// n8n webhook trigger utilities
const axios = require('axios');

/**
 * Trigger n8n webhook for Google Sheets update
 */
async function triggerSheetsUpdate(callData) {
  const webhookUrl = process.env.N8N_SHEETS_WEBHOOK;
  
  if (!webhookUrl) {
    console.warn('N8N_SHEETS_WEBHOOK not configured, skipping sheets update');
    return null;
  }

  try {
    const response = await axios.post(webhookUrl, {
      event: 'sheets_update',
      call_id: callData.call_id,
      language: callData.language,
      handled_by: callData.handled_by,
      outcome: callData.outcome,
      call_duration_seconds: callData.call_duration_seconds,
      timestamp: callData.timestamp,
      caller_number: callData.caller_number
    }, {
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Sheets update triggered successfully');
    return response.data;
  } catch (error) {
    console.error('Error triggering sheets update:', error.message);
    // Don't throw - we don't want to fail the call if n8n is down
    return null;
  }
}

/**
 * Trigger n8n webhook for Telegram alert
 */
async function triggerTelegramAlert(alertType, callData) {
  const webhookUrl = process.env.N8N_TELEGRAM_WEBHOOK;
  
  if (!webhookUrl) {
    console.warn('N8N_TELEGRAM_WEBHOOK not configured, skipping telegram alert');
    return null;
  }

  try {
    const response = await axios.post(webhookUrl, {
      event: 'telegram_alert',
      alert_type: alertType, // 'new_booking', 'missed_call', 'human_transfer'
      call_id: callData.call_id,
      language: callData.language,
      handled_by: callData.handled_by,
      outcome: callData.outcome,
      timestamp: callData.timestamp,
      caller_number: callData.caller_number
    }, {
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log(`Telegram alert (${alertType}) triggered successfully`);
    return response.data;
  } catch (error) {
    console.error('Error triggering telegram alert:', error.message);
    return null;
  }
}

/**
 * Trigger n8n webhook for daily summary
 */
async function triggerDailySummary(statsData) {
  const webhookUrl = process.env.N8N_DAILY_SUMMARY_WEBHOOK;
  
  if (!webhookUrl) {
    console.warn('N8N_DAILY_SUMMARY_WEBHOOK not configured, skipping daily summary');
    return null;
  }

  try {
    const response = await axios.post(webhookUrl, {
      event: 'daily_summary',
      date: statsData.call_date,
      total_calls: statsData.total_calls,
      ai_handled_calls: statsData.ai_handled_calls,
      human_transfers: statsData.human_transfers,
      bookings: statsData.bookings,
      missed_calls: statsData.missed_calls,
      russian_calls: statsData.russian_calls,
      uzbek_calls: statsData.uzbek_calls,
      avg_duration_seconds: statsData.avg_duration_seconds
    }, {
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Daily summary triggered successfully');
    return response.data;
  } catch (error) {
    console.error('Error triggering daily summary:', error.message);
    return null;
  }
}

/**
 * Master function to handle all n8n notifications for a call
 */
async function notifyCall(callData) {
  const notifications = [];

  // Always trigger sheets update
  notifications.push(triggerSheetsUpdate(callData));

  // Trigger specific alerts based on outcome
  if (callData.outcome === 'booking') {
    notifications.push(triggerTelegramAlert('new_booking', callData));
  }
  
  if (callData.outcome === 'missed') {
    notifications.push(triggerTelegramAlert('missed_call', callData));
  }
  
  if (callData.handled_by === 'HUMAN') {
    notifications.push(triggerTelegramAlert('human_transfer', callData));
  }

  // Execute all notifications in parallel
  await Promise.allSettled(notifications);
}

module.exports = {
  triggerSheetsUpdate,
  triggerTelegramAlert,
  triggerDailySummary,
  notifyCall
};
