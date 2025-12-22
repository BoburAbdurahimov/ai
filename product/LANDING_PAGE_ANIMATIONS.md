# ✨ Micro-Interactions & Animation System

## Animation Philosophy

**Principles:**
1. **Purposeful** - Every animation serves a function
2. **Fast** - 200-400ms for most interactions
3. **Natural** - Easing functions that feel organic
4. **Subtle** - Enhance, don't distract
5. **Accessible** - Respect `prefers-reduced-motion`

---

## Easing Functions

```css
:root {
  /* Standard easings */
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-out: cubic-bezier(0.0, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  
  /* Custom premium easings */
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  --ease-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease-dramatic: cubic-bezier(0.87, 0, 0.13, 1);
  
  /* Timings */
  --duration-instant: 100ms;
  --duration-fast: 200ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  --duration-dramatic: 800ms;
}

/* Respect user preferences */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Hero Animations

### Page Load Sequence

```css
/* Fade in from bottom */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Fade in from left */
@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Fade in from right */
@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Scale fade in */
@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Apply to hero elements */
.hero-headline {
  animation: fadeInUp var(--duration-slow) var(--ease-out) forwards;
  animation-delay: 100ms;
  opacity: 0;
}

.hero-subheadline {
  animation: fadeInUp var(--duration-slow) var(--ease-out) forwards;
  animation-delay: 250ms;
  opacity: 0;
}

.hero-benefits {
  animation: fadeInUp var(--duration-slow) var(--ease-out) forwards;
  animation-delay: 400ms;
  opacity: 0;
}

.hero-cta {
  animation: fadeInScale var(--duration-slow) var(--ease-bounce) forwards;
  animation-delay: 600ms;
  opacity: 0;
}

.hero-visual {
  animation: fadeInRight var(--duration-slow) var(--ease-out) forwards;
  animation-delay: 300ms;
  opacity: 0;
}
```

### Typing Effect for Headline

```css
@keyframes typing {
  from { width: 0; }
  to { width: 100%; }
}

@keyframes blink {
  50% { border-color: transparent; }
}

.hero-headline-animated {
  overflow: hidden;
  border-right: 3px solid #06B6D4;
  white-space: nowrap;
  animation: 
    typing 2s steps(30) forwards,
    blink 0.75s step-end infinite;
}
```

---

## Button Micro-Interactions

### Pulse Animation for CTAs

```css
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(6, 182, 212, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(6, 182, 212, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(6, 182, 212, 0);
  }
}

.btn-cta-animated {
  animation: pulse 2s infinite;
}

/* Only pulse primary hero CTA */
.hero-cta-primary {
  animation: pulse 2s infinite;
  animation-delay: 2s; /* After page load */
}
```

### Ripple Effect on Click

```css
.btn-ripple {
  position: relative;
  overflow: hidden;
}

.btn-ripple::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.btn-ripple:active::after {
  width: 300px;
  height: 300px;
}
```

### Loading State

```css
@keyframes spin {
  to { transform: rotate(360deg); }
}

.btn-loading {
  position: relative;
  color: transparent;
  pointer-events: none;
}

