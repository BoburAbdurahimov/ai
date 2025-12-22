/**
 * Payment Failure Handler - Cron Job
 * Handles retry logic, grace periods, and auto-cancellation
 */

import { createClient } from '@/lib/supabase/client';
import { stripe } from '@/lib/stripe/service';
import { PAYMENT_RETRY_SCHEDULE } from '@/lib/stripe/config';

/**
 * Main cron job for handling payment failures
 * Run daily at 00:00 UTC
 */
export async function handlePaymentFailures() {
  const supabase = createClient();
  
  console.log('[Payment Failure Handler] Starting...');
  
  // Get all organizations with past due payments
  const { data: organizations } = await supabase
    .from('organizations')
    .select('id, payment_failed_at, retry_count, stripe_subscription_id, email, name')
    .eq('plan_status', 'PAST_DUE')
    .not('payment_failed_at', 'is', null);
  
  if (!organizations || organizations.length === 0) {
    console.log('[Payment Failure Handler] No past due organizations found');
    return;
  }
  
  console.log(`[Payment Failure Handler] Processing ${organizations.length} organizations`);
  
  const now = new Date();
  
  for (const org of organizations) {
    const failedAt = new Date(org.payment_failed_at);
    const daysSinceFailure = Math.floor(
      (now.getTime() - failedAt.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    console.log(`[Payment Failure Handler] Org ${org.id}: ${daysSinceFailure} days since failure`);
    
    // Check if we should auto-cancel (14 days)
    if (daysSinceFailure >= PAYMENT_RETRY_SCHEDULE.autoCancelDays) {
      await autoCancelSubscription(org.id, org.stripe_subscription_id);
      continue;
    }
    
    // Check if we should retry payment
    if (PAYMENT_RETRY_SCHEDULE.attempts.includes(daysSinceFailure)) {
      await retryPayment(org.id, org.stripe_subscription_id, org.retry_count);
    }
    
    // Send dunning email at specific days (1, 3, 7, 14)
    if ([1, 3, 7, 14].includes(daysSinceFailure)) {
      await sendDunningEmail(org, daysSinceFailure);
    }
  }
  
  console.log('[Payment Failure Handler] Complete');
}

/**
 * Retry payment for a subscription
 */
async function retryPayment(
  organizationId: string,
  stripeSubscriptionId: string,
  currentRetryCount: number
) {
  const supabase = createClient();
  
  try {
    console.log(`[Payment Retry] Attempting retry for org ${organizationId}`);
    
    // Get the latest invoice for this subscription
    const invoices = await stripe.invoices.list({
      subscription: stripeSubscriptionId,
      limit: 1,
      status: 'open',
    });
    
    if (invoices.data.length === 0) {
      console.log(`[Payment Retry] No open invoices for org ${organizationId}`);
      return;
    }
    
    const invoice = invoices.data[0];
    
    // Attempt to pay the invoice
    const paidInvoice = await stripe.invoices.pay(invoice.id, {
      forgive: false,
    });
    
    if (paidInvoice.status === 'paid') {
      console.log(`[Payment Retry] Success for org ${organizationId}`);
      
      // Clear failure status
      await supabase
        .from('organizations')
        .update({
          plan_status: 'ACTIVE',
          payment_failed_at: null,
          retry_count: 0,
        })
        .eq('id', organizationId);
      
      // Send success email
      await sendPaymentSuccessEmail(organizationId);
    } else {
      // Increment retry count
      await supabase
        .from('organizations')
        .update({
          retry_count: currentRetryCount + 1,
        })
        .eq('id', organizationId);
    }
  } catch (error) {
    console.error(`[Payment Retry] Failed for org ${organizationId}:`, error);
    
    // Increment retry count
    await supabase
      .from('organizations')
      .update({
        retry_count: currentRetryCount + 1,
      })
      .eq('id', organizationId);
  }
}

/**
 * Auto-cancel subscription after grace period
 */
async function autoCancelSubscription(
  organizationId: string,
  stripeSubscriptionId: string
) {
  const supabase = createClient();
  
  try {
    console.log(`[Auto Cancel] Canceling subscription for org ${organizationId}`);
    
    // Cancel Stripe subscription
    await stripe.subscriptions.cancel(stripeSubscriptionId);
    
    // Update organization status
    await supabase
      .from('organizations')
      .update({
        plan_status: 'CANCELED',
      })
      .eq('id', organizationId);
    
    // Update subscription record
    await supabase
      .from('subscriptions')
      .update({
        status: 'CANCELED',
        canceled_at: new Date().toISOString(),
        cancellation_reason: 'Auto-canceled due to payment failure',
      })
      .eq('stripe_subscription_id', stripeSubscriptionId);
    
    // Send cancellation email
    await sendCancellationEmail(organizationId);
    
    console.log(`[Auto Cancel] Success for org ${organizationId}`);
  } catch (error) {
    console.error(`[Auto Cancel] Failed for org ${organizationId}:`, error);
  }
}

/**
 * Send dunning email based on days since failure
 */
async function sendDunningEmail(
  org: { id: string; email: string; name: string },
  daysSinceFailure: number
) {
  console.log(`[Dunning Email] Sending day ${daysSinceFailure} email to org ${org.id}`);
  
  // TODO: Implement email sending via your email service
  // For now, just log
  const emailTemplates: Record<number, { subject: string; message: string }> = {
    1: {
      subject: 'Payment Failed - Action Required',
      message: 'Your payment failed. Please update your payment method to avoid service interruption.',
    },
    3: {
      subject: 'Reminder: Payment Failed',
      message: 'This is a reminder that your payment failed 3 days ago. Please update your payment method.',
    },
    7: {
      subject: 'Final Warning: Payment Failed',
      message: 'Your payment failed 7 days ago. Your service will be restricted if not resolved within 7 days.',
    },
    14: {
      subject: 'Subscription Canceled - Payment Failed',
      message: 'Your subscription has been canceled due to payment failure. Please contact support to reactivate.',
    },
  };
  
  const template = emailTemplates[daysSinceFailure];
  
  if (template) {
    console.log(`[Dunning Email] To: ${org.email}`);
    console.log(`[Dunning Email] Subject: ${template.subject}`);
    console.log(`[Dunning Email] Message: ${template.message}`);
    
    // TODO: Send actual email
    // await sendEmail({
    //   to: org.email,
    //   subject: template.subject,
    //   html: renderDunningEmailTemplate(org, template.message, daysSinceFailure),
    // });
  }
}

async function sendPaymentSuccessEmail(organizationId: string) {
  console.log(`[Success Email] Payment recovered for org ${organizationId}`);
  // TODO: Implement email sending
}

async function sendCancellationEmail(organizationId: string) {
  console.log(`[Cancellation Email] Subscription canceled for org ${organizationId}`);
  // TODO: Implement email sending
}

/**
 * Check for expiring cards (30 days)
 */
export async function checkExpiringCards() {
  const supabase = createClient();
  
  console.log('[Expiring Cards] Checking for cards expiring soon...');
  
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  
  const { data: paymentMethods } = await supabase
    .from('payment_methods')
    .select('*, organizations!inner(id, email, name)')
    .eq('is_default', true)
    .lte('card_exp_year', thirtyDaysFromNow.getFullYear())
    .lte('card_exp_month', thirtyDaysFromNow.getMonth() + 1);
  
  if (!paymentMethods || paymentMethods.length === 0) {
    console.log('[Expiring Cards] No expiring cards found');
    return;
  }
  
  console.log(`[Expiring Cards] Found ${paymentMethods.length} expiring cards`);
  
  for (const pm of paymentMethods) {
    console.log(`[Expiring Cards] Card ending in ${pm.card_last4} expires ${pm.card_exp_month}/${pm.card_exp_year}`);
    
    // TODO: Send expiring card email
    // await sendExpiringCardEmail(pm.organizations.email, pm);
  }
}

/**
 * Cleanup old checkout sessions (1 hour)
 */
export async function cleanupCheckoutSessions() {
  const supabase = createClient();
  
  console.log('[Cleanup] Removing expired checkout sessions...');
  
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  
  const { data, error } = await supabase
    .from('checkout_sessions')
    .delete()
    .eq('status', 'pending')
    .lt('expires_at', oneHourAgo.toISOString());
  
  if (error) {
    console.error('[Cleanup] Error:', error);
  } else {
    console.log('[Cleanup] Complete');
  }
}
