/**
 * UsageMetrics Component - Dark Modern Design
 * Sleek usage visualization with animated progress bars
 */

'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  Clock, 
  Users, 
  Smartphone,
  AlertTriangle,
  TrendingUp,
  Activity,
  Zap
} from 'lucide-react';
import { useSubscription } from '@/lib/hooks/useSubscription';
import { formatPrice } from '@/lib/stripe/config';

export function UsageMetrics() {
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

  const metrics = [
    {
      icon: Clock,
      label: 'Call Minutes',
      value: usage.minutes,
      limit: plan.limits.maxMinutesPerMonth,
      unit: 'min',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-500/20 to-cyan-500/20',
      glowColor: 'shadow-blue-500/30',
    },
    {
      icon: Phone,
      label: 'Total Calls',
      value: usage.calls,
      limit: null,
      unit: 'calls',
      gradient: 'from-emerald-500 to-green-500',
      bgGradient: 'from-emerald-500/20 to-green-500/20',
      glowColor: 'shadow-emerald-500/30',
    },
    {
      icon: Smartphone,
      label: 'Phone Numbers',
      value: usage.phoneNumbers,
      limit: plan.limits.maxPhoneNumbers,
      unit: '',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-500/20 to-pink-500/20',
      glowColor: 'shadow-purple-500/30',
    },
    {
      icon: Users,
      label: 'Team Members',
      value: usage.teamMembers,
      limit: plan.limits.maxTeamMembers,
      unit: '',
      gradient: 'from-orange-500 to-amber-500',
      bgGradient: 'from-orange-500/20 to-amber-500/20',
      glowColor: 'shadow-orange-500/30',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Overage Warning - Modern Alert */}
      {!limits.withinLimits && limits.overages.overageCost > 0 && (
        <Card className="p-6 glass border-amber-500/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10" />
          <div className="relative z-10 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="h-6 w-6 text-amber-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-lg text-amber-400 mb-2">
                Usage Limit Exceeded
              </h4>
              <p className="text-sm text-foreground/90 mb-3">
                You've exceeded your plan limits. Overage charges of{' '}
                <strong className="text-amber-400">{formatPrice(limits.overages.overageCost)}</strong> will be applied to your next invoice.
              </p>
              {limits.warnings.length > 0 && (
                <ul className="space-y-2">
                  {limits.warnings.map((warning, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      {warning}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Usage Grid - Modern Cards */}
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
              className={`p-8 glass smooth-transition hover:shadow-2xl ${metric.glowColor} group relative overflow-hidden`}
            >
              {/* Animated gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${metric.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative z-10 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${metric.gradient} flex items-center justify-center shadow-lg ${metric.glowColor}`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <span className="font-semibold text-muted-foreground text-sm">{metric.label}</span>
                      {isOverLimit && (
                        <Badge variant="destructive" className="ml-2 text-xs">
                          Over Limit
                        </Badge>
                      )}
                      {isNearLimit && !isOverLimit && (
                        <Badge className="ml-2 text-xs bg-amber-500/20 text-amber-400 border-amber-500/30">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          80%+
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Value Display */}
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className={`text-5xl font-bold bg-gradient-to-r ${metric.gradient} bg-clip-text text-transparent`}>
                      {metric.value.toLocaleString()}
                    </span>
                    {metric.limit && (
                      <span className="text-lg text-muted-foreground">
                        / {metric.limit.toLocaleString()}
                      </span>
                    )}
                    {metric.unit && (
                      <span className="text-sm text-muted-foreground">
                        {metric.unit}
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Bar - Modern Animated */}
                {metric.limit && (
                  <div className="space-y-3">
                    <div className="relative h-3 rounded-full bg-muted/30 overflow-hidden">
                      {/* Background glow */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${metric.gradient} opacity-10`} />
                      
                      {/* Progress fill with animation */}
                      <div
                        className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${metric.gradient} transition-all duration-1000 ease-out ${
                          isOverLimit 
                            ? 'animate-pulse' 
                            : ''
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-shimmer" />
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground font-medium">
                        {percentage.toFixed(1)}% used
                      </span>
                      <span className={`font-semibold ${
                        isOverLimit 
                          ? 'text-red-400' 
                          : isNearLimit 
                          ? 'text-amber-400' 
                          : 'text-emerald-400'
                      }`}>
                        {metric.limit - metric.value > 0 
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

      {/* Period Info - Modern Footer Card */}
      <Card className="p-6 glass border-primary/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5" />
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current billing period</p>
              <p className="font-semibold">
                {new Date(usage.periodStart).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })} - {new Date(usage.periodEnd).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Days remaining</p>
              <p className="text-2xl font-bold gradient-text-primary">
                {Math.ceil(
                  (new Date(usage.periodEnd).getTime() - new Date().getTime()) /
                    (1000 * 60 * 60 * 24)
                )}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
