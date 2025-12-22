-- Backup Management Tables
-- Extends the existing schema with backup tracking, user management, and audit logs

-- =====================================================
-- BACKUP METADATA TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS backups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Backup identification
  backup_name VARCHAR(255) UNIQUE NOT NULL,
  backup_path TEXT NOT NULL,
  
  -- Backup metadata
  backup_type VARCHAR(20) NOT NULL CHECK (backup_type IN ('full', 'database', 'config')),
  status VARCHAR(20) NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
  
  -- Size and content
  size_bytes BIGINT,
  compressed BOOLEAN DEFAULT FALSE,
  components JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timing
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  -- User tracking
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Retention
  expires_at TIMESTAMPTZ,
  auto_delete BOOLEAN DEFAULT FALSE,
  
  -- Error tracking
  error_message TEXT,
  retry_count INTEGER DEFAULT 0
);

-- Indexes for performance
CREATE INDEX idx_backups_created_at ON backups(created_at DESC);
CREATE INDEX idx_backups_status ON backups(status);
CREATE INDEX idx_backups_type ON backups(backup_type);
CREATE INDEX idx_backups_created_by ON backups(created_by);
CREATE INDEX idx_backups_expires_at ON backups(expires_at) WHERE expires_at IS NOT NULL;

COMMENT ON TABLE backups IS 'Tracks all backup operations with metadata and user information';

-- =====================================================
-- RESTORE OPERATIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS restore_operations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Reference to backup
  backup_id UUID REFERENCES backups(id) ON DELETE CASCADE,
  backup_name VARCHAR(255) NOT NULL,
  
  -- Operation details
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed', 'cancelled')),
  restore_type VARCHAR(20) CHECK (restore_type IN ('full', 'database', 'config', 'partial')),
  
  -- Components restored
  components JSONB DEFAULT '[]'::jsonb,
  
  -- Results
  result JSONB DEFAULT '{}'::jsonb,
  tables_restored INTEGER,
  records_restored INTEGER,
  files_restored INTEGER,
  
  -- Timing
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  
  -- User tracking
  initiated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Error tracking
  error_message TEXT,
  error_details JSONB
);

-- Indexes
CREATE INDEX idx_restore_operations_backup_id ON restore_operations(backup_id);
CREATE INDEX idx_restore_operations_status ON restore_operations(status);
CREATE INDEX idx_restore_operations_started_at ON restore_operations(started_at DESC);
CREATE INDEX idx_restore_operations_initiated_by ON restore_operations(initiated_by);

COMMENT ON TABLE restore_operations IS 'Tracks all restore operations with detailed results';

-- =====================================================
-- BACKUP SCHEDULES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS backup_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Schedule details
  name VARCHAR(255) NOT NULL,
  description TEXT,
  cron_expression VARCHAR(100) NOT NULL,
  timezone VARCHAR(50) DEFAULT 'UTC',
  
  -- Backup configuration
  backup_type VARCHAR(20) NOT NULL CHECK (backup_type IN ('full', 'database', 'config')),
  compress BOOLEAN DEFAULT TRUE,
  retention_days INTEGER NOT NULL DEFAULT 30 CHECK (retention_days > 0 AND retention_days <= 365),
  
  -- Status
  enabled BOOLEAN DEFAULT TRUE,
  
  -- Execution tracking
  last_run_at TIMESTAMPTZ,
  last_run_status VARCHAR(20),
  last_backup_id UUID REFERENCES backups(id) ON DELETE SET NULL,
  next_run_at TIMESTAMPTZ,
  
  -- Failure tracking
  consecutive_failures INTEGER DEFAULT 0,
  last_error TEXT,
  
  -- User tracking
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_backup_schedules_enabled ON backup_schedules(enabled) WHERE enabled = TRUE;
CREATE INDEX idx_backup_schedules_next_run ON backup_schedules(next_run_at) WHERE enabled = TRUE;
CREATE INDEX idx_backup_schedules_created_by ON backup_schedules(created_by);

COMMENT ON TABLE backup_schedules IS 'Manages automated backup schedules with cron expressions';

-- =====================================================
-- AUDIT LOGS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- User and action
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email VARCHAR(255),
  
  -- Action details
  action VARCHAR(50) NOT NULL,
  resource_type VARCHAR(50) NOT NULL,
  resource_id UUID,
  
  -- Request details
  ip_address INET,
  user_agent TEXT,
  
  -- Changes (for updates)
  old_values JSONB,
  new_values JSONB,
  
  -- Additional context
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamp
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

COMMENT ON TABLE audit_logs IS 'Comprehensive audit trail of all system operations';

