import { plans, PlanId } from './plans';

export function canAccess(feature: string, plan: PlanId) {
  const def = plans[plan];
  return def.features.includes(feature as any);
}

export function quotaFor(plan: PlanId) {
  const def = plans[plan];
  return {
    calls: def.calls,
    overage: def.overage,
    agents: def.agents,
    numbers: def.numbers,
    softCap: (def as any).soft_cap_multiplier ?? 2,
  };
}

