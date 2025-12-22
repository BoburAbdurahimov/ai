/**
 * Animated Button Component
 * Enhanced button with smooth micro-interactions
 */

'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ButtonAnimatedProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'gradient';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  loading?: boolean;
  ripple?: boolean;
  magnetic?: boolean;
  shine?: boolean;
}

const ButtonAnimated = React.forwardRef<HTMLButtonElement, ButtonAnimatedProps>(
  ({ className, variant = 'default', size = 'default', loading, ripple = true, magnetic, shine, children, ...props }, ref) => {
    const [ripples, setRipples] = React.useState<Array<{ x: number; y: number; id: number }>>([]);
    
    const variantStyles = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      outline: 'border-2 border-primary text-primary hover:bg-primary/10',
      ghost: 'text-primary hover:bg-primary/10',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      gradient: 'bg-gradient-to-r from-primary to-accent text-white hover:from-primary/90 hover:to-accent/90 shadow-lg shadow-primary/40',
    };

    const sizeStyles = {
      default: 'h-10 px-6 py-2',
      sm: 'h-8 px-4 text-sm',
      lg: 'h-12 px-8 text-lg',
      icon: 'h-10 w-10',
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (ripple && !props.disabled && !loading) {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const newRipple = { x, y, id: Date.now() };
        setRipples(prev => [...prev, newRipple]);
        
        setTimeout(() => {
          setRipples(prev => prev.filter(r => r.id !== newRipple.id));
        }, 600);
      }
      
      if (props.onClick && !loading) {
        props.onClick(e);
      }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (magnetic && !props.disabled && !loading) {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const distance = Math.sqrt(x * x + y * y);
        const maxDistance = 50;
        
        if (distance < maxDistance) {
          const strength = (maxDistance - distance) / maxDistance;
          button.style.transform = `translate(${x * strength * 0.3}px, ${y * strength * 0.3}px)`;
        }
      }
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (magnetic) {
        e.currentTarget.style.transform = 'translate(0, 0)';
      }
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-xl font-semibold',
          'transition-all duration-200 ease-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          'relative overflow-hidden',
          'active:scale-95', // Press effect
          variantStyles[variant],
          sizeStyles[size],
          shine && 'btn-shine',
          magnetic && 'transition-transform',
          className
        )}
        disabled={props.disabled || loading}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {/* Ripple effects */}
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute rounded-full bg-white/30 pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: 0,
              height: 0,
              transform: 'translate(-50%, -50%)',
              animation: 'ripple 0.6s ease-out',
            }}
          />
        ))}
        
        {/* Shine effect */}
        {shine && (
          <span className="absolute inset-0 pointer-events-none">
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shine" />
          </span>
        )}
        
        {/* Loading spinner */}
        {loading && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
        
        {/* Button content */}
        {!loading && children}
      </button>
    );
  }
);

ButtonAnimated.displayName = 'ButtonAnimated';

export { ButtonAnimated };
