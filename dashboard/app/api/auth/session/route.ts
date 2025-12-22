/**
 * Session Management API
 * GET /api/auth/session - Get current user session
 */

import { NextRequest, NextResponse } from 'next/server';
import { asyncHandler } from '@/lib/middleware/error-handler';
import { getAuthUser } from '@/lib/supabase/auth';
import { getUserBackupSummary } from '@/lib/supabase/database';

export const GET = asyncHandler(async (request: Request) => {
  const user = await getAuthUser(request);

  if (!user) {
    return NextResponse.json({
      authenticated: false,
      user: null,
    });
  }

  // Get user's backup summary
  const summary = await getUserBackupSummary(user.id);

  return NextResponse.json({
    authenticated: true,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      backups: summary,
    },
  });
});
