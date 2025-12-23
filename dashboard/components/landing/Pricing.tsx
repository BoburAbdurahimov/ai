'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: '99',
    description: 'Perfect for small businesses',
    features: [
      '500 calls per month',
      'Basic AI agents',
      'Call analytics',
      'Email support',
      '24/7 availability'
    ],
    cta: 'Start Free Trial',
    popular: false
  },
  {
    name: 'Professional',
    price: '299',
    description: 'For growing teams',
    features: [
      '2,000 calls per month',
      'Advanced AI agents',
      'Custom workflows',
      'Priority support',
      'Advanced analytics',
      'API access'
    ],
    cta: 'Start Free Trial',
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations',
    features: [
      'Unlimited calls',
      'Custom AI training',
      'Dedicated account manager',
      '24/7 phone support',
      'Custom integrations',
      'SLA guarantee'
    ],
    cta: 'Contact Sales',
    popular: false
  }
];

export function Pricing() {
  return (
    <section className="py-24 bg-slate-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index}
              className={`relative ${
                plan.popular 
                  ? 'bg-gradient-to-b from-blue-900/50 to-slate-800/50 border-blue-500 scale-105' 
                  : 'bg-slate-800/50 border-slate-700'
              } hover:scale-105 transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl text-white mb-2">{plan.name}</CardTitle>
                <p className="text-slate-400 text-sm mb-4">{plan.description}</p>
                <div className="text-4xl font-bold text-white mb-1">
                  {plan.price !== 'Custom' && '$'}{plan.price}
                  {plan.price !== 'Custom' && <span className="text-lg text-slate-400">/mo</span>}
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
