/**
 * Plans Client Component
 * Interactive pricing table with 3D
 */

'use client';

import { useRouter } from 'next/navigation';
import { PricingTable3D } from '@/components/billing/PricingTable.3d';

export function PlansClient() {
  const router = useRouter();

  const handleSelectPlan = async (plan: string, interval: 'monthly' | 'yearly') => {
    try {
      const response = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, interval }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert(error instanceof Error ? error.message : 'Failed to start checkout');
    }
  };

  return <PricingTable3D onSelectPlan={handleSelectPlan} />;
}
