/**
 * Billing Dashboard Page
 * Main billing interface for subscription management
 */

'use client';

import { useState } from 'react';
import { SubscriptionCard } from '@/components/billing/SubscriptionCard';
import { UsageMetrics } from '@/components/billing/UsageMetrics';
import { PricingTable } from '@/components/billing/PricingTable';
import { TrialBanner } from '@/components/FeatureGate';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSubscription } from '@/lib/hooks/useSubscription';
import { CreditCard, BarChart3, Receipt, Settings } from 'lucide-react';

export default function BillingPage() {
  const { subscription, loading } = useSubscription();
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
      window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
      alert(error instanceof Error ? error.message : 'Failed to start checkout');
    } finally {
      setUpgrading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-64 bg-muted rounded"></div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="h-48 bg-muted rounded"></div>
            <div className="h-48 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Billing & Subscription</h1>
        <p className="text-muted-foreground">
          Manage your subscription, view usage, and access invoices
        </p>
      </div>

      {/* Trial Banner */}
      <TrialBanner />

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="plans" className="gap-2">
            <CreditCard className="h-4 w-4" />
            Plans
          </TabsTrigger>
          <TabsTrigger value="invoices" className="gap-2">
            <Receipt className="h-4 w-4" />
            Invoices
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SubscriptionCard />
            </div>
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Receipt className="h-4 w-4 mr-2" />
                  View Invoices
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Update Payment Method
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Subscription
                </Button>
              </div>
            </Card>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Usage This Period</h2>
            <UsageMetrics />
          </div>
        </TabsContent>

        {/* Plans Tab */}
        <TabsContent value="plans" className="space-y-6">
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-3xl font-bold">Choose Your Plan</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Select the perfect plan for your business needs. Upgrade, downgrade, or cancel anytime.
            </p>
          </div>
          <PricingTable 
            currentPlan={subscription?.organization.plan}
            onSelectPlan={handleSelectPlan}
          />
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices">
          <InvoicesTab />
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <SettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InvoicesTab() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useState(() => {
    fetch('/api/billing/invoices')
      .then(res => res.json())
      .then(data => {
        setInvoices(data.invoices || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load invoices:', err);
        setLoading(false);
      });
  });

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-muted rounded"></div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Invoice History</h2>
      {invoices.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No invoices yet</p>
      ) : (
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div 
              key={invoice.id} 
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div>
                <p className="font-medium">
                  {new Date(invoice.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-sm text-muted-foreground">
                  {invoice.status === 'paid' ? 'Paid' : 'Pending'}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  ${(invoice.amount_paid / 100).toFixed(2)}
                </p>
                {invoice.invoice_pdf && (
                  <Button variant="link" size="sm" asChild>
                    <a href={invoice.invoice_pdf} target="_blank" rel="noopener noreferrer">
                      Download PDF
                    </a>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function SettingsTab() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Billing Settings</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Payment Method</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Manage your payment methods and billing information
            </p>
            <Button variant="outline">Update Payment Method</Button>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Billing Email</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Change the email address where invoices are sent
            </p>
            <Button variant="outline">Update Email</Button>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2 text-destructive">Danger Zone</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Cancel your subscription (you'll retain access until the end of your billing period)
            </p>
            <Button variant="destructive">Cancel Subscription</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
