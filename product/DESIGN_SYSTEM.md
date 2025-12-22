# Design System - AI Call Center SaaS

Complete design specification for consistent UI/UX across the platform.

---

## 🎨 Color Palette

### Primary Colors

```css
--primary-900: #0C1E3D;  /* Darkest - headers, emphasis */
--primary-800: #1E3A8A;  /* Deep Blue - main brand */
--primary-700: #1E40AF;
--primary-600: #2563EB;  /* Default buttons, links */
--primary-500: #3B82F6;
--primary-400: #60A5FA;
--primary-300: #93C5FD;  /* Hover states */
--primary-200: #BFDBFE;  /* Backgrounds */
--primary-100: #DBEAFE;
--primary-50:  #EFF6FF;  /* Lightest - subtle backgrounds */
```

### Accent Colors (Uzbek Turquoise)

```css
--accent-900: #164E63;
--accent-800: #155E75;
--accent-700: #0E7490;
--accent-600: #0891B2;
--accent-500: #06B6D4;  /* Main accent - CTAs, highlights */
--accent-400: #22D3EE;
--accent-300: #67E8F9;
--accent-200: #A5F3FC;
--accent-100: #CFFAFE;
--accent-50:  #ECFEFF;
```

### Semantic Colors

```css
/* Success - Green */
--success-700: #15803D;
--success-600: #16A34A;
--success-500: #22C55E;  /* Default success */
--success-100: #DCFCE7;

/* Warning - Yellow/Amber */
--warning-700: #B45309;
--warning-600: #D97706;
--warning-500: #F59E0B;  /* Default warning */
--warning-100: #FEF3C7;

/* Error - Red */
--error-700: #B91C1C;
--error-600: #DC2626;
--error-500: #EF4444;  /* Default error */
--error-100: #FEE2E2;

/* Info - Blue */
--info-600: #2563EB;
--info-500: #3B82F6;
--info-100: #DBEAFE;
```

### Neutral Colors (Grayscale)

```css
--gray-900: #111827;  /* Text primary */
--gray-800: #1F2937;  /* Text secondary */
--gray-700: #374151;
--gray-600: #4B5563;  /* Text tertiary */
--gray-500: #6B7280;  /* Placeholders */
--gray-400: #9CA3AF;  /* Borders */
--gray-300: #D1D5DB;  /* Dividers */
--gray-200: #E5E7EB;  /* Backgrounds */
--gray-100: #F3F4F6;  /* Subtle backgrounds */
--gray-50:  #F9FAFB;  /* Page background */
--white:    #FFFFFF;
--black:    #000000;
```

### Usage Guidelines

**Text on Dark Backgrounds:**
- Primary text: `--white` or `--gray-50`
- Secondary text: `--gray-300`

**Text on Light Backgrounds:**
- Primary text: `--gray-900`
- Secondary text: `--gray-600`
- Tertiary text: `--gray-500`

**Backgrounds:**
- Page: `--gray-50`
- Card: `--white`
- Hover: `--gray-100`
- Active: `--primary-50`

---

## 📐 Typography

### Font Families

```css
/* For Latin text */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* For Cyrillic (Russian/Uzbek) - better readability */
--font-cyrillic: 'Onest', 'Inter', sans-serif;

/* Monospace for code/data */
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Type Scale

```css
/* Display - Large headings */
--text-display-2xl: 4.5rem;    /* 72px */
--text-display-xl:  3.75rem;   /* 60px */
--text-display-lg:  3rem;      /* 48px */

/* Heading */
--text-h1: 2.25rem;  /* 36px */
--text-h2: 1.875rem; /* 30px */
--text-h3: 1.5rem;   /* 24px */
--text-h4: 1.25rem;  /* 20px */
--text-h5: 1.125rem; /* 18px */
--text-h6: 1rem;     /* 16px */

