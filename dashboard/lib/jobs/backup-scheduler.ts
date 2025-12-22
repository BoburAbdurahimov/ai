/**
 * Backup Scheduler
 * Background job system for automated backups
 */

import { createBackup } from '@/lib/cli-wrapper';
import { logger } from '@/lib/logger';

interface ScheduledJob {
  id: string;
  name: string;
  cron: string;
  handler: () => Promise<void>;
  enabled: boolean;
  lastRun?: Date;
  nextRun?: Date;
}

class BackupScheduler {
  private jobs: Map<string, ScheduledJob>;
  private intervals: Map<string, NodeJS.Timeout>;

  constructor() {
    this.jobs = new Map();
    this.intervals = new Map();
  }

  /**
   * Add a scheduled backup job
   */
  addJob(job: Omit<ScheduledJob, 'lastRun' | 'nextRun'>) {
    this.jobs.set(job.id, {
      ...job,
      lastRun: undefined,
      nextRun: this.calculateNextRun(job.cron),
    });

    if (job.enabled) {
      this.startJob(job.id);
    }

    logger.info('Added scheduled job', { jobId: job.id, name: job.name });
  }

  /**
   * Start a job
   */
  startJob(jobId: string) {
    const job = this.jobs.get(jobId);
    if (!job) {
      logger.error('Job not found', { jobId });
      return;
    }

    // Stop existing interval if any
    this.stopJob(jobId);

    // Parse cron and calculate interval
    const intervalMs = this.parseCronToInterval(job.cron);

    // Set up recurring execution
    const interval = setInterval(async () => {
      await this.executeJob(jobId);
    }, intervalMs);

    this.intervals.set(jobId, interval);
    
    // Update job
    job.enabled = true;
    job.nextRun = this.calculateNextRun(job.cron);

    logger.info('Started scheduled job', { jobId, interval: intervalMs });
  }

  /**
   * Stop a job
   */
  stopJob(jobId: string) {
    const interval = this.intervals.get(jobId);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(jobId);
    }

    const job = this.jobs.get(jobId);
    if (job) {
      job.enabled = false;
    }

    logger.info('Stopped scheduled job', { jobId });
  }

  /**
   * Execute a job
   */
  async executeJob(jobId: string) {
    const job = this.jobs.get(jobId);
    if (!job) {
      logger.error('Job not found', { jobId });
      return;
    }

    logger.info('Executing scheduled job', { jobId, name: job.name });

    try {
      await job.handler();
      
      // Update last run
      job.lastRun = new Date();
      job.nextRun = this.calculateNextRun(job.cron);

      logger.info('Job executed successfully', { jobId });
    } catch (error) {
      logger.error('Job execution failed', {
        jobId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * List all jobs
   */
  listJobs() {
    return Array.from(this.jobs.values());
  }

  /**
   * Remove a job
   */
  removeJob(jobId: string) {
    this.stopJob(jobId);
    this.jobs.delete(jobId);
    logger.info('Removed scheduled job', { jobId });
  }

  /**
   * Parse cron expression to interval (simplified)
   * For production, use a proper cron parser like node-cron
   */
  private parseCronToInterval(cron: string): number {
    // Simple parsing for common patterns
    // Format: "0 2 * * *" = minute hour day month weekday

    if (cron === '*/5 * * * *') return 5 * 60 * 1000; // Every 5 minutes
    if (cron === '0 * * * *') return 60 * 60 * 1000; // Every hour
    if (cron === '0 0 * * *') return 24 * 60 * 60 * 1000; // Daily at midnight
    if (cron === '0 2 * * *') return 24 * 60 * 60 * 1000; // Daily at 2 AM

    // Default to 1 hour
    return 60 * 60 * 1000;
  }

  /**
   * Calculate next run time
   */
  private calculateNextRun(cron: string): Date {
    // Simplified calculation
    const interval = this.parseCronToInterval(cron);
    return new Date(Date.now() + interval);
  }
}

// Export singleton
export const scheduler = new BackupScheduler();

/**
 * Initialize default backup jobs
 */
export function initializeDefaultJobs() {
  // Daily backup at 2 AM
  scheduler.addJob({
    id: 'daily-backup',
    name: 'Daily Full Backup',
    cron: '0 2 * * *',
    enabled: true,
    handler: async () => {
      logger.info('Running daily backup');
      const result = await createBackup({
        compress: true,
      });

      if (result.success) {
        logger.backup('created', result.backupName || 'unknown', {
          tables: result.metadata?.tables,
          records: result.metadata?.records,
        });
      } else {
        logger.error('Daily backup failed', { error: result.error });
      }
    },
  });

  // Weekly database backup
  scheduler.addJob({
    id: 'weekly-db-backup',
    name: 'Weekly Database Backup',
    cron: '0 3 * * 0', // Sunday at 3 AM
    enabled: true,
    handler: async () => {
      logger.info('Running weekly database backup');
      await createBackup({
        dbOnly: true,
        compress: true,
      });
    },
  });

  logger.info('Initialized default backup jobs');
}
