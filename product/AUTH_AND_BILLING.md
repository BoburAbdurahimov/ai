# Authentication, Authorization & Billing System

Complete specifications for auth and billing implementation.

---

## 🔐 Authentication System

### Strategy: Clerk (Recommended) or Auth0

**Why Clerk:**
- Built for modern React/Next.js apps
- Beautiful pre-built UI components
- Multi-tenant support out of the box
- Easy organization/team management
- Affordable pricing ($25/month for 10k MAU)

**Alternative: Auth0**
- More enterprise features
- Broader integration ecosystem
- Higher cost ($240/year)

### Implementation Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                       │
└─────────────────────────────────────────────────────────────┘

User → Frontend → Clerk/Auth0 → JWT Token → Backend API
                      ↓
                  User Profile
                  Organization
                  Roles/Permissions
                      ↓
                  Supabase User Record
```

### User Registration Flow

```typescript
// Frontend: app/(auth)/signup/page.tsx
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-white shadow-xl",
          }
        }}
        routing="path"
        path="/signup"
        signInUrl="/login"
        afterSignUpUrl="/onboarding"
      />
    </div>
  );
}
```

### Backend Authentication Middleware

```typescript
// backend/middleware/auth.ts
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

export const requireAuth = ClerkExpressRequireAuth({
  onError: (error) => {
    console.error('Auth error:', error);
    return {
      status: 401,
      message: 'Unauthorized'
    };
  }
});

export async function loadUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const clerkUserId = req.auth.userId;
    
    // Get or create user in our database
    let user = await prisma.user.findUnique({
      where: { authId: clerkUserId },
      include: { organization: true }
    });
    
    if (!user) {
      // Create user on first login
      const clerkUser = await clerkClient.users.getUser(clerkUserId);
      
      user = await prisma.user.create({
        data: {
          authId: clerkUserId,
          email: clerkUser.emailAddresses[0].emailAddress,
          name: `${clerkUser.firstName} ${clerkUser.lastName}`,
          // organizationId will be set during onboarding
        }
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Error loading user:', error);
    res.status(500).json({ error: 'Failed to load user' });
  }
}
```

---

## 🛡️ Authorization System (RBAC)

### Role Definitions

```typescript
// types/roles.ts
export enum Role {
  OWNER = 'OWNER',       // Full access, billing, delete org
  ADMIN = 'ADMIN',       // All features except billing
  MANAGER = 'MANAGER',   // View all, manage team
  OPERATOR = 'OPERATOR', // Handle calls, view own data
  VIEWER = 'VIEWER'      // Read-only access
}

export const RolePermissions = {
  OWNER: [
    // Organization
    'org:read', 'org:update', 'org:delete',
    // Users
    'users:read', 'users:create', 'users:update', 'users:delete',
    // Calls
    'calls:read', 'calls:update', 'calls:delete',
    // AI
    'ai:read', 'ai:update',
    // Analytics
    'analytics:read',
    // Billing
    'billing:read', 'billing:update',
    // Integrations
    'integrations:read', 'integrations:create', 'integrations:delete',
  ],
  
  ADMIN: [
    'org:read', 'org:update',
    'users:read', 'users:create', 'users:update', 'users:delete',
    'calls:read', 'calls:update',
    'ai:read', 'ai:update',
    'analytics:read',
    'integrations:read', 'integrations:create', 'integrations:delete',
  ],
  
  MANAGER: [
    'org:read',
    'users:read',
    'calls:read', 'calls:update',
    'ai:read',
    'analytics:read',
  ],
  
  OPERATOR: [
    'calls:read:own',
    'calls:update:own',
  ],
  
  VIEWER: [
    'org:read',
    'calls:read',
    'analytics:read',
  ]
};
```

### Permission Middleware

```typescript
// backend/middleware/permissions.ts
import { Request, Response, NextFunction } from 'express';
import { RolePermissions } from '../types/roles';

export function requirePermission(...permissions: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const userPermissions = RolePermissions[user.role] || [];
    const hasPermission = permissions.every(p => 
      userPermissions.includes(p)
    );
    
    if (!hasPermission) {
      return res.status(403).json({ 
        error: 'Forbidden',
        message: 'You do not have permission to perform this action'
      });
    }
    
    next();
  };
}

// Usage:
app.delete('/api/users/:id', 
  requireAuth,
  loadUser,
  requirePermission('users:delete'),
  async (req, res) => {
    // Delete user logic
  }
);
```

### Multi-tenant Data Isolation

```typescript
// backend/middleware/tenant.ts
import { Request, Response, NextFunction } from 'express';

export function requireTenant(req: Request, res: Response, next: NextFunction) {
  const user = req.user;
  
  if (!user?.organizationId) {
    return res.status(400).json({ 
      error: 'Organization not set up',
      message: 'Please complete onboarding'
    });
  }
  
  // Add organization context to request
  req.organizationId = user.organizationId;
  next();
}