/* Body */
--text-xl:  1.25rem;  /* 20px */
--text-lg:  1.125rem; /* 18px */
--text-base: 1rem;    /* 16px - default */
--text-sm:  0.875rem; /* 14px */
--text-xs:  0.75rem;  /* 12px */
```

### Font Weights

```css
--font-thin:       100;
--font-extralight: 200;
--font-light:      300;
--font-normal:     400;  /* Body text */
--font-medium:     500;  /* Subtle emphasis */
--font-semibold:   600;  /* Buttons, labels */
--font-bold:       700;  /* Headings */
--font-extrabold:  800;
--font-black:      900;
```

### Line Heights

```css
--leading-none:   1;
--leading-tight:  1.25;  /* Headings */
--leading-snug:   1.375;
--leading-normal: 1.5;   /* Body text */
--leading-relaxed: 1.625;
--leading-loose:  2;     /* Spaced content */
```

### Letter Spacing

```css
--tracking-tighter: -0.05em;
--tracking-tight:   -0.025em;
--tracking-normal:   0;      /* Default */
--tracking-wide:     0.025em;
--tracking-wider:    0.05em;
--tracking-widest:   0.1em;  /* All caps */
```

### Usage Examples

```css
/* Page Title */
.page-title {
  font-size: var(--text-h1);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  color: var(--gray-900);
}

/* Section Heading */
.section-heading {
  font-size: var(--text-h3);
  font-weight: var(--font-semibold);
  line-height: var(--leading-snug);
  color: var(--gray-800);
}

/* Body Text */
.body {
  font-size: var(--text-base);
  font-weight: var(--font-normal);
  line-height: var(--leading-normal);
  color: var(--gray-700);
}

