/**
 * Stripe Configuration & Pricing Plans
 * Defines all subscription tiers and pricing
 */

export const PLANS = {
  STARTER: {
    id: 'starter',
    name: 'Starter',
    nameRu: 'Стартовый',
    description: 'Perfect for small businesses getting started',
    descriptionRu: 'Идеально для малого бизнеса',
    priceMonthly: 9900, // $99.00 in cents
    priceYearly: 100692, // $1006.92 (15% discount)
    stripePriceIdMonthly: process.env.STRIPE_PRICE_STARTER_MONTHLY!,
    stripePriceIdYearly: process.env.STRIPE_PRICE_STARTER_YEARLY!,
    features: {
      minutesIncluded: 500,
      phoneNumbers: 1,
      teamMembers: 1,
      languages: ['RU'],
      analytics: 'basic',
      support: 'email',
      apiAccess: false,
      customAI: false,
      customIntegrations: false,
      dedicatedSupport: false,
    },
    limits: {
      maxMinutesPerMonth: 500,
      maxPhoneNumbers: 1,
      maxTeamMembers: 1,
      maxApiCallsPerDay: 0,
    }
  },
  
  PROFESSIONAL: {
    id: 'professional',
    name: 'Professional',
    nameRu: 'Профессиональный',
    description: 'For growing businesses with advanced needs',
    descriptionRu: 'Для растущего бизнеса',
    priceMonthly: 29900, // $299.00
    priceYearly: 305094, // $3050.94 (15% discount)
    stripePriceIdMonthly: process.env.STRIPE_PRICE_PRO_MONTHLY!,
    stripePriceIdYearly: process.env.STRIPE_PRICE_PRO_YEARLY!,
    popular: true, // Highlight as most popular
    features: {
      minutesIncluded: 2000,
      phoneNumbers: 3,
      teamMembers: 5,
      languages: ['RU', 'UZ'],
      analytics: 'advanced',
      support: 'priority',
      apiAccess: false,
      customAI: true,
      customIntegrations: false,
      dedicatedSupport: false,
    },
    limits: {
      maxMinutesPerMonth: 2000,
      maxPhoneNumbers: 3,
      maxTeamMembers: 5,
      maxApiCallsPerDay: 0,
    }
  },
  
  BUSINESS: {
    id: 'business',
    name: 'Business',
    nameRu: 'Бизнес',
    description: 'For enterprises requiring full control',
    descriptionRu: 'Для крупных компаний',
    priceMonthly: 79900, // $799.00
    priceYearly: 815094, // $8150.94 (15% discount)
    stripePriceIdMonthly: process.env.STRIPE_PRICE_BUSINESS_MONTHLY!,
    stripePriceIdYearly: process.env.STRIPE_PRICE_BUSINESS_YEARLY!,
    features: {
      minutesIncluded: 10000,
      phoneNumbers: 'unlimited',
      teamMembers: 'unlimited',
      languages: ['RU', 'UZ', 'EN'],
      analytics: 'advanced',
      support: 'dedicated',
      apiAccess: true,
      customAI: true,
      customIntegrations: true,
      dedicatedSupport: true,
    },
    limits: {
      maxMinutesPerMonth: 10000,
      maxPhoneNumbers: 999,
      maxTeamMembers: 999,
      maxApiCallsPerDay: 100000,
    }
  },
  
  ENTERPRISE: {
    id: 'enterprise',
    name: 'Enterprise',
    nameRu: 'Предприятие',
    description: 'Custom solutions for large organizations',
    descriptionRu: 'Индивидуальные решения',
    priceMonthly: null, // Contact sales
    priceYearly: null,
    stripePriceIdMonthly: null,
    stripePriceIdYearly: null,
    features: {
      minutesIncluded: 'unlimited',
      phoneNumbers: 'unlimited',
      teamMembers: 'unlimited',
      languages: ['RU', 'UZ', 'EN', 'custom'],
      analytics: 'custom',
      support: 'dedicated',
      apiAccess: true,
      customAI: true,
      customIntegrations: true,
      dedicatedSupport: true,
      sla: true,
      customContract: true,
    },
    limits: {
      maxMinutesPerMonth: 999999999,
      maxPhoneNumbers: 999999999,
      maxTeamMembers: 999999999,
      maxApiCallsPerDay: 999999999,
    }
  }
} as const;

export type PlanId = keyof typeof PLANS;
export type PlanConfig = typeof PLANS[PlanId];

// Overage pricing (when exceeding plan limits)
export const OVERAGE_PRICING = {
  perMinute: 10, // $0.10 in cents
  perPhoneNumber: 1000, // $10.00 per month
  perTeamMember: 2000, // $20.00 per month
} as const;

// Trial configuration
export const TRIAL_CONFIG = {
  durationDays: 14,
  defaultPlan: 'PROFESSIONAL' as PlanId,
} as const;

// Payment retry schedule
export const PAYMENT_RETRY_SCHEDULE = {
  attempts: [3, 7, 14], // Days after initial failure
  maxRetries: 3,
  gracePeriodDays: 7,
  autoCancelDays: 14,
} as const;

// Feature flags by plan
export function hasFeature(plan: PlanId, feature: string): boolean {
  const planConfig = PLANS[plan];
  return (planConfig.features as any)[feature] === true;
}

// Check if organization is within limits
export function isWithinLimit(
  plan: PlanId,
  metric: keyof typeof PLANS[PlanId]['limits'],
  currentValue: number
): boolean {
  const limit = PLANS[plan].limits[metric];
  if (typeof limit === 'number') {
    return currentValue <= limit;
  }
  return true; // No limit or unlimited
}

// Calculate overage cost
export function calculateOverageCost(
  plan: PlanId,
  usage: {
    minutes?: number;
    phoneNumbers?: number;
    teamMembers?: number;
  }
): {
  overageMinutes: number;
  overageCost: number;
  breakdown: {
    minutes: number;
    phoneNumbers: number;
    teamMembers: number;
  };
} {
  const limits = PLANS[plan].limits;
  
  const overageMinutes = Math.max(0, (usage.minutes || 0) - limits.maxMinutesPerMonth);
  const overagePhoneNumbers = Math.max(0, (usage.phoneNumbers || 0) - limits.maxPhoneNumbers);
  const overageTeamMembers = Math.max(0, (usage.teamMembers || 0) - limits.maxTeamMembers);
  
  const breakdown = {
    minutes: overageMinutes * OVERAGE_PRICING.perMinute,
    phoneNumbers: overagePhoneNumbers * OVERAGE_PRICING.perPhoneNumber,
    teamMembers: overageTeamMembers * OVERAGE_PRICING.perTeamMember,
  };
  
  const overageCost = breakdown.minutes + breakdown.phoneNumbers + breakdown.teamMembers;
  
  return {
    overageMinutes,
    overageCost,
    breakdown,
  };
}

// Format price for display
export function formatPrice(cents: number | null, currency = 'USD'): string {
  if (cents === null) return 'Contact Sales';
  
  const dollars = cents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(dollars);
}

// Calculate discount percentage
export function getYearlyDiscount(plan: PlanId): number {
  const planConfig = PLANS[plan];
  if (!planConfig.priceMonthly || !planConfig.priceYearly) return 0;
  
  const monthlyAnnual = planConfig.priceMonthly * 12;
  const discount = ((monthlyAnnual - planConfig.priceYearly) / monthlyAnnual) * 100;
  return Math.round(discount);
}
