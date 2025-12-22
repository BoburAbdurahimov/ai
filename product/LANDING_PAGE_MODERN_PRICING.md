# 💎 Modern Pricing Section - Stripe/Vapi Style

## Ultra-Modern Pricing Design

### Pricing Toggle with Animation

```html
<section class="pricing-section-modern">
  <div class="container">
    <!-- Section header -->
    <div class="pricing-header">
      <h2 class="section-heading-modern">
        Simple, transparent pricing.
        <span class="gradient-text">No hidden fees.</span>
      </h2>
      <p class="section-subheading">
        Start free, scale as you grow. Cancel anytime.
      </p>
      
      <!-- Billing toggle -->
      <div class="billing-toggle">
        <span class="toggle-label" data-active="monthly">Monthly</span>
        <button class="toggle-switch" role="switch" aria-checked="false">
          <span class="toggle-slider"></span>
        </button>
        <span class="toggle-label" data-active="annual">
          Annual
          <span class="toggle-badge">Save 20%</span>
        </span>
      </div>
    </div>
    
    <!-- Pricing cards -->
    <div class="pricing-grid-modern">
      <!-- Starter Plan -->
      <div class="pricing-card-modern">
        <div class="pricing-card-header">
          <h3 class="plan-name">Starter</h3>
          <p class="plan-description">Perfect for testing</p>
        </div>
        
        <div class="pricing-card-price">
          <span class="price-amount" data-monthly="99" data-annual="79">$99</span>
          <span class="price-period">/month</span>
        </div>
        
        <button class="pricing-cta secondary">
          Get started
          <svg class="arrow-icon">→</svg>
        </button>
        
        <div class="pricing-features">
          <div class="feature-item">
            <svg class="check-icon">✓</svg>
            <span>500 minutes/month</span>
          </div>
          <div class="feature-item">
            <svg class="check-icon">✓</svg>
            <span>1 phone number</span>
          </div>
          <div class="feature-item">
            <svg class="check-icon">✓</svg>
            <span>Basic analytics</span>
          </div>
          <div class="feature-item">
            <svg class="check-icon">✓</svg>
            <span>Email support</span>
          </div>
        </div>
      </div>
      
      <!-- Professional Plan (Featured) -->
      <div class="pricing-card-modern featured">
        <div class="featured-badge">
          <span>Most popular</span>
        </div>
        
        <div class="pricing-card-header">
          <h3 class="plan-name">Professional</h3>
          <p class="plan-description">For growing businesses</p>
        </div>
        
        <div class="pricing-card-price">
          <span class="price-amount" data-monthly="299" data-annual="239">$299</span>
          <span class="price-period">/month</span>
        </div>
        
        <button class="pricing-cta primary">
          Start free trial
          <svg class="arrow-icon">→</svg>
        </button>
        
        <div class="pricing-features">
          <div class="feature-item">
            <svg class="check-icon">✓</svg>
            <span>2,000 minutes/month</span>
          </div>
          <div class="feature-item">
            <svg class="check-icon">✓</svg>
            <span>3 phone numbers</span>
          </div>
          <div class="feature-item">
            <svg class="check-icon">✓</svg>
            <span>Advanced analytics</span>
          </div>
          <div class="feature-item">
            <svg class="check-icon">✓</svg>
            <span>Priority support</span>
          </div>
          <div class="feature-item">
            <svg class="check-icon">✓</svg>
            <span>Custom integrations</span>
          </div>
        </div>
      </div>
      
      <!-- Business Plan -->
      <div class="pricing-card-modern">
        <div class="pricing-card-header">
          <h3 class="plan-name">Business</h3>
          <p class="plan-description">For large teams</p>
        </div>
        
        <div class="pricing-card-price">
          <span class="price-amount" data-monthly="799" data-annual="639">$799</span>
          <span class="price-period">/month</span>
        </div>
        
        <button class="pricing-cta secondary">
          Contact sales
          <svg class="arrow-icon">→</svg>
        </button>
        
        <div class="pricing-features">
          <div class="feature-item">
            <svg class="check-icon">✓</svg>
            <span>Unlimited minutes</span>
          </div>
          <div class="feature-item">
            <svg class="check-icon">✓</svg>
            <span>Unlimited numbers</span>
          </div>
          <div class="feature-item">
            <svg class="check-icon">✓</svg>
            <span>Enterprise analytics</span>
          </div>
          <div class="feature-item">
            <svg class="check-icon">✓</svg>
            <span>Dedicated support</span>
          </div>
          <div class="feature-item">
            <svg class="check-icon">✓</svg>
            <span>SLA guarantee</span>
          </div>
          <div class="feature-item">
            <svg class="check-icon">✓</svg>
            <span>Custom contract</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- FAQ below pricing -->
    <div class="pricing-faq">
      <p class="faq-title">Frequently asked questions</p>
      <div class="faq-grid">
        <div class="faq-item">
          <h4>Can I change plans later?</h4>
          <p>Yes, upgrade or downgrade anytime.</p>
        </div>
        <div class="faq-item">
          <h4>What payment methods?</h4>
          <p>Credit card, UzCard, Payme, Click.</p>
        </div>
        <div class="faq-item">
          <h4>How does billing work?</h4>
          <p>Monthly or annual, cancel anytime.</p>
        </div>
      </div>
    </div>
  </div>
</section>
```