/* Small Label */
.label-sm {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  line-height: var(--leading-tight);
  color: var(--gray-600);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
}
```

---

## 📏 Spacing System

### Base Unit: 4px (0.25rem)

```css
--space-0:   0;
--space-1:   0.25rem;  /* 4px */
--space-2:   0.5rem;   /* 8px */
--space-3:   0.75rem;  /* 12px */
--space-4:   1rem;     /* 16px */
--space-5:   1.25rem;  /* 20px */
--space-6:   1.5rem;   /* 24px */
--space-8:   2rem;     /* 32px */
--space-10:  2.5rem;   /* 40px */
--space-12:  3rem;     /* 48px */
--space-16:  4rem;     /* 64px */
--space-20:  5rem;     /* 80px */
--space-24:  6rem;     /* 96px */
```

### Usage Guidelines

**Component Padding:**
- Tight: `--space-2` (8px)
- Normal: `--space-4` (16px)
- Comfortable: `--space-6` (24px)

**Component Margins:**
- Inline elements: `--space-2` (8px)
- Stacked elements: `--space-4` (16px)
- Section separation: `--space-8` to `--space-12`

**Page Layout:**
- Container padding: `--space-6` to `--space-8`
- Section spacing: `--space-12` to `--space-16`

---

## 🔘 Button Components

### Button Variants

#### Primary Button
```css
.btn-primary {
  background: var(--primary-600);
  color: var(--white);
  border: none;
  padding: 0.625rem 1.25rem; /* 10px 20px */
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: var(--primary-700);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.btn-primary:active {
  background: var(--primary-800);
  transform: translateY(0);
}

.btn-primary:disabled {
  background: var(--gray-300);
  cursor: not-allowed;
  opacity: 0.6;
}
```

#### Secondary Button
```css
.btn-secondary {
  background: var(--white);
  color: var(--primary-600);
  border: 1px solid var(--primary-600);
  padding: 0.625rem 1.25rem;
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: var(--primary-50);
  border-color: var(--primary-700);
}
```

#### Accent Button (CTA)
```css
.btn-accent {
  background: var(--accent-500);
  color: var(--white);
  border: none;
  padding: 0.625rem 1.25rem;
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.btn-accent:hover {
  background: var(--accent-600);
  box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
}
```

#### Danger Button
```css
.btn-danger {
  background: var(--error-500);
  color: var(--white);
  /* ... similar structure */
}
```

#### Ghost Button (Minimal)
```css
.btn-ghost {
  background: transparent;
  color: var(--gray-700);
  border: none;
  padding: 0.625rem 1.25rem;
}

.btn-ghost:hover {
  background: var(--gray-100);
}
```

### Button Sizes

```css
.btn-xs {
  padding: 0.375rem 0.75rem;  /* 6px 12px */
  font-size: var(--text-xs);
}

.btn-sm {
  padding: 0.5rem 1rem;       /* 8px 16px */
  font-size: var(--text-sm);
}

.btn-md {
  padding: 0.625rem 1.25rem;  /* 10px 20px */
  font-size: var(--text-base);
}

.btn-lg {
  padding: 0.75rem 1.5rem;    /* 12px 24px */
  font-size: var(--text-lg);
}

.btn-xl {
  padding: 1rem 2rem;         /* 16px 32px */
  font-size: var(--text-xl);
}
```

### Button States

```html
<!-- Loading State -->
<button class="btn-primary">
  <span class="spinner"></span>
  Loading...
</button>

<!-- Icon Button -->
<button class="btn-primary">
  <svg>...</svg>
  Save Changes
</button>

<!-- Icon Only -->
<button class="btn-icon">
  <svg>...</svg>
</button>
```

---

## 📦 Card Components

### Basic Card

```css
.card {
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: 0.75rem;  /* 12px */
  padding: var(--space-6);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.card-header {
  border-bottom: 1px solid var(--gray-200);
  padding-bottom: var(--space-4);
  margin-bottom: var(--space-4);
}

.card-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--gray-900);
}

.card-body {
  /* Main content area */
}

.card-footer {
  border-top: 1px solid var(--gray-200);
  padding-top: var(--space-4);
  margin-top: var(--space-4);
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
}
```

### Stat Card

```html
<div class="stat-card">
  <div class="stat-icon">
    <svg>📞</svg>
  </div>
  <div class="stat-content">
    <p class="stat-label">Total Calls</p>
    <h3 class="stat-value">1,247</h3>
    <p class="stat-change positive">
      <svg>↑</svg> +12% from last month
    </p>
  </div>
</div>
```

```css
.stat-card {
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: 0.75rem;
  padding: var(--space-6);
  display: flex;
  gap: var(--space-4);
}

.stat-icon {
  width: 48px;
  height: 48px;
  background: var(--primary-100);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-label {
  font-size: var(--text-sm);
  color: var(--gray-600);
  margin-bottom: var(--space-1);
}

.stat-value {
  font-size: var(--text-h2);
  font-weight: var(--font-bold);
  color: var(--gray-900);
  margin-bottom: var(--space-2);
}

.stat-change {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.stat-change.positive {
  color: var(--success-600);
}

.stat-change.negative {
  color: var(--error-600);
}
```

---

## 📝 Form Components

### Input Field

```html
<div class="form-group">
  <label class="form-label" for="email">
    Email Address
    <span class="required">*</span>
  </label>
  <input 
    type="email" 
    id="email" 
    class="form-input"
    placeholder="user@example.com"
  />
  <p class="form-help">We'll never share your email</p>
</div>
```

```css
.form-group {
  margin-bottom: var(--space-5);
}

.form-label {
  display: block;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--gray-700);
  margin-bottom: var(--space-2);
}

.form-label .required {
  color: var(--error-500);
}

.form-input {
  width: 100%;
  padding: 0.625rem 0.875rem;
  font-size: var(--text-base);
  border: 1px solid var(--gray-300);
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px var(--primary-100);
}

.form-input:disabled {
  background: var(--gray-100);
  cursor: not-allowed;
}

.form-input.error {
  border-color: var(--error-500);
}

.form-input.error:focus {
  box-shadow: 0 0 0 3px var(--error-100);
}

.form-help {
  font-size: var(--text-sm);
  color: var(--gray-500);
  margin-top: var(--space-2);
}

.form-error {
  font-size: var(--text-sm);
  color: var(--error-600);
  margin-top: var(--space-2);
  display: flex;
  align-items: center;
  gap: var(--space-1);
}
```

### Select Dropdown

```css
.form-select {
  width: 100%;
  padding: 0.625rem 2.5rem 0.625rem 0.875rem;
  font-size: var(--text-base);
  border: 1px solid var(--gray-300);
  border-radius: 0.5rem;
  background: var(--white);
  background-image: url('data:image/svg+xml...');  /* Chevron icon */
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  appearance: none;
}
```

### Checkbox & Radio

```css
.form-checkbox {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid var(--gray-300);
  border-radius: 0.25rem;
  cursor: pointer;
}

.form-checkbox:checked {
  background: var(--primary-600);
  border-color: var(--primary-600);
}

.form-radio {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid var(--gray-300);
  border-radius: 50%;
}

.form-radio:checked {
  border-color: var(--primary-600);
  border-width: 6px;
}
```

### Toggle Switch

```css
.toggle {
  position: relative;
  width: 44px;
  height: 24px;
  background: var(--gray-300);
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.toggle.active {
  background: var(--primary-600);
}

.toggle-handle {
  position: absolute;
  width: 20px;
  height: 20px;
  background: var(--white);
  border-radius: 50%;
  top: 2px;
  left: 2px;
  transition: transform 0.2s;
}

.toggle.active .toggle-handle {
  transform: translateX(20px);
}
```

---

## 🔔 Notification Components

### Toast Notifications

```css
.toast {
  position: fixed;
  top: var(--space-6);
  right: var(--space-6);
  min-width: 320px;
  max-width: 480px;
  background: var(--white);
  border-radius: 0.75rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  padding: var(--space-4);
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  animation: slideIn 0.3s ease;
  z-index: 9999;
}

@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

.toast-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.toast.success .toast-icon {
  color: var(--success-600);
}

.toast.error .toast-icon {
  color: var(--error-600);
}

.toast.warning .toast-icon {
  color: var(--warning-600);
}

.toast.info .toast-icon {
  color: var(--info-600);
}

.toast-content {
  flex: 1;
}

.toast-title {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--gray-900);
  margin-bottom: var(--space-1);
}

.toast-message {
  font-size: var(--text-sm);
  color: var(--gray-600);
}

.toast-close {
  background: transparent;
  border: none;
  color: var(--gray-400);
  cursor: pointer;
  padding: 0;
}
```

### Alert Banners

```css
.alert {
  padding: var(--space-4);
  border-radius: 0.5rem;
  border-left: 4px solid;
  display: flex;
  gap: var(--space-3);
}

.alert-success {
  background: var(--success-100);
  border-color: var(--success-600);
  color: var(--success-700);
}

.alert-error {
  background: var(--error-100);
  border-color: var(--error-600);
  color: var(--error-700);
}

.alert-warning {
  background: var(--warning-100);
  border-color: var(--warning-600);
  color: var(--warning-700);
}

.alert-info {
  background: var(--info-100);
  border-color: var(--info-600);
  color: var(--info-700);
}
```

---

## 📊 Data Display Components

### Table

```css
.table {
  width: 100%;
  border-collapse: collapse;
}

.table thead {
  background: var(--gray-50);
  border-bottom: 2px solid var(--gray-200);
}

.table th {
  padding: var(--space-3) var(--space-4);
  text-align: left;
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--gray-700);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
}

.table td {
  padding: var(--space-4);
  border-bottom: 1px solid var(--gray-200);
  font-size: var(--text-sm);
  color: var(--gray-900);
}

.table tbody tr:hover {
  background: var(--gray-50);
}
```

### Badge

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
}

.badge-primary {
  background: var(--primary-100);
  color: var(--primary-700);
}

.badge-success {
  background: var(--success-100);
  color: var(--success-700);
}

.badge-error {
  background: var(--error-100);
  color: var(--error-700);
}

.badge-warning {
  background: var(--warning-100);
  color: var(--warning-700);
}

.badge-gray {
  background: var(--gray-200);
  color: var(--gray-700);
}
```

---

## 🎭 Animation & Transitions

```css
/* Standard transitions */
--transition-fast: 150ms ease;
--transition-base: 200ms ease;
--transition-slow: 300ms ease;

/* Easing functions */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);

/* Common animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

---

This design system provides the foundation. Next, I'll create detailed UI screen specifications!
