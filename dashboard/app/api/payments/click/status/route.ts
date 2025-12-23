import { NextResponse } from 'next/server';

// Stub: return subscription status (placeholder)
export async function GET() {
  return NextResponse.json({
    status: 'active',
    plan: 'pro',
    current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    overage_rate: 0.08,
  });
}

