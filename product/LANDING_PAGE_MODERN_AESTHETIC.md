# 🎨 Ultra-Modern AI SaaS Landing Page Design
## Stripe × Linear × Vapi Aesthetic

**Inspiration:** Stripe's clarity + Linear's elegance + Vapi's AI-first design  
**Vibe:** Minimal, Fast, Confident, Technical Excellence  
**Target:** Tech-savvy decision makers who appreciate good design

---

## 🎯 Modern Design Principles

### 1. **Confident Minimalism**
- Generous whitespace (not cluttered)
- Every element has purpose
- "Less is more" execution
- Let content breathe

### 2. **Technical Sophistication**
- Subtle grid systems visible
- Code-inspired UI elements
- Terminal/API aesthetics
- Developer-friendly feel

### 3. **Motion with Purpose**
- Smooth, fast transitions (not flashy)
- Physics-based animations
- Scroll-driven effects
- Ambient background motion

### 4. **Depth through Layers**
- Glassmorphism (frosted glass effects)
- Elevated cards with shadows
- Overlapping elements
- Z-axis depth perception

### 5. **Premium Color Science**
- Gradient meshes (not linear)
- Sophisticated neutrals
- Subtle color shifts
- Dark mode first thinking

---

## 🌈 Ultra-Modern Color System

### Base Palette - Sophisticated Neutrals

```css
/* Stripe-inspired grays */
--gray-50:  #FAFAFA;
--gray-100: #F5F5F5;
--gray-200: #E5E5E5;
--gray-300: #D4D4D4;
--gray-400: #A3A3A3;
--gray-500: #737373;
--gray-600: #525252;
--gray-700: #404040;
--gray-800: #262626;
--gray-900: #171717;
--gray-950: #0A0A0A;

/* True black (sparingly) */
--black: #000000;
--white: #FFFFFF;
```

### Accent Colors - Tech-Forward

```css
/* Primary - Electric Blue (AI/Tech) */
--primary-50:  #EFF6FF;
--primary-100: #DBEAFE;
--primary-200: #BFDBFE;
--primary-300: #93C5FD;
--primary-400: #60A5FA;
--primary-500: #3B82F6;  /* Main */
--primary-600: #2563EB;
--primary-700: #1D4ED8;
--primary-800: #1E40AF;
--primary-900: #1E3A8A;

/* Secondary - Cyber Cyan (Modern AI) */
--cyan-50:  #ECFEFF;
--cyan-100: #CFFAFE;
--cyan-200: #A5F3FC;
--cyan-300: #67E8F9;
--cyan-400: #22D3EE;
--cyan-500: #06B6D4;  /* Main */
--cyan-600: #0891B2;
--cyan-700: #0E7490;
--cyan-800: #155E75;
--cyan-900: #164E63;

/* Success - Subtle Green */
--success-500: #10B981;
--success-600: #059669;

/* Warning - Soft Amber */
--warning-500: #F59E0B;
--warning-600: #D97706;
```

### Gradient Meshes - Stripe/Linear Style

```css
/* Hero background gradient */
--gradient-hero: 
  radial-gradient(at 27% 37%, hsla(215, 98%, 61%, 0.15) 0px, transparent 50%),
  radial-gradient(at 97% 21%, hsla(189, 94%, 57%, 0.15) 0px, transparent 50%),
  radial-gradient(at 52% 99%, hsla(354, 98%, 61%, 0.08) 0px, transparent 50%),
  radial-gradient(at 10% 29%, hsla(256, 96%, 67%, 0.1) 0px, transparent 50%),
  radial-gradient(at 97% 96%, hsla(38, 60%, 74%, 0.08) 0px, transparent 50%),
  radial-gradient(at 33% 50%, hsla(222, 67%, 73%, 0.1) 0px, transparent 50%),
  radial-gradient(at 79% 53%, hsla(343, 68%, 79%, 0.08) 0px, transparent 50%);

/* CTA button gradient (animated) */
--gradient-cta:
  linear-gradient(135deg, 
    #667eea 0%, 
    #764ba2 25%,
    #667eea 50%,
    #764ba2 75%,
    #667eea 100%
  );
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;

/* Card hover gradient */
--gradient-card-hover:
  linear-gradient(135deg, 
    rgba(102, 126, 234, 0.05) 0%, 
    rgba(118, 75, 162, 0.05) 100%
  );

/* Glassmorphism backdrop */
--glass-bg: rgba(255, 255, 255, 0.05);
--glass-border: rgba(255, 255, 255, 0.1);
--glass-blur: blur(20px);
```

