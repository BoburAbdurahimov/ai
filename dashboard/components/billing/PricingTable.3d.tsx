/**
 * Pricing Table with 3D Elements
 * Branded pricing table enhanced with Three.js visualizations
 */

'use client';

import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { ButtonAnimated } from '@/components/ui/button-animated';
import { CardAnimated } from '@/components/ui/card-animated';
import { CounterAnimated } from '@/components/ui/counter-animated';
import { IconAnimated, HoverBounceIcon, PopIcon } from '@/components/ui/icon-animated';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Star, Sparkles, Crown, Rocket, Phone, ArrowRight } from 'lucide-react';
import { PLANS, getYearlyDiscount } from '@/lib/stripe/config';

// Dynamically import 3D components (client-side only)
const AnimatedPricingBackground = dynamic(
  () => import('@/components/3d/AnimatedPricingBackground').then(mod => mod.AnimatedPricingBackground),
  { ssr: false }
);

const AnimatedLogo3D = dynamic(
  () => import('@/components/3d/AnimatedLogo3D').then(mod => mod.AnimatedLogo3D),
  { ssr: false }
);

interface PricingTable3DProps {
  currentPlan?: string;
  onSelectPlan?: (plan: string, interval: 'monthly' | 'yearly') => void;
}

export function PricingTable3D({ currentPlan, onSelectPlan }: PricingTable3DProps) {
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

  const planDetails = {
    STARTER: {
      tagline: "Launch your AI call center",
      variant: 'starter' as const,
      icon: Rocket,
      color: 'from-blue-500 to-cyan-500',
    },
    PROFESSIONAL: {
      tagline: "Power multiple locations",
      variant: 'professional' as const,
      icon: Zap,
      color: 'from-purple-500 to-pink-500',
    },
    BUSINESS: {
      tagline: "Enterprise-ready infrastructure",
      variant: 'business' as const,
      icon: Crown,
      color: 'from-orange-500 to-red-500',
    },
  };

  return (
    <div className="space-y-16">
      {/* Header with 3D Logo */}
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <div className="flex justify-center">
          <Suspense fallback={<div className="w-32 h-32 bg-muted/20 rounded-2xl animate-pulse" />}>
            <AnimatedLogo3D size={128} />
          </Suspense>
        </div>
        
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
            ripple
            shine={interval === 'monthly'}
            className="px-8"
          >
            Monthly
          </ButtonAnimated>
          <ButtonAnimated
            variant={interval === 'yearly' ? 'gradient' : 'ghost'}
            size="lg"
            onClick={() => setInterval('yearly')}
            ripple
            shine={interval === 'yearly'}
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

      {/* Plans grid with 3D backgrounds */}
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
              tilt={isPopular}
              lift
              glow={isPopular}
              className={`relative p-8 overflow-hidden ${
                isPopular
                  ? 'border-2 border-primary shadow-2xl shadow-primary/20 scale-105'
                  : 'glass'
              }`}
            >
              {/* 3D Background */}
              <Suspense fallback={null}>
                <AnimatedPricingBackground 
                  variant={details.variant}
                  color={details.color.split(' ')[1]}
                />
              </Suspense>

              {/* Popular indicator */}
              {isPopular && (
                <div className="absolute -top-4 -right-4 w-32 h-32 pointer-events-none z-20">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-20 rotate-45 transform origin-bottom-left" />
                  <div className="absolute top-8 right-4 rotate-45 text-xs font-bold text-primary">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="space-y-6 relative z-10">
                {/* Icon with custom color per plan */}
                <div className="flex items-start justify-between">
                  <HoverBounceIcon>
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${details.color} shadow-lg`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                  </HoverBounceIcon>
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
                </div>

                {/* Pricing with counter animation */}
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
                  
                  <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>~{Math.round(plan.features.minutesIncluded / 30)} calls/day</span>
                  </div>
                </div>

                {/* CTA */}
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

                {/* Features */}
                <div className="space-y-3 pt-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    What you get
                  </p>
                  
                  {[
                    `${plan.features.minutesIncluded} minutes then $0.10/min`,
                    `${plan.features.phoneNumbers === 'unlimited' ? 'Unlimited' : plan.features.phoneNumbers} Uzbek numbers`,
                    `${plan.features.teamMembers === 'unlimited' ? 'Unlimited' : plan.features.teamMembers} team members`,
                    key === 'STARTER' ? 'Russian AI' : key === 'PROFESSIONAL' ? 'Russian AI + Uzbek handoff' : 'Multi-language',
                  ].map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardAnimated>
          );
        })}
      </div>
    </div>
  );
}
