/**
 * Page Transition Component
 * Smooth page transitions with various effects
 */

'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export interface PageTransitionProps {
  children: React.ReactNode;
  effect?: 'fade' | 'slide' | 'scale' | 'blur';
  duration?: number;
}

export function PageTransition({
  children,
  effect = 'fade',
  duration = 300,
}: PageTransitionProps) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const [displayChildren, setDisplayChildren] = React.useState(children);

  React.useEffect(() => {
    setIsTransitioning(true);
    
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setIsTransitioning(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [pathname, children, duration]);

  const effectClasses = {
    fade: {
      enter: 'opacity-0',
      enterActive: 'opacity-100 transition-opacity',
      exit: 'opacity-100',
      exitActive: 'opacity-0 transition-opacity',
    },
    slide: {
      enter: 'opacity-0 translate-x-8',
      enterActive: 'opacity-100 translate-x-0 transition-all',
      exit: 'opacity-100 translate-x-0',
      exitActive: 'opacity-0 -translate-x-8 transition-all',
    },
    scale: {
      enter: 'opacity-0 scale-95',
      enterActive: 'opacity-100 scale-100 transition-all',
      exit: 'opacity-100 scale-100',
      exitActive: 'opacity-0 scale-95 transition-all',
    },
    blur: {
      enter: 'opacity-0 blur-sm',
      enterActive: 'opacity-100 blur-0 transition-all',
      exit: 'opacity-100 blur-0',
      exitActive: 'opacity-0 blur-sm transition-all',
    },
  };

  const classes = effectClasses[effect];

  return (
    <div
      className={cn(
        isTransitioning ? classes.exitActive : classes.enterActive,
        !isTransitioning && classes.enter
      )}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {displayChildren}
    </div>
  );
}

/**
 * Stagger Children Animation
 * Animates children with delays
 */
export function StaggerChildren({
  children,
  staggerDelay = 100,
  className,
}: {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}) {
  const childrenArray = React.Children.toArray(children);

  return (
    <>
      {childrenArray.map((child, index) => (
        <div
          key={index}
          className={cn('animate-fadeIn', className)}
          style={{ animationDelay: `${index * staggerDelay}ms` }}
        >
          {child}
        </div>
      ))}
    </>
  );
}

/**
 * Scroll Reveal Animation
 * Reveals content when scrolling into view
 */
export function ScrollReveal({
  children,
  animation = 'fade',
  threshold = 0.1,
  className,
}: {
  children: React.ReactNode;
  animation?: 'fade' | 'slide-up' | 'slide-left' | 'scale';
  threshold?: number;
  className?: string;
}) {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  const animationClasses = {
    fade: isVisible ? 'animate-fadeIn' : 'opacity-0',
    'slide-up': isVisible ? 'scroll-fade-in' : 'opacity-0',
    'slide-left': isVisible ? 'scroll-slide-left' : 'opacity-0',
    scale: isVisible ? 'animate-scaleIn' : 'opacity-0',
  };

  return (
    <div ref={ref} className={cn(animationClasses[animation], className)}>
      {children}
    </div>
  );
}
