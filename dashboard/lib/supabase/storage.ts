/**
 * Supabase Storage Service
 * Handles backup file uploads, downloads, and management in Supabase Storage
 */

import { supabaseAdmin } from './client';
import { createHash } from 'crypto';
import { readFile } from 'fs/promises';

const BUCKET_NAME = 'backups';

export interface UploadOptions {
  userId: string;
  backupId: string;
  contentType?: string;
}

export interface UploadResult {
  success: boolean;
  path?: string;
  url?: string;
  error?: string;
  metadata?: {
    size: number;
    md5: string;
    sha256: string;
  };
}

/**
 * Upload backup file to Supabase Storage
 */
export async function uploadBackupFile(
  filePath: string,
  fileName: string,
  options: UploadOptions
): Promise<UploadResult> {
  try {
    // Read file
    const fileBuffer = await readFile(filePath);

    // Calculate checksums
    const md5 = createHash('md5').update(fileBuffer).digest('hex');
    const sha256 = createHash('sha256').update(fileBuffer).digest('hex');

    // Create storage path: userId/backupId/fileName
    const storagePath = `${options.userId}/${options.backupId}/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(storagePath, fileBuffer, {
        contentType: options.contentType || 'application/octet-stream',
        upsert: false,
      });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    // Get public URL (signed for 1 hour)
    const { data: urlData } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .createSignedUrl(storagePath, 3600);

    // Save metadata to database
    await supabaseAdmin.from('storage_metadata').insert({
      storage_path: storagePath,
      bucket_name: BUCKET_NAME,
      file_name: fileName,
      content_type: options.contentType || 'application/octet-stream',
      size_bytes: fileBuffer.length,
      md5_hash: md5,
      sha256_hash: sha256,
      backup_id: options.backupId,
      uploaded_by: options.userId,
    });

    return {
      success: true,
      path: storagePath,
      url: urlData?.signedUrl,
      metadata: {
        size: fileBuffer.length,
        md5,
        sha256,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Download backup file from Supabase Storage
 */
export async function downloadBackupFile(
  storagePath: string
): Promise<{ success: boolean; data?: Blob; error?: string }> {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .download(storagePath);

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    // Update access tracking
    await supabaseAdmin
      .from('storage_metadata')
      .update({
        last_accessed_at: new Date().toISOString(),
        // access_count: supabaseAdmin.raw('access_count + 1'), // TODO: Fix atomic increment
      })
      .eq('storage_path', storagePath);

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Delete backup file from storage
 */
export async function deleteBackupFile(
  storagePath: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Delete from storage
    const { error: storageError } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .remove([storagePath]);

    if (storageError) {
      return {
        success: false,
        error: storageError.message,
      };
    }

    // Delete metadata
    await supabaseAdmin
      .from('storage_metadata')
      .delete()
      .eq('storage_path', storagePath);

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Get signed URL for backup file
 */
export async function getSignedUrl(
  storagePath: string,
  expiresIn: number = 3600
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .createSignedUrl(storagePath, expiresIn);

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      url: data.signedUrl,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * List files in user's backup folder
 */
export async function listUserBackupFiles(
  userId: string
): Promise<{ success: boolean; files?: any[]; error?: string }> {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .list(userId);

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      files: data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Get storage usage for user
 */
export async function getUserStorageUsage(
  userId: string
): Promise<{ success: boolean; usage?: { files: number; bytes: number }; error?: string }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('storage_metadata')
      .select('size_bytes')
      .eq('uploaded_by', userId);

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    const totalBytes = data.reduce((sum, file) => sum + (file.size_bytes || 0), 0);

    return {
      success: true,
      usage: {
        files: data.length,
        bytes: totalBytes,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Cleanup expired backup files
 */
export async function cleanupExpiredBackups(): Promise<{
  success: boolean;
  deleted?: number;
  error?: string;
}> {
  try {
    // Get expired backups
    const { data: expiredBackups, error: queryError } = await supabaseAdmin
      .from('backups')
      .select('id, backup_name')
      .lt('expires_at', new Date().toISOString())
      .eq('auto_delete', true);

    if (queryError) {
      return {
        success: false,
        error: queryError.message,
      };
    }

    if (!expiredBackups || expiredBackups.length === 0) {
      return {
        success: true,
        deleted: 0,
      };
    }

    // Delete each backup
    let deleted = 0;
    for (const backup of expiredBackups) {
      // Get storage metadata
      const { data: storageData } = await supabaseAdmin
        .from('storage_metadata')
        .select('storage_path')
        .eq('backup_id', backup.id);

      // Delete files from storage
      if (storageData) {
        for (const file of storageData) {
          await deleteBackupFile(file.storage_path);
        }
      }

      // Delete backup record (cascades to metadata)
      await supabaseAdmin
        .from('backups')
        .delete()
        .eq('id', backup.id);

      deleted++;
    }

    return {
      success: true,
      deleted,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}
