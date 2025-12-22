/**
 * Backup Statistics API
 * GET /api/backups/stats
 */

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

  // Try to get from cache
  const cached = cache.get(cacheKeys.stats());
  if (cached) {
    logger.debug('Stats cache hit');
    return NextResponse.json({ success: true, ...cached, cached: true });
  }

  // Fetch backups
  const backups = await listBackups();

  // Calculate statistics
  const stats = {
    total: backups.length,
    totalSize: backups.reduce((sum, b) => {
      const sizeMatch = b.size?.match(/(\d+\.?\d*)\s*(KB|MB|GB)/);
      if (!sizeMatch) return sum;

      const value = parseFloat(sizeMatch[1]);
      const unit = sizeMatch[2];

      // Convert to bytes
      const multipliers = { KB: 1024, MB: 1024 * 1024, GB: 1024 * 1024 * 1024 };
      return sum + (value * multipliers[unit as keyof typeof multipliers]);
    }, 0),
    oldest: backups.length > 0 ? backups[backups.length - 1] : null,
    newest: backups.length > 0 ? backups[0] : null,
    byDay: calculateByDay(backups),
    sizeDistribution: calculateSizeDistribution(backups),
  };

  // Cache for 5 minutes
  cache.set(cacheKeys.stats(), stats, { ttl: 5 * 60 * 1000 });

  const duration = Date.now() - startTime;
  logger.api('GET', '/api/backups/stats', 200, duration);

  return NextResponse.json({
    success: true,
    ...stats,
  });
});

function calculateByDay(backups: any[]) {
  const byDay: Record<string, number> = {};

  backups.forEach(backup => {
    const date = new Date(backup.date).toISOString().split('T')[0];
    byDay[date] = (byDay[date] || 0) + 1;
  });

  return byDay;
}

function calculateSizeDistribution(backups: any[]) {
  const distribution = {
    small: 0,   // < 1 MB
    medium: 0,  // 1-10 MB
    large: 0,   // 10-100 MB
    xlarge: 0,  // > 100 MB
  };

  backups.forEach(backup => {
    const sizeMatch = backup.size?.match(/(\d+\.?\d*)\s*(KB|MB|GB)/);
    if (!sizeMatch) return;

    const value = parseFloat(sizeMatch[1]);
    const unit = sizeMatch[2];

    let sizeMB = 0;
    if (unit === 'KB') sizeMB = value / 1024;
    else if (unit === 'MB') sizeMB = value;
    else if (unit === 'GB') sizeMB = value * 1024;

    if (sizeMB < 1) distribution.small++;
    else if (sizeMB < 10) distribution.medium++;
    else if (sizeMB < 100) distribution.large++;
    else distribution.xlarge++;
  });

  return distribution;
}
