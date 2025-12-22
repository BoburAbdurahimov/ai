/**
 * PricingTable with Micro-Animations
 * Enhanced version with smooth micro-interactions
 */

'use client';

import { useState } from 'react';
import { ButtonAnimated } from '@/components/ui/button-animated';
import { CardAnimated } from '@/components/ui/card-animated';
import { CounterAnimated } from '@/components/ui/counter-animated';
import { IconAnimated, HoverBounceIcon, PopIcon } from '@/components/ui/icon-animated';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Star, Sparkles, Crown, Rocket } from 'lucide-react';
import { PLANS, getYearlyDiscount } from '@/lib/stripe/config';

interface PricingTableMicroProps {
  currentPlan?: string;
  onSelectPlan?: (plan: string, interval: 'monthly' | 'yearly') => void;
}

export function PricingTableMicro({ currentPlan, onSelectPlan }: PricingTableMicroProps) {
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
      {/* Interval Toggle with Micro-Animations */}
      <div className="flex items-center justify-center">
        <div className="glass rounded-2xl p-2 flex gap-2">
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
            className="px-8 relative"
          >
            Yearly
            <PopIcon delay={300}>
              <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-green-400 to-emerald-600 text-white border-0 shadow-lg animate-badge-attention">
                <Sparkles className="w-3 h-3 mr-1" />
                Save 15%
              </Badge>
            </PopIcon>
          </ButtonAnimated>
        </div>
      </div>

      {/* Plans Grid with Stagger Animation */}
      <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {Object.entries(PLANS).map(([key, plan], index) => {
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
            <CardAnimated
              key={key}
              tilt={isPopular}
              lift
              glow={isPopular}
              glowColor="primary"
              className={`relative p-8 overflow-hidden animate-fadeIn ${
                isPopular
                  ? 'gradient-border scale-105'
                  : 'glass'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Glow effect background */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                isPopular ? 'bg-gradient-to-br from-blue-500/10 to-purple-600/10' : 'bg-gradient-to-br from-blue-500/5 to-purple-600/5'
              }`} />
              
              {/* Popular badge with animation */}
              {isPopular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
                  <PopIcon delay={200}>
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 text-sm font-bold shadow-lg shadow-purple-500/50 border-0 animate-badge-attention">
                      <Star className="h-4 w-4 mr-1 fill-current" />
                      Most Popular
                    </Badge>
                  </PopIcon>
                </div>
              )}

              <div className="space-y-6 relative z-10">
                {/* Icon & Plan Name with Hover Animation */}
                <div className="flex items-center gap-4">
                  <HoverBounceIcon>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                      isPopular 
                        ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-purple-500/50' 
                        : 'bg-muted/50'
                    }`}>
                      <Icon className={`h-7 w-7 ${isPopular ? 'text-white' : 'text-primary'}`} />
                    </div>
                  </HoverBounceIcon>
                  
                  <div>
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                </div>

                {/* Pricing with Counter Animation */}
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-5xl font-bold ${isPopular ? 'gradient-text-primary' : ''}`}>
                      $<CounterAnimated 
                        value={price ? price / 100 : 0} 
                        duration={800}
                        decimals={0}
                      />
                    </span>
                    <span className="text-muted-foreground text-lg">
                      /{interval === 'monthly' ? 'mo' : 'yr'}
                    </span>
                  </div>
                  {interval === 'yearly' && (
                    <p className="text-sm text-emerald-400 mt-2 font-medium animate-fadeIn">
                      💎 Save {getYearlyDiscount(key as keyof typeof PLANS)}% annually
                    </p>
                  )}
                </div>

                {/* CTA Button with Ripple Effect */}
                <ButtonAnimated
                  variant={isPopular ? 'gradient' : 'outline'}
                  size="lg"
                  className="w-full"
                  disabled={isCurrentPlan}
                  loading={loading === key}
                  ripple
                  magnetic={isPopular}
                  shine={isPopular}
                  onClick={() => handleSelectPlan(key)}
                >
                  {isCurrentPlan ? (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Current Plan
                    </>
                  ) : (
                    <>
                      Get Started
                      <IconAnimated animation="bounce" trigger="hover">
                        <Sparkles className="w-4 h-4 ml-2" />
                      </IconAnimated>
                    </>
                  )}
                </ButtonAnimated>

                {/* Features List with Stagger */}
                <div className="space-y-4 pt-6 border-t border-border/50">
                  {[
                    { label: `${plan.features.minutesIncluded} minutes/month`, delay: 0 },
                    { label: `${plan.features.phoneNumbers === 'unlimited' ? 'Unlimited' : plan.features.phoneNumbers} phone numbers`, delay: 50 },
                    { label: `${plan.features.teamMembers === 'unlimited' ? 'Unlimited' : plan.features.teamMembers} team members`, delay: 100 },
                    { label: `${Array.isArray(plan.features.languages) ? plan.features.languages.join(', ') : 'All'} languages`, delay: 150 },
                  ].map((feature, i) => (
                    <div 
                      key={i} 
                      className="flex items-center gap-3 animate-fadeIn"
                      style={{ animationDelay: `${(index * 100) + feature.delay}ms` }}
                    >
                      <PopIcon delay={(index * 100) + feature.delay}>
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                          <Check className="h-3 w-3 text-emerald-400" />
                        </div>
                      </PopIcon>
                      <span className="text-sm">{feature.label}</span>
                    </div>
                  ))}
                  
                  {plan.features.apiAccess && (
                    <div className="flex items-center gap-3 animate-fadeIn" style={{ animationDelay: `${(index * 100) + 200}ms` }}>
                      <HoverBounceIcon>
                        <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                          <Zap className="h-3 w-3 text-purple-400" />
                        </div>
                      </HoverBounceIcon>
                      <span className="text-sm font-semibold text-purple-400">API Access</span>
                    </div>
                  )}
                </div>
              </div>
            </CardAnimated>
          );
        })}
      </div>

      {/* Enterprise Plan with Hover Effects */}
      <CardAnimated 
        lift 
        glow 
        glowColor="accent"
        className="relative p-10 overflow-hidden glass border-0 animate-fadeIn"
        style={{ animationDelay: '400ms' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 opacity-50" />
        <div className="absolute inset-0 bg-grid opacity-20" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <HoverBounceIcon>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/50">
                  <Crown className="h-8 w-8 text-white" />
                </div>
              </HoverBounceIcon>
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
                <li key={i} className="flex items-center gap-2 animate-fadeIn" style={{ animationDelay: `${500 + (i * 50)}ms` }}>
                  <PopIcon delay={500 + (i * 50)}>
                    <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                  </PopIcon>
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
            <ButtonAnimated 
              variant="gradient"
              size="lg"
              ripple
              magnetic
              shine
              className="px-8"
            >
              <Crown className="w-5 h-5 mr-2" />
              Contact Sales
            </ButtonAnimated>
          </div>
        </div>
      </CardAnimated>
    </div>
  );
}
