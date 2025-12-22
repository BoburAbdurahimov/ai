# Micro-Animations Guide - Premium Billing System

## 🎬 Overview

A comprehensive library of **smooth, delightful micro-animations** that enhance user experience without being distracting. Every interaction feels polished and intentional.

---

## ✨ What's Included

### **1. Animation Utilities (CSS)**
- 60+ keyframe animations
- Button interactions (press, ripple, shine, magnetic)
- Card effects (tilt, lift, glow)
- Number counters
- Icon animations
- Loading states
- Scroll reveals
- Transitions

**File:** `dashboard/lib/animations/micro-animations.css` (600+ lines)

### **2. React Components**
- `ButtonAnimated` - Interactive buttons with ripple effects
- `CardAnimated` - 3D tilt and hover effects
- `CounterAnimated` - Smooth number counting
- `SkeletonAnimated` - Shimmer loading states
- `IconAnimated` - Bounce, spin, wiggle animations
- `PageTransition` - Smooth page changes
- `ScrollReveal` - Scroll-triggered animations

### **3. Enhanced Billing Components**
- `PricingTable.micro.tsx` - Full micro-animation integration

---

## 🎯 Micro-Animation Categories

### **1. Button Animations**

#### **Press Effect**
```tsx
<ButtonAnimated ripple>
  Click Me
</ButtonAnimated>
```
- **Effect:** Button scales to 96% on press
- **Duration:** 100ms
- **Easing:** ease-in-out

#### **Ripple Effect**
```tsx
<ButtonAnimated ripple magnetic>
  Click Me
</ButtonAnimated>
```
- **Effect:** Circular ripple expands from click point
- **Duration:** 600ms
- **Visual:** White overlay at 50% opacity

#### **Magnetic Effect**
```tsx
<ButtonAnimated magnetic>
  Hover Me
</ButtonAnimated>
```
- **Effect:** Button subtly follows cursor within 50px radius
- **Strength:** 30% of distance
- **Use case:** Hero CTAs, primary actions

#### **Shine Effect**
```tsx
<ButtonAnimated shine>
  Premium Action
</ButtonAnimated>
```
- **Effect:** Light sweep across button on hover
- **Duration:** 800ms
- **Visual:** White gradient from left to right

---

### **2. Card Animations**

#### **3D Tilt**
```tsx
<CardAnimated tilt>
  <Content />
</CardAnimated>
```
- **Effect:** Card tilts following mouse position
- **Max tilt:** 10 degrees
- **Perspective:** 1000px
- **Use case:** Featured/popular cards

#### **Lift on Hover**
```tsx
<CardAnimated lift>
  <Content />
</CardAnimated>
```
- **Effect:** Card rises with enhanced shadow
- **Movement:** -8px translateY, scale(1.02)
- **Duration:** 300ms
- **Shadow:** Expands to 40px blur

#### **Glow Effect**
```tsx
<CardAnimated glow glowColor="primary">
  <Content />
</CardAnimated>
```
- **Effect:** Pulsing glow around card
- **Colors:** primary, accent, success
- **Duration:** 2s infinite
- **Use case:** Active/selected cards

---

### **3. Number Animations**

#### **Counter**
```tsx
<CounterAnimated 
  value={1234} 
  duration={1000}
  decimals={0}
  separator
  prefix="$"
  suffix="/mo"
/>
```
- **Effect:** Smooth count-up from 0 to value
- **Easing:** Ease-out cubic
- **Features:** 
  - Thousand separators
  - Decimal precision
  - Prefix/suffix support
  - Color flash on increment (green)

#### **Flash on Change**
```tsx
<span className="number-flash">1,234</span>
```
- **Effect:** Brief opacity pulse
- **Duration:** 300ms
- **Use case:** Real-time updates

---

### **4. Icon Animations**

#### **Bounce**
```tsx
<IconAnimated animation="bounce" trigger="hover">
  <Sparkles />
</IconAnimated>
```
- **Effect:** Vertical bounce motion
- **Distance:** -8px
- **Duration:** 600ms

#### **Wiggle**
```tsx
<IconAnimated animation="wiggle" trigger="hover">
  <Bell />
</IconAnimated>
```
- **Effect:** Rotation wiggle (±10deg)
- **Duration:** 500ms
- **Use case:** Notifications, alerts