.btn-loading::after {
  content: "";
  position: absolute;
  width: 20px;
  height: 20px;
  top: 50%;
  left: 50%;
  margin-left: -10px;
  margin-top: -10px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
```

---

## Scroll Animations

### Fade In on Scroll

```css
.animate-on-scroll {
  opacity: 0;
  transform: translateY(30px);
  transition: 
    opacity 0.6s var(--ease-out),
    transform 0.6s var(--ease-out);
}

.animate-on-scroll.in-view {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger children */
.stagger-children > * {
  opacity: 0;
  transform: translateY(20px);
  transition: 
    opacity 0.5s var(--ease-out),
    transform 0.5s var(--ease-out);
}

.stagger-children.in-view > *:nth-child(1) { 
  animation: fadeInUp 0.5s var(--ease-out) 0.1s forwards; 
}
.stagger-children.in-view > *:nth-child(2) { 
  animation: fadeInUp 0.5s var(--ease-out) 0.2s forwards; 
}
.stagger-children.in-view > *:nth-child(3) { 
  animation: fadeInUp 0.5s var(--ease-out) 0.3s forwards; 
}
.stagger-children.in-view > *:nth-child(4) { 
  animation: fadeInUp 0.5s var(--ease-out) 0.4s forwards; 
}
```

### JavaScript Intersection Observer

```javascript
// Observe elements for scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      // Optional: Stop observing after animation
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all animatable elements
document.querySelectorAll('.animate-on-scroll, .stagger-children').forEach(el => {
  observer.observe(el);
});
```

---

## Number Counter Animation

### Animated Statistics

```css
.stat-number {
  font-size: 3rem;
  font-weight: 800;
  color: #06B6D4;
  font-variant-numeric: tabular-nums;
}
```

```javascript
function animateValue(element, start, end, duration) {
  const startTime = performance.now();
  const difference = end - start;
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function (ease-out)
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = start + (difference * easeOut);
    
    element.textContent = Math.floor(current).toLocaleString();
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

// Usage
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = entry.target;
      const endValue = parseInt(target.dataset.value);
      animateValue(target, 0, endValue, 2000);
      statsObserver.unobserve(target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => {
  statsObserver.observe(el);
});
```

---

## Card Hover Effects

### 3D Tilt Effect

```css
.card-tilt {
  transition: transform 0.1s ease;
  transform-style: preserve-3d;
}

/* Applied via JavaScript on mousemove */
```

```javascript
function addTiltEffect(card) {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    card.style.transform = `
      perspective(1000px) 
      rotateX(${rotateX}deg) 
      rotateY(${rotateY}deg)
      scale3d(1.05, 1.05, 1.05)
    `;
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
  });
}

document.querySelectorAll('.card-tilt').forEach(addTiltEffect);
```

### Shine Effect

```css
@keyframes shine {
  0% {
    background-position: -100%;
  }
  100% {
    background-position: 200%;
  }
}

.card-shine {
  position: relative;
  overflow: hidden;
}

.card-shine::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  background-size: 200%;
  animation: shine 3s infinite;
}
```

---

## Loading & Skeleton States

### Skeleton Loader

```css
@keyframes skeleton-loading {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

.skeleton {
  background: linear-gradient(
    90deg,
    #f0f0f0 0px,
    #f8f8f8 40px,
    #f0f0f0 80px
  );
  background-size: 200px 100%;
  animation: skeleton-loading 1.2s ease-in-out infinite;
  border-radius: 4px;
}

.skeleton-text {
  height: 1rem;
  margin-bottom: 0.5rem;
}

.skeleton-heading {
  height: 2rem;
  width: 60%;
  margin-bottom: 1rem;
}

.skeleton-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}
```

---

## Particle System for Hero Background

```javascript
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.particleCount = 50;
    
    this.resize();
    this.init();
    this.animate();
    
    window.addEventListener('resize', () => this.resize());
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  init() {
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach(particle => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Wrap around edges
      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.canvas.height;
      if (particle.y > this.canvas.height) particle.y = 0;
      
      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(6, 182, 212, ${particle.opacity})`;
      this.ctx.fill();
    });
    
    // Draw connections
    this.particles.forEach((p1, i) => {
      this.particles.slice(i + 1).forEach(p2 => {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          const opacity = (1 - distance / 150) * 0.2;
          this.ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`;
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      });
    });
    
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize
const canvas = document.getElementById('particle-canvas');
new ParticleSystem(canvas);
```

---

## Parallax Scrolling

```css
.parallax-container {
  position: relative;
  overflow: hidden;
}

.parallax-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: transform 0.1s ease-out;
}
```

```javascript
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  
  document.querySelectorAll('.parallax-layer').forEach(layer => {
    const speed = layer.dataset.speed || 0.5;
    const yPos = -(scrolled * speed);
    layer.style.transform = `translateY(${yPos}px)`;
  });
});
```

---

## Smooth Scroll to Section

```javascript
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});
```

---

## Progress Bar on Scroll

```css
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 0;
  height: 3px;
  background: linear-gradient(90deg, #06B6D4, #10B981);
  z-index: 9999;
  transition: width 0.1s ease-out;
}
```

```javascript
window.addEventListener('scroll', () => {
  const winScroll = document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = (winScroll / height) * 100;
  
  document.querySelector('.scroll-progress').style.width = scrolled + '%';
});
```

---
