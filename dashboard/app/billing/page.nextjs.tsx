/**
 * Billing Page - Next.js 14 App Router Optimized
 * Server component with proper data fetching and client component separation
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import { BillingClient } from './billing-client';
import { SkeletonPricingCard } from '@/components/ui/skeleton-animated';

export const metadata: Metadata = {
  title: 'Billing & Subscription | VoiceOps AI',
  description: 'Manage your VoiceOps AI subscription, view usage statistics, and access invoice history',
};

// Revalidate every hour
export const revalidate = 3600;

export default async function BillingPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4 animate-fadeIn">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl shadow-primary/40">
            <svg 
              className="h-8 w-8 text-white" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold gradient-text-primary">
              Billing & Subscription
            </h1>
            <p className="text-muted-foreground text-lg mt-2">
              Manage your subscription, view usage, and access invoices
            </p>
          </div>
        </div>
      </div>

      {/* Client component for interactive features */}
      <Suspense fallback={<BillingFallback />}>
        <BillingClient />
      </Suspense>
    </div>
  );
}

function BillingFallback() {
  return (
    <div className="space-y-8">
      {/* Pricing cards skeleton */}
      <div className="grid lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <SkeletonPricingCard key={i} />
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
