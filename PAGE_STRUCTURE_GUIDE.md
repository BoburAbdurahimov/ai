# Page Structure Guide - VoiceOps AI Dashboard

## 🏗️ Complete Navigation Architecture

A production-ready page structure with proper Next.js 14 App Router patterns, layouts, and navigation.

---

## 📁 File Structure

```
dashboard/
├── app/
│   ├── layout.tsx                           # Root layout (providers, fonts)
│   ├── globals.css                          # Global styles
│   │
│   ├── (dashboard)/                         # Dashboard group (shared layout)
│   │   ├── layout.tsx                       # Sidebar + Header layout
│   │   │
│   │   ├── dashboard/
│   │   │   └── page.tsx                     # Dashboard home
│   │   │
│   │   ├── billing/
│   │   │   ├── page.tsx                     # Billing overview
│   │   │   ├── billing-overview-client.tsx
│   │   │   │
│   │   │   ├── plans/
│   │   │   │   ├── page.tsx                 # View plans
│   │   │   │   └── plans-client.tsx
│   │   │   │
│   │   │   └── invoices/
│   │   │       ├── page.tsx                 # Invoice list
│   │   │       └── invoices-client.tsx
│   │   │
│   │   ├── calls/
│   │   │   └── page.tsx                     # Call history
│   │   │
│   │   ├── analytics/
│   │   │   └── page.tsx                     # Analytics dashboard
│   │   │
│   │   ├── team/
│   │   │   └── page.tsx                     # Team management
│   │   │
│   │   └── settings/
│   │       └── page.tsx                     # Settings
│   │
│   └── (marketing)/                         # Marketing pages (different layout)
│       ├── page.tsx                         # Landing page
│       ├── pricing/
│       └── about/
│
└── components/
    ├── layout/
    │   ├── Sidebar.tsx                      # Main navigation
    │   ├── Header.tsx                       # Top bar
    │   └── Breadcrumbs.tsx                  # Navigation trail
    └── ...
```

---

## 🎯 Route Structure

### **Dashboard Routes** (Authenticated)

| Route | Description | Component |
|-------|-------------|-----------|
| `/dashboard` | Main dashboard home | Dashboard overview with metrics |
| `/billing` | Billing overview | Subscription status + usage |
| `/billing/plans` | View all plans | Pricing table with 3D |
| `/billing/invoices` | Invoice history | List of past invoices |
| `/calls` | Call history | Recent calls and analytics |
| `/analytics` | Analytics dashboard | Charts and insights |
| `/team` | Team management | Manage team members |
| `/settings` | Settings | Account and preferences |

### **Marketing Routes** (Public)

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/pricing` | Public pricing page |
| `/about` | About us |

---

## 🏛️ Layout Hierarchy

### **1. Root Layout** (`app/layout.tsx`)
```tsx
<html>
  <body>
    {/* Providers, fonts, global styles */}
    {children}
  </body>
</html>
```

**Applies to:** ALL pages  
**Includes:**
- Font configuration (Inter)
- Global CSS imports
- Metadata
- Dark mode class

---

### **2. Dashboard Layout** (`app/(dashboard)/layout.tsx`)
```tsx
<div>
  <ParticleField3D />  {/* Background */}
  <Sidebar />          {/* Left navigation */}
  <div>
    <Header />         {/* Top bar */}
    <main>{children}</main>
  </div>
</div>
```

**Applies to:** All `/dashboard`, `/billing`, `/calls`, etc.  
**Includes:**
- Sidebar navigation
- Header with search and user menu
- 3D particle background
- Responsive mobile menu

---

### **3. Page Layout** (Individual pages)
```tsx
<div className="container mx-auto py-8 px-4">
  <Breadcrumbs />
  <h1>Page Title</h1>
  <Content />
</div>
```

**Standard pattern for each page**

---

## 🧭 Navigation Components

### **1. Sidebar** (`components/layout/Sidebar.tsx`)

**Features:**
- Logo with 3D animation
- Navigation links with active states
- Mobile hamburger menu
- Upgrade prompt
- Help link

**Navigation Items:**
```tsx
const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Calls', href: '/calls', icon: Phone, badge: 'Live' },
  { name: 'Billing', href: '/billing', icon: CreditCard },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Team', href: '/team', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];
