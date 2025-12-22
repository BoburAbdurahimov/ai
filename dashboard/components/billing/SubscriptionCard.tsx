/**
 * SubscriptionCard Component
 * Displays current subscription details and management options
 */

'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Calendar, 
  AlertCircle, 
  Settings,
  TrendingUp,
  CheckCircle 
} from 'lucide-react';
import { useSubscription } from '@/lib/hooks/useSubscription';
import { formatPrice } from '@/lib/stripe/config';

export function SubscriptionCard() {
  const { subscription, loading } = useSubscription();

  const handleManageSubscription = async () => {
    try {
      const response = await fetch('/api/billing/portal', {
        method: 'POST',
      });
      
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Failed to open billing portal:', error);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground">No subscription data available</p>
      </Card>
    );
  }

  const { organization, subscription: sub, plan } = subscription;
  const statusColors: Record<string, string> = {
    ACTIVE: 'bg-green-500',
    TRIALING: 'bg-blue-500',
    PAST_DUE: 'bg-yellow-500',
    CANCELED: 'bg-red-500',
    PAUSED: 'bg-gray-500',
  };

  return (
    <Card className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-2xl font-bold mb-2">{plan.name} Plan</h3>
          <div className="flex items-center gap-2">
            <Badge className={statusColors[organization.planStatus]}>
              {organization.planStatus}
            </Badge>
            {sub?.cancelAtPeriodEnd && (
              <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                Canceling at period end
              </Badge>
            )}
          </div>
        </div>
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={handleManageSubscription}
        >
          <Settings className="h-4 w-4" />
          Manage
        </Button>
      </div>

      {/* Plan Details */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Current Period */}
        {sub && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-medium">Billing Period</span>
            </div>
            <p className="text-sm">
              {new Date(sub.currentPeriodStart).toLocaleDateString()} - {new Date(sub.currentPeriodEnd).toLocaleDateString()}
            </p>
          </div>
        )}

        {/* Next Billing */}
        {sub && !sub.cancelAtPeriodEnd && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CreditCard className="h-4 w-4" />
              <span className="text-sm font-medium">Next Billing</span>
            </div>
            <p className="text-sm">
              {formatPrice(
                sub.interval === 'monthly' ? plan.priceMonthly : plan.priceYearly
              )} on {new Date(sub.currentPeriodEnd).toLocaleDateString()}
            </p>
          </div>
        )}

        {/* Trial Info */}
        {organization.trialEndsAt && organization.planStatus === 'TRIALING' && (
          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center gap-2 text-blue-600">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Trial Period</span>
            </div>
            <p className="text-sm">
              Your trial ends on {new Date(organization.trialEndsAt).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>

      {/* Plan Features Summary */}
      <div className="border-t pt-4">
        <h4 className="font-semibold mb-3">Plan Includes</h4>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm">
              {plan.features.minutesIncluded} minutes/month
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm">
              {plan.features.phoneNumbers === 'unlimited' 
                ? 'Unlimited' 
                : plan.features.phoneNumbers} phone numbers
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm">
              {plan.features.teamMembers === 'unlimited'
                ? 'Unlimited'
                : plan.features.teamMembers} team members
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm capitalize">
              {plan.features.support} support
            </span>
          </div>
        </div>
      </div>

      {/* Upgrade Prompt for lower tiers */}
      {organization.plan !== 'BUSINESS' && organization.plan !== 'ENTERPRISE' && (
        <div className="border-t pt-4">
          <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="font-medium">Need more?</p>
                <p className="text-sm text-muted-foreground">
                  Upgrade to unlock advanced features and higher limits
                </p>
              </div>
              <Button>Upgrade</Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
