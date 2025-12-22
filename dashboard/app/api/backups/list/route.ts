import { NextRequest, NextResponse } from 'next/server';
import { listBackups } from '@/lib/cli-wrapper';
import { asyncHandler } from '@/lib/middleware/error-handler';
import { limiters, getClientId } from '@/lib/middleware/rate-limit';
import { cache, cacheKeys } from '@/lib/cache';
import { logger } from '@/lib/logger';

export const GET = asyncHandler(async (request: Request) => {
  const startTime = Date.now();

  // Rate limiting
  const clientId = getClientId(request);
  await limiters.lenient.check(60, clientId);

  // Try cache first
  const cachedBackups = cache.get(cacheKeys.backupList());
  if (cachedBackups) {
    logger.debug('Backup list cache hit');
    return NextResponse.json({
      success: true,
      backups: cachedBackups,
      total: (cachedBackups as any).length,
      cached: true,
    });
  }

  // Fetch from CLI
  const backups = await listBackups();

  // Cache for 1 minute
  cache.set(cacheKeys.backupList(), backups, { ttl: 60 * 1000 });

  const duration = Date.now() - startTime;
  logger.api('GET', '/api/backups/list', 200, duration);

  return NextResponse.json({
    success: true,
    backups,
    total: backups.length,
  });
});
