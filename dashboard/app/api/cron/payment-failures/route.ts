/**
 * POST /api/cron/payment-failures
 * Cron endpoint for handling payment failures
 * 
 * Should be called daily by Vercel Cron or external scheduler
 */

import { NextRequest, NextResponse } from 'next/server';
import { handlePaymentFailures, checkExpiringCards, cleanupCheckoutSessions } from '@/lib/cron/payment-failure-handler';

export async function POST(request: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    console.log('[Cron] Payment failure handler starting...');
    
    // Run all payment-related cron jobs
    await Promise.all([
      handlePaymentFailures(),
      checkExpiringCards(),
      cleanupCheckoutSessions(),
    ]);
    
    console.log('[Cron] Payment failure handler complete');
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('[Cron] Payment failure handler error:', error);
    
    return NextResponse.json(
      { 
        error: 'Cron job failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Allow GET for manual testing in development
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Not available in production' },
      { status: 403 }
    );
  }
  
  return POST(request);
}
