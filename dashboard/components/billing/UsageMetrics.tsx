/**
 * UsageMetrics Component
 * Displays usage statistics with progress bars and warnings
 */

'use client';

import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  Clock, 
  Users, 
  Smartphone,
  AlertTriangle,
  TrendingUp 
} from 'lucide-react';
import { useSubscription } from '@/lib/hooks/useSubscription';
import { formatPrice } from '@/lib/stripe/config';

export function UsageMetrics() {
  const { subscription, loading, getUsagePercentage } = useSubscription();

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-2 bg-muted rounded"></div>
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
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: Phone,
      label: 'Total Calls',
      value: usage.calls,
      limit: null, // No limit on calls, only minutes
      unit: 'calls',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: Smartphone,
      label: 'Phone Numbers',
      value: usage.phoneNumbers,
      limit: plan.limits.maxPhoneNumbers,
      unit: '',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      icon: Users,
      label: 'Team Members',
      value: usage.teamMembers,
      limit: plan.limits.maxTeamMembers,
      unit: '',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overage Warning */}
      {!limits.withinLimits && limits.overages.overageCost > 0 && (
        <Card className="p-4 bg-yellow-500/10 border-yellow-500/50">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">
                Usage Limit Exceeded
              </h4>
              <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                You've exceeded your plan limits. Overage charges of{' '}
                <strong>{formatPrice(limits.overages.overageCost)}</strong> will be applied to your next invoice.
              </p>
              {limits.warnings.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {limits.warnings.map((warning, i) => (
                    <li key={i} className="text-sm text-yellow-800 dark:text-yellow-200">
                      • {warning}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Usage Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const percentage = metric.limit 
            ? Math.min((metric.value / metric.limit) * 100, 100)
            : 0;
          
          const isNearLimit = percentage >= 80 && percentage < 100;
          const isOverLimit = percentage >= 100;

          return (
            <Card key={metric.label} className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg p-2 ${metric.bgColor}`}>
                      <Icon className={`h-5 w-5 ${metric.color}`} />
                    </div>
                    <span className="font-medium text-sm">{metric.label}</span>
                  </div>
                  {isOverLimit && (
                    <Badge variant="destructive" className="text-xs">
                      Over Limit
                    </Badge>
                  )}
                  {isNearLimit && (
                    <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-600">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      80%+
                    </Badge>
                  )}
                </div>

                {/* Value */}
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">
                      {metric.value.toLocaleString()}
                    </span>
                    {metric.limit && (
                      <span className="text-muted-foreground text-sm">
                        / {metric.limit.toLocaleString()} {metric.unit}
                      </span>
                    )}
                    {!metric.limit && metric.unit && (
                      <span className="text-muted-foreground text-sm">
                        {metric.unit}
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                {metric.limit && (
                  <div className="space-y-2">
                    <Progress 
                      value={percentage} 
                      className={
                        isOverLimit 
                          ? 'bg-red-100 [&>div]:bg-red-500' 
                          : isNearLimit 
                          ? 'bg-yellow-100 [&>div]:bg-yellow-500'
                          : ''
                      }
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{percentage.toFixed(0)}% used</span>
                      <span>{(metric.limit - metric.value).toLocaleString()} remaining</span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Period Info */}
      <Card className="p-4 bg-muted/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>
              Current billing period: {new Date(usage.periodStart).toLocaleDateString()} -{' '}
              {new Date(usage.periodEnd).toLocaleDateString()}
            </span>
          </div>
          <span className="text-sm font-medium">
            {Math.ceil(
              (new Date(usage.periodEnd).getTime() - new Date().getTime()) /
                (1000 * 60 * 60 * 24)
            )}{' '}
            days left
          </span>
        </div>
      </Card>
    </div>
  );
}
