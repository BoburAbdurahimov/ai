export const plans = {
  starter: {
    price: 39,
    calls: 500,
    overage: 0.08,
    agents: 1,
    numbers: 1,
    features: ['basic_analytics', 'byo_api_keys'],
  },
  pro: {
    price: 99,
    calls: 1500,
    overage: 0.08,
    agents: 3,
    numbers: 3,
    features: ['platform_api_keys', 'telegram', 'sheets', 'agent_customization'],
  },
  business: {
    price: 199,
    calls: 1500,
    overage: 0.08,
    agents: 10,
    numbers: 10,
    features: ['cold_calling', 'advanced_analytics', 'priority_support'],
    soft_cap_multiplier: 2,
  },
} as const;

export type PlanId = keyof typeof plans;