### Dark Mode Colors (Primary Theme)

```css
/* Background layers */
--bg-primary:   #000000;      /* Pure black base */
--bg-secondary: #0A0A0A;      /* Slightly elevated */
--bg-tertiary:  #141414;      /* Cards, modals */
--bg-elevated:  #1A1A1A;      /* Hover states */

/* Text hierarchy */
--text-primary:   #FFFFFF;    /* Headings */
--text-secondary: #A3A3A3;    /* Body */
--text-tertiary:  #737373;    /* Captions */
--text-disabled:  #404040;    /* Disabled */

/* Borders */
--border-subtle:  rgba(255, 255, 255, 0.05);
--border-default: rgba(255, 255, 255, 0.1);
--border-strong:  rgba(255, 255, 255, 0.2);
```

---

## 📝 Typography - Technical Precision

### Font System

```css
/* Display - Headlines */
--font-display: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* Body - Readable */
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* Mono - Code/Technical */
--font-mono: 'JetBrains Mono', 'Fira Code', 'SF Mono', monospace;

/* Load with variable font support */
@import url('https://rsms.me/inter/inter.css');

@supports (font-variation-settings: normal) {
  :root {
    --font-display: 'Inter var', sans-serif;
    --font-body: 'Inter var', sans-serif;
  }
}
```

### Type Scale - Fluid & Responsive

```css
/* Fluid typography using clamp() */
--text-xs:   clamp(0.75rem,  0.7rem  + 0.25vw, 0.875rem);  /* 12-14px */
--text-sm:   clamp(0.875rem, 0.8rem  + 0.35vw, 1rem);      /* 14-16px */
--text-base: clamp(1rem,     0.95rem + 0.25vw, 1.125rem);  /* 16-18px */
--text-lg:   clamp(1.125rem, 1rem    + 0.5vw,  1.25rem);   /* 18-20px */
--text-xl:   clamp(1.25rem,  1.1rem  + 0.65vw, 1.5rem);    /* 20-24px */
--text-2xl:  clamp(1.5rem,   1.3rem  + 0.9vw,  1.875rem);  /* 24-30px */
--text-3xl:  clamp(1.875rem, 1.5rem  + 1.5vw,  2.25rem);   /* 30-36px */
--text-4xl:  clamp(2.25rem,  1.8rem  + 2vw,    3rem);      /* 36-48px */
--text-5xl:  clamp(3rem,     2.5rem  + 2.5vw,  4rem);      /* 48-64px */
--text-6xl:  clamp(3.75rem,  3rem    + 3vw,    5rem);      /* 60-80px */

/* Hero display - Extra large */
--text-hero: clamp(4rem, 3rem + 5vw, 7rem);                /* 64-112px */
```

### Font Weights - Variable Font

```css
--weight-light:    300;
--weight-regular:  400;
--weight-medium:   500;
--weight-semibold: 600;
--weight-bold:     700;
--weight-black:    900;  /* For hero headlines */
```

### Line Heights & Letter Spacing

```css
--leading-none:   1;
--leading-tight:  1.25;
--leading-snug:   1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
--leading-loose:  2;

/* Tighter tracking for large text */
--tracking-tighter: -0.05em;
--tracking-tight:   -0.025em;
--tracking-normal:  0;
--tracking-wide:    0.025em;
--tracking-wider:   0.05em;
```

---

## 🎭 Ultra-Modern Hero Section

### Vapi/Linear-Style Hero

