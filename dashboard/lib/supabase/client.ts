/**
 * Supabase Client Configuration
 * Server and client-side Supabase clients
 */

import { createClient } from '@supabase/supabase-js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Server-side client (with service role)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Client-side client (browser)
export const supabase = createClientComponentClient();

// Type definitions
export type Database = {
  public: {
    Tables: {
      backups: {
        Row: {
          id: string;
          backup_name: string;
          backup_path: string;
          backup_type: 'full' | 'database' | 'config';
          status: 'pending' | 'in_progress' | 'completed' | 'failed';
          size_bytes: number | null;
          compressed: boolean;
          components: string[];
          metadata: Record<string, any>;
          created_at: string;
          started_at: string | null;
          completed_at: string | null;
          created_by: string | null;
          expires_at: string | null;
          auto_delete: boolean;
          error_message: string | null;
          retry_count: number;
        };
        Insert: Omit<Database['public']['Tables']['backups']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['backups']['Insert']>;
      };
      restore_operations: {
        Row: {
          id: string;
          backup_id: string | null;
          backup_name: string;
          status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
          restore_type: 'full' | 'database' | 'config' | 'partial' | null;
          components: string[];
          result: Record<string, any>;
          tables_restored: number | null;
          records_restored: number | null;
          files_restored: number | null;
          started_at: string;
          completed_at: string | null;
          duration_seconds: number | null;
          initiated_by: string | null;
          error_message: string | null;
          error_details: Record<string, any> | null;
        };
        Insert: Omit<Database['public']['Tables']['restore_operations']['Row'], 'id' | 'started_at'>;
        Update: Partial<Database['public']['Tables']['restore_operations']['Insert']>;
      };
      backup_schedules: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          cron_expression: string;
          timezone: string;
          backup_type: 'full' | 'database' | 'config';
          compress: boolean;
          retention_days: number;
          enabled: boolean;
          last_run_at: string | null;
          last_run_status: string | null;
          last_backup_id: string | null;
          next_run_at: string | null;
          consecutive_failures: number;
          last_error: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['backup_schedules']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['backup_schedules']['Insert']>;
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string | null;
          user_email: string | null;
          action: string;
          resource_type: string;
          resource_id: string | null;
          ip_address: string | null;
          user_agent: string | null;
          old_values: Record<string, any> | null;
          new_values: Record<string, any> | null;
          metadata: Record<string, any>;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['audit_logs']['Row'], 'id' | 'created_at'>;
        Update: never; // Audit logs are immutable
      };
      storage_metadata: {
        Row: {
          id: string;
          storage_path: string;
          bucket_name: string;
          file_name: string;
          content_type: string | null;
          size_bytes: number;
          md5_hash: string | null;
          sha256_hash: string | null;
          backup_id: string | null;
          uploaded_at: string;
          uploaded_by: string | null;
          last_accessed_at: string | null;
          access_count: number;
        };
        Insert: Omit<Database['public']['Tables']['storage_metadata']['Row'], 'id' | 'uploaded_at' | 'access_count'>;
        Update: Partial<Database['public']['Tables']['storage_metadata']['Insert']>;
      };
    };
    Views: {
      backup_stats: {
        Row: {
          backup_date: string;
          backup_type: string;
          total_backups: number;
          successful_backups: number;
          failed_backups: number;
          total_size_bytes: number;
          avg_duration_seconds: number;
        };
      };
      recent_activity: {
        Row: {
          activity_type: 'backup' | 'restore';
          id: string;
          name: string;
          status: string;
          created_at: string;
          user_email: string | null;
        };
      };
    };
  };
};
