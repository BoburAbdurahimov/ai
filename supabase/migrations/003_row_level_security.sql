-- Row Level Security Policies
-- Secure data access based on user authentication and roles

-- =====================================================
-- HELPER FUNCTIONS FOR RLS
-- =====================================================

-- Check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = user_id
    AND raw_user_meta_data->>'role' = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user owns resource
CREATE OR REPLACE FUNCTION owns_resource(user_id UUID, resource_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN user_id = resource_user_id OR is_admin(user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- BACKUPS TABLE POLICIES
-- =====================================================

-- Users can view their own backups or all if admin
CREATE POLICY "Users can view own backups or all if admin"
  ON backups FOR SELECT
  USING (
    auth.uid() = created_by
    OR is_admin(auth.uid())
    OR created_by IS NULL  -- Allow viewing system backups
  );

-- Only authenticated users can create backups
CREATE POLICY "Authenticated users can create backups"
  ON backups FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Users can update their own backups, admins can update all
CREATE POLICY "Users can update own backups"
  ON backups FOR UPDATE
  USING (
    owns_resource(auth.uid(), created_by)
  );

-- Only admins can delete backups
CREATE POLICY "Only admins can delete backups"
  ON backups FOR DELETE
  USING (is_admin(auth.uid()));

-- =====================================================
-- RESTORE OPERATIONS TABLE POLICIES
-- =====================================================

-- Users can view their own restores or all if admin
CREATE POLICY "Users can view own restores"
  ON restore_operations FOR SELECT
  USING (
    auth.uid() = initiated_by
    OR is_admin(auth.uid())
  );

-- Authenticated users can create restore operations
CREATE POLICY "Authenticated users can create restores"
  ON restore_operations FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Users can update their own restore operations
CREATE POLICY "Users can update own restores"
  ON restore_operations FOR UPDATE
  USING (
    owns_resource(auth.uid(), initiated_by)
  );

-- Admins can delete restore operations
CREATE POLICY "Only admins can delete restores"
  ON restore_operations FOR DELETE
  USING (is_admin(auth.uid()));

-- =====================================================
-- BACKUP SCHEDULES TABLE POLICIES
-- =====================================================

-- Users can view their own schedules or all if admin
CREATE POLICY "Users can view own schedules"
  ON backup_schedules FOR SELECT
  USING (
    auth.uid() = created_by
    OR is_admin(auth.uid())
  );

-- Authenticated users can create schedules
CREATE POLICY "Authenticated users can create schedules"
  ON backup_schedules FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Users can update their own schedules
CREATE POLICY "Users can update own schedules"
  ON backup_schedules FOR UPDATE
  USING (
    owns_resource(auth.uid(), created_by)
  );

-- Users can delete their own schedules
CREATE POLICY "Users can delete own schedules"
  ON backup_schedules FOR DELETE
  USING (
    owns_resource(auth.uid(), created_by)
  );

-- =====================================================
-- AUDIT LOGS TABLE POLICIES
-- =====================================================

-- Users can view their own audit logs, admins can view all
CREATE POLICY "Users can view own audit logs"
  ON audit_logs FOR SELECT
  USING (
    auth.uid() = user_id
    OR is_admin(auth.uid())
  );

-- Only system can insert audit logs (via triggers)
CREATE POLICY "System can insert audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (TRUE);

-- No one can update or delete audit logs (immutable)
CREATE POLICY "Audit logs are immutable"
  ON audit_logs FOR UPDATE
  USING (FALSE);

CREATE POLICY "Audit logs cannot be deleted"
  ON audit_logs FOR DELETE
  USING (FALSE);

-- =====================================================
-- SYSTEM SETTINGS TABLE POLICIES
-- =====================================================

-- Everyone can read system settings
CREATE POLICY "Anyone can read system settings"
  ON system_settings FOR SELECT
  USING (TRUE);

-- Only admins can modify system settings
CREATE POLICY "Only admins can update system settings"
  ON system_settings FOR UPDATE
  USING (is_admin(auth.uid()));

CREATE POLICY "Only admins can insert system settings"
  ON system_settings FOR INSERT
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Only admins can delete system settings"
  ON system_settings FOR DELETE
  USING (is_admin(auth.uid()));

-- =====================================================
-- STORAGE METADATA TABLE POLICIES
-- =====================================================

-- Users can view their own uploaded files or all if admin
CREATE POLICY "Users can view own storage metadata"
  ON storage_metadata FOR SELECT
  USING (
    auth.uid() = uploaded_by
    OR is_admin(auth.uid())
  );

-- Authenticated users can upload files
CREATE POLICY "Authenticated users can upload files"
  ON storage_metadata FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Users can update metadata of their own files
CREATE POLICY "Users can update own storage metadata"
  ON storage_metadata FOR UPDATE
  USING (
    owns_resource(auth.uid(), uploaded_by)
  );

-- Users can delete their own files
CREATE POLICY "Users can delete own files"
  ON storage_metadata FOR DELETE
  USING (
    owns_resource(auth.uid(), uploaded_by)
  );

-- =====================================================
-- STORAGE BUCKET POLICIES
-- =====================================================

-- Create storage bucket for backups (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('backups', 'backups', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for backup files
CREATE POLICY "Users can upload to their own folder"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'backups'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can view their own backup files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'backups'
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR is_admin(auth.uid())
    )
  );

CREATE POLICY "Users can update their own backup files"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'backups'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own backup files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'backups'
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR is_admin(auth.uid())
    )
  );

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

-- Grant usage on schemas
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

-- Grant select on views
GRANT SELECT ON backup_stats TO authenticated;
GRANT SELECT ON recent_activity TO authenticated;

-- Grant select on existing tables (from original schema)
GRANT SELECT ON calls TO authenticated;
GRANT SELECT ON call_events TO authenticated;
GRANT SELECT ON daily_call_stats TO authenticated;
