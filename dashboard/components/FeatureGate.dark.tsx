/**
 * FeatureGate Component - Dark Modern Design
 * Conditional rendering with sleek upgrade prompts
 */

'use client';

import { ReactNode } from 'react';
import { useSubscription } from '@/lib/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Lock, Zap, Crown, TrendingUp, AlertTriangle, Sparkles, Clock } from 'lucide-react';

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
      <div className="flex items-center justify-center p-12">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
          <div className="absolute inset-0 w-12 h-12 rounded-full bg-primary/20 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!subscription || !hasFeature(feature)) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (showUpgradePrompt) {
      return (
        <Card className="relative overflow-hidden glass border-primary/30">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 animate-pulse" />
          <div className="absolute inset-0 bg-grid opacity-20" />
          
          <div className="relative z-10 p-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Icon */}
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl shadow-primary/40">
                  <Lock className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/50 animate-bounce">
                  <Crown className="h-4 w-4 text-white" />
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-2xl font-bold gradient-text-primary mb-2">
                    Premium Feature
                  </h3>
                  <p className="text-muted-foreground">
                    This feature is not available on your current plan. Upgrade to unlock advanced capabilities and boost your productivity.
                  </p>
                </div>
                
                {/* Features preview */}
                <div className="flex flex-wrap gap-3">
                  {['Advanced Analytics', 'Priority Support', 'Custom Integrations'].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/30 border border-border/30">
                      <Sparkles className="h-3 w-3 text-primary" />
                      <span className="text-xs font-medium">{item}</span>
                    </div>
                  ))}
                </div>
                
                <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg shadow-primary/40 hover:shadow-xl hover:shadow-primary/50 smooth-transition">
                  <Zap className="w-4 h-4 mr-2" />
                  Upgrade Now
                  <TrendingUp className="w-4 h-4 ml-2" />
                </Button>
              </div>
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
 * UsageGate Component - Dark Modern Design
 * Shows warning when approaching or exceeding limits
 */
interface UsageGateProps {
  metric: 'minutes' | 'phoneNumbers' | 'teamMembers';
  children: ReactNode;
  warningThreshold?: number;
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

  const metricLabels: Record<string, string> = {
    minutes: 'call minutes',
    phoneNumbers: 'phone numbers',
    teamMembers: 'team members',
  };

  return (
    <div className="space-y-6">
      {showWarning && (
        <Card className={`relative overflow-hidden glass ${
          overLimit 
            ? 'border-red-500/50' 
            : 'border-amber-500/50'
        }`}>
          {/* Gradient background */}
          <div className={`absolute inset-0 ${
            overLimit
              ? 'bg-gradient-to-r from-red-500/10 to-orange-500/10'
              : 'bg-gradient-to-r from-amber-500/10 to-yellow-500/10'
          }`} />
          
          <div className="relative z-10 p-6">
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                overLimit
                  ? 'bg-red-500/20 shadow-red-500/30'
                  : 'bg-amber-500/20 shadow-amber-500/30'
              }`}>
                <AlertTriangle className={`h-7 w-7 ${
                  overLimit ? 'text-red-400' : 'text-amber-400'
                }`} />
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <p className="font-bold text-lg mb-1">
                  {overLimit ? 'Limit Exceeded' : 'Approaching Limit'}
                </p>
                <p className="text-sm text-muted-foreground">
                  You've used <strong className={overLimit ? 'text-red-400' : 'text-amber-400'}>
                    {usagePercentage.toFixed(0)}%
                  </strong> of your {metricLabels[metric]} quota.
                  {overLimit && ' Overage charges will apply.'}
                </p>
              </div>
              
              {/* Progress Circle */}
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="text-muted/30"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 28}`}
                    strokeDashoffset={`${2 * Math.PI * 28 * (1 - usagePercentage / 100)}`}
                    className={`transition-all duration-500 ${
                      overLimit ? 'text-red-400' : 'text-amber-400'
                    }`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-xs font-bold ${
                    overLimit ? 'text-red-400' : 'text-amber-400'
                  }`}>
                    {usagePercentage.toFixed(0)}%
                  </span>
                </div>
              </div>
              
              {/* Action */}
              <Button 
                variant="outline" 
                size="sm"
                className={`${
                  overLimit
                    ? 'border-red-500/50 hover:bg-red-500/10 text-red-400'
                    : 'border-amber-500/50 hover:bg-amber-500/10 text-amber-400'
                }`}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Upgrade
              </Button>
            </div>
          </div>
        </Card>
      )}
      {children}
    </div>
  );
}

/**
 * TrialBanner Component - Dark Modern Design
 * Shows trial status with countdown
 */
export function TrialBanner() {
  const { subscription, loading, isTrialing, daysLeftInTrial } = useSubscription();

  if (loading || !subscription || !isTrialing()) {
    return null;
  }

  const daysLeft = daysLeftInTrial();

  return (
    <Card className="relative overflow-hidden glass border-0 animate-fadeIn">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-20 animate-pulse" />
      <div className="absolute inset-0 bg-grid opacity-10" />
      
      <div className="relative z-10 p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left side - Info */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-xl shadow-blue-500/40">
                <Zap className="h-8 w-8 text-white" />
              </div>
              {daysLeft !== null && daysLeft <= 3 && (
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 flex items-center justify-center animate-pulse shadow-lg shadow-red-500/50">
                  <span className="text-xs font-bold text-white">{daysLeft}</span>
                </div>
              )}
            </div>
            
            <div>
              <p className="text-xl font-bold mb-1">
                {daysLeft !== null && daysLeft > 0 ? (
                  <>
                    <span className="gradient-text-primary">{daysLeft}</span> day{daysLeft === 1 ? '' : 's'} left in trial
                  </>
                ) : (
                  'Trial ending soon'
                )}
              </p>
              <p className="text-sm text-muted-foreground">
                Upgrade now to continue enjoying premium features without interruption
              </p>
            </div>
          </div>
          
          {/* Right side - Countdown & CTA */}
          <div className="flex items-center gap-4">
            {/* Visual countdown */}
            {daysLeft !== null && (
              <div className="hidden md:flex items-center gap-3">
                {[...Array(Math.min(daysLeft, 7))].map((_, i) => (
                  <div 
                    key={i}
                    className="w-2 h-8 rounded-full bg-gradient-to-t from-blue-500 to-purple-600 animate-pulse"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            )}
            
            <Button 
              size="lg"
              className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 hover:from-blue-600 hover:via-purple-700 hover:to-pink-700 text-white shadow-xl shadow-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/60 smooth-transition"
            >
              <Crown className="w-5 h-5 mr-2" />
              Choose Plan
              <Sparkles className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

/**
 * PastDueBanner Component - Critical payment warning
 */
export function PastDueBanner() {
  const { subscription, loading, isPastDue } = useSubscription();

  if (loading || !subscription || !isPastDue()) {
    return null;
  }

  return (
    <Card className="relative overflow-hidden glass border-red-500/50 animate-fadeIn">
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 animate-pulse" />
      
      <div className="relative z-10 p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center shadow-lg shadow-red-500/30 animate-pulse">
            <AlertTriangle className="h-7 w-7 text-red-400" />
          </div>
          
          <div className="flex-1">
            <p className="text-lg font-bold text-red-400 mb-1">
              Payment Failed - Action Required
            </p>
            <p className="text-sm text-muted-foreground">
              Your last payment failed. Please update your payment method to avoid service interruption.
            </p>
          </div>
          
          <Button 
            variant="destructive"
            className="bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Update Payment
          </Button>
        </div>
      </div>
    </Card>
  );
}