// Add to all queries
export function addTenantFilter(query: any, req: Request) {
  return {
    ...query,
    where: {
      ...query.where,
      organizationId: req.organizationId
    }
  };
}

// Example usage:
const calls = await prisma.call.findMany(
  addTenantFilter({
    where: { status: 'COMPLETED' },
    orderBy: { startedAt: 'desc' }
  }, req)
);
```

---

## 💳 Billing System (Stripe Integration)

### Pricing Structure

```typescript
// config/pricing.ts
export const PLANS = {
  STARTER: {
    id: 'starter',
    name: 'Starter',
    priceMonthly: 9900, // $99.00 in cents
    priceYearly: 100692, // $1006.92 (15% discount)
    stripePriceIdMonthly: 'price_starter_monthly',
    stripePriceIdYearly: 'price_starter_yearly',
    features: {
      minutesIncluded: 500,
      phoneNumbers: 1,
      teamMembers: 1,
      languages: ['RU'],
      analytics: 'basic',
      support: 'email',
    },
    limits: {
      maxMinutesPerMonth: 500,
      maxPhoneNumbers: 1,
      maxTeamMembers: 1,
      apiAccess: false,
      customAI: false,
    }
  },
  
  PROFESSIONAL: {
    id: 'professional',
    name: 'Professional',
    priceMonthly: 29900, // $299.00
    priceYearly: 305094, // $3050.94 (15% discount)
    stripePriceIdMonthly: 'price_pro_monthly',
    stripePriceIdYearly: 'price_pro_yearly',
    features: {
      minutesIncluded: 2000,
      phoneNumbers: 3,
      teamMembers: 5,
      languages: ['RU', 'UZ'],
      analytics: 'advanced',
      support: 'priority',
    },
    limits: {
      maxMinutesPerMonth: 2000,
      maxPhoneNumbers: 3,
      maxTeamMembers: 5,
      apiAccess: false,
      customAI: true,
    }
  },
  
  BUSINESS: {
    id: 'business',
    name: 'Business',
    priceMonthly: 79900, // $799.00
    priceYearly: 815094, // $8150.94 (15% discount)
    stripePriceIdMonthly: 'price_business_monthly',
    stripePriceIdYearly: 'price_business_yearly',
    features: {
      minutesIncluded: 10000,
      phoneNumbers: 'unlimited',
      teamMembers: 'unlimited',
      languages: ['RU', 'UZ', 'EN'],
      analytics: 'advanced',
      support: 'dedicated',
      apiAccess: true,
      customIntegrations: true,
    },
    limits: {
      maxMinutesPerMonth: 10000,
      maxPhoneNumbers: 999,
      maxTeamMembers: 999,
      apiAccess: true,
      customAI: true,
    }
  }
};

