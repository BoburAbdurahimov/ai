/**
 * Custom Branded Elements - No Stock Templates
 * Unique visual elements that feel authentic and bespoke
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Custom Visual Separator - Not a generic line
 */
export function BrandedSeparator({ className }: { className?: string }) {
  return (
    <div className={cn('relative h-px my-8', className)}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary shadow-lg shadow-primary/50" />
    </div>
  );
}

/**
 * Custom Data Visualization - Real metrics, not stock charts
 */
export function MiniSparkline({ data, color = 'primary' }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((value, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  const colorClasses = {
    primary: 'stroke-primary',
    success: 'stroke-emerald-400',
    warning: 'stroke-amber-400',
    danger: 'stroke-red-400',
  };

  return (
    <svg viewBox="0 0 100 30" className="w-full h-8" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(colorClasses[color as keyof typeof colorClasses], 'transition-all duration-300')}
      />
    </svg>
  );
}

/**
 * Usage Thermometer - Visual quota indicator
 */
export function UsageThermometer({ 
  percentage, 
  label 
}: { 
  percentage: number; 
  label: string;
}) {
  const level = percentage > 90 ? 'critical' : percentage > 70 ? 'warning' : 'normal';
  
  const colors = {
    normal: 'from-blue-500 to-cyan-500',
    warning: 'from-amber-500 to-orange-500',
    critical: 'from-red-500 to-rose-500',
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-8 h-32 rounded-full bg-muted/30 overflow-hidden">
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${colors[level]} transition-all duration-1000 ease-out`}
          style={{ height: `${Math.min(percentage, 100)}%` }}
        >
          <div className="absolute inset-0 animate-pulse opacity-50" />
        </div>
        {/* Tick marks */}
        {[25, 50, 75].map((tick) => (
          <div 
            key={tick}
            className="absolute left-0 right-0 h-px bg-background/50"
            style={{ bottom: `${tick}%` }}
          />
        ))}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium mb-1">{label}</p>
        <p className="text-3xl font-bold">{percentage.toFixed(0)}%</p>
        {level === 'critical' && (
          <p className="text-xs text-red-400 mt-1">Over limit</p>
        )}
        {level === 'warning' && (
          <p className="text-xs text-amber-400 mt-1">Approaching limit</p>
        )}
      </div>
    </div>
  );
}

/**
 * Timeline Indicator - Show billing cycle progress
 */
export function BillingTimeline({
  startDate,
  endDate,
  currentDate = new Date(),
}: {
  startDate: Date;
  endDate: Date;
  currentDate?: Date;
}) {
  const totalDuration = endDate.getTime() - startDate.getTime();
  const elapsed = currentDate.getTime() - startDate.getTime();
  const percentage = Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));
  const daysLeft = Math.ceil((endDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        <span className="font-semibold">{daysLeft} days left</span>
        <span>{endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
      </div>
      <div className="relative h-2 rounded-full bg-muted/30 overflow-hidden">
        <div 
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent transition-all duration-500"
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-shimmer" />
        </div>
        {/* Current position marker */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-primary shadow-lg transition-all duration-500"
          style={{ left: `calc(${percentage}% - 6px)` }}
        />
      </div>
    </div>
  );
}

/**
 * Real-time Activity Pulse - Show live system status
 */
export function ActivityPulse({ 
  active = true, 
  label = 'Live' 
}: { 
  active?: boolean; 
  label?: string;
}) {
  return (
    <div className="inline-flex items-center gap-2">
      <div className="relative">
        <div className={cn(
          'w-2 h-2 rounded-full',
          active ? 'bg-emerald-400' : 'bg-muted-foreground'
        )} />
        {active && (
          <>
            <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
            <div className="absolute inset-0 rounded-full bg-emerald-400 animate-pulse" />
          </>
        )}
      </div>
      <span className={cn(
        'text-xs font-medium',
        active ? 'text-emerald-400' : 'text-muted-foreground'
      )}>
        {label}
      </span>
    </div>
  );
}

/**
 * Metric Delta - Show change with context
 */
export function MetricDelta({
  value,
  previousValue,
  format = 'number',
  label,
}: {
  value: number;
  previousValue: number;
  format?: 'number' | 'percentage' | 'currency';
  label?: string;
}) {
  const delta = value - previousValue;
  const percentageChange = previousValue !== 0 ? (delta / previousValue) * 100 : 0;
  const isPositive = delta > 0;
  const isNeutral = delta === 0;

  const formatValue = (val: number) => {
    switch (format) {
      case 'percentage':
        return `${val.toFixed(1)}%`;
      case 'currency':
        return `$${val.toFixed(2)}`;
      default:
        return val.toLocaleString();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-2xl font-bold">{formatValue(value)}</span>
      {!isNeutral && (
        <div className={cn(
          'flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold',
          isPositive 
            ? 'bg-emerald-500/20 text-emerald-400' 
            : 'bg-red-500/20 text-red-400'
        )}>
          {isPositive ? '↑' : '↓'}
          {Math.abs(percentageChange).toFixed(1)}%
        </div>
      )}
      {label && (
        <span className="text-xs text-muted-foreground">{label}</span>
      )}
    </div>
  );
}

/**
 * Custom Empty State - Not generic
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-2xl bg-muted/30 flex items-center justify-center mb-6">
        <Icon className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md mb-6">{description}</p>
      {action}
    </div>
  );
}

/**
 * Feature Highlight Badge - Not a generic label
 */
export function FeatureHighlight({ 
  label, 
  description,
  icon: Icon,
}: { 
  label: string; 
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="inline-flex items-start gap-3 p-4 rounded-xl glass border border-primary/20">
      {Icon && (
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      )}
      <div>
        <p className="font-semibold text-sm">{label}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
    </div>
  );
}

/**
 * Usage Forecast - Predictive indicator
 */
export function UsageForecast({
  currentUsage,
  limit,
  daysInCycle,
  daysRemaining,
}: {
  currentUsage: number;
  limit: number;
  daysInCycle: number;
  daysRemaining: number;
}) {
  const daysElapsed = daysInCycle - daysRemaining;
  const dailyRate = currentUsage / Math.max(1, daysElapsed);
  const projectedTotal = dailyRate * daysInCycle;
  const willExceed = projectedTotal > limit;

  return (
    <div className={cn(
      'p-4 rounded-xl border',
      willExceed 
        ? 'bg-amber-500/5 border-amber-500/30' 
        : 'bg-emerald-500/5 border-emerald-500/30'
    )}>
      <div className="flex items-start gap-3">
        <div className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
          willExceed ? 'bg-amber-500/20' : 'bg-emerald-500/20'
        )}>
          <TrendingUp className={cn(
            'h-5 w-5',
            willExceed ? 'text-amber-400' : 'text-emerald-400'
          )} />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm mb-1">
            {willExceed ? 'On pace to exceed limit' : 'On track this cycle'}
          </p>
          <p className="text-xs text-muted-foreground">
            At your current rate ({dailyRate.toFixed(1)}/day), you'll use{' '}
            <strong className={willExceed ? 'text-amber-400' : 'text-emerald-400'}>
              {projectedTotal.toFixed(0)}
            </strong> of {limit} by cycle end.
          </p>
        </div>
      </div>
    </div>
  );
}

function TrendingUp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}
