/**
 * Animated Card Component
 * Enhanced card with 3D tilt and smooth interactions
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface CardAnimatedProps extends React.HTMLAttributes<HTMLDivElement> {
  tilt?: boolean;
  lift?: boolean;
  glow?: boolean;
  glowColor?: 'primary' | 'accent' | 'success';
}

const CardAnimated = React.forwardRef<HTMLDivElement, CardAnimatedProps>(
  ({ className, tilt, lift = true, glow, glowColor = 'primary', children, ...props }, ref) => {
    const cardRef = React.useRef<HTMLDivElement>(null);
    const [rotation, setRotation] = React.useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!tilt) return;
      
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg tilt
      const rotateY = ((x - centerX) / centerX) * 10;
      
      setRotation({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
      if (tilt) {
        setRotation({ x: 0, y: 0 });
      }
    };

    const glowColors = {
      primary: 'hover:shadow-primary/30',
      accent: 'hover:shadow-accent/30',
      success: 'hover:shadow-success/30',
    };

    return (
      <div
        ref={cardRef}
        className={cn(
          'rounded-2xl border bg-card text-card-foreground',
          'transition-all duration-300 ease-out',
          lift && 'hover:-translate-y-2 hover:shadow-2xl',
          glow && `shadow-lg ${glowColors[glowColor]}`,
          tilt && 'transform-gpu',
          className
        )}
        style={
          tilt
            ? {
                transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                transformStyle: 'preserve-3d',
              }
            : undefined
        }
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardAnimated.displayName = 'CardAnimated';

export { CardAnimated };