```

**Active State Logic:**
```tsx
const isActive = pathname?.startsWith(item.href);
```

**Mobile Responsive:**
- Hidden on mobile by default
- Toggles with hamburger button
- Overlay backdrop
- Slide-in animation

---

### **2. Header** (`components/layout/Header.tsx`)

**Features:**
- Search bar
- System status indicator (live pulse)
- Notifications bell (with count)
- User menu dropdown

**User Menu:**
- User profile info
- Plan badge
- Profile link
- Settings link
- Sign out button

---

### **3. Breadcrumbs** (`components/layout/Breadcrumbs.tsx`)

**Features:**
- Home icon link
- Current path trail
- Hover states
- Chevron separators

**Usage:**
```tsx
<Breadcrumbs items={[
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Billing', href: '/billing' },
  { label: 'Plans', href: '/billing/plans' },
]} />
```

---

## 📄 Page Patterns

### **Pattern 1: Server Component + Client Component**

**Server Component** (page.tsx):
```tsx
export default function Page() {
  return (
    <div>
      <Breadcrumbs />
      <Suspense fallback={<Loading />}>
        <ClientComponent />
      </Suspense>
    </div>
  );
}
```

**Client Component** (*-client.tsx):
```tsx
'use client';

export function ClientComponent() {
  // Interactive features
  const [state, setState] = useState();
  return <div>...</div>;
}
```

---

### **Pattern 2: Loading States**

```tsx
function Loading() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-20 glass rounded-xl animate-pulse" />
      ))}
    </div>
  );
}
```

---

### **Pattern 3: Metadata**

```tsx
export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Page description',
};
```

---

## 🎨 Styling Patterns

### **Container**
```tsx
<div className="container mx-auto py-8 px-4 space-y-6">
```

### **Page Header**
```tsx
<div>
  <h1 className="text-4xl font-bold gradient-text-primary">Title</h1>
  <p className="text-muted-foreground mt-2">Description</p>
</div>
```

### **Metric Cards**
```tsx
<Card className="p-6 glass hover:shadow-xl transition-all">
  <div className="flex items-center gap-4">
    <div className="w-12 h-12 rounded-xl bg-primary/20">
      <Icon className="h-6 w-6 text-primary" />
    </div>
    <div>
      <p className="text-sm text-muted-foreground">Label</p>
      <p className="text-3xl font-bold">Value</p>
    </div>
  </div>
</Card>
```

---

## 📱 Responsive Behavior

### **Breakpoints**
- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

### **Sidebar**
- **Desktop:** Always visible (sticky)
- **Mobile:** Hidden, toggle with button

### **Grid Layouts**
```tsx
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
```

---

## 🔒 Route Protection

### **Protected Routes** (Dashboard group)
All routes in `(dashboard)` should be protected by authentication middleware.

**Implementation** (in middleware.ts):
```tsx
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (pathname.startsWith('/dashboard') || 
      pathname.startsWith('/billing') ||
      pathname.startsWith('/calls')) {
    // Check authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.redirect('/login');
    }
  }
  
  return NextResponse.next();
}
```

---

## 🚀 Adding New Pages

### **Step 1: Create page.tsx**
```tsx
// app/(dashboard)/new-feature/page.tsx
import { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export const metadata: Metadata = {
  title: 'New Feature',
};

export default function NewFeaturePage() {
  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      <Breadcrumbs items={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'New Feature', href: '/new-feature' },
      ]} />
      
      <h1 className="text-4xl font-bold gradient-text-primary">
        New Feature
      </h1>
      
      {/* Content */}
    </div>
  );
}
```

### **Step 2: Add to Sidebar**
```tsx
// components/layout/Sidebar.tsx
const navigation = [
  // ...existing items
  { name: 'New Feature', href: '/new-feature', icon: YourIcon },
];
```

### **Step 3: Update Types** (if needed)
Add route to authentication middleware.

---

## 📊 Page Structure Checklist

For each new page, ensure:

- [ ] Metadata configured
- [ ] Breadcrumbs added
- [ ] Responsive layout
- [ ] Loading state
- [ ] Error boundary (via error.tsx)
- [ ] Server/client separation
- [ ] Added to navigation
- [ ] Protected route (if needed)
- [ ] Mobile tested

---

## 🎯 Best Practices

### **1. Use Route Groups**
```
(dashboard)/  - Shared layout
(marketing)/  - Different layout
(auth)/       - Auth-specific layout
```

### **2. Server Components by Default**
Only use `'use client'` when you need:
- useState, useEffect, etc.
- Event handlers
- Browser APIs

### **3. Loading States Everywhere**
Always wrap async content in Suspense with loading fallback.

### **4. Proper Metadata**
Each page should have unique title and description.

### **5. Consistent Spacing**
- Container: `py-8 px-4`
- Section gaps: `space-y-6` or `space-y-8`
- Grid gaps: `gap-4` or `gap-6`

---

## 🎉 Result

You now have a **complete, production-ready page structure** with:

✅ Proper Next.js 14 App Router patterns  
✅ Dashboard layout with sidebar + header  
✅ Billing pages (overview, plans, invoices)  
✅ Navigation components  
✅ Breadcrumbs  
✅ Mobile responsive  
✅ Loading states  
✅ Metadata configuration  
✅ 3D backgrounds  
✅ Glass morphism design  

**Navigate confidently through your premium billing system!** 🚀
