/**
 * Billing Overview Page
 * Main billing dashboard with subscription and usage
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import { BillingOverviewClient } from './billing-overview-client';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Billing & Subscription',
  description: 'Manage your VoiceOps AI subscription, view usage, and access invoices',
};

export default function BillingOverviewPage() {
  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      <Breadcrumbs items={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Billing', href: '/billing' },
      ]} />

      <Suspense fallback={<BillingOverviewLoading />}>
        <BillingOverviewClient />
      </Suspense>
    </div>
  );
}

function BillingOverviewLoading() {
  return (
    <div className="space-y-8">
      <div className="h-48 glass rounded-2xl animate-pulse" />
      <div className="grid md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-64 glass rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}