#### **Pulse**
```tsx
<IconAnimated animation="pulse" trigger="always">
  <Activity />
</IconAnimated>
```
- **Effect:** Scale pulse (1.0 to 1.1)
- **Duration:** 1s infinite
- **Use case:** Live indicators

#### **Spin**
```tsx
<IconAnimated animation="spin" trigger="always">
  <Loader2 />
</IconAnimated>
```
- **Effect:** Continuous rotation
- **Speed:** 1s per revolution
- **Use case:** Loading states

#### **Shake**
```tsx
<IconAnimated animation="shake" trigger="once">
  <AlertTriangle />
</IconAnimated>
```
- **Effect:** Horizontal shake (±4px)
- **Duration:** 500ms
- **Use case:** Errors, warnings

#### **Pop**
```tsx
<PopIcon delay={300}>
  <Crown />
</PopIcon>
```
- **Effect:** Scale pop (1.0 → 1.3 → 1.0)
- **Duration:** 300ms
- **Use case:** Badge appearances

---

### **5. Loading States**

#### **Skeleton Shimmer**
```tsx
<SkeletonAnimated 
  variant="rectangular" 
  width={300} 
  height={200}
  animation="wave"
/>
```
- **Effect:** Shimmer wave from left to right
- **Duration:** 1.5s infinite
- **Gradient:** 5% → 15% → 5% opacity

#### **Pre-built Patterns**
```tsx
<SkeletonCard />         // Complete card skeleton
<SkeletonTable />        // Table rows skeleton
<SkeletonPricingCard />  // Pricing card skeleton
```

#### **Pulse Loader**
```tsx
<div className="pulse-loader">•</div>
```
- **Effect:** Opacity and scale pulse
- **Range:** 0.3 to 1.0 opacity, 0.8 to 1.0 scale
- **Duration:** 1.5s infinite

#### **Dot Bounce**
```tsx
<div className="flex gap-2">
  <div className="dot-bounce-1">•</div>
  <div className="dot-bounce-2">•</div>
  <div className="dot-bounce-3">•</div>
</div>
```
- **Effect:** Sequential vertical bounce
- **Delays:** 0s, 0.2s, 0.4s
- **Height:** -10px

---

### **6. Progress Bars**

#### **Animated Fill**
```tsx
<div className="progress-animate" style={{ width: `${percentage}%` }}>
  <div className="progress-shimmer" />
</div>
```
- **Effect:** Smooth width expansion + shimmer overlay
- **Duration:** 1s ease-out
- **Shimmer:** Continuous 2s loop

---

### **7. Badge Animations**

#### **Scale In**
```tsx
<Badge className="badge-animate">New</Badge>
```
- **Effect:** Pop in from scale(0)
- **Duration:** 300ms
- **Easing:** Bouncy cubic-bezier

#### **Attention Pulse**
```tsx
<Badge className="badge-attention">Hot</Badge>
```
- **Effect:** Subtle scale pulse
- **Range:** 1.0 to 1.1
- **Duration:** 800ms infinite

---

### **8. Text Animations**

#### **Reveal**
```tsx
<h1 className="text-reveal">Welcome</h1>
```
- **Effect:** Fade in from bottom
- **Distance:** +20px
- **Duration:** 600ms

#### **Gradient Flow**
```tsx
<h1 className="text-gradient-animate gradient-text-primary">
  Premium
</h1>
```
- **Effect:** Gradient position animation
- **Duration:** 3s infinite
- **Background size:** 200%

---

### **9. Hover Effects**

#### **Underline**
```tsx
<a className="hover-underline">Link</a>
```
- **Effect:** Line expands from left
- **Duration:** 300ms

#### **Scale**
```tsx
<div className="hover-scale">Card</div>
```
- **Effect:** Scale to 105%
- **Duration:** 200ms

#### **Rotate**
```tsx
<div className="hover-rotate">Element</div>
```
- **Effect:** Rotate 5 degrees
- **Duration:** 300ms

#### **Glow**
```tsx
<div className="hover-glow">Button</div>
```
- **Effect:** Blue glow + brightness increase
- **Duration:** 300ms

