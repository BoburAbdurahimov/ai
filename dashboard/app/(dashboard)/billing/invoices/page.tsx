/**
 * Invoices Page
 * View and download invoices
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import { InvoicesClient } from './invoices-client';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Invoices',
  description: 'View your billing history and download invoices',
};

export default function InvoicesPage() {
  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      <Breadcrumbs items={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Billing', href: '/billing' },
        { label: 'Invoices', href: '/billing/invoices' },
      ]} />

      <div>
        <h1 className="text-4xl font-bold gradient-text-primary mb-2">Invoice History</h1>
        <p className="text-muted-foreground">
          View and download all your past invoices
        </p>
      </div>

      <Suspense fallback={<InvoicesLoading />}>
        <InvoicesClient />
      </Suspense>
    </div>
  );
}

function InvoicesLoading() {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-20 bg-muted/20 rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}
