/**
 * GET /api/billing/usage
 * Returns detailed usage breakdown for the current billing period
 * 
 * POST /api/billing/usage/track
 * Tracks usage events (called internally by system)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { getCurrentPeriodUsage, checkUsageLimits, trackCallUsage } from '@/lib/stripe/usage';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get user's organization
    const { data: userProfile } = await supabase
      .from('users')
      .select('organization_id')
      .eq('id', user.id)
      .single();
    
    if (!userProfile?.organization_id) {
      return NextResponse.json(
        { error: 'User not associated with an organization' },
        { status: 400 }
      );
    }
    
    // Get usage and limits
    const usage = await getCurrentPeriodUsage(userProfile.organization_id);
    const limits = await checkUsageLimits(userProfile.organization_id);
    
    // Get daily breakdown for the current period
    const startDate = new Date(usage.periodStart).toISOString().split('T')[0];
    const endDate = new Date(usage.periodEnd).toISOString().split('T')[0];
    
    const { data: dailyUsage } = await supabase
      .from('usage_records')
      .select('date, metric_type, quantity')
      .eq('organization_id', userProfile.organization_id)
      .gte('date', startDate)
      .lt('date', endDate)
      .order('date', { ascending: true });
    
    // Group by date and metric
    const dailyBreakdown: Record<string, Record<string, number>> = {};
    dailyUsage?.forEach((record) => {
      if (!dailyBreakdown[record.date]) {
        dailyBreakdown[record.date] = {};
      }
      if (!dailyBreakdown[record.date][record.metric_type]) {
        dailyBreakdown[record.date][record.metric_type] = 0;
      }
      dailyBreakdown[record.date][record.metric_type] += record.quantity;
    });
    
    return NextResponse.json({
      current: usage,
      limits: limits,
      dailyBreakdown,
    });
    
  } catch (error) {
    console.error('Get usage error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch usage data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // This endpoint should be called internally or with API key
    const apiKey = request.headers.get('x-api-key');
    if (apiKey !== process.env.INTERNAL_API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { organizationId, callId, durationSeconds, metadata } = body;
    
    if (!organizationId || !callId || !durationSeconds) {
      return NextResponse.json(
        { error: 'Missing required fields: organizationId, callId, durationSeconds' },
        { status: 400 }
      );
    }
    
    await trackCallUsage({
      organizationId,
      callId,
      durationSeconds,
      metadata: metadata || {},
    });
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Track usage error:', error);
    return NextResponse.json(
      { error: 'Failed to track usage' },
      { status: 500 }
    );
  }
}
