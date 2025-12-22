/**
 * Plans Page
 * View and select subscription plans
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import { PlansClient } from './plans-client';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Choose Your Plan',
  description: 'Select the perfect VoiceOps AI plan for your clinic',
};

export default function PlansPage() {
  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      <Breadcrumbs items={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Billing', href: '/billing' },
        { label: 'Plans', href: '/billing/plans' },
      ]} />

      <Suspense fallback={<PlansLoading />}>
        <PlansClient />
      </Suspense>
    </div>
  );
}

function PlansLoading() {
  return (
    <div className="space-y-8">
      <div className="h-24 glass rounded-2xl animate-pulse" />
      <div className="grid lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-96 glass rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}
