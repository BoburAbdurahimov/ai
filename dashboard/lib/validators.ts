/**
 * Input Validation Utilities
 * Centralized validation logic
 */

import { ValidationError } from './middleware/error-handler';

/**
 * Validate backup type
 */
export function validateBackupType(type: string): 'full' | 'database' | 'config' {
  const validTypes = ['full', 'database', 'config'];
  
  if (!validTypes.includes(type)) {
    throw new ValidationError(`Invalid backup type. Must be one of: ${validTypes.join(', ')}`);
  }
  
  return type as 'full' | 'database' | 'config';
}

/**
 * Validate backup ID/name
 */
export function validateBackupId(id: string): string {
  if (!id) {
    throw new ValidationError('Backup ID is required');
  }

  // Check for path traversal attempts
  if (id.includes('..') || id.includes('/') || id.includes('\\')) {
    throw new ValidationError('Invalid backup ID');
  }

  // Must match backup naming pattern
  const backupPattern = /^backup_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}$/;
  if (!backupPattern.test(id)) {
    throw new ValidationError('Invalid backup ID format');
  }

  return id;
}

/**
 * Validate restore components
 */
export function validateComponents(components: string[]): string[] {
  if (!Array.isArray(components)) {
    throw new ValidationError('Components must be an array');
  }

  const validComponents = ['database', 'config', 'deployment'];
  
  for (const component of components) {
    if (!validComponents.includes(component)) {
      throw new ValidationError(
        `Invalid component: ${component}. Must be one of: ${validComponents.join(', ')}`
      );
    }
  }

  if (components.length === 0) {
    throw new ValidationError('At least one component must be selected');
  }

  return components;
}

/**
 * Validate cron expression (simplified)
 */
export function validateCron(cron: string): string {
  if (!cron) {
    throw new ValidationError('Cron expression is required');
  }

  // Basic format check: "minute hour day month weekday"
  const parts = cron.split(' ');
  if (parts.length !== 5) {
    throw new ValidationError('Invalid cron format. Expected: "minute hour day month weekday"');
  }

  // Common patterns
  const validPatterns = [
    /^\*\s\*\s\*\s\*\s\*$/,           // Every minute
    /^0\s\*\s\*\s\*\s\*$/,            // Every hour
    /^0\s\d+\s\*\s\*\s\*$/,           // Daily at specific hour
    /^0\s\d+\s\*\s\*\s\d$/,           // Weekly on specific day
    /^\*\/\d+\s\*\s\*\s\*\s\*$/,     // Every N minutes
  ];

  const isValid = validPatterns.some(pattern => pattern.test(cron));
  if (!isValid) {
    throw new ValidationError('Invalid or unsupported cron expression');
  }

  return cron;
}

/**
 * Validate pagination parameters
 */
export function validatePagination(params: { page?: string; limit?: string }) {
  const page = parseInt(params.page || '1');
  const limit = parseInt(params.limit || '10');

  if (isNaN(page) || page < 1) {
    throw new ValidationError('Invalid page number');
  }

  if (isNaN(limit) || limit < 1 || limit > 100) {
    throw new ValidationError('Invalid limit. Must be between 1 and 100');
  }

  return { page, limit };
}

/**
 * Sanitize file path
 */
export function sanitizePath(path: string): string {
  // Remove any path traversal attempts
  return path.replace(/\.\./g, '').replace(/[\/\\]/g, '');
}

/**
 * Validate email (simple check)
 */
export function validateEmail(email: string): string {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailPattern.test(email)) {
    throw new ValidationError('Invalid email address');
  }

  return email.toLowerCase();
}

/**
 * Validate retention days
 */
export function validateRetentionDays(days: number): number {
  if (isNaN(days) || days < 1 || days > 365) {
    throw new ValidationError('Retention days must be between 1 and 365');
  }

  return days;
}
