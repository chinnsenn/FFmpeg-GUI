# Animation & Interactions - Glassmorphism Design

This document defines motion design, animations, and interaction patterns for the FFmpeg GUI glassmorphism design system.

## Motion Design Philosophy

**Principles:**

1. **Purposeful Motion**: Every animation serves a functional purpose (feedback, guidance, delight)
2. **Subtle Elegance**: Movements are refined and understated, never distracting
3. **Physical Plausibility**: Animations follow real-world physics (easing, momentum, friction)
4. **Performance First**: Smooth 60fps animations using GPU-accelerated properties
5. **Respectful**: Honor user preferences for reduced motion

**Animation Properties to Use:**
- ✅ `transform` (translate, scale, rotate)
- ✅ `opacity`
- ✅ `backdrop-filter` (use sparingly)
- ✅ `box-shadow`
- ❌ Avoid animating: `width`, `height`, `margin`, `padding` (causes layout reflow)

---

## Timing & Easing

### Duration Scale

```css
:root {
  /* Micro-interactions */
  --duration-instant: 100ms;   /* Immediate feedback */
  --duration-fast: 150ms;      /* Button presses, toggles */
  --duration-normal: 200ms;    /* Hover states, focus */
  --duration-slow: 300ms;      /* Card movements, page transitions */
  --duration-slower: 400ms;    /* Complex animations */
  --duration-slowest: 500ms;   /* Page loads, large movements */
}
```

### Easing Functions

```css
:root {
  /* Standard easing */
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);        /* Material ease-in-out */
  --ease-in: cubic-bezier(0.4, 0, 1, 1);               /* Accelerate */
  --ease-out: cubic-bezier(0, 0, 0.2, 1);              /* Decelerate */
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);         /* Smooth */

  /* Special easing */
  --ease-sharp: cubic-bezier(0.4, 0, 0.6, 1);          /* Quick, decisive */
  --ease-smooth: cubic-bezier(0.25, 0.1, 0.25, 1);     /* Very smooth */
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55); /* Overshoot */
  --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275); /* Subtle spring */
}
```

**Usage Guidelines:**

- **Hover states**: `--ease-out` + `--duration-normal` (200ms)
- **Button presses**: `--ease-sharp` + `--duration-fast` (150ms)
- **Card movements**: `--ease-smooth` + `--duration-slow` (300ms)
- **Page transitions**: `--ease-default` + `--duration-slower` (400ms)
- **Progress animations**: `linear` for consistent speed

---

## Interactive State Animations

### 1. Hover Effects

**Glass Surface Hover** (Cards, Buttons, Navigation Items)

```css
.glass-hover {
  transition:
    background 200ms cubic-bezier(0, 0, 0.2, 1),
    border-color 200ms cubic-bezier(0, 0, 0.2, 1),
    box-shadow 200ms cubic-bezier(0, 0, 0.2, 1),
    transform 200ms cubic-bezier(0, 0, 0.2, 1);
}

.glass-hover:hover {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.18),
    rgba(255, 255, 255, 0.10)
  );
  border-color: rgba(255, 255, 255, 0.20);
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.20),
    0 4px 8px rgba(0, 0, 0, 0.12),
    inset 0 1px 3px rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}
```

**Tailwind Implementation:**

```tsx
<div className="backdrop-blur-glass-medium bg-gradient-to-br from-white/15 to-white/8 border border-white/12 rounded-glass-xl p-6 transition-all duration-200 hover:from-white/18 hover:to-white/10 hover:border-white/20 hover:shadow-[0_8px_24px_rgba(0,0,0,0.20),0_4px_8px_rgba(0,0,0,0.12)] hover:-translate-y-0.5">
  {/* Card content */}
</div>
```

---

**Glow Hover Effect** (Primary Buttons, Active Tasks)