---

### **10. Page Transitions**

#### **Basic Usage**
```tsx
<PageTransition effect="fade" duration={300}>
  <YourPage />
</PageTransition>
```

#### **Effects Available**
- **fade:** Opacity transition
- **slide:** Horizontal slide
- **scale:** Scale from 95%
- **blur:** Blur transition

#### **Stagger Children**
```tsx
<StaggerChildren staggerDelay={100}>
  <Card />
  <Card />
  <Card />
</StaggerChildren>
```

#### **Scroll Reveal**
```tsx
<ScrollReveal animation="slide-up" threshold={0.1}>
  <Section />
</ScrollReveal>
```

---

## 🎨 Usage Examples

### **Example 1: Interactive CTA Button**
```tsx
<ButtonAnimated
  variant="gradient"
  size="lg"
  ripple
  magnetic
  shine
  className="px-8"
>
  <Crown className="w-5 h-5 mr-2" />
  Upgrade Now
  <IconAnimated animation="bounce" trigger="hover">
    <Sparkles className="w-4 h-4 ml-2" />
  </IconAnimated>
</ButtonAnimated>
```

**Result:**
- Gradient background
- Ripple on click
- Magnetic pull on hover
- Shine sweep effect
- Bouncing sparkle icon

---

### **Example 2: Pricing Card with Tilt**
```tsx
<CardAnimated tilt lift glow glowColor="primary">
  <div className="p-8">
    <HoverBounceIcon>
      <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent">
        <Zap className="h-7 w-7" />
      </div>
    </HoverBounceIcon>
    
    <h3 className="text-2xl font-bold mt-4">Professional</h3>
    
    <div className="text-5xl font-bold mt-6">
      $<CounterAnimated value={299} duration={800} />
    </div>
    
    <ButtonAnimated variant="gradient" ripple magnetic className="mt-6 w-full">
      Get Started
    </ButtonAnimated>
  </div>
</CardAnimated>
```

**Result:**
- 3D tilt following mouse
- Lift on hover (-8px)
- Glow pulse effect
- Icon bounces on hover
- Price counts up smoothly
- Button with ripple + magnetic

---

### **Example 3: Usage Metrics with Animations**
```tsx
<CardAnimated lift glow>
  <div className="p-6">
    <div className="flex items-center gap-4">
      <HoverBounceIcon>
        <Clock className="h-6 w-6 text-primary" />
      </HoverBounceIcon>
      <div>
        <p className="text-sm text-muted-foreground">Call Minutes</p>
        <p className="text-3xl font-bold">
          <CounterAnimated 
            value={1234} 
            duration={1000}
            separator
          />
        </p>
      </div>
    </div>
    
    <div className="mt-4 h-3 bg-muted/30 rounded-full overflow-hidden">
      <div 
        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 progress-animate"
        style={{ width: '75%' }}
      >
        <div className="progress-shimmer" />
      </div>
    </div>
  </div>
</CardAnimated>
```

**Result:**
- Card lifts on hover
- Icon bounces
- Number counts up with separators
- Progress bar animates width
- Shimmer effect on progress

---

### **Example 4: Loading State**
```tsx
<SkeletonPricingCard />

// Or custom skeleton
<div className="p-8 space-y-4">
  <div className="flex items-center gap-4">
    <SkeletonAnimated variant="circular" width={56} height={56} />
    <div className="space-y-2 flex-1">
      <SkeletonAnimated variant="text" width="60%" />
      <SkeletonAnimated variant="text" width="40%" />
    </div>
  </div>
  <SkeletonAnimated variant="rectangular" height={120} />
</div>
```

---

### **Example 5: Staggered Grid**
```tsx
<div className="grid grid-cols-3 gap-6">
  {plans.map((plan, i) => (
    <div
      key={plan.id}
      className="animate-fadeIn"
      style={{ animationDelay: `${i * 100}ms` }}
    >
      <PricingCard plan={plan} />
    </div>
  ))}
</div>
```

---

## ⚡ Performance Tips

### **1. Use CSS Transforms**
✅ Good: `transform: translateY(-8px)`  
❌ Avoid: `top: -8px`

### **2. Limit Backdrop Filters**
- Only use on static elements
- Avoid on animated elements

