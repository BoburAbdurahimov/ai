-- AI Call Center MVP - Supabase Database Schema
-- Target: Uzbekistan market, Russian AI + Uzbek human transfer

-- Main calls table (source of truth for all call data)
CREATE TABLE IF NOT EXISTS calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Core identifiers
  call_id VARCHAR(255) UNIQUE NOT NULL,
  
  -- Language and routing
  language VARCHAR(2) NOT NULL CHECK (language IN ('RU', 'UZ')),
  handled_by VARCHAR(10) NOT NULL CHECK (handled_by IN ('AI', 'HUMAN')),
  
  -- Call outcome
  outcome VARCHAR(20) NOT NULL CHECK (outcome IN ('info', 'booking', 'transfer', 'missed')),
  
  -- Timing
  call_duration_seconds INTEGER,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Additional metadata
  caller_number VARCHAR(50),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'failed')),
  
  -- Conversation data (for Russian AI calls)
  conversation_transcript JSONB DEFAULT '[]'::jsonb,
  
  -- n8n webhook status
  n8n_notified BOOLEAN DEFAULT FALSE,
  n8n_notified_at TIMESTAMPTZ,
  
  -- Indexes for fast queries
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_calls_timestamp ON calls(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_calls_language ON calls(language);
CREATE INDEX IF NOT EXISTS idx_calls_handled_by ON calls(handled_by);
CREATE INDEX IF NOT EXISTS idx_calls_outcome ON calls(outcome);
CREATE INDEX IF NOT EXISTS idx_calls_status ON calls(status);
CREATE INDEX IF NOT EXISTS idx_calls_call_id ON calls(call_id);
CREATE INDEX IF NOT EXISTS idx_calls_n8n_notified ON calls(n8n_notified) WHERE n8n_notified = FALSE;

-- Call events log (detailed event tracking)
CREATE TABLE IF NOT EXISTS call_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  call_id VARCHAR(255) NOT NULL,
  event_type VARCHAR(50) NOT NULL, -- 'start', 'dtmf_input', 'language_selected', 'ai_response', 'transfer', 'end'
  event_data JSONB DEFAULT '{}'::jsonb,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  FOREIGN KEY (call_id) REFERENCES calls(call_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_call_events_call_id ON call_events(call_id);
CREATE INDEX IF NOT EXISTS idx_call_events_timestamp ON call_events(timestamp DESC);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_calls_updated_at
  BEFORE UPDATE ON calls
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- View for daily analytics (used by n8n for daily summaries)
CREATE OR REPLACE VIEW daily_call_stats AS
SELECT
  DATE(timestamp) as call_date,
  COUNT(*) as total_calls,
  COUNT(*) FILTER (WHERE handled_by = 'AI') as ai_handled_calls,
  COUNT(*) FILTER (WHERE handled_by = 'HUMAN') as human_transfers,
  COUNT(*) FILTER (WHERE outcome = 'booking') as bookings,
  COUNT(*) FILTER (WHERE outcome = 'missed') as missed_calls,
  COUNT(*) FILTER (WHERE language = 'RU') as russian_calls,
  COUNT(*) FILTER (WHERE language = 'UZ') as uzbek_calls,
  AVG(call_duration_seconds) as avg_duration_seconds
FROM calls
GROUP BY DATE(timestamp)
ORDER BY call_date DESC;

-- Row Level Security (RLS) - Enable for production
-- ALTER TABLE calls ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE call_events ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE calls IS 'Main calls table - source of truth for all call data';
COMMENT ON TABLE call_events IS 'Detailed event log for each call lifecycle';
COMMENT ON VIEW daily_call_stats IS 'Aggregated daily statistics for n8n daily summaries';
