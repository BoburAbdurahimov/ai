/**
 * React hook for accessing subscription data and permissions
 */

'use client';

import { useEffect, useState } from 'react';
import { PlanId } from '@/lib/stripe/config';

export interface SubscriptionData {
  organization: {
    id: string;
    name: string;
    plan: PlanId;
    planStatus: string;
    trialEndsAt: string | null;
  };
  subscription: {
    id: string;
    status: string;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
  } | null;
  plan: {
    id: string;
    name: string;
    priceMonthly: number | null;
    priceYearly: number | null;
    features: Record<string, any>;
    limits: {
      maxMinutesPerMonth: number;
      maxPhoneNumbers: number;
      maxTeamMembers: number;
      maxApiCallsPerDay: number;
    };
  };
  usage: {
    minutes: number;
    calls: number;
    phoneNumbers: number;
    teamMembers: number;
    apiCalls: number;
    periodStart: string;
    periodEnd: string;
  };
  limits: {
    withinLimits: boolean;
    warnings: string[];
    overages: {
      overageMinutes: number;
      overageCost: number;
      breakdown: {
        minutes: number;
        phoneNumbers: number;
        teamMembers: number;
      };
    };
  };
}

export function useSubscription() {
  const [data, setData] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/billing/subscription');
      
      if (!response.ok) {
        throw new Error('Failed to fetch subscription');
      }
      
      const subscriptionData = await response.json();
      setData(subscriptionData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  return {
    subscription: data,
    loading,
    error,
    refresh: fetchSubscription,
    
    // Convenience methods
    hasFeature: (feature: string) => {
      return data?.plan.features[feature] === true;
    },
    
    isOverLimit: (metric: 'minutes' | 'phoneNumbers' | 'teamMembers') => {
      if (!data) return false;
      return data.usage[metric] > data.plan.limits[`max${metric.charAt(0).toUpperCase() + metric.slice(1)}` as keyof typeof data.plan.limits];
    },
    
    getUsagePercentage: (metric: 'minutes' | 'phoneNumbers' | 'teamMembers') => {
      if (!data) return 0;
      const limit = data.plan.limits[`max${metric.charAt(0).toUpperCase() + metric.slice(1)}` as keyof typeof data.plan.limits];
      const usage = data.usage[metric];
      return Math.min((usage / limit) * 100, 100);
    },
    
    isTrialing: () => {
      return data?.subscription?.status === 'TRIALING';
    },
    
    isPastDue: () => {
      return data?.organization.planStatus === 'PAST_DUE';
    },
    
    daysLeftInTrial: () => {
      if (!data?.organization.trialEndsAt) return null;
      const trialEnd = new Date(data.organization.trialEndsAt);
      const now = new Date();
      const daysLeft = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return Math.max(0, daysLeft);
    },
  };
}
