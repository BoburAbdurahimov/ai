/**
 * Usage Tracking & Metering System
 * Tracks call minutes, API usage, and enforces plan limits
 */

import { createClient } from '@/lib/supabase/client';
import { PLANS, PlanId, calculateOverageCost } from './config';

// ============================================
// TRACK USAGE
// ============================================

export async function trackCallUsage({
  organizationId,
  callId,
  durationSeconds,
  metadata = {},
}: {
  organizationId: string;
  callId: string;
  durationSeconds: number;
  metadata?: Record<string, any>;
}): Promise<void> {
  const supabase = createClient();
  const durationMinutes = Math.ceil(durationSeconds / 60);
  
  // Record usage
  await supabase.from('usage_records').insert({
    organization_id: organizationId,
    metric_type: 'minutes',
    quantity: durationMinutes,
    call_id: callId,
    date: new Date().toISOString().split('T')[0],
    metadata,
  });
  
  // Also track call count
  await supabase.from('usage_records').insert({
    organization_id: organizationId,
    metric_type: 'calls',
    quantity: 1,
    call_id: callId,
    date: new Date().toISOString().split('T')[0],
    metadata,
  });
  
  // Check if over limit and send warning if needed
  await checkUsageLimits(organizationId);
}

export async function trackApiUsage({
  organizationId,
  endpoint,
  metadata = {},
}: {
  organizationId: string;
  endpoint: string;
  metadata?: Record<string, any>;
}): Promise<void> {
  const supabase = createClient();
  
  await supabase.from('usage_records').insert({
    organization_id: organizationId,
    metric_type: 'api_calls',
    quantity: 1,
    date: new Date().toISOString().split('T')[0],
    metadata: { endpoint, ...metadata },
  });
}

// ============================================
// GET CURRENT USAGE
// ============================================

