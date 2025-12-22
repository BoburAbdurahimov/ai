/**
 * Animated Skeleton Loader
 * Smooth loading placeholder with shimmer effect
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonAnimatedProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

const SkeletonAnimated = React.forwardRef<HTMLDivElement, SkeletonAnimatedProps>(
  ({ className, variant = 'rectangular', width, height, animation = 'wave', ...props }, ref) => {
    const variantStyles = {
      text: 'h-4 w-full rounded',
      circular: 'rounded-full',
      rectangular: 'rounded-lg',
    };

    const animationStyles = {
      pulse: 'animate-pulse',
      wave: 'skeleton',
      none: '',
    };

    const style: React.CSSProperties = {
      width: width ?? (variant === 'circular' ? '40px' : '100%'),
      height: height ?? (variant === 'text' ? '1rem' : variant === 'circular' ? '40px' : '100px'),
    };

    return (
      <div
        ref={ref}
        className={cn(
          'bg-muted/50',
          variantStyles[variant],
          animationStyles[animation],
          className
        )}
        style={style}
        {...props}
      />
    );
  }
);

SkeletonAnimated.displayName = 'SkeletonAnimated';

export { SkeletonAnimated };

/**
 * Pre-built skeleton patterns
 */
export function SkeletonCard() {
  return (
    <div className="p-6 space-y-4">
      <SkeletonAnimated variant="circular" width={48} height={48} />
      <SkeletonAnimated variant="text" width="60%" />
      <SkeletonAnimated variant="text" width="80%" />
      <SkeletonAnimated variant="rectangular" height={200} />
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="space-y-3">
      <SkeletonAnimated variant="rectangular" height={40} />
      {[...Array(5)].map((_, i) => (
        <SkeletonAnimated key={i} variant="rectangular" height={60} />
      ))}
    </div>
  );
}

export function SkeletonPricingCard() {
  return (
    <div className="p-8 space-y-6 glass rounded-2xl">
      <div className="flex items-center gap-4">
        <SkeletonAnimated variant="circular" width={56} height={56} />
        <div className="space-y-2 flex-1">
          <SkeletonAnimated variant="text" width="50%" height={24} />
          <SkeletonAnimated variant="text" width="70%" />
        </div>
      </div>
      <SkeletonAnimated variant="rectangular" height={60} />
      <SkeletonAnimated variant="rectangular" height={44} />
      <div className="space-y-3">
        {[...Array(6)].map((_, i) => (
          <SkeletonAnimated key={i} variant="text" />
        ))}
      </div>
    </div>
  );
}
