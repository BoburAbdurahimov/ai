/**
 * PricingTable Component - Dark Modern Design
 * Sleek, modern pricing table with glassmorphism and gradient accents
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Star, Sparkles, Crown, Rocket } from 'lucide-react';
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
    <div className="space-y-12">
      {/* Interval Toggle - Modern Glass Design */}
      <div className="flex items-center justify-center">
        <div className="glass rounded-2xl p-2 flex gap-2">
          <button
            onClick={() => setInterval('monthly')}
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
              interval === 'monthly'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/50'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setInterval('yearly')}
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 relative ${
              interval === 'yearly'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/50'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Yearly
            <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-green-400 to-emerald-600 text-white border-0 shadow-lg">
              <Sparkles className="w-3 h-3 mr-1" />
              Save 15%
            </Badge>
          </button>
        </div>
      </div>

      {/* Plans Grid - Modern Dark Cards */}
      <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {Object.entries(PLANS).map(([key, plan]) => {
          if (key === 'ENTERPRISE') return null;
          
          const price = interval === 'monthly' ? plan.priceMonthly : plan.priceYearly;
          const isCurrentPlan = currentPlan === key;
          const isPopular = plan.popular;
          
          const icons = {
            STARTER: Rocket,
            PROFESSIONAL: Zap,
            BUSINESS: Crown,
          };
          const Icon = icons[key as keyof typeof icons] || Zap;

          return (
            <Card
              key={key}
              className={`relative p-8 group smooth-transition overflow-hidden ${
                isPopular
                  ? 'gradient-border scale-105 shadow-2xl shadow-purple-500/20'
                  : 'bg-card/50 backdrop-blur-sm border-border/50 hover:border-border card-hover'
              }`}
            >
              {/* Glow effect background */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                isPopular ? 'bg-gradient-to-br from-blue-500/10 to-purple-600/10' : 'bg-gradient-to-br from-blue-500/5 to-purple-600/5'
              }`} />
              
              {/* Popular badge */}
              {isPopular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 text-sm font-bold shadow-lg shadow-purple-500/50 border-0">
                    <Star className="h-4 w-4 mr-1 fill-current" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <div className="space-y-6 relative z-10">
                {/* Icon & Plan Name */}
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                    isPopular 
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-purple-500/50' 
                      : 'bg-muted/50'
                  }`}>
                    <Icon className={`h-7 w-7 ${isPopular ? 'text-white' : 'text-primary'}`} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                </div>

                {/* Pricing */}
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-5xl font-bold ${isPopular ? 'gradient-text-primary' : ''}`}>
                      {formatPrice(price, 'USD').replace('.00', '')}
                    </span>
                    <span className="text-muted-foreground text-lg">
                      /{interval === 'monthly' ? 'mo' : 'yr'}
                    </span>
                  </div>
                  {interval === 'yearly' && (
                    <p className="text-sm text-emerald-400 mt-2 font-medium">
                      💎 Save {getYearlyDiscount(key as keyof typeof PLANS)}% annually
                    </p>
                  )}
                </div>

                {/* CTA Button */}
                <Button
                  className={`w-full h-12 text-base font-semibold smooth-transition ${
                    isPopular
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/60'
                      : 'bg-secondary hover:bg-secondary/80'
                  }`}
                  disabled={isCurrentPlan || loading === key}
                  onClick={() => handleSelectPlan(key)}
                >
                  {loading === key ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent"></div>
                      Processing...
                    </span>
                  ) : isCurrentPlan ? (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Current Plan
                    </>
                  ) : (
                    <>
                      Get Started
                      <Sparkles className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>

                {/* Features List */}
                <div className="space-y-4 pt-6 border-t border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-emerald-400" />
                    </div>
                    <span className="text-sm">
                      <strong className="text-foreground">{plan.features.minutesIncluded}</strong> minutes/month
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-emerald-400" />
                    </div>
                    <span className="text-sm">
                      <strong className="text-foreground">{plan.features.phoneNumbers === 'unlimited' ? 'Unlimited' : plan.features.phoneNumbers}</strong> phone number{plan.features.phoneNumbers !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-emerald-400" />
                    </div>
                    <span className="text-sm">
                      <strong className="text-foreground">{plan.features.teamMembers === 'unlimited' ? 'Unlimited' : plan.features.teamMembers}</strong> team member{plan.features.teamMembers !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-emerald-400" />
                    </div>
                    <span className="text-sm">
                      {Array.isArray(plan.features.languages) ? plan.features.languages.join(', ') : 'All'} languages
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-emerald-400" />
                    </div>
                    <span className="text-sm capitalize">
                      <strong className="text-foreground">{plan.features.analytics}</strong> analytics
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-emerald-400" />
                    </div>
                    <span className="text-sm capitalize">
                      <strong className="text-foreground">{plan.features.support}</strong> support
                    </span>
                  </div>
                  
                  {plan.features.apiAccess && (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                        <Zap className="h-3 w-3 text-purple-400" />
                      </div>
                      <span className="text-sm font-semibold text-purple-400">API Access</span>
                    </div>
                  )}
                  
                  {plan.features.customAI && (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="h-3 w-3 text-purple-400" />
                      </div>
                      <span className="text-sm font-semibold text-purple-400">Custom AI Training</span>
                    </div>
                  )}
                  
                  {plan.features.customIntegrations && (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                        <Zap className="h-3 w-3 text-purple-400" />
                      </div>
                      <span className="text-sm font-semibold text-purple-400">Custom Integrations</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Enterprise Plan - Premium Dark Card */}
      <Card className="relative p-10 overflow-hidden glass border-0">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 opacity-50" />
        <div className="absolute inset-0 bg-grid opacity-20" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/50">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-bold gradient-text-primary">Enterprise</h3>
                <p className="text-muted-foreground">White-glove service for large organizations</p>
              </div>
            </div>
            
            <ul className="grid md:grid-cols-2 gap-3 pt-4">
              {[
                'Unlimited everything',
                'Dedicated account manager',
                'Custom SLA & contracts',
                'On-premise deployment',
                'Priority feature requests',
                '24/7 phone support'
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="text-center lg:text-right space-y-6">
            <div>
              <p className="text-4xl font-bold gradient-text-primary mb-2">Custom Pricing</p>
              <p className="text-muted-foreground">Tailored to your needs</p>
            </div>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/50 hover:shadow-xl hover:shadow-amber-500/60 px-8 h-12"
            >
              <Crown className="w-5 h-5 mr-2" />
              Contact Sales
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
