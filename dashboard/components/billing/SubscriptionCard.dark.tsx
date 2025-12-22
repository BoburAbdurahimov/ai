/**
 * SubscriptionCard Component - Dark Modern Design
 * Sleek subscription management card with modern dark theme
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
  CheckCircle,
  Crown,
  Zap,
  Clock
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
        <p className="text-muted-foreground">No subscription data available</p>
      </Card>
    );
  }

  const { organization, subscription: sub, plan } = subscription;
  
  const statusConfig: Record<string, { color: string; bgColor: string; icon: any }> = {
    ACTIVE: { 
      color: 'text-emerald-400', 
      bgColor: 'bg-emerald-500/20 border-emerald-500/30',
      icon: CheckCircle 
    },
    TRIALING: { 
      color: 'text-blue-400', 
      bgColor: 'bg-blue-500/20 border-blue-500/30',
      icon: Zap 
    },
    PAST_DUE: { 
      color: 'text-amber-400', 
      bgColor: 'bg-amber-500/20 border-amber-500/30',
      icon: AlertCircle 
    },
    CANCELED: { 
      color: 'text-red-400', 
      bgColor: 'bg-red-500/20 border-red-500/30',
      icon: AlertCircle 
    },
    PAUSED: { 
      color: 'text-gray-400', 
      bgColor: 'bg-gray-500/20 border-gray-500/30',
      icon: Clock 
    },
  };

  const status = statusConfig[organization.planStatus] || statusConfig.ACTIVE;
  const StatusIcon = status.icon;

  return (
    <Card className="p-8 glass smooth-transition hover:shadow-2xl hover:shadow-primary/10 relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-bold gradient-text-primary">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">Subscription Plan</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 flex-wrap">
              <Badge className={`${status.bgColor} ${status.color} border px-4 py-1.5 font-semibold`}>
                <StatusIcon className="w-4 h-4 mr-2" />
                {organization.planStatus}
              </Badge>
              {sub?.cancelAtPeriodEnd && (
                <Badge variant="outline" className="text-amber-400 border-amber-500/50 bg-amber-500/10 px-4 py-1.5">
                  <Clock className="w-4 h-4 mr-2" />
                  Canceling at period end
                </Badge>
              )}
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="glass border-border/50 hover:border-primary/50 hover:bg-primary/10 smooth-transition group"
            onClick={handleManageSubscription}
          >
            <Settings className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
            Manage
          </Button>
        </div>

        {/* Plan Details - Modern Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Current Period */}
          {sub && (
            <div className="space-y-3 p-6 rounded-2xl bg-muted/30 border border-border/50">
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <span className="font-semibold">Billing Period</span>
              </div>
              <div className="pl-13">
                <p className="text-sm text-foreground font-medium">
                  {new Date(sub.currentPeriodStart).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                  {' → '}
                  {new Date(sub.currentPeriodEnd).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          )}

          {/* Next Billing */}
          {sub && !sub.cancelAtPeriodEnd && (
            <div className="space-y-3 p-6 rounded-2xl bg-muted/30 border border-border/50">
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-accent" />
                </div>
                <span className="font-semibold">Next Billing</span>
              </div>
              <div className="pl-13">
                <p className="text-sm">
                  <span className="text-2xl font-bold gradient-text-primary">
                    {formatPrice(
                      sub.interval === 'monthly' ? plan.priceMonthly : plan.priceYearly
                    )}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  on {new Date(sub.currentPeriodEnd).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          )}

          {/* Trial Info */}
          {organization.trialEndsAt && organization.planStatus === 'TRIALING' && (
            <div className="md:col-span-2 space-y-3 p-6 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-blue-400">Trial Period Active</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your trial ends on {new Date(organization.trialEndsAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Plan Features - Modern Grid */}
        <div className="border-t border-border/50 pt-8">
          <h4 className="font-semibold text-lg mb-6 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            Plan Includes
          </h4>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { label: `${plan.features.minutesIncluded} minutes/month`, icon: Clock },
              { 
                label: `${plan.features.phoneNumbers === 'unlimited' ? 'Unlimited' : plan.features.phoneNumbers} phone numbers`,
                icon: CreditCard 
              },
              { 
                label: `${plan.features.teamMembers === 'unlimited' ? 'Unlimited' : plan.features.teamMembers} team members`,
                icon: CheckCircle 
              },
              { label: `${plan.features.support} support`.replace(/^\w/, c => c.toUpperCase()), icon: Zap },
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-muted/20 border border-border/30">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upgrade Prompt */}
        {organization.plan !== 'BUSINESS' && organization.plan !== 'ENTERPRISE' && (
          <div className="border-t border-border/50 pt-6">
            <div className="relative overflow-hidden rounded-2xl p-6 glass border border-primary/30">
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 animate-pulse" />
              
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-lg">Need more power?</p>
                  <p className="text-sm text-muted-foreground">
                    Upgrade to unlock advanced features and higher limits
                  </p>
                </div>
                <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg shadow-primary/30">
                  <Zap className="w-4 h-4 mr-2" />
                  Upgrade
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
