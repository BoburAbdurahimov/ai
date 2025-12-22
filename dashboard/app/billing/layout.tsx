/**
 * Billing Layout - Next.js 14 App Router
 * Provides consistent layout for all billing pages
 */

import { Metadata } from 'next';
import { Suspense } from 'react';
import { SkeletonCard } from '@/components/ui/skeleton-animated';

export const metadata: Metadata = {
  title: 'Billing & Subscription | VoiceOps AI',
  description: 'Manage your VoiceOps AI subscription, view usage, and access invoices',
};

export default function BillingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background bg-dots">
      <div className="container mx-auto py-8 px-4">
        <Suspense fallback={<BillingLoadingFallback />}>
          {children}
        </Suspense>
      </div>
    </div>
  );
}

function BillingLoadingFallback() {
  return (
    <div className="space-y-8">
      <div className="space-y-4 animate-fadeIn">
        <div className="h-12 bg-muted/50 rounded-lg w-1/3 shimmer" />
        <div className="h-6 bg-muted/50 rounded w-1/2 shimmer" />
      </div>
      
      <div className="grid lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
