import { NextRequest, NextResponse } from 'next/server';
import { getStatus } from '@/lib/cli-wrapper';
import { asyncHandler } from '@/lib/middleware/error-handler';
import { limiters, getClientId } from '@/lib/middleware/rate-limit';
import { cache, cacheKeys } from '@/lib/cache';
import { logger } from '@/lib/logger';

export const GET = asyncHandler(async (request: Request) => {
  const startTime = Date.now();

  // Rate limiting
  const clientId = getClientId(request);
  await limiters.lenient.check(60, clientId);

  const verbose = new URL(request.url).searchParams.get('verbose') === 'true';

  // Try cache first (30 second TTL for status)
  const cacheKey = `${cacheKeys.systemStatus()}-${verbose}`;
  const cachedStatus = cache.get(cacheKey);

  if (cachedStatus) {
    logger.debug('Status cache hit');
    return NextResponse.json({
      success: true,
      status: cachedStatus,
      cached: true,
    });
  }

  // Fetch fresh status
  const status = await getStatus(verbose);

  if (!status) {
    logger.error('Failed to get system status');
    throw new Error('Failed to get status');
  }

  // Cache for 30 seconds
  cache.set(cacheKey, status, { ttl: 30 * 1000 });

  const duration = Date.now() - startTime;
  logger.api('GET', '/api/status/health', 200, duration);

  return NextResponse.json({
    success: true,
    status
  });
});
