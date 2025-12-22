# 📱 Responsive Design System - Mobile First

## Breakpoint System

```css
:root {
  --breakpoint-xs: 320px;   /* Small phones */
  --breakpoint-sm: 640px;   /* Large phones */
  --breakpoint-md: 768px;   /* Tablets */
  --breakpoint-lg: 1024px;  /* Desktop */
  --breakpoint-xl: 1280px;  /* Large desktop */
  --breakpoint-2xl: 1536px; /* Ultra-wide */
}

/* Mobile First approach */
/* Base styles = Mobile (320px+) */

/* Tablet and up */
@media (min-width: 768px) { /* md */ }

/* Desktop and up */
@media (min-width: 1024px) { /* lg */ }

/* Large desktop and up */
@media (min-width: 1280px) { /* xl */ }
```

---

## Hero Section - Responsive Layouts

### Mobile (320px - 767px)

```css
.hero-section {
  padding: 2rem 1rem;
  min-height: auto;
}

.hero-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.hero-content {
  order: 1;
  text-align: center;
  padding: 0;
}

.hero-headline {
  font-size: 2rem;        /* 32px - scaled down from 72px */
  line-height: 1.2;
  margin-bottom: 1rem;
}

.hero-subheadline {
  font-size: 1rem;        /* 16px - scaled down from 24px */
  margin-bottom: 1.5rem;
}

.hero-benefits {
  text-align: left;
  margin-bottom: 2rem;
}

.hero-benefit-item {
  font-size: 0.875rem;    /* 14px */
  padding: 0.5rem 0;
}

.hero-cta-primary {
  width: 100%;
  padding: 1rem 1.5rem;
  font-size: 1rem;        /* 16px */
  justify-content: center;
}

.hero-visual {
  order: 2;
  width: 100%;
  height: 300px;
}

.trust-signals {
  flex-direction: column;
  gap: 1rem;
  text-align: center;
}

.hero-social-proof {
  margin-top: 2rem;
}

.customer-logos {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  padding: 1.5rem 0;
}
```

### Tablet (768px - 1023px)

```css
@media (min-width: 768px) {
  .hero-section {
    padding: 4rem 2rem;
  }

  .hero-container {
    gap: 3rem;
  }

  .hero-headline {
    font-size: 3rem;      /* 48px */
  }

  .hero-subheadline {
    font-size: 1.25rem;   /* 20px */
  }

  .hero-cta-primary {
    width: auto;
    padding: 1rem 2rem;
  }

  .hero-visual {
    height: 400px;
  }

  .trust-signals {
    flex-direction: row;
    justify-content: center;
  }

  .customer-logos {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

### Desktop (1024px+)

```css
@media (min-width: 1024px) {
  .hero-section {
    padding: 6rem 2rem;
    min-height: 90vh;
  }

  .hero-container {
    flex-direction: row;
    align-items: center;
    gap: 4rem;
    max-width: 1440px;
    margin: 0 auto;
  }

  .hero-content {
    flex: 1 1 55%;
    text-align: left;
    order: 1;
  }

  .hero-visual {
    flex: 1 1 45%;
    order: 2;
    height: 500px;
  }

  .hero-headline {
    font-size: 4.5rem;    /* 72px - full size */
  }

  .hero-subheadline {
    font-size: 1.5rem;    /* 24px */
  }

  .customer-logos {
    grid-template-columns: repeat(6, 1fr);
  }
}
```

---

## Navigation - Responsive Behavior

### Mobile Navigation

```css
/* Mobile hamburger menu */
.navbar {
  padding: 1rem;
}

.navbar-container {
  position: relative;
}

.navbar-logo {
  font-size: 1.125rem;
}

.navbar-links {
  position: fixed;
  top: 0;
  right: -100%;
  width: 80%;
  max-width: 320px;
  height: 100vh;
  background: white;
  flex-direction: column;
  align-items: flex-start;
  padding: 6rem 2rem 2rem;
  gap: 2rem;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15);
  transition: right 0.3s ease;
  z-index: var(--z-modal);
}

.navbar-links.open {
  right: 0;
}

.navbar-link {
  font-size: 1.125rem;
  width: 100%;
  padding: 0.5rem 0;
}