```html
<section class="hero-modern">
  <!-- Animated gradient mesh background -->
  <div class="hero-bg-gradient"></div>
  
  <!-- Floating grid overlay -->
  <div class="hero-grid-overlay"></div>
  
  <div class="hero-container">
    <div class="hero-content">
      <!-- Eyebrow text -->
      <div class="hero-eyebrow">
        <span class="badge-modern">
          <span class="badge-icon">✨</span>
          <span>Powered by GPT-4 Turbo</span>
        </span>
      </div>
      
      <!-- Hero headline with gradient text -->
      <h1 class="hero-headline">
        AI Call Center.
        <span class="gradient-text">
          Built for Speed.
        </span>
      </h1>
      
      <!-- Subheadline -->
      <p class="hero-subheadline">
        Handle unlimited calls simultaneously. Deploy in 5 minutes.
        <br />
        <span class="text-gradient-subtle">
          From $99/month. No long-term contracts.
        </span>
      </p>
      
      <!-- CTA Group -->
      <div class="hero-cta-group">
        <button class="btn-primary-modern">
          <span>Start free trial</span>
          <svg class="arrow-icon">→</svg>
        </button>
        
        <button class="btn-secondary-modern">
          <svg class="play-icon">▶</svg>
          <span>Watch demo</span>
          <span class="duration">2:15</span>
        </button>
      </div>
      
      <!-- Social proof - minimal -->
      <div class="hero-social-proof-minimal">
        <div class="avatar-stack">
          <img src="/avatar1.jpg" alt="" />
          <img src="/avatar2.jpg" alt="" />
          <img src="/avatar3.jpg" alt="" />
          <img src="/avatar4.jpg" alt="" />
          <span class="avatar-count">+50</span>
        </div>
        <p class="social-proof-text">
          <strong>127,583</strong> calls handled this month
        </p>
      </div>
    </div>
    
    <!-- Hero visual - Interactive dashboard preview -->
    <div class="hero-visual-modern">
      <div class="dashboard-preview">
        <!-- Floating cards with glassmorphism -->
        <div class="dashboard-card glass-card animate-float">
          <div class="card-header">
            <span class="status-dot pulsing"></span>
            <span>Live call in progress</span>
          </div>
          <div class="waveform-animation"></div>
        </div>
        
        <div class="dashboard-card glass-card animate-float delay-1">
          <div class="metric-display">
            <span class="metric-value">847</span>
            <span class="metric-label">Calls today</span>
            <span class="metric-trend">↑ 23%</span>
          </div>
        </div>
        
        <div class="dashboard-card glass-card animate-float delay-2">
          <div class="transcript-preview">
            <span class="transcript-label">Live transcript</span>
            <p class="typing-effect">"Can you help me with..."</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

### Hero Styling - Stripe/Linear Aesthetic

```css
.hero-modern {
  position: relative;
  min-height: 90vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  background: var(--bg-primary);
}

/* Animated gradient mesh background */
.hero-bg-gradient {
  position: absolute;
  inset: 0;
  background: var(--gradient-hero);
  opacity: 1;
  animation: gradient-morph 15s ease infinite;
}

@keyframes gradient-morph {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

/* Subtle grid overlay */
.hero-grid-overlay {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 50px 50px;
  mask-image: radial-gradient(
    ellipse 80% 50% at 50% 40%,
    black 0%,
    transparent 100%
  );
}

.hero-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  position: relative;
  z-index: 1;
}

/* Eyebrow badge */
.hero-eyebrow {
  margin-bottom: 2rem;
}

.badge-modern {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 9999px;
  backdrop-filter: blur(12px);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  transition: all 0.3s ease;
}

.badge-modern:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.badge-icon {
  font-size: 1rem;
}

