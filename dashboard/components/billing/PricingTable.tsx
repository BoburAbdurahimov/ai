/**
 * PricingTable Component
 * Displays subscription plans with features and pricing
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Star } from 'lucide-react';
import { PLANS, formatPrice, getYearlyDiscount } from '@/lib/stripe/config';

interface PricingTableProps {
  currentPlan?: string;
  onSelectPlan?: (plan: string, interval: 'monthly' | 'yearly') => void;
}

export function PricingTable({ currentPlan, onSelectPlan }: PricingTableProps) {
  const [interval, setInterval] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState<string | null>(null);

  const handleSelectPlan = async (planId: string) => {
    if (onSelectPlan) {
      setLoading(planId);
      try {
        await onSelectPlan(planId, interval);
      } finally {
        setLoading(null);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Interval Toggle */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => setInterval('monthly')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            interval === 'monthly'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setInterval('yearly')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            interval === 'yearly'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          Yearly
          <Badge className="ml-2 bg-green-500 text-white">Save 15%</Badge>
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {Object.entries(PLANS).map(([key, plan]) => {
          if (key === 'ENTERPRISE') return null; // Handle Enterprise separately
          
          const price = interval === 'monthly' ? plan.priceMonthly : plan.priceYearly;
          const isCurrentPlan = currentPlan === key;
          const isPopular = plan.popular;

          return (
            <Card
              key={key}
              className={`relative p-6 ${
                isPopular
                  ? 'border-2 border-primary shadow-xl scale-105'
                  : 'border'
              }`}
            >
              {isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <div className="space-y-4">
                {/* Plan Name */}
                <div>
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {plan.description}
                  </p>
                </div>

                {/* Pricing */}
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">
                      {formatPrice(price, 'USD').replace('.00', '')}
                    </span>
                    <span className="text-muted-foreground">
                      /{interval === 'monthly' ? 'mo' : 'yr'}
                    </span>
                  </div>
                  {interval === 'yearly' && (
                    <p className="text-sm text-green-600 mt-1">
                      Save {getYearlyDiscount(key as keyof typeof PLANS)}% annually
                    </p>
                  )}
                </div>

                {/* CTA Button */}
                <Button
                  className="w-full"
                  variant={isPopular ? 'default' : 'outline'}
                  disabled={isCurrentPlan || loading === key}
                  onClick={() => handleSelectPlan(key)}
                >
                  {loading === key ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      Processing...
                    </span>
                  ) : isCurrentPlan ? (
                    'Current Plan'
                  ) : (
                    'Get Started'
                  )}
                </Button>

                {/* Features List */}
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">
                      {plan.features.minutesIncluded} minutes/month
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">
                      {plan.features.phoneNumbers === 'unlimited' 
                        ? 'Unlimited' 
                        : plan.features.phoneNumbers} phone number{plan.features.phoneNumbers !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">
                      {plan.features.teamMembers === 'unlimited'
                        ? 'Unlimited'
                        : plan.features.teamMembers} team member{plan.features.teamMembers !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">
                      {Array.isArray(plan.features.languages) 
                        ? plan.features.languages.join(', ') 
                        : 'All'} languages
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm capitalize">
                      {plan.features.analytics} analytics
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm capitalize">
                      {plan.features.support} support
                    </span>
                  </div>
                  
                  {plan.features.apiAccess && (
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm font-medium">API Access</span>
                    </div>
                  )}
                  
                  {plan.features.customAI && (
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm font-medium">Custom AI Training</span>
                    </div>
                  )}
                  
                  {plan.features.customIntegrations && (
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm font-medium">Custom Integrations</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Enterprise Plan */}
      <Card className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
            <p className="text-slate-300 mb-4">
              Custom solutions for large organizations with specific requirements
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-400" />
                Unlimited everything
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-400" />
                Dedicated account manager
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-400" />
                Custom SLA & contracts
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-400" />
                On-premise deployment options
              </li>
            </ul>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold mb-4">Custom Pricing</p>
            <Button variant="secondary" size="lg">
              Contact Sales
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
