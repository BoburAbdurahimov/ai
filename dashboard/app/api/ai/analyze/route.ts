/**
 * AI Analysis API
 * POST /api/ai/analyze - Analyze backup patterns with AI
 */

import { NextRequest, NextResponse } from 'next/server';
import { asyncHandler } from '@/lib/middleware/error-handler';
import { limiters, getClientId } from '@/lib/middleware/rate-limit';
import { analyzeBackupPatterns, detectAnomalies, generateRecommendations } from '@/lib/ai/service';
import { listBackups } from '@/lib/supabase/database';
import { getStatus } from '@/lib/cli-wrapper';
import { getUserStorageUsage } from '@/lib/supabase/storage';
import { logger } from '@/lib/logger';

export const POST = asyncHandler(async (request: Request) => {
  const startTime = Date.now();

  // Rate limiting (AI calls are expensive)
  const clientId = getClientId(request);
  await limiters.strict.check(3, clientId);

  const body = await request.json();
  const { analysisType = 'full', userId } = body;

  logger.info('AI analysis requested', { analysisType, userId });

  // Fetch data
  const { data: backups } = await listBackups({ userId, limit: 50 });
  const systemStatus = await getStatus(true);
  const usage = userId ? await getUserStorageUsage(userId) : null;

  const results: any = {};

  // Pattern analysis
  if (analysisType === 'full' || analysisType === 'patterns') {
    results.patterns = await analyzeBackupPatterns(backups || []);
  }

  // Anomaly detection
  if (analysisType === 'full' || analysisType === 'anomalies') {
    results.anomalies = await detectAnomalies(backups || []);
  }

  // Recommendations
  if (analysisType === 'full' || analysisType === 'recommendations') {
    results.recommendations = await generateRecommendations(
      systemStatus,
      backups || [],
      usage?.usage
    );
  }

  const duration = Date.now() - startTime;
  logger.api('POST', '/api/ai/analyze', 200, duration);

  return NextResponse.json({
    success: true,
    analysis: results,
    metadata: {
      analysisType,
      backupsAnalyzed: backups?.length || 0,
      duration: `${duration}ms`,
    },
  });
});
