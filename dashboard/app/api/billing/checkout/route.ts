/**
 * POST /api/billing/checkout
 * Creates a Stripe checkout session for subscription purchase
 */

import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe/service';
import { PlanId } from '@/lib/stripe/config';
import { createClient } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
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
      .select('organization_id, role')
      .eq('id', user.id)
      .single();
    
    if (!userProfile?.organization_id) {
      return NextResponse.json(
        { error: 'User not associated with an organization' },
        { status: 400 }
      );
    }
    
    // Only owners and admins can manage billing
    if (!['OWNER', 'ADMIN'].includes(userProfile.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions. Only owners and admins can manage billing.' },
        { status: 403 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    const { plan, interval } = body;
    
    // Validate input
    if (!plan || !['STARTER', 'PROFESSIONAL', 'BUSINESS'].includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan. Must be STARTER, PROFESSIONAL, or BUSINESS.' },
        { status: 400 }
      );
    }
    
    if (!interval || !['monthly', 'yearly'].includes(interval)) {
      return NextResponse.json(
        { error: 'Invalid interval. Must be monthly or yearly.' },
        { status: 400 }
      );
    }
    
    // Get organization details
    const { data: org } = await supabase
      .from('organizations')
      .select('email')
      .eq('id', userProfile.organization_id)
      .single();
    
    if (!org) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      );
    }
    
    // Create checkout session
    const session = await createCheckoutSession({
      organizationId: userProfile.organization_id,
      plan: plan as PlanId,
      interval: interval as 'monthly' | 'yearly',
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
      customerEmail: org.email,
    });
    
    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
    
  } catch (error) {
    console.error('Checkout error:', error);
    
    if (error instanceof Error && error.message.includes('already in progress')) {
      return NextResponse.json(
        { error: 'A checkout session is already in progress. Please complete or cancel it first.' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