```css
.glass-glow-hover {
  transition:
    box-shadow 300ms cubic-bezier(0, 0, 0.2, 1),
    border-color 300ms cubic-bezier(0, 0, 0.2, 1),
    transform 200ms cubic-bezier(0, 0, 0.2, 1);
}

.glass-glow-hover:hover {
  box-shadow:
    0 0 24px rgba(59, 130, 246, 0.5),
    0 0 48px rgba(59, 130, 246, 0.25),
    0 4px 16px rgba(0, 0, 0, 0.16),
    inset 0 1px 3px rgba(255, 255, 255, 0.2);
  border-color: rgba(59, 130, 246, 0.60);
  transform: translateY(-1px);
}
```

---

**Depth Change Hover** (Navigation Items, Sidebar)

```css
.glass-depth-hover {
  transition:
    transform 200ms cubic-bezier(0, 0, 0.2, 1),
    padding-left 200ms cubic-bezier(0, 0, 0.2, 1);
}

.glass-depth-hover:hover {
  transform: translateX(4px);
  padding-left: 20px;
}
```

---

### 2. Click/Press States

**Active State** (Button Press)

```css
.glass-active {
  transition: all 150ms cubic-bezier(0.4, 0, 0.6, 1);
}

.glass-active:active {
  transform: translateY(0) scale(0.98);
  box-shadow:
    inset 0 2px 4px rgba(0, 0, 0, 0.12),
    inset 0 1px 2px rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.10);
}
```

**Ripple Effect** (Optional Touch Feedback)

```tsx
// React implementation with framer-motion
import { motion } from 'framer-motion';

function RippleButton({ children, onClick }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className="glass-button"
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}
```

---

### 3. Focus States

**Keyboard Focus Ring**

```css
.glass-focus:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 3px rgba(59, 130, 246, 0.50),
    0 0 0 6px rgba(59, 130, 246, 0.20),
    0 4px 16px rgba(0, 0, 0, 0.16);
  border-color: rgba(59, 130, 246, 0.60);

  /* Animate the focus ring */
  animation: focusPulse 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

@keyframes focusPulse {
  0%, 100% {
    box-shadow:
      0 0 0 3px rgba(59, 130, 246, 0.50),
      0 0 0 6px rgba(59, 130, 246, 0.20);
  }
  50% {
    box-shadow:
      0 0 0 3px rgba(59, 130, 246, 0.60),
      0 0 0 6px rgba(59, 130, 246, 0.30);
  }
}
```

**Tailwind Implementation:**

```tsx
<button className="glass-button focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:border-blue-500/60">
  {/* Button content */}
</button>
```

---

### 4. Disabled States

**Disabled Appearance**

```css
.glass-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;

  /* Reduce glass effect */
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(5px);

  /* Remove shadow */
  box-shadow: none;

  /* Disable all transitions */
  transition: none;
}
```

---

## Component-Specific Animations

### 5. Card Animations

**Card Entry Animation**

```css
@keyframes cardSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.glass-card-enter {
  animation: cardSlideIn 400ms cubic-bezier(0.25, 0.1, 0.25, 1);
}
```

**Staggered List Animation**

```tsx
// React with framer-motion
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

function TaskList({ tasks }) {
  return (
    <motion.div variants={container} initial="hidden" animate="show">
      {tasks.map((task) => (
        <motion.div key={task.id} variants={item}>
          <TaskCard task={task} />
        </motion.div>
      ))}
    </motion.div>
  );
}
```

---

### 6. Progress Bar Animations

**Shimmer Effect** (Running Task Progress)

```css
@keyframes progressShimmer {
  0%, 100% {
    background-position: 0% 0%;
  }
  50% {
    background-position: 100% 0%;
  }
}

.glass-progress-bar {
  background: linear-gradient(
    90deg,
    rgba(59, 130, 246, 0.8) 0%,
    rgba(59, 130, 246, 1.0) 50%,
    rgba(59, 130, 246, 0.8) 100%
  );
  background-size: 200% 100%;
  animation: progressShimmer 2s ease-in-out infinite;

  /* Smooth width transitions */
  transition: width 300ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

**Pulse Effect** (Indeterminate Progress)

```css
@keyframes progressPulse {
  0%, 100% {
    opacity: 0.6;
    transform: scaleX(0.95);
  }
  50% {
    opacity: 1;
    transform: scaleX(1);
  }
}

