/**
 * Stripe Service - Core integration with Stripe API
 * Handles subscriptions, payments, and webhooks
 */

import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/client';
import { PLANS, PlanId, TRIAL_CONFIG } from './config';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
});

// ============================================
// CHECKOUT SESSIONS
// ============================================

export async function createCheckoutSession({
  organizationId,
  plan,
  interval,
  successUrl,
  cancelUrl,
  customerEmail,
}: {
  organizationId: string;
  plan: PlanId;
  interval: 'monthly' | 'yearly';
  successUrl: string;
  cancelUrl: string;
  customerEmail: string;
}): Promise<Stripe.Checkout.Session> {
  const supabase = createClient();
  
  // Check for existing pending checkout (idempotency)
  const { data: existingSession } = await supabase
    .from('checkout_sessions')
    .select('stripe_session_id')
    .eq('organization_id', organizationId)
    .eq('status', 'pending')
    .gte('expires_at', new Date().toISOString())
    .single();
  
  if (existingSession) {
    // Return existing session
    const session = await stripe.checkout.sessions.retrieve(existingSession.stripe_session_id);
    return session;
  }
  
  const planConfig = PLANS[plan];
  if (!planConfig.stripePriceIdMonthly && !planConfig.stripePriceIdYearly) {
    throw new Error('Plan does not support self-service checkout');
  }
  
  const priceId = interval === 'monthly' 
    ? planConfig.stripePriceIdMonthly 
    : planConfig.stripePriceIdYearly;
  
  if (!priceId) {
    throw new Error('Price ID not configured for this plan and interval');
  }
  
  // Check if organization already has a Stripe customer
  const { data: org } = await supabase
    .from('organizations')
    .select('stripe_customer_id')
    .eq('id', organizationId)
    .single();
  
  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    client_reference_id: organizationId,
    metadata: {
      organizationId,
      plan,
      interval,
    },
    subscription_data: {
      metadata: {
        organizationId,
        plan,
      },
      trial_period_days: TRIAL_CONFIG.durationDays,
    },
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
    expires_at: Math.floor(Date.now() / 1000) + 1800, // 30 minutes
  };
  
  // Use existing customer if available
  if (org?.stripe_customer_id) {
    sessionParams.customer = org.stripe_customer_id;
  } else {
    sessionParams.customer_email = customerEmail;
  }
  
  const session = await stripe.checkout.sessions.create(sessionParams);
  
  // Store checkout session in database
  await supabase.from('checkout_sessions').insert({
    organization_id: organizationId,
    stripe_session_id: session.id,
    plan,
    interval,
    status: 'pending',
    expires_at: new Date(session.expires_at * 1000).toISOString(),
  });
  
  return session;
}

// ============================================
// CUSTOMER PORTAL
// ============================================

export async function createCustomerPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string;
  returnUrl: string;
}): Promise<Stripe.BillingPortal.Session> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
  
  return session;
}

// ============================================
// SUBSCRIPTION MANAGEMENT
// ============================================

export async function cancelSubscription(
  subscriptionId: string,
  cancelAtPeriodEnd: boolean = true,
  reason?: string
): Promise<Stripe.Subscription> {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: cancelAtPeriodEnd,
    metadata: {
      cancellation_reason: reason || 'User requested',
    },
  });
  
  return subscription;
}

export async function resumeSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  });
  
  return subscription;
}

export async function updateSubscription({
  subscriptionId,
  newPriceId,
}: {
  subscriptionId: string;
  newPriceId: string;
}): Promise<Stripe.Subscription> {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  
  const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: newPriceId,
      },
    ],
    proration_behavior: 'always_invoice',
  });
  
  return updatedSubscription;
}

// ============================================
// WEBHOOKS
// ============================================

export async function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
): Promise<Stripe.Event> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not defined');
  }
  
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}

export async function handleWebhookEvent(event: Stripe.Event): Promise<void> {
  const supabase = createClient();
  
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session, supabase);
      break;
      
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object as Stripe.Subscription, supabase);
      break;
      
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object as Stripe.Subscription, supabase);
      break;
      
    case 'invoice.payment_succeeded':
      await handlePaymentSucceeded(event.data.object as Stripe.Invoice, supabase);
      break;
      
    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data.object as Stripe.Invoice, supabase);
      break;
      
    case 'customer.subscription.trial_will_end':
      await handleTrialWillEnd(event.data.object as Stripe.Subscription, supabase);
      break;
      
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
}

// ============================================
// WEBHOOK HANDLERS
// ============================================

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
  supabase: ReturnType<typeof createClient>
): Promise<void> {
  const organizationId = session.metadata?.organizationId;
  if (!organizationId) {
    console.error('No organizationId in checkout session metadata');
    return;
  }
  
  const subscriptionId = session.subscription as string;
  const customerId = session.customer as string;
  
  // Update organization with Stripe IDs
  await supabase
    .from('organizations')
    .update({
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      plan: session.metadata?.plan,
      plan_status: 'ACTIVE',
    })
    .eq('id', organizationId);
  
  // Update checkout session status
  await supabase
    .from('checkout_sessions')
    .update({ status: 'completed' })
    .eq('stripe_session_id', session.id);
  
  // Fetch full subscription details and create record
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  await createOrUpdateSubscriptionRecord(subscription, supabase);
}