export async function getCurrentPeriodUsage(
  organizationId: string
): Promise<{
  minutes: number;
  calls: number;
  phoneNumbers: number;
  teamMembers: number;
  apiCalls: number;
  periodStart: string;
  periodEnd: string;
}> {
  const supabase = createClient();
  
  // Get organization's current billing period
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('current_period_start, current_period_end')
    .eq('organization_id', organizationId)
    .eq('status', 'ACTIVE')
    .single();
  
  let periodStart: Date;
  let periodEnd: Date;
  
  if (subscription) {
    periodStart = new Date(subscription.current_period_start);
    periodEnd = new Date(subscription.current_period_end);
  } else {
    // Default to current month if no active subscription
    periodStart = new Date();
    periodStart.setDate(1);
    periodStart.setHours(0, 0, 0, 0);
    periodEnd = new Date(periodStart);
    periodEnd.setMonth(periodEnd.getMonth() + 1);
  }
  
  // Query usage for the period
  const { data: usage } = await supabase
    .from('usage_records')
    .select('metric_type, quantity')
    .eq('organization_id', organizationId)
    .gte('date', periodStart.toISOString().split('T')[0])
    .lt('date', periodEnd.toISOString().split('T')[0]);
  
  // Aggregate by metric type
  const aggregated = {
    minutes: 0,
    calls: 0,
    apiCalls: 0,
  };
  
  usage?.forEach((record) => {
    if (record.metric_type === 'minutes') {
      aggregated.minutes += record.quantity;
    } else if (record.metric_type === 'calls') {
      aggregated.calls += record.quantity;
    } else if (record.metric_type === 'api_calls') {
      aggregated.apiCalls += record.quantity;
    }
  });
  
  // Get current phone numbers and team members
  const { count: phoneNumbers } = await supabase
    .from('calls')
    .select('caller_number', { count: 'exact', head: true })
    .eq('organization_id', organizationId);
  
  const { count: teamMembers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', organizationId)
    .eq('status', 'ACTIVE');
  
  return {
    ...aggregated,
    phoneNumbers: phoneNumbers || 0,
    teamMembers: teamMembers || 0,
    periodStart: periodStart.toISOString(),
    periodEnd: periodEnd.toISOString(),
  };
}

// ============================================
// CHECK LIMITS
// ============================================

export async function checkUsageLimits(
  organizationId: string
): Promise<{
  withinLimits: boolean;
  warnings: string[];
  overages: ReturnType<typeof calculateOverageCost>;
}> {
  const supabase = createClient();
  
  // Get organization plan
  const { data: org } = await supabase
    .from('organizations')
    .select('plan')
    .eq('id', organizationId)
    .single();
  
  if (!org) {
    throw new Error('Organization not found');
  }
  
  const plan = org.plan as PlanId;
  const limits = PLANS[plan].limits;
  const usage = await getCurrentPeriodUsage(organizationId);
  
  const warnings: string[] = [];
  let withinLimits = true;
  
  // Check minutes
  if (usage.minutes > limits.maxMinutesPerMonth) {
    warnings.push(`Exceeded minutes limit: ${usage.minutes}/${limits.maxMinutesPerMonth}`);
    withinLimits = false;
  } else if (usage.minutes > limits.maxMinutesPerMonth * 0.8) {
    warnings.push(`Approaching minutes limit: ${usage.minutes}/${limits.maxMinutesPerMonth} (80%)`);
  }
  
  // Check phone numbers
  if (usage.phoneNumbers > limits.maxPhoneNumbers) {
    warnings.push(`Exceeded phone number limit: ${usage.phoneNumbers}/${limits.maxPhoneNumbers}`);
    withinLimits = false;
  }
  
  // Check team members
  if (usage.teamMembers > limits.maxTeamMembers) {
    warnings.push(`Exceeded team member limit: ${usage.teamMembers}/${limits.maxTeamMembers}`);
    withinLimits = false;
  }
  
  // Calculate overage costs
  const overages = calculateOverageCost(plan, {
    minutes: usage.minutes,
    phoneNumbers: usage.phoneNumbers,
    teamMembers: usage.teamMembers,
  });
  
  return {
    withinLimits,
    warnings,
    overages,
  };
}

// ============================================
// FEATURE ACCESS CHECKS
// ============================================

export async function canAccessFeature(
  organizationId: string,
  feature: string
): Promise<{ allowed: boolean; reason?: string }> {
  const supabase = createClient();
  
  // Get organization details
  const { data: org } = await supabase
    .from('organizations')
    .select('plan, plan_status')
    .eq('id', organizationId)
    .single();
  
  if (!org) {
    return { allowed: false, reason: 'Organization not found' };
  }
  
  // Check if subscription is active
  if (org.plan_status !== 'ACTIVE' && org.plan_status !== 'TRIALING') {
    return { allowed: false, reason: 'Subscription not active' };
  }
  
  // Check plan features
  const plan = org.plan as PlanId;
  const planFeatures = PLANS[plan].features as any;
  
  if (!planFeatures[feature]) {
    return { 
      allowed: false, 
      reason: `Feature not available on ${plan} plan. Please upgrade.` 
    };
  }
  
  return { allowed: true };
}

export async function enforceRateLimit(
  organizationId: string,
  resource: 'api_calls' | 'minutes'
): Promise<{ allowed: boolean; retryAfter?: number }> {
  const supabase = createClient();
  
  const { data: org } = await supabase
    .from('organizations')
    .select('plan')
    .eq('id', organizationId)
    .single();
  
  if (!org) {
    return { allowed: false };
  }
  
  const plan = org.plan as PlanId;
  const limits = PLANS[plan].limits;
  
  if (resource === 'api_calls') {
    // Check daily API limit
    const today = new Date().toISOString().split('T')[0];
    const { data: todayUsage } = await supabase
      .from('usage_records')
      .select('quantity')
      .eq('organization_id', organizationId)
      .eq('metric_type', 'api_calls')
      .eq('date', today);
    
    const totalCalls = todayUsage?.reduce((sum, r) => sum + r.quantity, 0) || 0;
    
    if (totalCalls >= limits.maxApiCallsPerDay) {
      // Calculate seconds until midnight
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const retryAfter = Math.floor((tomorrow.getTime() - now.getTime()) / 1000);
      
      return { allowed: false, retryAfter };
    }
  }
  
  return { allowed: true };
}
