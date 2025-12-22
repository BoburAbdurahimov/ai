/**
 * Permission Middleware - Plan-based feature gating and access control
 * Enforces subscription limits and checks feature access
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { canAccessFeature, enforceRateLimit } from '@/lib/stripe/usage';
import { PLANS, PlanId } from '@/lib/stripe/config';

export interface PermissionContext {
  user: {
    id: string;
    email: string;
  };
  organization: {
    id: string;
    plan: PlanId;
    planStatus: string;
  };
  role: string;
}

/**
 * Middleware to check if user has required role
 */
export async function requireRole(
  request: NextRequest,
  requiredRoles: string[]
): Promise<{ allowed: boolean; context?: PermissionContext; error?: string }> {
  const supabase = createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { allowed: false, error: 'Unauthorized' };
  }
  
  const { data: userProfile } = await supabase
    .from('users')
    .select('organization_id, role')
    .eq('id', user.id)
    .single();
  
  if (!userProfile?.organization_id) {
    return { allowed: false, error: 'User not associated with an organization' };
  }
  
  if (!requiredRoles.includes(userProfile.role)) {
    return { 
      allowed: false, 
      error: `Insufficient permissions. Required roles: ${requiredRoles.join(', ')}` 
    };
  }
  
  const { data: org } = await supabase
    .from('organizations')
    .select('plan, plan_status')
    .eq('id', userProfile.organization_id)
    .single();
  
  if (!org) {
    return { allowed: false, error: 'Organization not found' };
  }
  
  return {
    allowed: true,
    context: {
      user: {
        id: user.id,
        email: user.email || '',
      },
      organization: {
        id: userProfile.organization_id,
        plan: org.plan as PlanId,
        planStatus: org.plan_status,
      },
      role: userProfile.role,
    },
  };
}

/**
 * Middleware to check if organization's subscription is active
 */
export async function requireActiveSubscription(
  request: NextRequest
): Promise<{ allowed: boolean; context?: PermissionContext; error?: string; statusCode?: number }> {
  const roleCheck = await requireRole(request, ['OWNER', 'ADMIN', 'MANAGER', 'OPERATOR', 'VIEWER']);
  
  if (!roleCheck.allowed || !roleCheck.context) {
    return roleCheck;
  }
  
  const { organization } = roleCheck.context;
  
  // Check if subscription is active or in trial
  if (!['ACTIVE', 'TRIALING'].includes(organization.planStatus)) {
    // Check if in grace period
    const supabase = createClient();
    const { data: org } = await supabase
      .from('organizations')
      .select('payment_failed_at')
      .eq('id', organization.id)
      .single();
    
    if (org?.payment_failed_at) {
      const failedAt = new Date(org.payment_failed_at);
      const gracePeriodEnd = new Date(failedAt.getTime() + 7 * 24 * 60 * 60 * 1000);
      const now = new Date();
      
      if (now > gracePeriodEnd) {
        return {
          allowed: false,
          error: 'Subscription inactive. Please update payment method.',
          statusCode: 402, // Payment Required
        };
      }
      
      // In grace period - allow but warn
      console.warn(`Organization ${organization.id} is in grace period`);
    } else {
      return {
        allowed: false,
        error: 'Subscription not active',
        statusCode: 402,
      };
    }
  }
  
  return roleCheck;
}

/**
 * Middleware to check if organization has access to a specific feature
 */
export async function requireFeature(
  request: NextRequest,
  feature: string
): Promise<{ allowed: boolean; context?: PermissionContext; error?: string }> {
  const subscriptionCheck = await requireActiveSubscription(request);
  
  if (!subscriptionCheck.allowed || !subscriptionCheck.context) {
    return subscriptionCheck;
  }
  
  const { organization } = subscriptionCheck.context;
  
  // Check feature access
  const featureAccess = await canAccessFeature(organization.id, feature);
  
  if (!featureAccess.allowed) {
    return {
      allowed: false,
      error: featureAccess.reason || 'Feature not available on current plan',
    };
  }
  
  return subscriptionCheck;
}

/**
 * Middleware to enforce API rate limits
 */
export async function requireRateLimit(
  request: NextRequest
): Promise<{ allowed: boolean; context?: PermissionContext; error?: string; retryAfter?: number }> {
  const subscriptionCheck = await requireActiveSubscription(request);
  
  if (!subscriptionCheck.allowed || !subscriptionCheck.context) {
    return subscriptionCheck;
  }
  
  const { organization } = subscriptionCheck.context;
  
  // Check rate limit
  const rateLimit = await enforceRateLimit(organization.id, 'api_calls');
  
  if (!rateLimit.allowed) {
    return {
      allowed: false,
      error: 'API rate limit exceeded',
      retryAfter: rateLimit.retryAfter,
    };
  }
  
  return subscriptionCheck;
}

/**
 * Helper function to create permission error response
 */
export function createPermissionErrorResponse(
  error: string,
  statusCode: number = 403,
  retryAfter?: number
): NextResponse {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (retryAfter) {
    headers['Retry-After'] = retryAfter.toString();
  }
  
  return NextResponse.json(
    { error },
    { status: statusCode, headers }
  );
}

/**
 * Check if organization can perform write operations
 * (Used to enforce read-only mode during grace period)
 */
export async function canPerformWriteOperation(
  organizationId: string
): Promise<{ allowed: boolean; reason?: string }> {
  const supabase = createClient();
  
  const { data: org } = await supabase
    .from('organizations')
    .select('plan_status, payment_failed_at')
    .eq('id', organizationId)
    .single();
  
  if (!org) {
    return { allowed: false, reason: 'Organization not found' };
  }
  
  // If payment failed and beyond grace period, block writes
  if (org.payment_failed_at && org.plan_status === 'PAST_DUE') {
    const failedAt = new Date(org.payment_failed_at);
    const gracePeriodEnd = new Date(failedAt.getTime() + 7 * 24 * 60 * 60 * 1000);
    const now = new Date();
    
    if (now > gracePeriodEnd) {
      return {
        allowed: false,
        reason: 'Account in read-only mode due to payment failure. Please update payment method.',
      };
    }
  }
  
  return { allowed: true };
}

/**
 * Feature flag helper - check if plan has specific feature
 */
export function hasFeature(plan: PlanId, feature: keyof typeof PLANS['STARTER']['features']): boolean {
  const planConfig = PLANS[plan];
  return planConfig.features[feature] === true || planConfig.features[feature] === 'unlimited';
}

/**
 * Get feature limits for a plan
 */
export function getFeatureLimits(plan: PlanId) {
  return PLANS[plan].limits;
}
