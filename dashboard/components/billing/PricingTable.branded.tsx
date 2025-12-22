/**
 * Branded Pricing Table - NO Generic Stock Feel
 * Custom, authentic pricing experience for VoiceOps AI
 */

'use client';

import { useState } from 'react';
import { ButtonAnimated } from '@/components/ui/button-animated';
import { CardAnimated } from '@/components/ui/card-animated';
import { CounterAnimated } from '@/components/ui/counter-animated';
import { IconAnimated, HoverBounceIcon, PopIcon } from '@/components/ui/icon-animated';
import { Badge } from '@/components/ui/badge';
import { Check, Phone, Zap, Building2, ArrowRight, TrendingUp, Users, Globe } from 'lucide-react';
import { PLANS, getYearlyDiscount } from '@/lib/stripe/config';

interface PricingTableBrandedProps {
  currentPlan?: string;
  onSelectPlan?: (plan: string, interval: 'monthly' | 'yearly') => void;
}

export function PricingTableBranded({ currentPlan, onSelectPlan }: PricingTableBrandedProps) {
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

  // Custom plan descriptions that feel real and specific
  const planDetails = {
    STARTER: {
      tagline: "Launch your AI call center",
      description: "Perfect for testing VoiceOps AI with your first clients. Start small, scale fast.",
      realWorld: "~17 calls per day",
      audience: "Solo clinic owners",
      icon: Phone,
      color: "from-blue-500 to-cyan-500",
    },
    PROFESSIONAL: {
      tagline: "Power multiple locations",
      description: "Built for growing practices handling hundreds of patient calls monthly.",
      realWorld: "~67 calls per day",
      audience: "Multi-clinic operations",
      icon: Zap,
      color: "from-purple-500 to-pink-500",
    },
    BUSINESS: {
      tagline: "Enterprise-ready infrastructure",
      description: "Unlimited capacity for high-volume contact centers across Uzbekistan and beyond.",
      realWorld: "~333 calls per day",
      audience: "Large healthcare networks",
      icon: Building2,
      color: "from-orange-500 to-red-500",
    },
  };

  return (
    <div className="space-y-16">
      {/* Real intro - not generic */}
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-bold">
          Pay for{' '}
          <span className="gradient-text-primary">real usage</span>
          , not seats
        </h2>
        <p className="text-lg text-muted-foreground">
          VoiceOps AI charges by the minute. No hidden fees, no per-user costs.
          <br />
          Start free for 14 days, cancel anytime.
        </p>
      </div>

      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-4">
        <div className="glass rounded-2xl p-2 flex gap-2 items-center">
          <ButtonAnimated
            variant={interval === 'monthly' ? 'gradient' : 'ghost'}
            size="lg"
            onClick={() => setInterval('monthly')}
            className="px-8"
          >
            Monthly
          </ButtonAnimated>
          <ButtonAnimated
            variant={interval === 'yearly' ? 'gradient' : 'ghost'}
            size="lg"
            onClick={() => setInterval('yearly')}
            className="px-8"
          >
            Yearly
          </ButtonAnimated>
          {interval === 'yearly' && (
            <span className="text-sm font-semibold text-emerald-400 ml-2 animate-fadeIn">
              Save 15% 💰
            </span>
          )}
        </div>
      </div>

      {/* Plans grid - unique layouts per tier */}
      <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {Object.entries(PLANS).map(([key, plan], index) => {
          if (key === 'ENTERPRISE') return null;
          
          const price = interval === 'monthly' ? plan.priceMonthly : plan.priceYearly;
          const isCurrentPlan = currentPlan === key;
          const isPopular = key === 'PROFESSIONAL';
          const details = planDetails[key as keyof typeof planDetails];
          const Icon = details.icon;

          return (
            <CardAnimated
              key={key}
              lift={!isPopular}
              tilt={isPopular}
              glow={isPopular}
              className={`relative p-8 overflow-hidden ${
                isPopular
                  ? 'border-2 border-primary shadow-2xl shadow-primary/20 scale-105'
                  : 'glass'
              }`}
            >
              {/* Popular indicator - not a generic badge */}
              {isPopular && (
                <div className="absolute -top-4 -right-4 w-32 h-32">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-20 rotate-45 transform origin-bottom-left" />
                  <div className="absolute top-8 right-4 rotate-45 text-xs font-bold text-primary">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {/* Icon with custom color per plan */}
                <div className="flex items-start justify-between">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${details.color} shadow-lg`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  {isCurrentPlan && (
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                      Active
                    </Badge>
                  )}
                </div>

                {/* Plan name and tagline */}
                <div>
                  <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                  <p className="text-sm font-semibold text-primary">{details.tagline}</p>
                  <p className="text-sm text-muted-foreground mt-2">{details.description}</p>
                </div>

                {/* Pricing - with real context */}
                <div className="border-y border-border/50 py-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold gradient-text-primary">
                      $<CounterAnimated value={price ? price / 100 : 0} decimals={0} />
                    </span>
                    <div className="text-sm text-muted-foreground">
                      <div>per {interval === 'monthly' ? 'month' : 'year'}</div>
                      {interval === 'yearly' && (
                        <div className="text-emerald-400 font-semibold">
                          ${((price || 0) / 12 / 100).toFixed(0)}/mo
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Real-world context instead of just features */}
                  <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{details.realWorld}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Users className="h-4 w-4" />
                    <span>{details.audience}</span>
                  </div>
                </div>

                {/* CTA - specific to plan */}
                <ButtonAnimated
                  variant={isPopular ? 'gradient' : 'outline'}
                  className="w-full group"
                  disabled={isCurrentPlan}
                  loading={loading === key}
                  ripple
                  magnetic={isPopular}
                  onClick={() => handleSelectPlan(key)}
                >
                  {isCurrentPlan ? (
                    'Current Plan'
                  ) : (
                    <>
                      {key === 'STARTER' && 'Start Free Trial'}
                      {key === 'PROFESSIONAL' && 'Upgrade Now'}
                      {key === 'BUSINESS' && 'Go Enterprise'}
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </ButtonAnimated>

                {/* What's included - specific, not generic bullet points */}
                <div className="space-y-3 pt-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    What you get
                  </p>
                  
                  {/* Minutes with overage pricing */}
                  <div className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <span className="font-semibold">{plan.features.minutesIncluded} minutes</span>
                      <span className="text-muted-foreground"> then $0.10/min</span>
                    </div>
                  </div>

                  {/* Phone numbers */}
                  <div className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <span className="font-semibold">
                        {plan.features.phoneNumbers === 'unlimited' ? 'Unlimited' : plan.features.phoneNumbers} Uzbek phone {plan.features.phoneNumbers === 1 ? 'number' : 'numbers'}
                      </span>
                    </div>
                  </div>

                  {/* Languages - specific to market */}
                  <div className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      {key === 'STARTER' && 'Russian AI responses'}
                      {key === 'PROFESSIONAL' && 'Russian AI + Uzbek handoff'}
                      {key === 'BUSINESS' && 'Multi-language support'}
                    </div>
                  </div>

                  {/* Team - real value prop */}
                  <div className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      {plan.features.teamMembers === 'unlimited' 
                        ? 'Unlimited team access' 
                        : `${plan.features.teamMembers} team ${plan.features.teamMembers === 1 ? 'member' : 'members'}`}
                    </div>
                  </div>

                  {/* Premium features */}
                  {key === 'BUSINESS' && (
                    <>
                      <div className="flex items-start gap-3">
                        <Zap className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <div className="text-sm font-semibold text-primary">
                          Full API access
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Zap className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <div className="text-sm font-semibold text-primary">
                          n8n workflow integration
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardAnimated>
          );
        })}
      </div>

      {/* Enterprise - not a generic card */}
      <CardAnimated className="relative overflow-hidden glass max-w-4xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-purple-900/20 to-slate-900/50" />
        <div className="absolute inset-0 bg-grid opacity-10" />
        
        <div className="relative p-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-2xl shadow-amber-500/30">
                <Building2 className="h-12 w-12 text-white" />
              </div>
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-3xl font-bold mb-2">Need a custom solution?</h3>
                <p className="text-muted-foreground">
                  Large healthcare network? Multi-region deployment? We'll build a custom plan that fits your exact needs—whether that's 100,000 calls/month or dedicated infrastructure.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span>Volume discounts available</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span>Custom SLA guarantees</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span>On-premise options</span>
                </div>
              </div>
            </div>
            
            <ButtonAnimated
              variant="gradient"
              size="lg"
              ripple
              magnetic
              className="flex-shrink-0"
            >
              Talk to Sales
              <ArrowRight className="h-5 w-5 ml-2" />
            </ButtonAnimated>
          </div>
        </div>
      </CardAnimated>

      {/* Trust signals - specific, not generic */}
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-3xl font-bold gradient-text-primary">99.9%</div>
            <div className="text-sm text-muted-foreground">Uptime (Yandex Cloud)</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold gradient-text-primary">
              <CounterAnimated value={50} />ms
            </div>
            <div className="text-sm text-muted-foreground">Avg response time</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold gradient-text-primary">
              <CounterAnimated value={24} />/<CounterAnimated value={7} />
            </div>
            <div className="text-sm text-muted-foreground">Telegram support</div>
          </div>
        </div>
      </div>

      {/* FAQ - real questions */}
      <div className="max-w-2xl mx-auto space-y-6">
        <h3 className="text-2xl font-bold text-center mb-8">Common questions</h3>
        
        <div className="space-y-4">
          <div className="glass rounded-xl p-6">
            <h4 className="font-semibold mb-2">What happens if I go over my minutes?</h4>
            <p className="text-sm text-muted-foreground">
              You're charged $0.10 per additional minute. We'll email you at 80% usage, so no surprises.
            </p>
          </div>
          
          <div className="glass rounded-xl p-6">
            <h4 className="font-semibold mb-2">Can I change plans mid-month?</h4>
            <p className="text-sm text-muted-foreground">
              Yes. Upgrade anytime and we'll prorate the difference. Downgrades take effect next billing cycle.
            </p>
          </div>
          
          <div className="glass rounded-xl p-6">
            <h4 className="font-semibold mb-2">Do you support Uzbek phone numbers?</h4>
            <p className="text-sm text-muted-foreground">
              All plans include local Uzbek numbers via Yandex Telephony. Russian numbers available on request.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