.navbar-actions {
  flex-direction: column;
  width: 100%;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-nav-login,
.btn-nav-cta {
  width: 100%;
  text-align: center;
}

/* Hamburger button */
.hamburger {
  display: block;
  width: 28px;
  height: 24px;
  position: relative;
  cursor: pointer;
  z-index: calc(var(--z-modal) + 1);
}

.hamburger span {
  display: block;
  position: absolute;
  height: 3px;
  width: 100%;
  background: #0A1F44;
  border-radius: 3px;
  opacity: 1;
  left: 0;
  transition: 0.25s ease-in-out;
}

.hamburger span:nth-child(1) {
  top: 0;
}

.hamburger span:nth-child(2) {
  top: 10px;
}

.hamburger span:nth-child(3) {
  top: 20px;
}

/* Animated hamburger to X */
.hamburger.open span:nth-child(1) {
  top: 10px;
  transform: rotate(135deg);
}

.hamburger.open span:nth-child(2) {
  opacity: 0;
  left: -60px;
}

.hamburger.open span:nth-child(3) {
  top: 10px;
  transform: rotate(-135deg);
}

/* Overlay */
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: calc(var(--z-modal) - 1);
}

.mobile-menu-overlay.open {
  opacity: 1;
  visibility: visible;
}

/* Desktop navigation */
@media (min-width: 1024px) {
  .hamburger {
    display: none;
  }

  .navbar-links {
    position: static;
    flex-direction: row;
    width: auto;
    height: auto;
    background: transparent;
    padding: 0;
    box-shadow: none;
    gap: 2rem;
  }

  .navbar-actions {
    flex-direction: row;
    width: auto;
    margin-top: 0;
  }

  .btn-nav-login,
  .btn-nav-cta {
    width: auto;
  }

  .mobile-menu-overlay {
    display: none;
  }
}
```

---

## Grid Layouts - Responsive

### Feature Grid

```css
.feature-grid {
  display: grid;
  gap: 1.5rem;
  padding: 0 1rem;
}

/* Mobile: 1 column */
.feature-grid {
  grid-template-columns: 1fr;
}

/* Tablet: 2 columns */
@media (min-width: 768px) {
  .feature-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    padding: 0 2rem;
  }
}

