/**
 * Billing Overview Client Component
 * Shows subscription status and current usage
 */

'use client';

import { SubscriptionCardBranded } from '@/components/billing/SubscriptionCard.branded';
import { UsageMetricsBranded } from '@/components/billing/UsageMetrics.branded';
import { TrialBanner, PastDueBanner } from '@/components/FeatureGate.dark';
import { Button } from '@/components/ui/button';
import { CreditCard, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function BillingOverviewClient() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-text-primary">Billing Overview</h1>
          <p className="text-muted-foreground mt-2">
            Manage your subscription and track usage
          </p>
        </div>
        <Link href="/billing/plans">
          <Button className="gap-2">
            <CreditCard className="h-4 w-4" />
            Change Plan
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Banners */}
      <div className="space-y-4">
        <TrialBanner />
        <PastDueBanner />
      </div>

      {/* Subscription Card */}
      <SubscriptionCardBranded />

      {/* Usage Metrics */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Current Period Usage</h2>
        <UsageMetricsBranded />
      </div>
    </div>
  );
}
