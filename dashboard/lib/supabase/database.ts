/**
 * Supabase Database Service
 * High-level database operations for backups, restores, and schedules
 */

import { supabaseAdmin } from './client';
import type { Database } from './client';

type BackupRow = Database['public']['Tables']['backups']['Row'];
type BackupInsert = Database['public']['Tables']['backups']['Insert'];
type RestoreRow = Database['public']['Tables']['restore_operations']['Row'];
type RestoreInsert = Database['public']['Tables']['restore_operations']['Insert'];
type ScheduleRow = Database['public']['Tables']['backup_schedules']['Row'];
type ScheduleInsert = Database['public']['Tables']['backup_schedules']['Insert'];

// =====================================================
// BACKUP OPERATIONS
// =====================================================

/**
 * Create backup record
 */
export async function createBackupRecord(data: BackupInsert) {
  const { data: backup, error } = await supabaseAdmin
    .from('backups')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return backup;
}

/**
 * Update backup record
 */
export async function updateBackupRecord(id: string, data: Partial<BackupInsert>) {
  const { data: backup, error } = await supabaseAdmin
    .from('backups')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return backup;
}

/**
 * Get backup by ID
 */
export async function getBackupById(id: string) {
  const { data, error } = await supabaseAdmin
    .from('backups')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get backup by name
 */
export async function getBackupByName(name: string) {
  const { data, error } = await supabaseAdmin
    .from('backups')
    .select('*')
    .eq('backup_name', name)
    .single();

  if (error) return null;
  return data;
}

/**
 * List backups with filters
 */
export async function listBackups(options?: {
  userId?: string;
  type?: 'full' | 'database' | 'config';
  status?: string;
  limit?: number;
  offset?: number;
}) {
  let query = supabaseAdmin
    .from('backups')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (options?.userId) {
    query = query.eq('created_by', options.userId);
  }

  if (options?.type) {
    query = query.eq('backup_type', options.type);
  }

  if (options?.status) {
    query = query.eq('status', options.status);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data, error, count } = await query;

  if (error) throw error;
  return { data, count };
}

/**
 * Delete backup
 */
export async function deleteBackup(id: string) {
  const { error } = await supabaseAdmin
    .from('backups')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// =====================================================
// RESTORE OPERATIONS
// =====================================================

/**
 * Create restore operation record
 */
export async function createRestoreRecord(data: RestoreInsert) {
  const { data: restore, error } = await supabaseAdmin
    .from('restore_operations')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return restore;
}

/**
 * Update restore operation
 */
export async function updateRestoreRecord(id: string, data: Partial<RestoreInsert>) {
  const { data: restore, error } = await supabaseAdmin
    .from('restore_operations')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return restore;
}

/**
 * Get restore operation by ID
 */
export async function getRestoreById(id: string) {
  const { data, error } = await supabaseAdmin
    .from('restore_operations')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

/**
 * List restore operations
 */
export async function listRestores(options?: {
  userId?: string;
  backupId?: string;
  status?: string;
  limit?: number;
}) {
  let query = supabaseAdmin
    .from('restore_operations')
    .select('*')
    .order('started_at', { ascending: false });

  if (options?.userId) {
    query = query.eq('initiated_by', options.userId);
  }

  if (options?.backupId) {
    query = query.eq('backup_id', options.backupId);
  }

  if (options?.status) {
    query = query.eq('status', options.status);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

// =====================================================
// BACKUP SCHEDULES
// =====================================================

/**
 * Create schedule
 */
export async function createSchedule(data: ScheduleInsert) {
  const { data: schedule, error } = await supabaseAdmin
    .from('backup_schedules')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return schedule;
}

/**
 * Update schedule
 */
export async function updateSchedule(id: string, data: Partial<ScheduleInsert>) {
  const { data: schedule, error } = await supabaseAdmin
    .from('backup_schedules')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return schedule;
}

/**
 * Get schedule by ID
 */
export async function getScheduleById(id: string) {
  const { data, error } = await supabaseAdmin
    .from('backup_schedules')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

/**
 * List schedules
 */
export async function listSchedules(options?: {
  userId?: string;
  enabled?: boolean;
}) {
  let query = supabaseAdmin
    .from('backup_schedules')
    .select('*')
    .order('created_at', { ascending: false });

  if (options?.userId) {
    query = query.eq('created_by', options.userId);
  }

  if (options?.enabled !== undefined) {
    query = query.eq('enabled', options.enabled);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

/**
 * Delete schedule
 */
export async function deleteSchedule(id: string) {
  const { error } = await supabaseAdmin
    .from('backup_schedules')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// =====================================================
// STATISTICS & ANALYTICS
// =====================================================

/**
 * Get backup statistics
 */
export async function getBackupStats(options?: {
  startDate?: string;
  endDate?: string;
}) {
  let query = supabaseAdmin
    .from('backup_stats')
    .select('*')
    .order('backup_date', { ascending: false });

  if (options?.startDate) {
    query = query.gte('backup_date', options.startDate);
  }

  if (options?.endDate) {
    query = query.lte('backup_date', options.endDate);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

/**
 * Get recent activity
 */
export async function getRecentActivity(limit: number = 50) {
  const { data, error } = await supabaseAdmin
    .from('recent_activity')
    .select('*')
    .limit(limit);

  if (error) throw error;
  return data;
}

/**
 * Get user's backup summary
 */
export async function getUserBackupSummary(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('backups')
    .select('backup_type, status, size_bytes')
    .eq('created_by', userId);

  if (error) throw error;

  const summary = {
    total: data.length,
    by_type: {
      full: data.filter(b => b.backup_type === 'full').length,
      database: data.filter(b => b.backup_type === 'database').length,
      config: data.filter(b => b.backup_type === 'config').length,
    },
    by_status: {
      completed: data.filter(b => b.status === 'completed').length,
      failed: data.filter(b => b.status === 'failed').length,
      pending: data.filter(b => b.status === 'pending').length,
    },
    total_size_bytes: data.reduce((sum, b) => sum + (b.size_bytes || 0), 0),
  };

  return summary;
}

// =====================================================
// AUDIT LOGS
// =====================================================

/**
 * Log audit event
 */
export async function logAudit(data: {
  user_id?: string;
  user_email?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  ip_address?: string;
  user_agent?: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  metadata?: Record<string, any>;
}) {
  const { error } = await supabaseAdmin
    .from('audit_logs')
    .insert(data);

  if (error) throw error;
}

/**
 * Get audit logs
 */
export async function getAuditLogs(options?: {
  userId?: string;
  action?: string;
  resourceType?: string;
  limit?: number;
}) {
  let query = supabaseAdmin
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false });

  if (options?.userId) {
    query = query.eq('user_id', options.userId);
  }

  if (options?.action) {
    query = query.eq('action', options.action);
  }

  if (options?.resourceType) {
    query = query.eq('resource_type', options.resourceType);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}
