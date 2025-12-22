# Next.js 14 + TailwindCSS Integration Guide

## 🚀 Complete Setup for Premium Billing System

This guide covers the full integration of the Premium Billing System with **Next.js 14 App Router** and **TailwindCSS**.

---

## 📦 Installation

### **1. Install Dependencies**

```bash
npm install next@latest react@latest react-dom@latest
npm install tailwindcss@latest postcss@latest autoprefixer@latest
npm install tailwindcss-animate
npm install clsx tailwind-merge
npm install @types/node @types/react @types/react-dom typescript
npm install stripe
npm install lucide-react
```

### **2. Initialize Tailwind**

```bash
npx tailwindcss init -p
```

---

## 🔧 Configuration Files

### **1. tailwind.config.ts**

```typescript
// Use: tailwind.config.nextjs.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // All custom colors, animations, etc.
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
}

export default config
```

### **2. postcss.config.js**

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### **3. globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Import custom animations */
@import './lib/animations/micro-animations.css';

/* Dark theme variables */
@layer base {
  :root {
    --background: 220 13% 8%;
    --foreground: 210 40% 98%;
    /* ... all other CSS variables */
  }
}
```

---

## 📁 File Structure

```
dashboard/
├── app/
│   ├── layout.tsx                 # Root layout
│   ├── globals.css                # Global styles + Tailwind
│   └── billing/
│       ├── layout.tsx             # Billing layout
│       ├── page.tsx               # Server component
│       ├── billing-client.tsx     # Client component
│       ├── loading.tsx            # Loading UI
│       └── error.tsx              # Error boundary
├── components/
│   ├── billing/
│   │   ├── PricingTable.branded.tsx
│   │   ├── SubscriptionCard.branded.tsx
│   │   └── UsageMetrics.branded.tsx
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   └── custom/
│       └── BrandedElements.tsx
├── lib/
│   ├── utils.ts                   # cn() helper
│   ├── stripe/
│   │   ├── config.ts
│   │   ├── service.ts
│   │   └── usage.ts
│   └── animations/
│       └── micro-animations.css
├── tailwind.config.ts
├── postcss.config.js
└── tsconfig.json
```

---

## 🎯 Next.js 14 App Router Patterns

### **1. Server vs Client Components**

#### **Server Component (Default)**
```tsx
// app/billing/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Billing | VoiceOps AI',
};

export default async function BillingPage() {
  // Can fetch data here
  return <BillingClient />;
}
```

#### **Client Component (Interactive)**
```tsx
// app/billing/billing-client.tsx
'use client';

import { useState } from 'react';

export function BillingClient() {
  const [state, setState] = useState();
  // Interactive features
  return <div>...</div>;
}
```

---

### **2. Loading States**

#### **Automatic Loading UI**
```tsx
// app/billing/loading.tsx
export default function Loading() {
  return <SkeletonPricingCard />;
}
```

#### **Manual Suspense**
```tsx
import { Suspense } from 'react';

<Suspense fallback={<Loading />}>
  <AsyncComponent />
</Suspense>
```

---

### **3. Error Handling**

```tsx
// app/billing/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

---

### **4. Metadata**

```tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Billing & Subscription',
  description: 'Manage your VoiceOps AI subscription',
  openGraph: {
    title: 'Billing | VoiceOps AI',
    description: 'Manage subscription and view usage',
  },
};
```

---

### **5. Data Fetching**

#### **Server Component**
```tsx
async function getData() {
  const res = await fetch('https://api.example.com/data', {
    next: { revalidate: 3600 } // Cache for 1 hour
  });
  return res.json();
}

export default async function Page() {
  const data = await getData();
  return <div>{data}</div>;
}
```

#### **Client Component**
```tsx
'use client';

import useSWR from 'swr';

export function ClientComponent() {
  const { data, error } = useSWR('/api/subscription', fetcher);
  
  if (error) return <Error />;
  if (!data) return <Loading />;
  
  return <div>{data}</div>;
}
```

---

## 🎨 TailwindCSS Best Practices

### **1. Use cn() Helper**

```tsx
import { cn } from '@/lib/utils';

<div className={cn(
  'base-classes',
  condition && 'conditional-classes',
  className
)} />
```

### **2. Responsive Design**

```tsx
<div className="
  grid 
  grid-cols-1 
  md:grid-cols-2 
  lg:grid-cols-3 
  gap-4 
  md:gap-6
" />
```

### **3. Dark Mode**

```tsx
<div className="bg-white dark:bg-gray-900 text-black dark:text-white" />
```

### **4. Custom Utilities**

```typescript
// tailwind.config.ts
theme: {
  extend: {
    animation: {
      'shimmer': 'shimmer 2s infinite',
    },
    keyframes: {
      shimmer: {
        '0%': { transform: 'translateX(-100%)' },
        '100%': { transform: 'translateX(100%)' },
      },
    },
  },
}
```

---

## 🔥 Performance Optimization

### **1. Code Splitting**

```tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Loading />,
  ssr: false, // Disable SSR for this component
});
```

### **2. Image Optimization**

```tsx
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="Logo"
  width={200}
  height={50}
  priority // For above-the-fold images
/>
```

### **3. Font Optimization**

```tsx
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

---

## 📱 Component Patterns

### **1. Branded Pricing Table**

```tsx
// Server Component
import { PricingTableBranded } from '@/components/billing/PricingTable.branded';

export default function PricingPage() {
  return <PricingTableBranded />;
}
```

### **2. Usage Metrics with Real-time Updates**

```tsx
'use client';

import { UsageMetricsBranded } from '@/components/billing/UsageMetrics.branded';
import { useSubscription } from '@/lib/hooks/useSubscription';

export function UsageDashboard() {
  const { subscription, loading } = useSubscription();
  
  if (loading) return <SkeletonMetrics />;
  
  return <UsageMetricsBranded />;
}
```

### **3. Interactive Forms**

```tsx
'use client';

import { ButtonAnimated } from '@/components/ui/button-animated';
import { useRouter } from 'next/navigation';

export function CheckoutForm() {
  const router = useRouter();
  
  const handleSubmit = async () => {
    const res = await fetch('/api/billing/checkout', {
      method: 'POST',
      body: JSON.stringify({ plan: 'PROFESSIONAL' }),
    });
    
    const { url } = await res.json();
    router.push(url);
  };
  
  return (
    <ButtonAnimated onClick={handleSubmit} ripple magnetic>
      Upgrade Now
    </ButtonAnimated>
  );
}
```

---

## 🚀 Deployment

### **1. Vercel (Recommended)**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### **2. Environment Variables**

```bash
# .env.local
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### **3. Build Optimization**

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['your-cdn.com'],
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react'],
  },
}

module.exports = nextConfig
```

---

## 🎯 Quick Start Checklist

- [x] Install Next.js 14 + TailwindCSS
- [x] Configure Tailwind with custom theme
- [x] Set up App Router structure
- [x] Add loading states
- [x] Add error boundaries
- [x] Configure metadata
- [x] Separate server/client components
- [x] Import branded components
- [x] Add animations CSS
- [x] Configure environment variables
- [x] Test responsive design
- [x] Deploy to Vercel

---

## 📚 Additional Resources

- [Next.js 14 Docs](https://nextjs.org/docs)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Tailwind Animate](https://github.com/jamiebuilds/tailwindcss-animate)
- [Next.js App Router](https://nextjs.org/docs/app)

---

**Your Premium Billing System is now fully optimized for Next.js 14 + TailwindCSS!** 🚀
