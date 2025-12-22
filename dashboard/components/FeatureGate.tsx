/**
 * FeatureGate Component
 * Conditionally renders content based on plan features
 */

'use client';

import { ReactNode } from 'react';
import { useSubscription } from '@/lib/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Lock, Zap } from 'lucide-react';

interface FeatureGateProps {
  feature: string;
  children: ReactNode;
  fallback?: ReactNode;
  showUpgradePrompt?: boolean;
}

export function FeatureGate({
  feature,
  children,
  fallback,
  showUpgradePrompt = true,
}: FeatureGateProps) {
  const { subscription, loading, hasFeature } = useSubscription();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!subscription || !hasFeature(feature)) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (showUpgradePrompt) {
      return (
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">
                Premium Feature
              </h3>
              <p className="text-muted-foreground mb-4">
                This feature is not available on your current plan. Upgrade to unlock advanced capabilities.
              </p>
              <Button className="gap-2">
                <Zap className="h-4 w-4" />
                Upgrade Plan
              </Button>
            </div>
          </div>
        </Card>
      );
    }

    return null;
  }

  return <>{children}</>;
}

/**
 * UsageGate Component
 * Shows warning when approaching or exceeding limits
 */
interface UsageGateProps {
  metric: 'minutes' | 'phoneNumbers' | 'teamMembers';
  children: ReactNode;
  warningThreshold?: number; // Percentage (default 80)
}

export function UsageGate({
  metric,
  children,
  warningThreshold = 80,
}: UsageGateProps) {
  const { subscription, loading, getUsagePercentage, isOverLimit } = useSubscription();

  if (loading || !subscription) {
    return <>{children}</>;
  }

  const usagePercentage = getUsagePercentage(metric);
  const overLimit = isOverLimit(metric);

  const showWarning = usagePercentage >= warningThreshold;

  return (
    <div className="space-y-4">
      {showWarning && (
        <Card className={`p-4 ${overLimit ? 'bg-destructive/10 border-destructive' : 'bg-warning/10 border-warning'}`}>
          <div className="flex items-center gap-3">
            <div className={`rounded-full p-2 ${overLimit ? 'bg-destructive/20' : 'bg-warning/20'}`}>
              <Zap className={`h-4 w-4 ${overLimit ? 'text-destructive' : 'text-warning'}`} />
            </div>
            <div className="flex-1">
              <p className="font-medium">
                {overLimit ? 'Limit Exceeded' : 'Approaching Limit'}
              </p>
              <p className="text-sm text-muted-foreground">
                You've used {usagePercentage.toFixed(0)}% of your {metric} quota.
                {overLimit && ' Overage charges may apply.'}
              </p>
            </div>
            <Button variant="outline" size="sm">
              Upgrade
            </Button>
          </div>
        </Card>
      )}
      {children}
    </div>
  );
}

/**
 * TrialBanner Component
 * Shows trial status and days remaining
 */
export function TrialBanner() {
  const { subscription, loading, isTrialing, daysLeftInTrial } = useSubscription();

  if (loading || !subscription || !isTrialing()) {
    return null;
  }

  const daysLeft = daysLeftInTrial();

  return (
    <Card className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-blue-500/20 p-2">
            <Zap className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <p className="font-medium">
              {daysLeft !== null && daysLeft > 0
                ? `${daysLeft} day${daysLeft === 1 ? '' : 's'} left in trial`
                : 'Trial ending soon'}
            </p>
            <p className="text-sm text-muted-foreground">
              Upgrade now to continue enjoying premium features
            </p>
          </div>
        </div>
        <Button>Choose Plan</Button>
      </div>
    </Card>
  );
}