/* Hero headline */
.hero-headline {
  font-size: var(--text-hero);
  font-weight: var(--weight-black);
  line-height: var(--leading-none);
  letter-spacing: var(--tracking-tighter);
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

/* Animated gradient text */
.gradient-text {
  background: linear-gradient(
    135deg,
    #667eea 0%,
    #764ba2 25%,
    #f093fb 50%,
    #667eea 75%,
    #764ba2 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-shift 4s linear infinite;
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}

/* Subheadline */
.hero-subheadline {
  font-size: var(--text-xl);
  line-height: var(--leading-relaxed);
  color: var(--text-secondary);
  margin-bottom: 3rem;
  max-width: 600px;
}

.text-gradient-subtle {
  background: linear-gradient(135deg, #A3A3A3, #FFFFFF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* CTA Button Group */
.hero-cta-group {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 3rem;
}

/* Primary button - Animated gradient */
.btn-primary-modern {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background: var(--gradient-cta);
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 8px 24px rgba(102, 126, 234, 0.25);
}

.btn-primary-modern:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.15),
    0 12px 32px rgba(102, 126, 234, 0.35);
}

.btn-primary-modern .arrow-icon {
  transition: transform 0.3s ease;
}

.btn-primary-modern:hover .arrow-icon {
  transform: translateX(4px);
}

/* Secondary button - Ghost with border */
.btn-secondary-modern {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary-modern:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.duration {
  font-size: 0.875rem;
  color: var(--text-tertiary);
}

/* Social proof - Minimal */
.hero-social-proof-minimal {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar-stack {
  display: flex;
  align-items: center;
}

.avatar-stack img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid var(--bg-primary);
  margin-left: -12px;
}

.avatar-stack img:first-child {
  margin-left: 0;
}

.avatar-count {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -12px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.social-proof-text {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.social-proof-text strong {
  color: var(--text-primary);
  font-weight: 600;
}
```

---

## 🎴 Bento Grid Layout System (Linear/Apple Style)

### Bento Grid Concept

The "Bento Box" layout popularized by Apple and Linear - asymmetric grid with varied card sizes, creating visual interest while maintaining organization.

```html
<section class="bento-section">
  <div class="container">
    <div class="bento-header">
      <h2 class="section-heading-modern">
        Everything you need.
        <span class="gradient-text">Nothing you don't.</span>
      </h2>
    </div>
    
    <div class="bento-grid">
      <!-- Large feature - Spans 2 columns -->
      <div class="bento-card large glass-effect">
        <div class="bento-card-content">
          <div class="bento-icon">🤖</div>
          <h3 class="bento-title">AI That Actually Works</h3>
          <p class="bento-description">
            GPT-4 powered conversations that feel human.
            Understands context, handles complex queries.
          </p>
        </div>
        <div class="bento-visual">
          <div class="code-block-preview">
            <div class="code-header">
              <span class="code-dot red"></span>
              <span class="code-dot yellow"></span>
              <span class="code-dot green"></span>
            </div>
            <pre class="code-content">
<span class="code-comment">// AI responds in real-time</span>
<span class="code-keyword">const</span> response = <span class="code-keyword">await</span> ai.<span class="code-function">chat</span>({
  <span class="code-property">message</span>: <span class="code-string">"Schedule appointment"</span>,
  <span class="code-property">language</span>: <span class="code-string">"ru"</span>
});
            </pre>
          </div>
        </div>
      </div>
      
      <!-- Medium card - Analytics -->
      <div class="bento-card medium glass-effect">
        <div class="bento-card-content">
          <div class="bento-icon">📊</div>
          <h3 class="bento-title">Real-time Analytics</h3>
          <p class="bento-description">
            Every call tracked, transcribed, analyzed.
          </p>
        </div>
        <div class="bento-visual-small">
          <div class="chart-preview">
            <div class="chart-bar" style="--height: 60%"></div>
            <div class="chart-bar" style="--height: 80%"></div>
            <div class="chart-bar" style="--height: 100%"></div>
            <div class="chart-bar" style="--height: 70%"></div>
            <div class="chart-bar" style="--height: 90%"></div>
          </div>
        </div>
      </div>
      
      <!-- Small card - 24/7 -->
      <div class="bento-card small glass-effect">
        <div class="bento-icon-large">🌙</div>
        <h3 class="bento-title-small">24/7 Uptime</h3>
        <p class="stat-number">99.9%</p>
      </div>
      
      <!-- Small card - Speed -->
      <div class="bento-card small glass-effect">
        <div class="bento-icon-large">⚡</div>
        <h3 class="bento-title-small">Lightning Fast</h3>
        <p class="stat-number">< 200ms</p>
      </div>
      
      <!-- Wide card - Integrations -->
      <div class="bento-card wide glass-effect">
        <div class="bento-card-content">
          <div class="bento-icon">🔗</div>
          <h3 class="bento-title">Connect Everything</h3>
          <p class="bento-description">
            One-click integrations with your existing tools.
          </p>
        </div>
        <div class="integration-logos">
          <div class="integration-logo">Telegram</div>
          <div class="integration-logo">WhatsApp</div>
          <div class="integration-logo">Bitrix24</div>
          <div class="integration-logo">Slack</div>
          <div class="integration-logo">+ 12 more</div>
        </div>
      </div>
      
      <!-- Tall card - Languages -->
      <div class="bento-card tall glass-effect">
        <div class="bento-card-content">
          <div class="bento-icon">🌍</div>
          <h3 class="bento-title">Multi-language</h3>
          <div class="language-list">
            <span class="language-tag">🇷🇺 Russian</span>
            <span class="language-tag">🇺🇿 Uzbek</span>
            <span class="language-tag">🇬🇧 English</span>
            <span class="language-tag">+20</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

### Bento Grid CSS

```css
.bento-section {
  padding: 8rem 0;
  background: var(--bg-primary);
  position: relative;
}

.bento-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-heading-modern {
  font-size: var(--text-5xl);
  font-weight: var(--weight-bold);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
  color: var(--text-primary);
}

/* Bento Grid - Asymmetric layout */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* Card size variants */
.bento-card.large {
  grid-column: span 2;
  grid-row: span 2;
}

.bento-card.wide {
  grid-column: span 2;
}

.bento-card.tall {
  grid-row: span 2;
}

.bento-card.medium {
  grid-column: span 2;
}

.bento-card.small {
  grid-column: span 1;
}

/* Glass effect cards */
.bento-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1.5rem;
  padding: 2rem;
  backdrop-filter: blur(20px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Hover effect with gradient border */
.bento-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 1.5rem;
  padding: 1px;
  background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.bento-card:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.12);
  transform: translateY(-4px);
}

.bento-card:hover::before {
  opacity: 1;
}

/* Card content */
.bento-card-content {
  flex: 1;
  z-index: 1;
}

.bento-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  display: block;
}

.bento-icon-large {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.bento-title {
  font-size: var(--text-2xl);
  font-weight: var(--weight-semibold);
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}

.bento-title-small {
  font-size: var(--text-lg);
  font-weight: var(--weight-semibold);
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.bento-description {
  font-size: var(--text-base);
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
}

/* Code block preview */
.code-block-preview {
  margin-top: 1.5rem;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.code-header {
  padding: 0.75rem 1rem;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  gap: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.code-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.code-dot.red { background: #FF5F56; }
.code-dot.yellow { background: #FFBD2E; }
.code-dot.green { background: #27C93F; }

.code-content {
  padding: 1.5rem;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--text-secondary);
  overflow-x: auto;
}

.code-keyword { color: #C792EA; }
.code-function { color: #82AAFF; }
.code-string { color: #C3E88D; }
.code-property { color: #F07178; }
.code-comment { color: #546E7A; }

/* Chart preview */
.chart-preview {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  height: 100px;
  margin-top: 1rem;
}

.chart-bar {
  flex: 1;
  background: linear-gradient(180deg, #667eea, #764ba2);
  border-radius: 0.25rem;
  height: var(--height);
  animation: chart-grow 1s ease-out backwards;
}

.chart-bar:nth-child(1) { animation-delay: 0.1s; }
.chart-bar:nth-child(2) { animation-delay: 0.2s; }
.chart-bar:nth-child(3) { animation-delay: 0.3s; }
.chart-bar:nth-child(4) { animation-delay: 0.4s; }
.chart-bar:nth-child(5) { animation-delay: 0.5s; }

@keyframes chart-grow {
  from {
    height: 0;
    opacity: 0;
  }
}

/* Stat number */
.stat-number {
  font-size: var(--text-4xl);
  font-weight: var(--weight-bold);
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
}

/* Integration logos */
.integration-logos {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.integration-logo {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  transition: all 0.2s ease;
}

.integration-logo:hover {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-primary);
  transform: translateY(-2px);
}

/* Language tags */
.language-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
}

.language-tag {
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Responsive - Stack on mobile */
@media (max-width: 768px) {
  .bento-grid {
    grid-template-columns: 1fr;
  }
  
  .bento-card.large,
  .bento-card.wide,
  .bento-card.medium,
  .bento-card.tall,
  .bento-card.small {
    grid-column: span 1;
    grid-row: span 1;
  }
}
```

---

## 🌫️ Glassmorphism & Blur Effects

### Premium Glass Cards

```css
/* Base glass effect */
.glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1.5rem;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

/* Light glass (more transparent) */
.glass-light {
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(12px);
}

/* Heavy glass (more opaque) */
.glass-heavy {
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(32px);
}

/* Glass with gradient border */
.glass-gradient-border {
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border-radius: 1.5rem;
}

.glass-gradient-border::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 1.5rem;
  padding: 1px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.2),
    rgba(255, 255, 255, 0.02),
    rgba(255, 255, 255, 0.1)
  );
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  -webkit-mask-composite: xor;
}

/* Frosted glass effect */
.frosted-glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(40px) brightness(1.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 8px 32px rgba(31, 38, 135, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}
```

### Floating Cards with Depth

```html
<div class="floating-card-container">
  <div class="floating-card layer-1">
    <h3>Front layer</h3>
  </div>
  <div class="floating-card layer-2">
    <h3>Middle layer</h3>
  </div>
  <div class="floating-card layer-3">
    <h3>Back layer</h3>
  </div>
</div>
```

```css
.floating-card-container {
  position: relative;
  perspective: 1000px;
}

.floating-card {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1.5rem;
  padding: 2rem;
  position: relative;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.floating-card.layer-1 {
  z-index: 3;
  transform: translateZ(60px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.floating-card.layer-2 {
  z-index: 2;
  transform: translateZ(30px) translateY(20px);
  opacity: 0.9;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.floating-card.layer-3 {
  z-index: 1;
  transform: translateZ(0) translateY(40px);
  opacity: 0.8;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
}

/* Hover effect */
.floating-card-container:hover .layer-1 {
  transform: translateZ(80px);
}

.floating-card-container:hover .layer-2 {
  transform: translateZ(40px) translateY(25px);
}

.floating-card-container:hover .layer-3 {
  transform: translateZ(10px) translateY(50px);
}
```

---

## ✨ Animated Gradient Effects

### Text Gradients

```css
/* Animated gradient text */
.gradient-text-animated {
  background: linear-gradient(
    135deg,
    #667eea 0%,
    #764ba2 25%,
    #f093fb 50%,
    #4facfe 75%,
    #00f2fe 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-flow 3s linear infinite;
}

@keyframes gradient-flow {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}

/* Subtle gradient text */
.gradient-text-subtle {
  background: linear-gradient(135deg, #A3A3A3, #FFFFFF, #A3A3A3);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Holographic text effect */
.text-holographic {
  background: linear-gradient(
    90deg,
    #ff6ec4, #7873f5, #4facfe, #00f2fe,
    #43e97b, #ff6ec4
  );
  background-size: 400% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: holographic-shift 8s ease-in-out infinite;
}

@keyframes holographic-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
```

### Background Gradients

```css
/* Mesh gradient background */
.mesh-gradient-bg {
  background: 
    radial-gradient(at 40% 20%, hsla(28,100%,74%,0.1) 0px, transparent 50%),
    radial-gradient(at 80% 0%, hsla(189,100%,56%,0.1) 0px, transparent 50%),
    radial-gradient(at 0% 50%, hsla(355,100%,93%,0.05) 0px, transparent 50%),
    radial-gradient(at 80% 50%, hsla(340,100%,76%,0.05) 0px, transparent 50%),
    radial-gradient(at 0% 100%, hsla(22,100%,77%,0.05) 0px, transparent 50%),
    radial-gradient(at 80% 100%, hsla(242,100%,70%,0.1) 0px, transparent 50%),
    radial-gradient(at 0% 0%, hsla(343,100%,76%,0.05) 0px, transparent 50%);
  animation: mesh-morph 20s ease-in-out infinite;
}

@keyframes mesh-morph {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

/* Gradient orb (floating background element) */
.gradient-orb {
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.3;
  pointer-events: none;
  animation: orb-float 20s ease-in-out infinite;
}

.gradient-orb.purple {
  background: radial-gradient(circle, #667eea, transparent);
  top: -200px;
  left: -200px;
}

.gradient-orb.pink {
  background: radial-gradient(circle, #f093fb, transparent);
  bottom: -200px;
  right: -200px;
  animation-delay: -10s;
}

@keyframes orb-float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(50px, -50px) scale(1.1); }
  66% { transform: translate(-50px, 50px) scale(0.9); }
}
```

---

