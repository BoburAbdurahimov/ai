# 🎨 Premium UI Components for Landing Page

## Navigation Bar

### Desktop Navigation (Sticky)

```css
.navbar {
  position: sticky;
  top: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  padding: 1rem 2rem;
  z-index: var(--z-sticky);
  transition: all 0.3s ease;
}

.navbar-scrolled {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  padding: 0.75rem 2rem;
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1440px;
  margin: 0 auto;
}

.navbar-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #0A1F44;
  text-decoration: none;
}

.navbar-links {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.navbar-link {
  color: #374151;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s ease;
  position: relative;
}

.navbar-link:hover {
  color: #0A1F44;
}

/* Underline animation */
.navbar-link::after {
  content: "";
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #06B6D4, #0891B2);
  transition: width 0.3s ease;
}

.navbar-link:hover::after {
  width: 100%;
}

.navbar-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.navbar-lang-switcher {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #F3F4F6;
  border-radius: 0.5rem;
}

.lang-option {
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  background: transparent;
  color: #6B7280;
}

.lang-option.active {
  background: white;
  color: #0A1F44;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.btn-nav-login {
  padding: 0.5rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 600;
  border: 1px solid #D1D5DB;
  background: white;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-nav-login:hover {
  border-color: #06B6D4;
  color: #06B6D4;
}

.btn-nav-cta {
  padding: 0.5rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 600;
  border: none;
  background: linear-gradient(135deg, #06B6D4, #0891B2);
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(6, 182, 212, 0.25);
}

.btn-nav-cta:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(6, 182, 212, 0.35);
}
```

---

## Primary CTA Button System

### Large Hero CTA

```css
.btn-cta-hero {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 3rem;
  font-size: 1.25rem;
  font-weight: 600;
  border-radius: 1rem;
  border: none;
  background: linear-gradient(135deg, #06B6D4 0%, #0891B2 100%);
  color: white;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Glow effect */
  box-shadow: 
    0 4px 16px rgba(6, 182, 212, 0.3),
    0 0 0 2px rgba(6, 182, 212, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

/* Shine animation overlay */
.btn-cta-hero::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg, 
    transparent, 
    rgba(255, 255, 255, 0.3), 
    transparent
  );
  transition: left 0.5s ease;
}

.btn-cta-hero:hover::before {
  left: 100%;
}

.btn-cta-hero:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 8px 24px rgba(6, 182, 212, 0.4),
    0 0 0 3px rgba(6, 182, 212, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.btn-cta-hero:active {
  transform: translateY(0);
}

/* Icon animation */
.btn-cta-hero svg {
  transition: transform 0.3s ease;
}

.btn-cta-hero:hover svg {
  transform: translateX(4px);
}
```

### Secondary CTA Button

```css
.btn-cta-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0.75rem;
  border: 2px solid #06B6D4;
  background: white;
  color: #06B6D4;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cta-secondary:hover {
  background: #06B6D4;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(6, 182, 212, 0.25);
}
```

### Ghost CTA Button

```css
.btn-cta-ghost {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0.5rem;
  border: none;
  background: transparent;
  color: #06B6D4;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cta-ghost:hover {
  background: rgba(6, 182, 212, 0.1);
}
```

---

## Feature Cards

### Icon Feature Card

```css
.feature-card {
  background: white;
  border-radius: 1.5rem;
  padding: 2.5rem;
  border: 1px solid rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

/* Gradient background on hover */
.feature-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #06B6D4, #10B981);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.feature-card:hover::before {
  transform: scaleX(1);
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  border-color: rgba(6, 182, 212, 0.2);
}

.feature-icon {
  width: 64px;
  height: 64px;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #06B6D4, #0891B2);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
  transition: all 0.3s ease;
}

.feature-card:hover .feature-icon {
  transform: scale(1.1) rotate(5deg);
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0A1F44;
  margin-bottom: 1rem;
}

.feature-description {
  color: #6B7280;
  line-height: 1.6;
  font-size: 1rem;
}
```

---

## Pricing Cards

### Premium Pricing Card

```css
.pricing-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.pricing-card {
  background: white;
  border-radius: 1.5rem;
  padding: 3rem;
  border: 2px solid #E5E7EB;
  position: relative;
  transition: all 0.3s ease;
}

.pricing-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.12);
}

/* Popular badge */
.pricing-card.popular {
  border-color: #06B6D4;
  background: linear-gradient(145deg, #FFFFFF 0%, #F0FDFF 100%);
}

.pricing-card.popular::before {
  content: "ПОПУЛЯРНО 🔥";
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #06B6D4, #0891B2);
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 2rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  box-shadow: 0 4px 12px rgba(6, 182, 212, 0.4);
}

.pricing-plan-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #6B7280;
  margin-bottom: 1rem;
}

.pricing-price {
  font-size: 3rem;
  font-weight: 800;
  color: #0A1F44;
  margin-bottom: 0.5rem;
}

.pricing-price-currency {
  font-size: 1.5rem;
  color: #6B7280;
}

.pricing-period {
  color: #9CA3AF;
  font-size: 1rem;
  margin-bottom: 2rem;
}

.pricing-features {
  list-style: none;
  padding: 0;
  margin-bottom: 2rem;
}

.pricing-feature {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem 0;
  color: #374151;
}

.pricing-feature-icon {
  color: #10B981;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.pricing-cta {
  width: 100%;
  padding: 1rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.pricing-card:not(.popular) .pricing-cta {
  background: white;
  color: #06B6D4;
  border: 2px solid #06B6D4;
}

.pricing-card:not(.popular) .pricing-cta:hover {
  background: #06B6D4;
  color: white;
}

.pricing-card.popular .pricing-cta {
  background: linear-gradient(135deg, #06B6D4, #0891B2);
  color: white;
  box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
}

.pricing-card.popular .pricing-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(6, 182, 212, 0.4);
}
```

---

## Testimonial Cards

```css
.testimonial-card {
  background: white;
  border-radius: 1.5rem;
  padding: 2.5rem;
  border: 1px solid #E5E7EB;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

.testimonial-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}

.testimonial-quote {
  font-size: 1.125rem;
  line-height: 1.7;
  color: #1F2937;
  margin-bottom: 2rem;
  position: relative;
  padding-left: 1.5rem;
}

/* Quote mark */
.testimonial-quote::before {
  content: '"';
  position: absolute;
  left: 0;
  top: -0.5rem;
  font-size: 4rem;
  color: #06B6D4;
  opacity: 0.2;
  font-family: Georgia, serif;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.testimonial-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #E5E7EB;
}

.testimonial-info {
  flex: 1;
}

.testimonial-name {
  font-weight: 700;
  color: #0A1F44;
  margin-bottom: 0.25rem;
}

.testimonial-role {
  color: #6B7280;
  font-size: 0.875rem;
}

.testimonial-rating {
  color: #F59E0B;
  font-size: 1.125rem;
}
```

---
