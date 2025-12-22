# 🧭 Modern Navigation - Minimalist & Blur Effect

## Linear/Stripe Style Navigation

```html
<nav class="nav-modern">
  <div class="nav-container">
    <!-- Logo -->
    <a href="/" class="nav-logo">
      <svg class="logo-icon">...</svg>
      <span class="logo-text">CallCenter<span class="logo-accent">AI</span></span>
    </a>
    
    <!-- Navigation Links -->
    <div class="nav-links">
      <a href="#features" class="nav-link">Features</a>
      <a href="#pricing" class="nav-link">Pricing</a>
      <a href="#docs" class="nav-link">Docs</a>
      <a href="#blog" class="nav-link">Blog</a>
    </div>
    
    <!-- Actions -->
    <div class="nav-actions">
      <button class="nav-link-button">Sign in</button>
      <button class="btn-nav-primary">
        Start free trial
        <svg class="arrow-icon">→</svg>
      </button>
    </div>
    
    <!-- Mobile menu button -->
    <button class="mobile-menu-btn" aria-label="Open menu">
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
    </button>
  </div>
</nav>
```

## Navigation CSS

```css
.nav-modern {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-sticky);
  padding: 1rem 0;
  transition: all 0.3s ease;
}

/* Glassmorphism on scroll */
.nav-modern.scrolled {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

/* Logo */
.nav-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  transition: opacity 0.2s ease;
}

.nav-logo:hover {
  opacity: 0.8;
}

.logo-icon {
  width: 32px;
  height: 32px;
}

.logo-accent {
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Navigation Links */
.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex: 1;
  justify-content: center;
}

.nav-link {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s ease;
  position: relative;
}

.nav-link:hover {
  color: var(--text-primary);
}

/* Subtle underline on hover */
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 1px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}

/* Actions */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-link-button {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--text-secondary);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease;
  padding: 0.5rem 1rem;
}

.nav-link-button:hover {
  color: var(--text-primary);
}

.btn-nav-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.25);
}

.btn-nav-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.35);
}

.btn-nav-primary .arrow-icon {
  transition: transform 0.3s ease;
}

.btn-nav-primary:hover .arrow-icon {
  transform: translateX(2px);
}

/* Mobile Menu Button */
.mobile-menu-btn {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.hamburger-line {
  width: 24px;
  height: 2px;
  background: var(--text-primary);
  border-radius: 2px;
  transition: all 0.3s ease;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .nav-links,
  .nav-actions .nav-link-button {
    display: none;
  }
  
  .mobile-menu-btn {
    display: flex;
  }
  
  /* Mobile menu overlay */
  .nav-links.mobile-open {
    display: flex;
    position: fixed;
    top: 0;
    right: 0;
    width: 100%;
    max-width: 320px;
    height: 100vh;
    background: rgba(0, 0, 0, 0.95);
    backdrop-filter: blur(20px);
    flex-direction: column;
    align-items: flex-start;
    padding: 6rem 2rem 2rem;
    gap: 2rem;
    border-left: 1px solid rgba(255, 255, 255, 0.08);
    animation: slide-in 0.3s ease;
  }
  
  @keyframes slide-in {
    from {
      transform: translateX(100%);
    }
  }
  
  .nav-link {
    font-size: 1.25rem;
  }
  
  .nav-actions {
    width: 100%;
    flex-direction: column;
  }
  
  .btn-nav-primary {
    width: 100%;
    justify-content: center;
  }
}
```

---

## Code-Block Style Testimonials

