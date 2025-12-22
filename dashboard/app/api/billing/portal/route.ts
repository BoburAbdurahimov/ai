/**
 * POST /api/billing/portal
 * Creates a Stripe customer portal session for subscription management
 */

import { NextRequest, NextResponse } from 'next/server';
import { createCustomerPortalSession } from '@/lib/stripe/service';
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
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }
    
    // Get organization's Stripe customer ID
    const { data: org } = await supabase
      .from('organizations')
      .select('stripe_customer_id')
      .eq('id', userProfile.organization_id)
      .single();
    
    if (!org?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      );
    }
    
    // Create portal session
    const session = await createCustomerPortalSession({
      customerId: org.stripe_customer_id,
      returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
    });
    
    return NextResponse.json({
      url: session.url,
    });
    
  } catch (error) {
    console.error('Portal error:', error);
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    );
  }
}
