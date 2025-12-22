/**
 * Branded Subscription Card - Authentic, Not Generic
 * Real data, real metrics, real context
 */

'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CounterAnimated } from '@/components/ui/counter-animated';
import { 
  Phone, 
  Calendar, 
  AlertCircle, 
  ExternalLink,
  TrendingUp,
  Clock,
  Users,
  Smartphone,
  Zap
} from 'lucide-react';
import { useSubscription } from '@/lib/hooks/useSubscription';
import { formatPrice } from '@/lib/stripe/config';

export function SubscriptionCardBranded() {
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
      <Card className="p-8 glass">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted/50 rounded-lg w-1/3 shimmer"></div>
          <div className="h-5 bg-muted/50 rounded w-2/3"></div>
          <div className="h-5 bg-muted/50 rounded w-1/2"></div>
        </div>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card className="p-8 glass text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No active subscription</p>
      </Card>
    );
  }

  const { organization, subscription: sub, plan, usage } = subscription;
  
  // Real status messaging, not generic
  const getStatusMessage = () => {
    switch (organization.planStatus) {
      case 'ACTIVE':
        return {
          text: 'Everything running smoothly',
          color: 'text-emerald-400',
          bgColor: 'bg-emerald-500/20 border-emerald-500/30',
        };
      case 'TRIALING':
        const daysLeft = organization.trialEndsAt 
          ? Math.ceil((new Date(organization.trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
          : 0;
        return {
          text: `${daysLeft} days left in trial`,
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/20 border-blue-500/30',
        };
      case 'PAST_DUE':
        return {
          text: 'Payment issue - please update card',
          color: 'text-amber-400',
          bgColor: 'bg-amber-500/20 border-amber-500/30',
        };
      default:
        return {
          text: organization.planStatus,
          color: 'text-muted-foreground',
          bgColor: 'bg-muted/20 border-muted/30',
        };
    }
  };

  const status = getStatusMessage();

  // Calculate real utilization
  const minutesUsed = usage.minutes;
  const minutesLimit = plan.limits.maxMinutesPerMonth;
  const utilization = Math.round((minutesUsed / minutesLimit) * 100);
  const callsPerDay = Math.round(usage.calls / 30); // Rough estimate

  return (
    <Card className="p-8 glass smooth-transition hover:shadow-2xl relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 space-y-8">
        {/* Header with real context */}
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div>
              <h3 className="text-3xl font-bold mb-1">{plan.name}</h3>
              <p className="text-sm text-muted-foreground">
                Billing for {organization.name || 'your organization'}
              </p>
            </div>
            
            <div className="flex items-center gap-3 flex-wrap">
              <Badge className={`${status.bgColor} ${status.color} border px-4 py-1.5 font-semibold`}>
                {status.text}
              </Badge>
              {sub?.cancelAtPeriodEnd && (
                <Badge variant="outline" className="text-amber-400 border-amber-500/50 bg-amber-500/10">
                  Cancels {new Date(sub.currentPeriodEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </Badge>
              )}
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="glass border-border/50 hover:border-primary/50 hover:bg-primary/10 smooth-transition group"
            onClick={handleManageSubscription}
          >
            Manage Billing
            <ExternalLink className="h-4 w-4 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Button>
        </div>

        {/* Current usage snapshot - not generic metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl glass border border-border/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Clock className="h-4 w-4" />
              <span className="text-xs font-medium">Minutes Used</span>
            </div>
            <div className="text-2xl font-bold">
              <CounterAnimated value={minutesUsed} separator />
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              of {minutesLimit.toLocaleString()}
            </div>
          </div>

          <div className="p-4 rounded-xl glass border border-border/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Phone className="h-4 w-4" />
              <span className="text-xs font-medium">Avg/Day</span>
            </div>
            <div className="text-2xl font-bold">
              <CounterAnimated value={callsPerDay} />
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              calls handled
            </div>
          </div>

          <div className="p-4 rounded-xl glass border border-border/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs font-medium">Usage</span>
            </div>
            <div className="text-2xl font-bold">
              <CounterAnimated value={utilization} />%
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              of quota
            </div>
          </div>

          <div className="p-4 rounded-xl glass border border-border/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Users className="h-4 w-4" />
              <span className="text-xs font-medium">Team Size</span>
            </div>
            <div className="text-2xl font-bold">
              <CounterAnimated value={usage.teamMembers} />
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              active users
            </div>
          </div>
        </div>

        {/* Billing period info - clear and specific */}
        {sub && (
          <div className="p-6 rounded-2xl glass border border-border/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Current billing cycle</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(sub.currentPeriodStart).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })} - {new Date(sub.currentPeriodEnd).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              
              {!sub.cancelAtPeriodEnd && (
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Next charge</p>
                  <p className="text-2xl font-bold gradient-text-primary">
                    {formatPrice(
                      sub.interval === 'monthly' ? plan.priceMonthly : plan.priceYearly
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    on {new Date(sub.currentPeriodEnd).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </div>

            {/* Days remaining progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Cycle progress</span>
                <span>
                  {Math.ceil(
                    (new Date(sub.currentPeriodEnd).getTime() - new Date().getTime()) /
                      (1000 * 60 * 60 * 24)
                  )} days left
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-1000"
                  style={{
                    width: `${100 - ((new Date(sub.currentPeriodEnd).getTime() - new Date().getTime()) / 
                                     (new Date(sub.currentPeriodEnd).getTime() - new Date(sub.currentPeriodStart).getTime()) * 100)}%`
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Upgrade nudge - contextual, not pushy */}
        {organization.plan !== 'BUSINESS' && utilization > 70 && (
          <div className="p-6 rounded-2xl border border-amber-500/30 bg-amber-500/5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-5 w-5 text-amber-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold mb-1">You're using {utilization}% of your quota</p>
                <p className="text-sm text-muted-foreground mb-3">
                  Based on your current usage, you might want to upgrade before hitting the limit. 
                  Overage is $0.10/min—upgrading now could save you money.
                </p>
                <Button variant="outline" size="sm" className="border-amber-500/50 hover:bg-amber-500/10">
                  View Upgrade Options
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* What's included - remind them of value */}
        <div className="border-t border-border/50 pt-6">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">
            Your plan includes
          </p>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Phone className="h-4 w-4 text-primary" />
              </div>
              <span>
                {plan.features.phoneNumbers === 'unlimited' 
                  ? 'Unlimited' 
                  : plan.features.phoneNumbers} Uzbek phone {plan.features.phoneNumbers === 1 ? 'number' : 'numbers'}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <span>
                {plan.features.teamMembers === 'unlimited'
                  ? 'Unlimited'
                  : plan.features.teamMembers} team {plan.features.teamMembers === 1 ? 'member' : 'members'}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Smartphone className="h-4 w-4 text-primary" />
              </div>
              <span>Russian AI + Uzbek handoff</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Zap className="h-4 w-4 text-primary" />
              </div>
              <span>24/7 Telegram support</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
