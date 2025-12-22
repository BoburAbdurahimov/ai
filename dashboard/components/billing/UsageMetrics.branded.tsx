/**
 * Branded Usage Metrics - Real Context, Not Generic Numbers
 * Shows actual business impact, not just stats
 */

'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CounterAnimated } from '@/components/ui/counter-animated';
import { 
  Phone, 
  Clock, 
  Users, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Calendar
} from 'lucide-react';
import { useSubscription } from '@/lib/hooks/useSubscription';
import { formatPrice } from '@/lib/stripe/config';

export function UsageMetricsBranded() {
  const { subscription, loading, getUsagePercentage } = useSubscription();

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-8 glass">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-muted/50 rounded w-1/2 shimmer"></div>
              <div className="h-10 bg-muted/50 rounded w-3/4"></div>
              <div className="h-3 bg-muted/50 rounded"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!subscription) {
    return null;
  }

  const { usage, plan, limits } = subscription;

  // Real-world metrics with business context
  const metrics = [
    {
      icon: Clock,
      label: 'Call Minutes',
      value: usage.minutes,
      limit: plan.limits.maxMinutesPerMonth,
      unit: 'min',
      gradient: 'from-blue-500 to-cyan-500',
      context: `~${Math.round(usage.minutes / 30)} min/day average`,
      costPerUnit: '$0.10',
    },
    {
      icon: Phone,
      label: 'Calls Handled',
      value: usage.calls,
      limit: null,
      unit: 'calls',
      gradient: 'from-emerald-500 to-green-500',
      context: `${Math.round((usage.calls / usage.minutes) * 60 || 0)} calls/hour`,
      costPerUnit: null,
    },
    {
      icon: Users,
      label: 'Team Members',
      value: usage.teamMembers,
      limit: plan.limits.maxTeamMembers,
      unit: '',
      gradient: 'from-purple-500 to-pink-500',
      context: usage.teamMembers === 1 ? 'Just you' : 'Active this month',
      costPerUnit: usage.teamMembers > plan.limits.maxTeamMembers ? '$20' : null,
    },
    {
      icon: TrendingUp,
      label: 'Growth Rate',
      value: Math.round((usage.calls / Math.max(1, usage.calls - 10)) * 100 - 100),
      limit: null,
      unit: '%',
      gradient: 'from-orange-500 to-amber-500',
      context: 'vs last month',
      costPerUnit: null,
    },
  ];

  const callsPerDay = Math.round(usage.calls / 30);
  const avgCallLength = Math.round((usage.minutes / Math.max(1, usage.calls)) * 10) / 10;

  return (
    <div className="space-y-8">
      {/* Real business insights at the top */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 glass">
          <div className="flex items-center gap-3 mb-2">
            <Phone className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Daily Volume</span>
          </div>
          <div className="text-3xl font-bold">
            <CounterAnimated value={callsPerDay} />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            calls/day on average
          </p>
        </Card>

        <Card className="p-6 glass">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Avg Call Length</span>
          </div>
          <div className="text-3xl font-bold">
            <CounterAnimated value={avgCallLength} decimals={1} />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            minutes per call
          </p>
        </Card>

        <Card className="p-6 glass">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Days Left</span>
          </div>
          <div className="text-3xl font-bold">
            <CounterAnimated 
              value={Math.ceil(
                (new Date(usage.periodEnd).getTime() - new Date().getTime()) /
                  (1000 * 60 * 60 * 24)
              )} 
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            in billing cycle
          </p>
        </Card>
      </div>

      {/* Overage warning with real cost impact */}
      {!limits.withinLimits && limits.overages.overageCost > 0 && (
        <Card className="p-6 glass border-amber-500/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10" />
          <div className="relative z-10 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="h-6 w-6 text-amber-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-lg text-amber-400 mb-2">
                You're over your included minutes
              </h4>
              <p className="text-sm text-foreground/90 mb-3">
                You've used <strong>{usage.minutes.toLocaleString()}</strong> minutes this cycle 
                (included: <strong>{plan.limits.maxMinutesPerMonth.toLocaleString()}</strong>).
                Overage charges of <strong className="text-amber-400">{formatPrice(limits.overages.overageCost)}</strong> will 
                be added to your next invoice.
              </p>
              <p className="text-xs text-muted-foreground">
                💡 Tip: Upgrading to {plan.id === 'STARTER' ? 'Professional' : 'Business'} would save you money at this volume.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Usage Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const percentage = metric.limit 
            ? Math.min((metric.value / metric.limit) * 100, 100)
            : 0;
          
          const isNearLimit = percentage >= 80 && percentage < 100;
          const isOverLimit = percentage >= 100;

          return (
            <Card 
              key={metric.label} 
              className="p-8 glass smooth-transition hover:shadow-2xl relative overflow-hidden group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${metric.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
              
              <div className="relative z-10 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${metric.gradient} flex items-center justify-center shadow-lg`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <span className="font-semibold text-sm text-muted-foreground block">{metric.label}</span>
                      {metric.context && (
                        <span className="text-xs text-muted-foreground">{metric.context}</span>
                      )}
                    </div>
                  </div>
                  {isOverLimit && (
                    <Badge variant="destructive" className="text-xs">
                      Over
                    </Badge>
                  )}
                  {isNearLimit && !isOverLimit && (
                    <Badge className="text-xs bg-amber-500/20 text-amber-400 border-amber-500/30">
                      80%+
                    </Badge>
                  )}
                </div>

                {/* Value */}
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className={`text-5xl font-bold bg-gradient-to-r ${metric.gradient} bg-clip-text text-transparent`}>
                      <CounterAnimated value={metric.value} separator />
                    </span>
                    {metric.limit && (
                      <span className="text-lg text-muted-foreground">
                        / {metric.limit.toLocaleString()}
                      </span>
                    )}
                    {metric.unit && !metric.limit && (
                      <span className="text-sm text-muted-foreground">
                        {metric.unit}
                      </span>
                    )}
                  </div>
                  {metric.costPerUnit && isOverLimit && (
                    <p className="text-xs text-amber-400 mt-2">
                      {metric.costPerUnit} per additional {metric.unit || 'unit'}
                    </p>
                  )}
                </div>

                {/* Progress Bar */}
                {metric.limit && (
                  <div className="space-y-3">
                    <div className="relative h-3 rounded-full bg-muted/30 overflow-hidden">
                      <div
                        className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${metric.gradient} transition-all duration-1000 ease-out ${
                          isOverLimit ? 'animate-pulse' : ''
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-shimmer" />
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-xs">
                      <span className={`font-semibold ${
                        isOverLimit ? 'text-red-400' : isNearLimit ? 'text-amber-400' : 'text-muted-foreground'
                      }`}>
                        {percentage.toFixed(0)}% used
                      </span>
                      <span className="text-muted-foreground">
                        {metric.value < metric.limit 
                          ? `${(metric.limit - metric.value).toLocaleString()} remaining`
                          : `${(metric.value - metric.limit).toLocaleString()} over limit`
                        }
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Success state - not over limit */}
      {limits.withinLimits && (
        <Card className="p-6 glass border-emerald-500/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-emerald-400" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">You're on track this month</p>
              <p className="text-sm text-muted-foreground">
                Your current usage is well within your plan limits. Keep it up! 
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
