/**
 * GET /api/billing/subscription
 * Returns current subscription details for the user's organization
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { getCurrentPeriodUsage, checkUsageLimits } from '@/lib/stripe/usage';
import { PLANS } from '@/lib/stripe/config';

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
    
    const organizationId = userProfile.organization_id;
    
    // Get organization with plan details
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', organizationId)
      .single();
    
    if (orgError || !org) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      );
    }
    
    // Get subscription details
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('status', 'ACTIVE')
      .single();
    
    // Get current usage
    const usage = await getCurrentPeriodUsage(organizationId);
    const limits = await checkUsageLimits(organizationId);
    
    // Get plan configuration
    const planConfig = PLANS[org.plan as keyof typeof PLANS];
    
    return NextResponse.json({
      organization: {
        id: org.id,
        name: org.name,
        plan: org.plan,
        planStatus: org.plan_status,
        trialEndsAt: org.trial_ends_at,
      },
      subscription: subscription || null,
      plan: {
        ...planConfig,
        limits: planConfig.limits,
        features: planConfig.features,
      },
      usage,
      limits: {
        withinLimits: limits.withinLimits,
        warnings: limits.warnings,
        overages: limits.overages,
      },
    });
    
  } catch (error) {
    console.error('Get subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription details' },
      { status: 500 }
    );
  }
}