async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription,
  supabase: ReturnType<typeof createClient>
): Promise<void> {
  await createOrUpdateSubscriptionRecord(subscription, supabase);
  
  // Update organization status
  const organizationId = subscription.metadata?.organizationId;
  if (organizationId) {
    await supabase
      .from('organizations')
      .update({
        plan_status: mapStripeStatus(subscription.status),
        stripe_subscription_id: subscription.id,
      })
      .eq('id', organizationId);
  }
}

async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
  supabase: ReturnType<typeof createClient>
): Promise<void> {
  const organizationId = subscription.metadata?.organizationId;
  if (!organizationId) return;
  
  // Update subscription record
  await supabase
    .from('subscriptions')
    .update({
      status: 'CANCELED',
      canceled_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);
  
  // Update organization
  await supabase
    .from('organizations')
    .update({
      plan_status: 'CANCELED',
    })
    .eq('id', organizationId);
}

async function handlePaymentSucceeded(
  invoice: Stripe.Invoice,
  supabase: ReturnType<typeof createClient>
): Promise<void> {
  const subscriptionId = invoice.subscription as string;
  if (!subscriptionId) return;
  
  // Get organization ID from subscription
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('organization_id')
    .eq('stripe_subscription_id', subscriptionId)
    .single();
  
  if (!subscription) return;
  
  // Create invoice record
  await supabase.from('invoices').insert({
    organization_id: subscription.organization_id,
    stripe_invoice_id: invoice.id,
    stripe_subscription_id: subscriptionId,
    amount_due: invoice.amount_due,
    amount_paid: invoice.amount_paid,
    currency: invoice.currency.toUpperCase(),
    status: invoice.status || 'paid',
    invoice_url: invoice.hosted_invoice_url,
    invoice_pdf: invoice.invoice_pdf,
    period_start: new Date(invoice.period_start * 1000).toISOString(),
    period_end: new Date(invoice.period_end * 1000).toISOString(),
    paid_at: invoice.status_transitions.paid_at 
      ? new Date(invoice.status_transitions.paid_at * 1000).toISOString() 
      : new Date().toISOString(),
  });
  
  // Clear payment failure tracking
  await supabase
    .from('organizations')
    .update({
      plan_status: 'ACTIVE',
      payment_failed_at: null,
      retry_count: 0,
    })
    .eq('id', subscription.organization_id);
}

async function handlePaymentFailed(
  invoice: Stripe.Invoice,
  supabase: ReturnType<typeof createClient>
): Promise<void> {
  const subscriptionId = invoice.subscription as string;
  if (!subscriptionId) return;
  
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('organization_id')
    .eq('stripe_subscription_id', subscriptionId)
    .single();
  
  if (!subscription) return;
  
  // Update organization with payment failure
  const { data: org } = await supabase
    .from('organizations')
    .select('retry_count, payment_failed_at')
    .eq('id', subscription.organization_id)
    .single();
  
  const retryCount = (org?.retry_count || 0) + 1;
  
  await supabase
    .from('organizations')
    .update({
      plan_status: 'PAST_DUE',
      payment_failed_at: org?.payment_failed_at || new Date().toISOString(),
      retry_count: retryCount,
    })
    .eq('id', subscription.organization_id);
  
  // TODO: Send dunning email
  console.log(`Payment failed for org ${subscription.organization_id}, retry count: ${retryCount}`);
}

async function handleTrialWillEnd(
  subscription: Stripe.Subscription,
  supabase: ReturnType<typeof createClient>
): Promise<void> {
  const organizationId = subscription.metadata?.organizationId;
  if (!organizationId) return;
  
  // TODO: Send trial ending email
  console.log(`Trial will end soon for org ${organizationId}`);
}

// ============================================
// HELPER FUNCTIONS
// ============================================

async function createOrUpdateSubscriptionRecord(
  subscription: Stripe.Subscription,
  supabase: ReturnType<typeof createClient>
): Promise<void> {
  const organizationId = subscription.metadata?.organizationId;
  if (!organizationId) return;
  
  const subscriptionData = {
    organization_id: organizationId,
    stripe_subscription_id: subscription.id,
    stripe_customer_id: subscription.customer as string,
    stripe_price_id: subscription.items.data[0].price.id,
    plan: subscription.metadata?.plan || 'PROFESSIONAL',
    interval: subscription.items.data[0].price.recurring?.interval || 'monthly',
    status: mapStripeStatus(subscription.status),
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    cancel_at_period_end: subscription.cancel_at_period_end,
    canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
    trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000).toISOString() : null,
    trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
  };
  
  // Upsert subscription
  await supabase
    .from('subscriptions')
    .upsert(subscriptionData, {
      onConflict: 'stripe_subscription_id',
    });
}

function mapStripeStatus(status: Stripe.Subscription.Status): string {
  const statusMap: Record<Stripe.Subscription.Status, string> = {
    'active': 'ACTIVE',
    'trialing': 'TRIALING',
    'past_due': 'PAST_DUE',
    'canceled': 'CANCELED',
    'unpaid': 'PAST_DUE',
    'incomplete': 'PAST_DUE',
    'incomplete_expired': 'CANCELED',
    'paused': 'PAUSED',
  };
  
  return statusMap[status] || 'ACTIVE';
}

export { stripe };