.glass-progress-indeterminate {
  animation: progressPulse 1.5s ease-in-out infinite;
}
```

---

### 7. Modal/Dialog Animations

**Modal Entry** (Backdrop + Content)

```css
/* Backdrop fade in */
@keyframes backdropFadeIn {
  from {
    opacity: 0;
    backdrop-filter: blur(0px);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(8px);
  }
}

.glass-modal-backdrop {
  animation: backdropFadeIn 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Modal slide up + fade in */
@keyframes modalSlideUp {
  from {
    opacity: 0;
    transform: translate(-50%, -48%) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

.glass-modal {
  animation: modalSlideUp 300ms cubic-bezier(0.25, 0.1, 0.25, 1);
}
```

**Modal Exit**

```css
@keyframes modalSlideDown {
  from {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  to {
    opacity: 0;
    transform: translate(-50%, -48%) scale(0.95);
  }
}

.glass-modal-exit {
  animation: modalSlideDown 200ms cubic-bezier(0.4, 0, 1, 1);
}
```

**Framer Motion Implementation:**

```tsx
import { AnimatePresence, motion } from 'framer-motion';

function Modal({ isOpen, onClose, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-[8px] z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-51"
          >
            <div className="glass-modal">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

---

### 8. Dropdown/Menu Animations

**Dropdown Slide Down**

```css
@keyframes dropdownSlideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.glass-dropdown {
  animation: dropdownSlideDown 150ms cubic-bezier(0, 0, 0.2, 1);
  transform-origin: top;
}
```

**Menu Item Hover**

```css
.glass-menu-item {
  transition: all 150ms cubic-bezier(0, 0, 0.2, 1);
}

.glass-menu-item:hover {
  background: rgba(255, 255, 255, 0.10);
  padding-left: 20px;
  transform: translateX(4px);
}
```

---

### 9. Tooltip Animations

**Tooltip Fade In + Slide**

```css
@keyframes tooltipFadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.glass-tooltip {
  animation: tooltipFadeIn 150ms cubic-bezier(0, 0, 0.2, 1);
}
```

---

### 10. Loading States

**Skeleton Shimmer** (Loading Placeholder)

```css
@keyframes skeletonShimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.glass-skeleton {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.10) 50%,
    rgba(255, 255, 255, 0.05) 100%
  );
  background-size: 200% 100%;
  animation: skeletonShimmer 1.5s ease-in-out infinite;
  border-radius: 8px;
}
```

**Spinner** (Loading Indicator)

```css
@keyframes spinnerRotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.glass-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: rgba(59, 130, 246, 0.8);
  border-radius: 50%;
  animation: spinnerRotate 800ms linear infinite;
}
```

---

## Page Transition Animations

### 11. Route Transitions

**Fade + Slide Transition**

```tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const pageVariants = {
  initial: {
    opacity: 0,
    x: -20,
  },
  enter: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1],
    },
  },
};

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
      >
        <Routes location={location}>
          {/* Your routes */}
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}
```

---

## Advanced Glass Effects

### 12. Glass Refraction Effect

**Simulated Light Refraction** (Hover Over Glass)

```css
.glass-refraction {
  position: relative;
  overflow: hidden;
}

.glass-refraction::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.15) 0%,
    transparent 60%
  );
  opacity: 0;
  transition: opacity 300ms cubic-bezier(0, 0, 0.2, 1);
  pointer-events: none;
}

.glass-refraction:hover::before {
  opacity: 1;
}
```

**Interactive Implementation:**

```tsx
function GlassRefractionCard({ children }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      className="glass-card relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <div
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.15) 0%, transparent 50%)`,
        }}
      />
      {children}
    </div>
  );
}
```

---

### 13. Parallax Glass Layers

**Depth Parallax** (Scroll-based)

```tsx
import { useScroll, useTransform, motion } from 'framer-motion';

function ParallaxGlassSection() {
  const { scrollY } = useScroll();

  const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);
  const foregroundY = useTransform(scrollY, [0, 500], [0, 50]);

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background layer */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 backdrop-blur-glass-heavy bg-white/5"
      />

      {/* Foreground layer */}
      <motion.div
        style={{ y: foregroundY }}
        className="absolute inset-0 backdrop-blur-glass-medium bg-white/10"
      />

      {/* Content */}
      <div className="relative z-10">{/* Content */}</div>
    </div>
  );
}
```

---

### 14. Dynamic Blur Effect

**Scroll-based Blur Intensity**

```tsx
import { useEffect, useState } from 'react';

