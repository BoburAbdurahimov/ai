/**
 * Animated Counter Component
 * Smooth number counting animation with optional formatting
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface CounterAnimatedProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  separator?: boolean;
  className?: string;
  onComplete?: () => void;
}

export function CounterAnimated({
  value,
  duration = 1000,
  decimals = 0,
  prefix = '',
  suffix = '',
  separator = true,
  className,
  onComplete,
}: CounterAnimatedProps) {
  const [count, setCount] = React.useState(0);
  const [isIncrementing, setIsIncrementing] = React.useState(false);
  const prevValueRef = React.useRef(value);

  React.useEffect(() => {
    const start = count;
    const end = value;
    const startTime = Date.now();
    
    // Detect if incrementing or decrementing
    if (end > prevValueRef.current) {
      setIsIncrementing(true);
      setTimeout(() => setIsIncrementing(false), 400);
    }
    prevValueRef.current = end;

    const timer = setInterval(() => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      const current = start + (end - start) * easeOut;
      setCount(current);

      if (progress === 1) {
        clearInterval(timer);
        setCount(end);
        onComplete?.();
      }
    }, 16); // ~60fps

    return () => clearInterval(timer);
  }, [value, duration, onComplete]);

  const formatNumber = (num: number) => {
    const fixed = num.toFixed(decimals);
    if (separator) {
      const parts = fixed.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return parts.join('.');
    }
    return fixed;
  };

  return (
    <span
      className={cn(
        'inline-block tabular-nums transition-colors duration-300',
        isIncrementing && 'text-emerald-400',
        className
      )}
    >
      {prefix}
      {formatNumber(count)}
      {suffix}
    </span>
  );
}
