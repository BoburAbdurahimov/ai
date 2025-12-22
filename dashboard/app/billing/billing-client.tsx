/**
 * Billing Client Component - Next.js 14
 * Client-side interactive billing interface
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PricingTableBranded } from '@/components/billing/PricingTable.branded';
import { SubscriptionCardBranded } from '@/components/billing/SubscriptionCard.branded';
import { UsageMetricsBranded } from '@/components/billing/UsageMetrics.branded';
import { TrialBanner, PastDueBanner } from '@/components/FeatureGate.dark';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, BarChart3, Receipt, Settings } from 'lucide-react';

export function BillingClient() {
  const router = useRouter();
  const [upgrading, setUpgrading] = useState(false);

  const handleSelectPlan = async (plan: string, interval: 'monthly' | 'yearly') => {
    try {
      setUpgrading(true);
      
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
      
      // Use Next.js router for navigation
      if (url) {
        window.location.href = url; // External Stripe checkout
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert(error instanceof Error ? error.message : 'Failed to start checkout');
    } finally {
      setUpgrading(false);
    }
  };

  return (
    <>
      {/* Banners */}
      <div className="space-y-4 animate-fadeIn stagger-1">
        <TrialBanner />
        <PastDueBanner />
      </div>

      {/* Main Content with Tabs */}
      <Tabs defaultValue="overview" className="space-y-8 animate-fadeIn stagger-2">
        <TabsList className="glass border border-border/50 p-2 h-auto grid grid-cols-2 md:grid-cols-4 w-full md:w-auto">
          <TabsTrigger 
            value="overview" 
            className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white"
          >
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger 
            value="plans" 
            className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white"
          >
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Plans</span>
          </TabsTrigger>
          <TabsTrigger 
            value="invoices" 
            className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white"
          >
            <Receipt className="h-4 w-4" />
            <span className="hidden sm:inline">Invoices</span>
          </TabsTrigger>
          <TabsTrigger 
            value="settings" 
            className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white"
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-8">
          <SubscriptionCardBranded />
          <div>
            <h2 className="text-3xl font-bold gradient-text-primary mb-6">
              Usage This Period
            </h2>
            <UsageMetricsBranded />
          </div>
        </TabsContent>

        {/* Plans Tab */}
        <TabsContent value="plans" className="space-y-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl font-bold gradient-text-primary">
              Choose Your Plan
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Select the perfect plan for your business needs. Upgrade, downgrade, or cancel anytime with no hidden fees.
            </p>
          </div>
          <PricingTableBranded onSelectPlan={handleSelectPlan} />
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices">
          <p className="text-center text-muted-foreground py-8">
            Invoice history component here
          </p>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <p className="text-center text-muted-foreground py-8">
            Billing settings component here
          </p>
        </TabsContent>
      </Tabs>
    </>
  );
}