```html
<section class="testimonials-code-style">
  <div class="container">
    <div class="section-header">
      <h2 class="section-heading-modern">
        Loved by developers.
        <span class="gradient-text">Trusted by businesses.</span>
      </h2>
    </div>
    
    <div class="testimonials-grid">
      <!-- Testimonial 1 - Code block style -->
      <div class="testimonial-code-card">
        <div class="code-header">
          <span class="code-dot red"></span>
          <span class="code-dot yellow"></span>
          <span class="code-dot green"></span>
          <span class="code-file">testimonial.json</span>
        </div>
        <div class="code-content">
          <pre><code>{
  <span class="code-property">"company"</span>: <span class="code-string">"TechMarket LLC"</span>,
  <span class="code-property">"author"</span>: <span class="code-string">"Aziz Karimov"</span>,
  <span class="code-property">"role"</span>: <span class="code-string">"CEO"</span>,
  <span class="code-property">"rating"</span>: <span class="code-number">5.0</span>,
  <span class="code-property">"review"</span>: <span class="code-string">"Saved us $32k in first year. 
  AI handles 847 calls/month perfectly."</span>,
  <span class="code-property">"metrics"</span>: {
    <span class="code-property">"calls_handled"</span>: <span class="code-number">847</span>,
    <span class="code-property">"savings"</span>: <span class="code-string">"$32,412"</span>,
    <span class="code-property">"setup_time"</span>: <span class="code-string">"8 minutes"</span>
  }
}</code></pre>
        </div>
      </div>
      
      <!-- Testimonial 2 - Terminal style -->
      <div class="testimonial-terminal-card">
        <div class="terminal-header">
          <span class="terminal-title">~ customer-feedback</span>
        </div>
        <div class="terminal-content">
          <div class="terminal-line">
            <span class="terminal-prompt">$</span>
            <span class="terminal-command">show_testimonial --customer="Medical Plus"</span>
          </div>
          <div class="terminal-output">
            <p>⭐⭐⭐⭐⭐ 5/5 stars</p>
            <p>"AI works 24/7. Patients can book appointments at midnight. Game changer for our clinic."</p>
            <p class="terminal-meta">- Dr. Dilnoza Rashidova, Medical Director</p>
          </div>
        </div>
      </div>
      
      <!-- Testimonial 3 - Chat style -->
      <div class="testimonial-chat-card">
        <div class="chat-message received">
          <div class="chat-avatar">RS</div>
          <div class="chat-bubble">
            <div class="chat-author">Rustam Yusupov</div>
            <p>Just deployed your AI solution. Clients don't even realize they're talking to AI. Incredible!</p>
            <div class="chat-meta">CEO, Uzbek Insurance • 2 days ago</div>
          </div>
        </div>
        <div class="chat-message sent">
          <div class="chat-bubble">
            <p>🎉 That's exactly what we aimed for! How's the setup process?</p>
          </div>
        </div>
        <div class="chat-message received">
          <div class="chat-avatar">RS</div>
          <div class="chat-bubble">
            <p>Took literally 10 minutes. No technical knowledge needed. Perfect.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

## Testimonials CSS

```css
.testimonials-code-style {
  padding: 8rem 0;
  background: var(--bg-primary);
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  max-width: 1400px;
  margin: 3rem auto 0;
}

/* Code Block Testimonial */
.testimonial-code-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  overflow: hidden;
  backdrop-filter: blur(20px);
  transition: all 0.3s ease;
}

.testimonial-code-card:hover {
  border-color: rgba(255, 255, 255, 0.12);
  transform: translateY(-4px);
}

.code-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(0, 0, 0, 0.3);
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

.code-file {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  margin-left: auto;
  font-family: var(--font-mono);
}

.code-content {
  padding: 1.5rem;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--text-secondary);
  overflow-x: auto;
}

.code-property { color: #82AAFF; }
.code-string { color: #C3E88D; }
.code-number { color: #F78C6C; }

/* Terminal Testimonial */
.testimonial-terminal-card {
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  overflow: hidden;
  backdrop-filter: blur(20px);
}

.terminal-header {
  padding: 0.75rem 1rem;
  background: rgba(0, 0, 0, 0.4);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.terminal-title {
  font-size: 0.875rem;
  font-family: var(--font-mono);
  color: var(--text-secondary);
}

.terminal-content {
  padding: 1.5rem;
  font-family: var(--font-mono);
  font-size: 0.875rem;
}

.terminal-line {
  margin-bottom: 1rem;
}

.terminal-prompt {
  color: #10B981;
  margin-right: 0.5rem;
}

.terminal-command {
  color: #3B82F6;
}

.terminal-output {
  margin-top: 1rem;
  color: var(--text-secondary);
  line-height: 1.8;
}

.terminal-output p {
  margin-bottom: 0.5rem;
}

.terminal-meta {
  color: var(--text-tertiary);
  font-style: italic;
  margin-top: 1rem;
}

/* Chat Testimonial */
.testimonial-chat-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  padding: 1.5rem;
  backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.chat-message {
  display: flex;
  gap: 0.75rem;
}

.chat-message.sent {
  flex-direction: row-reverse;
}

.chat-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  flex-shrink: 0;
}

.chat-bubble {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  padding: 1rem;
  max-width: 80%;
}

.chat-message.sent .chat-bubble {
  background: rgba(102, 126, 234, 0.15);
  border-color: rgba(102, 126, 234, 0.3);
}

.chat-author {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.chat-bubble p {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

.chat-meta {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  margin-top: 0.5rem;
}
```

---
