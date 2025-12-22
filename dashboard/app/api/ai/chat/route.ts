/**
 * AI Chat API
 * POST /api/ai/chat - Chat with AI assistant
 */

import { NextRequest, NextResponse } from 'next/server';
import { asyncHandler } from '@/lib/middleware/error-handler';
import { limiters, getClientId } from '@/lib/middleware/rate-limit';
import { processChatMessage } from '@/lib/ai/chatbot';
import { listBackups } from '@/lib/supabase/database';
import { getStatus } from '@/lib/cli-wrapper';
import { logger } from '@/lib/logger';

export const POST = asyncHandler(async (request: Request) => {
  // Rate limiting
  const clientId = getClientId(request);
  await limiters.default.check(10, clientId);

  const body = await request.json();
  const { message, conversationHistory = [], userId } = body;

  if (!message) {
    return NextResponse.json(
      { success: false, error: 'Message is required' },
      { status: 400 }
    );
  }

  // Get system context
  const { data: backups } = await listBackups({ userId, limit: 10 });
  const systemStatus = await getStatus();

  const systemContext = {
    backupCount: backups?.length || 0,
    lastBackup: backups?.[0]?.created_at,
    systemStatus,
  };

  // Process message
  const response = await processChatMessage(message, conversationHistory, systemContext);

  logger.info('Chat message processed', {
    intent: response.intent,
    messageLength: message.length,
  });

  return NextResponse.json({
    success: true,
    response,
  });
});
