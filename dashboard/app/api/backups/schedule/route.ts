/**
 * Backup Scheduling API
 * Manage automated backup schedules
 */

import { NextRequest, NextResponse } from 'next/server';
import { asyncHandler, ValidationError } from '@/lib/middleware/error-handler';
import { limiters, getClientId } from '@/lib/middleware/rate-limit';
import { logger } from '@/lib/logger';

// In-memory schedule store (replace with database in production)
const schedules = new Map<string, BackupSchedule>();

interface BackupSchedule {
  id: string;
  name: string;
  cron: string;
  type: 'full' | 'database' | 'config';
  enabled: boolean;
  compress: boolean;
  retentionDays: number;
  lastRun?: string;
  nextRun?: string;
  createdAt: string;
}

/**
 * GET - List all schedules
 */
export const GET = asyncHandler(async (request: Request) => {
  const clientId = getClientId(request);
  await limiters.lenient.check(60, clientId);

  const allSchedules = Array.from(schedules.values());

  logger.info('Listed backup schedules', { count: allSchedules.length });

  return NextResponse.json({
    success: true,
    schedules: allSchedules,
    total: allSchedules.length,
  });
});

/**
 * POST - Create new schedule
 */
export const POST = asyncHandler(async (request: Request) => {
  const clientId = getClientId(request);
  await limiters.default.check(10, clientId);

  const body = await request.json();
  const { name, cron, type, enabled, compress, retentionDays } = body;

  // Validation
  if (!name || !cron || !type) {
    throw new ValidationError('Missing required fields', {
      name: !name ? 'Name is required' : '',
      cron: !cron ? 'Cron expression is required' : '',
      type: !type ? 'Type is required' : '',
    });
  }

  if (!['full', 'database', 'config'].includes(type)) {
    throw new ValidationError('Invalid backup type');
  }

  // Create schedule
  const schedule: BackupSchedule = {
    id: `schedule_${Date.now()}`,
    name,
    cron,
    type,
    enabled: enabled ?? true,
    compress: compress ?? true,
    retentionDays: retentionDays ?? 30,
    createdAt: new Date().toISOString(),
  };

  schedules.set(schedule.id, schedule);

  logger.info('Created backup schedule', {
    scheduleId: schedule.id,
    name,
    cron,
  });

  return NextResponse.json({
    success: true,
    schedule,
  });
});

/**
 * PUT - Update schedule
 */
export const PUT = asyncHandler(async (request: Request) => {
  const clientId = getClientId(request);
  await limiters.default.check(10, clientId);

  const body = await request.json();
  const { id, ...updates } = body;

  if (!id) {
    throw new ValidationError('Schedule ID is required');
  }

  const schedule = schedules.get(id);
  if (!schedule) {
    throw new ValidationError('Schedule not found');
  }

  // Update schedule
  const updatedSchedule = {
    ...schedule,
    ...updates,
  };

  schedules.set(id, updatedSchedule);

  logger.info('Updated backup schedule', { scheduleId: id });

  return NextResponse.json({
    success: true,
    schedule: updatedSchedule,
  });
});

/**
 * DELETE - Remove schedule
 */
export const DELETE = asyncHandler(async (request: Request) => {
  const clientId = getClientId(request);
  await limiters.default.check(10, clientId);

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    throw new ValidationError('Schedule ID is required');
  }

  const deleted = schedules.delete(id);

  if (!deleted) {
    throw new ValidationError('Schedule not found');
  }

  logger.info('Deleted backup schedule', { scheduleId: id });

  return NextResponse.json({
    success: true,
    message: 'Schedule deleted',
  });
});
