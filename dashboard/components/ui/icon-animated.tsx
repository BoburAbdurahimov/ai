/**
 * Animated Icon Wrapper
 * Adds smooth micro-animations to icons
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface IconAnimatedProps {
  children: React.ReactNode;
  animation?: 'bounce' | 'spin' | 'pulse' | 'wiggle' | 'shake' | 'pop' | 'none';
  trigger?: 'hover' | 'always' | 'once';
  delay?: number;
  className?: string;
}

export function IconAnimated({
  children,
  animation = 'bounce',
  trigger = 'hover',
  delay = 0,
  className,
}: IconAnimatedProps) {
  const [shouldAnimate, setShouldAnimate] = React.useState(trigger === 'always');

  React.useEffect(() => {
    if (trigger === 'once') {
      const timer = setTimeout(() => setShouldAnimate(true), delay);
      return () => clearTimeout(timer);
    }
  }, [trigger, delay]);

  const animationClasses = {
    bounce: 'icon-bounce',
    spin: 'icon-spin',
    pulse: 'icon-pulse',
    wiggle: 'icon-wiggle',
    shake: 'icon-shake',
    pop: 'icon-pop',
    none: '',
  };

  const triggerClasses = {
    hover: 'group-hover',
    always: '',
    once: '',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center',
        trigger === 'hover' ? `group` : '',
        className
      )}
      onMouseEnter={() => trigger === 'hover' && setShouldAnimate(true)}
      onMouseLeave={() => trigger === 'hover' && setShouldAnimate(false)}
    >
      <span
        className={cn(
          'inline-flex',
          shouldAnimate && animationClasses[animation]
        )}
        style={{ animationDelay: `${delay}ms` }}
      >
        {children}
      </span>
    </span>
  );
}

/**
 * Pre-configured icon animations
 */
export function BouncingIcon({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <IconAnimated animation="bounce" trigger="always" className={className}>
      {children}
    </IconAnimated>
  );
}

export function SpinningIcon({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <IconAnimated animation="spin" trigger="always" className={className}>
      {children}
    </IconAnimated>
  );
}

export function PulsingIcon({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <IconAnimated animation="pulse" trigger="always" className={className}>
      {children}
    </IconAnimated>
  );
}

export function HoverBounceIcon({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <IconAnimated animation="bounce" trigger="hover" className={className}>
      {children}
    </IconAnimated>
  );
}

export function HoverWiggleIcon({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <IconAnimated animation="wiggle" trigger="hover" className={className}>
      {children}
    </IconAnimated>
  );
}

export function PopIcon({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <IconAnimated animation="pop" trigger="once" delay={delay} className={className}>
      {children}
    </IconAnimated>
  );
}