## Modern Pricing CSS

```css
.pricing-section-modern {
  padding: 8rem 0;
  background: var(--bg-primary);
  position: relative;
  overflow: hidden;
}

/* Background gradient */
.pricing-section-modern::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 800px;
  height: 800px;
  background: radial-gradient(
    circle,
    rgba(102, 126, 234, 0.08) 0%,
    transparent 70%
  );
  pointer-events: none;
}

.pricing-header {
  text-align: center;
  margin-bottom: 4rem;
  position: relative;
  z-index: 1;
}

.section-subheading {
  font-size: var(--text-xl);
  color: var(--text-secondary);
  margin-top: 1rem;
  margin-bottom: 2rem;
}

/* Billing Toggle */
.billing-toggle {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 9999px;
  backdrop-filter: blur(12px);
}

.toggle-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-tertiary);
  cursor: pointer;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.toggle-label[data-active="true"] {
  color: var(--text-primary);
}

.toggle-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background: linear-gradient(135deg, #10B981, #059669);
  color: white;
  border-radius: 9999px;
  font-weight: 600;
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  width: 48px;
  height: 24px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.toggle-switch[aria-checked="true"] {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.toggle-slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-switch[aria-checked="true"] .toggle-slider {
  transform: translateX(24px);
}

/* Pricing Grid */
.pricing-grid-modern {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

/* Pricing Card */
.pricing-card-modern {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1.5rem;
  padding: 2.5rem;
  backdrop-filter: blur(20px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  display: flex;
  flex-direction: column;
}

.pricing-card-modern:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.12);
  transform: translateY(-8px);
}

/* Featured card */
.pricing-card-modern.featured {
  background: rgba(102, 126, 234, 0.05);
  border: 2px solid rgba(102, 126, 234, 0.3);
  transform: scale(1.05);
}

.pricing-card-modern.featured:hover {
  transform: scale(1.05) translateY(-8px);
  border-color: rgba(102, 126, 234, 0.5);
}

.featured-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.375rem 1rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* Card Header */
.pricing-card-header {
  margin-bottom: 2rem;
}

.plan-name {
  font-size: var(--text-2xl);
  font-weight: var(--weight-semibold);
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.plan-description {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
}

/* Price Display */
.pricing-card-price {
  margin-bottom: 2rem;
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.price-amount {
  font-size: var(--text-5xl);
  font-weight: var(--weight-bold);
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
  transition: all 0.3s ease;
}

.price-period {
  font-size: var(--text-lg);
  color: var(--text-tertiary);
}

/* CTA Buttons */
.pricing-cta {
  width: 100%;
  padding: 1rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border: none;
}

.pricing-cta.primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
}

.pricing-cta.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.pricing-cta.secondary {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.pricing-cta.secondary:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.2);
}

/* Features List */
.pricing-features {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9375rem;
  color: var(--text-secondary);
}

.check-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(16, 185, 129, 0.1);
  color: #10B981;
  border-radius: 50%;
  flex-shrink: 0;
  font-size: 0.75rem;
}

/* FAQ Section */
.pricing-faq {
  margin-top: 6rem;
  text-align: center;
}

.faq-title {
  font-size: var(--text-xl);
  font-weight: var(--weight-semibold);
  color: var(--text-primary);
  margin-bottom: 2rem;
}

.faq-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.faq-item h4 {
  font-size: var(--text-base);
  font-weight: var(--weight-semibold);
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.faq-item p {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

/* Price Animation on Toggle */
@keyframes price-change {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.price-amount.updating {
  animation: price-change 0.3s ease;
}
```

## Toggle JavaScript

```javascript
// Pricing toggle functionality
const toggle = document.querySelector('.toggle-switch');
const priceAmounts = document.querySelectorAll('.price-amount');
const monthlyLabel = document.querySelector('[data-active="monthly"]');
const annualLabel = document.querySelector('[data-active="annual"]');

toggle.addEventListener('click', () => {
  const isAnnual = toggle.getAttribute('aria-checked') === 'true';
  
  // Toggle state
  toggle.setAttribute('aria-checked', !isAnnual);
  
  // Update labels
  monthlyLabel.setAttribute('data-active', isAnnual);
  annualLabel.setAttribute('data-active', !isAnnual);
  
  // Animate price change
  priceAmounts.forEach(price => {
    price.classList.add('updating');
    
    const monthly = price.dataset.monthly;
    const annual = price.dataset.annual;
    
    setTimeout(() => {
      price.textContent = isAnnual ? `$${monthly}` : `$${annual}`;
      price.classList.remove('updating');
    }, 150);
  });
});
```

---