-- =====================================================
-- SYSTEM SETTINGS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS system_settings (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

COMMENT ON TABLE system_settings IS 'System-wide configuration settings';

-- Insert default settings
INSERT INTO system_settings (key, value, description) VALUES
  ('backup_retention_days', '30', 'Default backup retention period in days'),
  ('max_concurrent_backups', '3', 'Maximum number of concurrent backup operations'),
  ('auto_cleanup_enabled', 'true', 'Enable automatic cleanup of expired backups'),
  ('notification_enabled', 'true', 'Enable backup completion notifications'),
  ('max_backup_size_mb', '1024', 'Maximum allowed backup size in MB')
ON CONFLICT (key) DO NOTHING;

-- =====================================================
-- STORAGE METADATA TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS storage_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Storage reference
  storage_path TEXT NOT NULL UNIQUE,
  bucket_name VARCHAR(255) NOT NULL DEFAULT 'backups',
  
  -- File information
  file_name VARCHAR(255) NOT NULL,
  content_type VARCHAR(100),
  size_bytes BIGINT NOT NULL,
  
  -- Checksums for integrity
  md5_hash VARCHAR(32),
  sha256_hash VARCHAR(64),
  
  -- Associated backup
  backup_id UUID REFERENCES backups(id) ON DELETE CASCADE,
  
  -- Metadata
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Access tracking
  last_accessed_at TIMESTAMPTZ,
  access_count INTEGER DEFAULT 0
);

-- Indexes
CREATE INDEX idx_storage_metadata_backup_id ON storage_metadata(backup_id);
CREATE INDEX idx_storage_metadata_bucket ON storage_metadata(bucket_name);
CREATE INDEX idx_storage_metadata_uploaded_at ON storage_metadata(uploaded_at DESC);

COMMENT ON TABLE storage_metadata IS 'Tracks files stored in Supabase Storage with checksums';

-- =====================================================
-- VIEWS FOR ANALYTICS
-- =====================================================

-- Backup statistics view
CREATE OR REPLACE VIEW backup_stats AS
SELECT
  DATE(created_at) as backup_date,
  backup_type,
  COUNT(*) as total_backups,
  COUNT(*) FILTER (WHERE status = 'completed') as successful_backups,
  COUNT(*) FILTER (WHERE status = 'failed') as failed_backups,
  SUM(size_bytes) as total_size_bytes,
  AVG(EXTRACT(EPOCH FROM (completed_at - started_at))) as avg_duration_seconds
FROM backups
GROUP BY DATE(created_at), backup_type
ORDER BY backup_date DESC, backup_type;

COMMENT ON VIEW backup_stats IS 'Daily backup statistics by type';

-- Recent activity view
CREATE OR REPLACE VIEW recent_activity AS
SELECT
  'backup' as activity_type,
  b.id,
  b.backup_name as name,
  b.status,
  b.created_at,
  u.email as user_email
FROM backups b
LEFT JOIN auth.users u ON b.created_by = u.id
UNION ALL
SELECT
  'restore' as activity_type,
  r.id,
  r.backup_name as name,
  r.status,
  r.started_at as created_at,
  u.email as user_email
FROM restore_operations r
LEFT JOIN auth.users u ON r.initiated_by = u.id
ORDER BY created_at DESC
LIMIT 100;

COMMENT ON VIEW recent_activity IS 'Recent backup and restore operations';

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for backup_schedules
CREATE TRIGGER update_backup_schedules_updated_at
  BEFORE UPDATE ON backup_schedules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate backup duration
CREATE OR REPLACE FUNCTION calculate_restore_duration()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND NEW.completed_at IS NOT NULL THEN
    NEW.duration_seconds = EXTRACT(EPOCH FROM (NEW.completed_at - NEW.started_at));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for restore_operations
CREATE TRIGGER calculate_restore_duration_trigger
  BEFORE UPDATE ON restore_operations
  FOR EACH ROW
  EXECUTE FUNCTION calculate_restore_duration();

-- Function to log audit events
CREATE OR REPLACE FUNCTION log_audit_event()
RETURNS TRIGGER AS $$
DECLARE
  user_email_val VARCHAR(255);
BEGIN
  -- Get user email if user_id is available
  IF NEW.created_by IS NOT NULL THEN
    SELECT email INTO user_email_val FROM auth.users WHERE id = NEW.created_by;
  END IF;

  INSERT INTO audit_logs (
    user_id,
    user_email,
    action,
    resource_type,
    resource_id,
    new_values
  ) VALUES (
    NEW.created_by,
    user_email_val,
    TG_OP,
    TG_TABLE_NAME,
    NEW.id,
    row_to_json(NEW)
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Audit triggers
CREATE TRIGGER audit_backups_insert
  AFTER INSERT ON backups
  FOR EACH ROW
  EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER audit_restore_operations_insert
  AFTER INSERT ON restore_operations
  FOR EACH ROW
  EXECUTE FUNCTION log_audit_event();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE backups ENABLE ROW LEVEL SECURITY;
ALTER TABLE restore_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE backup_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage_metadata ENABLE ROW LEVEL SECURITY;

-- Policies will be created in next migration
-- (See 003_row_level_security.sql)
