/**
 * Billing Dashboard Page - Dark Modern Design
 * Sleek, professional billing interface with dark theme
 */

'use client';

import { useState } from 'react';
import { SubscriptionCard } from '@/components/billing/SubscriptionCard.dark';
import { UsageMetrics } from '@/components/billing/UsageMetrics.dark';
import { PricingTable } from '@/components/billing/PricingTable.dark';
import { TrialBanner, PastDueBanner } from '@/components/FeatureGate.dark';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSubscription } from '@/lib/hooks/useSubscription';
import { 
  CreditCard, 
  BarChart3, 
  Receipt, 
  Settings,
  Download,
  Calendar,
  Sparkles
} from 'lucide-react';

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
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-12 px-4">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-muted/50 rounded-lg w-1/4 shimmer"></div>
            <div className="h-80 bg-muted/50 rounded-2xl shimmer"></div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="h-64 bg-muted/50 rounded-2xl shimmer"></div>
              <div className="h-64 bg-muted/50 rounded-2xl shimmer"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background bg-dots">
      <div className="container mx-auto py-12 px-4 space-y-8">
        {/* Header with gradient */}
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl shadow-primary/40">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold gradient-text-primary">
                Billing & Subscription
              </h1>
              <p className="text-muted-foreground text-lg mt-2">
                Manage your subscription, view usage, and access invoices
              </p>
            </div>
          </div>
        </div>

        {/* Banners */}
        <div className="space-y-4 animate-fadeIn stagger-1">
          <TrialBanner />
          <PastDueBanner />
        </div>

        {/* Main Content with Tabs */}
        <Tabs defaultValue="overview" className="space-y-8 animate-fadeIn stagger-2">
          <TabsList className="glass border border-border/50 p-2 h-auto">
            <TabsTrigger value="overview" className="gap-2 px-6 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="plans" className="gap-2 px-6 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white">
              <CreditCard className="h-4 w-4" />
              Plans
            </TabsTrigger>
            <TabsTrigger value="invoices" className="gap-2 px-6 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white">
              <Receipt className="h-4 w-4" />
              Invoices
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2 px-6 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <SubscriptionCard />
              </div>
              <QuickActionsCard />
            </div>

            <div>
              <h2 className="text-3xl font-bold gradient-text-primary mb-6">
                Usage This Period
              </h2>
              <UsageMetrics />
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
    </div>
  );
}

function QuickActionsCard() {
  return (
    <Card className="p-8 glass">
      <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        Quick Actions
      </h3>
      <div className="space-y-3">
        <Button 
          variant="outline" 
          className="w-full justify-start glass border-border/50 hover:border-primary/50 hover:bg-primary/10 smooth-transition group"
        >
          <Receipt className="h-4 w-4 mr-3 group-hover:text-primary transition-colors" />
          View Invoices
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start glass border-border/50 hover:border-accent/50 hover:bg-accent/10 smooth-transition group"
        >
          <CreditCard className="h-4 w-4 mr-3 group-hover:text-accent transition-colors" />
          Update Payment Method
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start glass border-border/50 hover:border-primary/50 hover:bg-primary/10 smooth-transition group"
        >
          <Settings className="h-4 w-4 mr-3 group-hover:text-primary transition-colors group-hover:rotate-90 transition-transform" />
          Manage Subscription
        </Button>
      </div>
    </Card>
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
      <Card className="p-8 glass">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-muted/50 rounded-xl shimmer"></div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8 glass">
      <h2 className="text-3xl font-bold gradient-text-primary mb-8">Invoice History</h2>
      {invoices.length === 0 ? (
        <div className="text-center py-16">
          <Receipt className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground text-lg">No invoices yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div 
              key={invoice.id} 
              className="flex items-center justify-between p-6 rounded-2xl glass border border-border/50 hover:border-primary/50 smooth-transition group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                  <Receipt className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-lg">
                    {new Date(invoice.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {invoice.status === 'paid' ? '✓ Paid' : 'Pending'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-bold gradient-text-primary">
                    ${(invoice.amount_paid / 100).toFixed(2)}
                  </p>
                </div>
                {invoice.invoice_pdf && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="glass"
                    asChild
                  >
                    <a href={invoice.invoice_pdf} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4 mr-2" />
                      PDF
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
      <Card className="p-8 glass">
        <h2 className="text-3xl font-bold gradient-text-primary mb-8">Billing Settings</h2>
        <div className="space-y-8">
          <div className="p-6 rounded-2xl glass border border-border/50">
            <h3 className="font-semibold text-xl mb-3 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Payment Method
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Manage your payment methods and billing information
            </p>
            <Button variant="outline" className="glass">
              Update Payment Method
            </Button>
          </div>
          
          <div className="p-6 rounded-2xl glass border border-border/50">
            <h3 className="font-semibold text-xl mb-3 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Billing Email
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Change the email address where invoices are sent
            </p>
            <Button variant="outline" className="glass">
              Update Email
            </Button>
          </div>
          
          <div className="p-6 rounded-2xl border border-red-500/30 bg-red-500/5">
            <h3 className="font-semibold text-xl mb-3 text-red-400 flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Danger Zone
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Cancel your subscription (you'll retain access until the end of your billing period)
            </p>
            <Button variant="destructive">
              Cancel Subscription
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