/* Desktop: 3 columns */
@media (min-width: 1024px) {
  .feature-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 2.5rem;
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

### Pricing Grid

```css
.pricing-grid {
  display: grid;
  gap: 2rem;
  padding: 0 1rem;
}

/* Mobile: Stack vertically */
.pricing-grid {
  grid-template-columns: 1fr;
}

/* Tablet: 2 columns, 3rd wraps */
@media (min-width: 768px) {
  .pricing-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop: 3 columns */
@media (min-width: 1024px) {
  .pricing-grid {
    grid-template-columns: repeat(3, 1fr);
    max-width: 1200px;
    margin: 0 auto;
  }
}

/* Large Desktop: Add spacing */
@media (min-width: 1280px) {
  .pricing-grid {
    gap: 3rem;
  }
}
```

---

## Typography - Responsive Scaling

### Fluid Typography

```css
/* Clamp for smooth scaling between breakpoints */
.hero-headline {
  font-size: clamp(2rem, 5vw + 1rem, 4.5rem);
  /* Min: 32px, Preferred: 5vw + 16px, Max: 72px */
}

.hero-subheadline {
  font-size: clamp(1rem, 2vw + 0.5rem, 1.5rem);
  /* Min: 16px, Preferred: 2vw + 8px, Max: 24px */
}

.section-heading {
  font-size: clamp(1.75rem, 3vw + 0.5rem, 3rem);
  /* Min: 28px, Preferred: 3vw + 8px, Max: 48px */
}

.body-text {
  font-size: clamp(0.875rem, 1vw + 0.5rem, 1.125rem);
  /* Min: 14px, Preferred: 1vw + 8px, Max: 18px */
}
```

---

## Spacing - Responsive Padding/Margin

```css
.section {
  padding: 3rem 1rem;
}

@media (min-width: 768px) {
  .section {
    padding: 5rem 2rem;
  }
}

@media (min-width: 1024px) {
  .section {
    padding: 8rem 3rem;
  }
}

/* Container max-width */
.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 768px) {
  .container {
    max-width: 768px;
    padding: 0 2rem;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
  }
}

@media (min-width: 1280px) {
  .container {
    max-width: 1200px;
  }
}
```

---

## Touch-Friendly Interactions

### Minimum Touch Targets

```css
/* Ensure all interactive elements are at least 44x44px */
.btn,
.navbar-link,
.touch-target {
  min-height: 44px;
  min-width: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Increase spacing between touch targets */
@media (max-width: 767px) {
  .button-group {
    gap: 1rem;
  }
  
  .navbar-link {
    padding: 1rem 0;
  }
}
```

### Remove Hover States on Touch Devices

```css
@media (hover: none) and (pointer: coarse) {
  /* Remove hover effects on touch devices */
  .card:hover {
    transform: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
  
  /* Use tap animations instead */
  .card:active {
    transform: scale(0.98);
  }
}
```

---

## Mobile-Specific Optimizations

### Sticky CTA Bar (Mobile)

```css
.sticky-cta-mobile {
  display: none;
}

@media (max-width: 767px) {
  .sticky-cta-mobile {
    display: block;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    padding: 1rem;
    box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.1);
    z-index: var(--z-sticky);
    transform: translateY(100%);
    transition: transform 0.3s ease;
  }
  
  .sticky-cta-mobile.visible {
    transform: translateY(0);
  }
  
  .sticky-cta-mobile .btn {
    width: 100%;
    font-size: 1rem;
    padding: 1rem;
  }
}
```

### Mobile-First Forms

```css
.form-field {
  margin-bottom: 1rem;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 0.875rem 1rem;
  font-size: 16px; /* Prevents zoom on iOS */
  border-radius: 0.5rem;
  border: 2px solid #E5E7EB;
  transition: border-color 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #06B6D4;
}

/* Tablet and up: Multi-column forms */
@media (min-width: 768px) {
  .form-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}
```

---

## Comparison Table - Mobile Layout

```css
.comparison-container {
  display: grid;
  gap: 2rem;
  padding: 0 1rem;
}

/* Mobile: Stack vertically */
.comparison-container {
  grid-template-columns: 1fr;
}

.comparison-old,
.comparison-new {
  padding: 2rem;
}

/* Tablet and up: Side by side */
@media (min-width: 768px) {
  .comparison-container {
    grid-template-columns: 1fr 1fr;
    padding: 0 2rem;
  }
}

@media (min-width: 1024px) {
  .comparison-old,
  .comparison-new {
    padding: 3rem;
  }
}
```

---

## Testimonials - Mobile Carousel

```css
.testimonials-container {
  padding: 0 1rem;
}

/* Mobile: Horizontal scroll carousel */
@media (max-width: 767px) {
  .testimonials-grid {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 1rem;
    padding-bottom: 1rem;
    -webkit-overflow-scrolling: touch;
  }
  
  .testimonial-card {
    flex: 0 0 90%;
    scroll-snap-align: center;
  }
  
  /* Hide scrollbar but keep functionality */
  .testimonials-grid::-webkit-scrollbar {
    display: none;
  }
  
  .testimonials-grid {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  /* Dots indicator */
  .testimonial-dots {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 1rem;
  }
  
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #D1D5DB;
    transition: all 0.3s ease;
  }
  
  .dot.active {
    background: #06B6D4;
    width: 24px;
    border-radius: 4px;
  }
}

/* Tablet and up: Grid layout */
@media (min-width: 768px) {
  .testimonials-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
}

@media (min-width: 1024px) {
  .testimonials-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

## Performance Optimizations

### Image Responsive Loading

```html
<picture>
  <source 
    media="(min-width: 1024px)" 
    srcset="hero-desktop.webp"
    type="image/webp"
  >
  <source 
    media="(min-width: 768px)" 
    srcset="hero-tablet.webp"
    type="image/webp"
  >
  <source 
    srcset="hero-mobile.webp"
    type="image/webp"
  >
  <img 
    src="hero-mobile.jpg" 
    alt="AI Call Center"
    loading="lazy"
    width="800"
    height="600"
  >
</picture>
```

### Critical CSS for Mobile

```css
/* Inline critical CSS for above-the-fold mobile */
/* Keep under 14KB for first render */

/* Base reset */
* { margin: 0; padding: 0; box-sizing: border-box; }

/* Critical hero styles */
.hero-section { 
  padding: 2rem 1rem; 
  background: #FFFFFF;
}

.hero-headline { 
  font-size: 2rem; 
  font-weight: 800; 
  color: #0A1F44; 
  margin-bottom: 1rem; 
}

.btn-cta-primary { 
  background: linear-gradient(135deg, #06B6D4, #0891B2); 
  color: white; 
  padding: 1rem; 
  border-radius: 0.75rem; 
  width: 100%; 
  border: none; 
  font-size: 1rem; 
  font-weight: 600; 
}
```

---
