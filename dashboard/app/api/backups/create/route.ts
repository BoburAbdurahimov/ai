import { NextRequest, NextResponse } from 'next/server';
import { createBackup } from '@/lib/cli-wrapper';
import { asyncHandler, ValidationError } from '@/lib/middleware/error-handler';
import { limiters, getClientId } from '@/lib/middleware/rate-limit';
import { validateBackupType } from '@/lib/validators';
import { cache, cacheKeys } from '@/lib/cache';
import { logger } from '@/lib/logger';

export const POST = asyncHandler(async (request: Request) => {
  const startTime = Date.now();

  // Strict rate limiting for backup creation (expensive operation)
  const clientId = getClientId(request);
  await limiters.strict.check(3, clientId);

  const body = await request.json();
  const { type, compress } = body;

  // Validation
  const backupType = type ? validateBackupType(type) : 'full';

  const options: any = {
    compress: compress ?? true
  };

  if (backupType === 'database') options.dbOnly = true;
  if (backupType === 'config') options.configOnly = true;

  logger.info('Creating backup', { type: backupType, compress: options.compress });

  const result = await createBackup(options);

  if (!result.success) {
    logger.error('Backup creation failed', { error: result.error });
    throw new Error(result.error || 'Backup creation failed');
  }

  // Invalidate cache
  cache.delete(cacheKeys.backupList());
  cache.delete(cacheKeys.stats());

  const duration = Date.now() - startTime;
  logger.backup('created', result.backupName || 'unknown', {
    duration: `${duration}ms`,
    tables: result.metadata?.tables,
    records: result.metadata?.records,
    files: result.metadata?.files,
  });

  return NextResponse.json({
    success: true,
    backup: {
      name: result.backupName,
      path: result.backupPath,
      metadata: result.metadata
    }
  });
});
