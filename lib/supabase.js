// Supabase client for database operations
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials in environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Create a new call record in the database
 */
async function createCall(callData) {
  const { data, error } = await supabase
    .from('calls')
    .insert([{
      call_id: callData.callId,
      language: callData.language,
      handled_by: callData.handledBy,
      outcome: callData.outcome || 'info',
      call_duration_seconds: callData.duration,
      caller_number: callData.callerNumber,
      status: callData.status || 'active',
      conversation_transcript: callData.transcript || []
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating call:', error);
    throw error;
  }

  return data;
}

/**
 * Update an existing call record
 */
async function updateCall(callId, updates) {
  const { data, error } = await supabase
    .from('calls')
    .update(updates)
    .eq('call_id', callId)
    .select()
    .single();

  if (error) {
    console.error('Error updating call:', error);
    throw error;
  }

  return data;
}

/**
 * Log a call event to the call_events table
 */
async function logCallEvent(callId, eventType, eventData = {}) {
  const { data, error } = await supabase
    .from('call_events')
    .insert([{
      call_id: callId,
      event_type: eventType,
      event_data: eventData
    }])
    .select()
    .single();

  if (error) {
    console.error('Error logging call event:', error);
    throw error;
  }

  return data;
}

/**
 * Get call by call_id
 */
async function getCall(callId) {
  const { data, error } = await supabase
    .from('calls')
    .select('*')
    .eq('call_id', callId)
    .single();

  if (error) {
    console.error('Error fetching call:', error);
    return null;
  }

  return data;
}

/**
 * Append to conversation transcript
 */
async function appendToTranscript(callId, message) {
  const call = await getCall(callId);
  if (!call) return null;

  const transcript = call.conversation_transcript || [];
  transcript.push({
    timestamp: new Date().toISOString(),
    ...message
  });

  return updateCall(callId, {
    conversation_transcript: transcript
  });
}

/**
 * Get daily stats (for n8n daily summary)
 */
async function getDailyStats(date = null) {
  const targetDate = date || new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('daily_call_stats')
    .select('*')
    .eq('call_date', targetDate)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows
    console.error('Error fetching daily stats:', error);
    return null;
  }

  return data || {
    call_date: targetDate,
    total_calls: 0,
    ai_handled_calls: 0,
    human_transfers: 0,
    bookings: 0,
    missed_calls: 0,
    russian_calls: 0,
    uzbek_calls: 0,
    avg_duration_seconds: 0
  };
}

module.exports = {
  supabase,
  createCall,
  updateCall,
  logCallEvent,
  getCall,
  appendToTranscript,
  getDailyStats
};