export const OVERAGE_PRICING = {
  perMinute: 10, // $0.10 in cents
};
```

### Stripe Integration

```typescript
// backend/services/stripe.ts
import Stripe from 'stripe';
import { prisma } from '../lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function createCheckoutSession(
  organizationId: string,
  plan: 'STARTER' | 'PROFESSIONAL' | 'BUSINESS',
  interval: 'monthly' | 'yearly'
) {
  const org = await prisma.organization.findUnique({
    where: { id: organizationId }
  });
  
  if (!org) throw new Error('Organization not found');
  
  const planConfig = PLANS[plan];
  const priceId = interval === 'monthly' 
    ? planConfig.stripePriceIdMonthly 
    : planConfig.stripePriceIdYearly;
  
  const session = await stripe.checkout.sessions.create({
    customer_email: org.email,
    client_reference_id: organizationId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.APP_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.APP_URL}/billing/canceled`,
    metadata: {
      organizationId,
      plan,
      interval,
    },
  });
  
  return session;
}

export async function handleWebhook(
  event: Stripe.Event
) {
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event.data.object);
      break;
      
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object);
      break;
      
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object);
      break;
      
    case 'invoice.payment_succeeded':
      await handlePaymentSucceeded(event.data.object);
      break;
      
    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data.object);
      break;
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const organizationId = session.metadata!.organizationId;
  const subscriptionId = session.subscription as string;
  
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  
  await prisma.organization.update({
    where: { id: organizationId },
    data: {
      plan: session.metadata!.plan,
      planStatus: 'ACTIVE',
      subscriptionId: subscriptionId,
    }
  });
  
  await prisma.subscription.create({
    data: {
      organizationId,
      stripeSubscriptionId: subscriptionId,
      stripeCustomerId: subscription.customer as string,
      plan: session.metadata!.plan,
      status: 'ACTIVE',
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    }
  });
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  await prisma.invoice.create({
    data: {
      organizationId: invoice.metadata!.organizationId,
      stripeInvoiceId: invoice.id,
      amount: invoice.amount_paid,
      currency: invoice.currency.toUpperCase(),
      status: 'paid',
      invoiceUrl: invoice.hosted_invoice_url,
      invoicePdf: invoice.invoice_pdf,
      periodStart: new Date(invoice.period_start * 1000),
      periodEnd: new Date(invoice.period_end * 1000),
      paidAt: new Date(invoice.status_transitions.paid_at! * 1000),
    }
  });
}
```

### Usage Tracking & Metering

```typescript
// backend/services/usage.ts
import { prisma } from '../lib/prisma';
import { PLANS, OVERAGE_PRICING } from '../config/pricing';

export async function trackCallUsage(
  organizationId: string,
  durationSeconds: number
) {
  const durationMinutes = Math.ceil(durationSeconds / 60);
  
  // Record usage
  await prisma.usageRecord.create({
    data: {
      organizationId,
      metricType: 'minutes',
      quantity: durationMinutes,
      date: new Date(),
    }
  });
  
  // Check if over limit
  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    include: { subscription: true }
  });
  
  if (!org) return;
  
  const planLimits = PLANS[org.plan].limits;
  const currentUsage = await getCurrentMonthUsage(organizationId);
  
  if (currentUsage.minutes > planLimits.maxMinutesPerMonth) {
    // Send warning email
    await sendUsageWarningEmail(org, currentUsage);
  }
}

export async function getCurrentMonthUsage(organizationId: string) {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  
  const usage = await prisma.usageRecord.groupBy({
    by: ['metricType'],
    where: {
      organizationId,
      date: {
        gte: startOfMonth
      }
    },
    _sum: {
      quantity: true
    }
  });
  
  return {
    minutes: usage.find(u => u.metricType === 'minutes')?._sum.quantity || 0,
    calls: usage.find(u => u.metricType === 'calls')?._sum.quantity || 0,
  };
}

export async function calculateOverageCost(organizationId: string) {
  const org = await prisma.organization.findUnique({
    where: { id: organizationId }
  });
  
  if (!org) return 0;
  
  const planLimits = PLANS[org.plan].limits;
  const usage = await getCurrentMonthUsage(organizationId);
  
  const overageMinutes = Math.max(0, usage.minutes - planLimits.maxMinutesPerMonth);
  const overageCost = overageMinutes * OVERAGE_PRICING.perMinute;
  
  return {
    overageMinutes,
    overageCost, // in cents
    overageCostFormatted: `$${(overageCost / 100).toFixed(2)}`
  };
}
```

### Frontend Billing Components

```typescript
// app/(dashboard)/billing/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function BillingPage() {
  const { data: subscription } = useQuery({
    queryKey: ['subscription'],
    queryFn: () => fetch('/api/billing/subscription').then(r => r.json())
  });
  
  const { data: usage } = useQuery({
    queryKey: ['usage'],
    queryFn: () => fetch('/api/billing/usage').then(r => r.json())
  });
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Billing & Usage</h1>
      
      {/* Current Plan */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Current Plan</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold">{subscription?.plan}</p>
            <p className="text-gray-600">
              ${subscription?.amount / 100}/month
            </p>
          </div>
          <Button onClick={() => openUpgradeModal()}>
            Upgrade Plan
          </Button>
        </div>
      </Card>
      
      {/* Usage This Month */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Usage This Month</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span>Minutes Used</span>
              <span className="font-semibold">
                {usage?.minutes} / {usage?.minutesIncluded}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full"
                style={{ 
                  width: `${Math.min(100, (usage?.minutes / usage?.minutesIncluded) * 100)}%` 
                }}
              />
            </div>
          </div>
          
          {usage?.overageMinutes > 0 && (
            <div className="bg-warning-100 border border-warning-500 rounded p-4">
              <p className="font-semibold text-warning-700">
                Overage: {usage.overageMinutes} minutes
              </p>
              <p className="text-sm text-warning-600">
                Additional cost: ${usage.overageCost / 100}
              </p>
            </div>
          )}
        </div>
      </Card>
      
      {/* Invoices */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Billing History</h2>
        {/* Invoice list */}
      </Card>
    </div>
  );
}
```

---

## 🔒 Security Best Practices

### API Rate Limiting

```typescript
// backend/middleware/rateLimit.ts
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export const apiLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:api:',
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: async (req) => {
    // Authenticated users get higher limit
    if (req.user) {
      return 1000;
    }
    return 100;
  },
  message: {
    error: 'Too many requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limit for sensitive endpoints
export const authLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:auth:',
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    error: 'Too many authentication attempts'
  }
});
```

### Data Encryption

```typescript
// backend/lib/encryption.ts
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

export function decrypt(encryptedText: string): string {
  const [ivHex, authTagHex, encrypted] = encryptedText.split(':');
  
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

// Usage: Encrypt sensitive integration credentials
const credentials = {
  apiKey: 'sensitive_key',
  secret: 'sensitive_secret'
};

await prisma.integration.create({
  data: {
    type: 'bitrix24',
    credentials: encrypt(JSON.stringify(credentials))
  }
});
```

---

This completes the authentication and billing specifications! Next, I'll create the deployment and implementation roadmap.