### **3. Use `will-change` Sparingly**
```css
.animated-element {
  will-change: transform;
}
```
Only add during animation, remove after.

### **4. Debounce Expensive Effects**
- Tilt/magnetic effects: OK
- Don't recalculate on every pixel

### **5. Use `requestAnimationFrame`**
For JavaScript animations:
```tsx
requestAnimationFrame(() => {
  element.style.transform = `translateX(${x}px)`;
});
```

---

## 🎭 Animation Timing

### **Micro-interactions (< 300ms)**
- Button press: **100ms**
- Icon bounce: **300ms**
- Badge scale: **300ms**

### **Standard interactions (300-500ms)**
- Card hover: **300ms**
- Hover effects: **300ms**
- Page transitions: **300ms**

### **Smooth effects (500ms-1s)**
- Number counters: **800ms-1s**
- Progress bars: **1s**
- Scroll reveals: **600ms**

### **Ambient (> 1s)**
- Pulse animations: **2s infinite**
- Shimmer loading: **1.5s infinite**
- Gradient flow: **3s infinite**

---

## 🎨 Easing Functions

```css
/* Fast start, slow end (most common) */
ease-out: cubic-bezier(0.4, 0, 0.2, 1)

/* Bouncy (for attention) */
bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55)

/* Elastic (playful) */
elastic: cubic-bezier(0.68, -0.55, 0.265, 1.55)

/* Smooth (general purpose) */
ease: cubic-bezier(0.4, 0, 0.2, 1)
```

---

## 📦 Import Guide

### **1. CSS Animations**
```tsx
// Add to layout or page
import '@/lib/animations/micro-animations.css';
```

### **2. React Components**
```tsx
import { ButtonAnimated } from '@/components/ui/button-animated';
import { CardAnimated } from '@/components/ui/card-animated';
import { CounterAnimated } from '@/components/ui/counter-animated';
import { SkeletonAnimated } from '@/components/ui/skeleton-animated';
import { IconAnimated, HoverBounceIcon, PopIcon } from '@/components/ui/icon-animated';
import { PageTransition, ScrollReveal } from '@/components/ui/page-transition';
```

### **3. Enhanced Components**
```tsx
import { PricingTableMicro } from '@/components/billing/PricingTable.micro';
```

---

## 🎯 Best Practices

### **1. Be Purposeful**
- Every animation should have a reason
- Don't animate just because you can

### **2. Respect Motion Preferences**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### **3. Test on Low-End Devices**
- Animations should not cause jank
- 60fps minimum

### **4. Progressive Enhancement**
- Core functionality works without animations
- Animations enhance, not replace

### **5. Consistency**
- Use same durations for similar actions
- Maintain easing consistency

---

## 🚀 Quick Start

1. **Add CSS file:**
   ```tsx
   // app/layout.tsx
   import '@/lib/animations/micro-animations.css';
   ```

2. **Replace components:**
   ```tsx
   // Before
   <Button>Click</Button>
   
   // After
   <ButtonAnimated ripple magnetic>Click</ButtonAnimated>
   ```

3. **Add to existing components:**
   ```tsx
   <div className="card-lift hover-glow">
     {/* Content */}
   </div>
   ```

---

## 📊 Animation Inventory

| Category | Animations | Duration | Trigger |
|----------|-----------|----------|---------|
| **Buttons** | press, ripple, shine, magnetic | 100-600ms | click/hover |
| **Cards** | tilt, lift, glow | 300ms | hover |
| **Numbers** | count-up, flash, increment | 400-1000ms | value change |
| **Icons** | bounce, spin, pulse, wiggle, shake, pop | 300-1000ms | hover/always/once |
| **Loading** | shimmer, pulse, dots | 1.5s infinite | always |
| **Progress** | fill, shimmer | 1-2s | value change |
| **Badges** | scale-in, attention | 300-800ms | mount/always |
| **Text** | reveal, gradient-flow | 600ms-3s | scroll/always |
| **Hover** | underline, scale, rotate, glow | 200-300ms | hover |
| **Page** | fade, slide, scale, blur | 300ms | route change |

---

**Result:** A cohesive, polished, and delightful user experience that feels premium and professional! 🎉