function useScrollBlur(maxBlur = 15) {
  const [blur, setBlur] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const newBlur = Math.min((scrollY / 100) * 2, maxBlur);
      setBlur(newBlur);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [maxBlur]);

  return blur;
}

function DynamicBlurHeader() {
  const blur = useScrollBlur();

  return (
    <header
      className="glass-header transition-all duration-200"
      style={{
        backdropFilter: `blur(${blur}px)`,
      }}
    >
      {/* Header content */}
    </header>
  );
}
```

---

## Micro-Interactions

### 15. Toggle Switch Animation

```tsx
function GlassToggle({ checked, onChange }) {
  return (
    <motion.button
      className={cn(
        'relative w-12 h-6 rounded-full transition-colors duration-200',
        checked
          ? 'bg-gradient-to-r from-blue-500/30 to-blue-500/20 border-blue-500/40'
          : 'bg-white/8 border-white/12'
      )}
      onClick={() => onChange(!checked)}
    >
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={cn(
          'absolute top-0.5 w-5 h-5 rounded-full backdrop-blur-glass-light border',
          checked
            ? 'left-[26px] bg-blue-400/50 border-blue-400/60'
            : 'left-0.5 bg-white/20 border-white/30'
        )}
      />
    </motion.button>
  );
}
```

---

### 16. Number Counter Animation

```tsx
import { animate } from 'framer-motion';
import { useEffect, useRef } from 'react';

function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const controls = animate(0, value, {
      duration: 1,
      ease: [0.25, 0.1, 0.25, 1],
      onUpdate(latest) {
        node.textContent = latest.toFixed(0);
      },
    });

    return () => controls.stop();
  }, [value]);

  return <span ref={ref} className="font-mono text-primary" />;
}
```

---

## Performance Optimization

### 17. Animation Best Practices

**Use `will-change` for Animated Elements**

```css
.glass-animated {
  will-change: transform, opacity;
}

/* Remove after animation completes */
.glass-animated.animation-done {
  will-change: auto;
}
```

**Debounce Expensive Animations**

```typescript
import { debounce } from 'lodash-es';

const handleScroll = debounce(() => {
  // Expensive animation logic
}, 16); // ~60fps
```

**Use GPU Acceleration**

```css
.glass-gpu-accelerated {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}
```

---

## Reduced Motion Support

### 18. Accessibility

Always respect user motion preferences:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .glass-component {
    transition: none;
  }
}
```

**React Hook for Reduced Motion:**

```typescript
function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}
```

---

## Animation Testing

### 19. Debug Animations

```tsx
// Animation debug mode
function AnimationDebugger() {
  useEffect(() => {
    document.documentElement.style.setProperty('--debug-animations', '1');

    // Slow down all animations 10x
    const style = document.createElement('style');
    style.textContent = `
      * {
        animation-duration: calc(var(--original-duration, 1s) * 10) !important;
        transition-duration: calc(var(--original-duration, 1s) * 10) !important;
      }
    `;
    document.head.appendChild(style);

    return () => document.head.removeChild(style);
  }, []);

  return null;
}
```

---

This comprehensive animation and interaction guide provides everything needed to implement smooth, purposeful, and delightful motion design in the FFmpeg GUI glassmorphism system.
