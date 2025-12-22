/**
 * Billing Loading State - Next.js 14 App Router
 * Automatic loading UI during page transitions
 */

import { SkeletonCard } from '@/components/ui/skeleton-animated';

export default function BillingLoading() {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="space-y-4 animate-fadeIn">
        <div className="h-12 bg-muted/50 rounded-lg w-1/3 shimmer" />
        <div className="h-6 bg-muted/50 rounded w-1/2 shimmer" />
      </div>
      
      {/* Pricing cards skeleton */}
      <div className="grid lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      
      {/* Usage metrics skeleton */}
      <div className="grid md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-8 glass rounded-2xl">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-muted/50 rounded w-1/2 shimmer" />
              <div className="h-10 bg-muted/50 rounded w-3/4 shimmer" />
              <div className="h-3 bg-muted/50 rounded shimmer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
