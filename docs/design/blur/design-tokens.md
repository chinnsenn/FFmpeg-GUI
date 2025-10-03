# Design Tokens - Glassmorphism System

This document defines all design tokens (variables) for the FFmpeg GUI glassmorphism design system. These tokens should be implemented as CSS custom properties and Tailwind configuration.

## Glass Effect Variants

### Blur Intensity Scale

```css
/* CSS Custom Properties */
:root {
  --blur-none: 0px;
  --blur-subtle: 5px;
  --blur-light: 8px;
  --blur-medium: 10px;
  --blur-strong: 12px;
  --blur-heavy: 15px;
  --blur-ultra: 20px;
}
```

**Usage Guidelines:**
- `blur-none`: Solid surfaces (overlays with no blur)
- `blur-subtle`: Tertiary elements, minimal glass effect
- `blur-light`: Interactive elements (buttons, inputs)
- `blur-medium`: Secondary surfaces (cards, panels)
- `blur-strong`: Primary surfaces (sidebar, main containers)
- `blur-heavy`: Modal overlays, dialogs
- `blur-ultra`: Special effects only (hero sections, emphasis)

### Glass Background Alpha

```css
:root {
  /* Light glass tints (on dark backgrounds) */
  --glass-alpha-minimal: rgba(255, 255, 255, 0.05);
  --glass-alpha-subtle: rgba(255, 255, 255, 0.08);
  --glass-alpha-light: rgba(255, 255, 255, 0.10);
  --glass-alpha-medium: rgba(255, 255, 255, 0.15);
  --glass-alpha-strong: rgba(255, 255, 255, 0.20);

  /* Dark glass tints (for light mode) */
  --glass-dark-alpha-minimal: rgba(0, 0, 0, 0.05);
  --glass-dark-alpha-subtle: rgba(0, 0, 0, 0.08);
  --glass-dark-alpha-light: rgba(0, 0, 0, 0.10);
  --glass-dark-alpha-medium: rgba(0, 0, 0, 0.15);
  --glass-dark-alpha-strong: rgba(0, 0, 0, 0.20);

  /* Colored glass tints */
  --glass-blue-alpha: rgba(59, 130, 246, 0.12);
  --glass-purple-alpha: rgba(139, 92, 246, 0.12);
  --glass-green-alpha: rgba(34, 197, 94, 0.12);
  --glass-red-alpha: rgba(239, 68, 68, 0.12);
  --glass-amber-alpha: rgba(245, 158, 11, 0.12);
}
```

### Glass Surface Presets

```css
:root {
  /* Primary Glass Surface - Sidebar, Main Container */
  --glass-surface-primary:
    linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.10),
      rgba(255, 255, 255, 0.05)
    );
  --glass-surface-primary-blur: 12px;

  /* Secondary Glass Surface - Cards, Panels */
  --glass-surface-secondary:
    linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.15),
      rgba(255, 255, 255, 0.08)
    );
  --glass-surface-secondary-blur: 10px;

  /* Tertiary Glass Surface - Buttons, Inputs */
  --glass-surface-tertiary:
    linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.12),
      rgba(255, 255, 255, 0.06)
    );
  --glass-surface-tertiary-blur: 8px;

  /* Overlay Glass - Modals, Dropdowns */
  --glass-surface-overlay:
    linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.18),
      rgba(255, 255, 255, 0.10)
    );
  --glass-surface-overlay-blur: 15px;
}
```

## Color Palette

### Background Gradients

```css
:root {
  /* Primary Dark Gradient - Main Background */
  --bg-gradient-primary:
    linear-gradient(
      135deg,
      #0f172a 0%,
      #1e293b 50%,
      #0f172a 100%
    );

  /* Secondary Dark Gradient - Alternative */
  --bg-gradient-secondary:
    linear-gradient(
      135deg,
      #1e1b4b 0%,
      #312e81 50%,
      #1e1b4b 100%
    );

  /* Accent Gradient - Hero Sections */
  --bg-gradient-accent:
    linear-gradient(
      135deg,
      #1e293b 0%,
      #334155 25%,
      #1e40af 50%,
      #334155 75%,
      #1e293b 100%
    );

  /* Subtle Pattern Overlay */
  --bg-pattern-noise: url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
}
```

### Glass Tint Colors

```css
:root {
  /* Neutral Glass */
  --glass-tint-neutral: rgba(255, 255, 255, 0.10);

  /* State-based Tints */
  --glass-tint-success: rgba(34, 197, 94, 0.12);
  --glass-tint-warning: rgba(245, 158, 11, 0.12);
  --glass-tint-error: rgba(239, 68, 68, 0.12);
  --glass-tint-info: rgba(59, 130, 246, 0.12);

  /* Task State Tints */
  --glass-tint-pending: rgba(148, 163, 184, 0.10);
  --glass-tint-running: rgba(59, 130, 246, 0.15);
  --glass-tint-completed: rgba(34, 197, 94, 0.12);
  --glass-tint-failed: rgba(239, 68, 68, 0.12);
  --glass-tint-paused: rgba(245, 158, 11, 0.12);
}
```

### Text Colors

```css
:root {
  /* Primary Text - High Contrast */
  --text-primary: rgba(255, 255, 255, 0.95);
  --text-primary-rgb: 255, 255, 255;

  /* Secondary Text - Medium Contrast */
  --text-secondary: rgba(255, 255, 255, 0.75);

  /* Tertiary Text - Low Contrast */
  --text-tertiary: rgba(255, 255, 255, 0.55);

  /* Disabled Text */
  --text-disabled: rgba(255, 255, 255, 0.35);

  /* Accent Text */
  --text-accent: #60a5fa; /* blue-400 */
  --text-success: #4ade80; /* green-400 */
  --text-warning: #fbbf24; /* amber-400 */
  --text-error: #f87171; /* red-400 */
}
```

### Accent Colors

```css
:root {
  /* Primary Accent - Blue */
  --accent-primary: #3b82f6; /* blue-500 */
  --accent-primary-light: #60a5fa; /* blue-400 */
  --accent-primary-dark: #2563eb; /* blue-600 */

  /* Secondary Accent - Purple */
  --accent-secondary: #8b5cf6; /* violet-500 */
  --accent-secondary-light: #a78bfa; /* violet-400 */
  --accent-secondary-dark: #7c3aed; /* violet-600 */

  /* Semantic Colors */
  --color-success: #22c55e; /* green-500 */
  --color-warning: #f59e0b; /* amber-500 */
  --color-error: #ef4444; /* red-500 */
  --color-info: #3b82f6; /* blue-500 */
}
```

## Spacing & Sizing

### Spacing Scale

```css
:root {
  /* Base unit: 4px (0.25rem) */
  --space-0: 0;
  --space-1: 0.25rem; /* 4px */
  --space-2: 0.5rem;  /* 8px */
  --space-3: 0.75rem; /* 12px */
  --space-4: 1rem;    /* 16px */
  --space-5: 1.25rem; /* 20px */
  --space-6: 1.5rem;  /* 24px */
  --space-8: 2rem;    /* 32px */
  --space-10: 2.5rem; /* 40px */
  --space-12: 3rem;   /* 48px */
  --space-16: 4rem;   /* 64px */
  --space-20: 5rem;   /* 80px */
  --space-24: 6rem;   /* 96px */
}
```

**Glass Component Spacing:**
- Inner padding: `--space-6` (24px) for cards
- Section gaps: `--space-8` (32px) between panels
- Sidebar padding: `--space-6` (24px)
- Button padding: `--space-3 --space-6` (12px 24px)

### Border Radius

```css
:root {
  --radius-none: 0;
  --radius-sm: 0.375rem;  /* 6px - Small elements */
  --radius-md: 0.5rem;    /* 8px - Buttons, inputs */
  --radius-lg: 0.75rem;   /* 12px - Cards */
  --radius-xl: 1rem;      /* 16px - Panels */
  --radius-2xl: 1.25rem;  /* 20px - Modals */
  --radius-3xl: 1.5rem;   /* 24px - Hero sections */
  --radius-full: 9999px;  /* Fully rounded */
}
```

**Glass Component Radius:**
- Sidebar: `--radius-none` (edge-to-edge)
- Cards: `--radius-xl` (16px)
- Buttons: `--radius-lg` (12px)
- Inputs: `--radius-md` (8px)
- Modals: `--radius-2xl` (20px)

## Shadows & Glows

### Shadow Definitions

```css
:root {
  /* Depth Shadows - For glass elevation */
  --shadow-glass-sm:
    0 2px 8px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.08);

  --shadow-glass-md:
    0 4px 16px rgba(0, 0, 0, 0.16),
    0 2px 4px rgba(0, 0, 0, 0.10);

  --shadow-glass-lg:
    0 8px 32px rgba(0, 0, 0, 0.20),
    0 4px 8px rgba(0, 0, 0, 0.12);

  --shadow-glass-xl:
    0 16px 48px rgba(0, 0, 0, 0.24),
    0 8px 16px rgba(0, 0, 0, 0.14);

  /* Glow Shadows - For interactive states */
  --shadow-glow-blue:
    0 0 20px rgba(59, 130, 246, 0.3),
    0 0 40px rgba(59, 130, 246, 0.15);

  --shadow-glow-purple:
    0 0 20px rgba(139, 92, 246, 0.3),
    0 0 40px rgba(139, 92, 246, 0.15);

  --shadow-glow-green:
    0 0 20px rgba(34, 197, 94, 0.3),
    0 0 40px rgba(34, 197, 94, 0.15);
}
```

### Inner Glow (Borders)

```css
:root {
  /* Subtle inner glow for glass edges */
  --inner-glow-subtle: inset 0 1px 2px rgba(255, 255, 255, 0.1);
  --inner-glow-medium: inset 0 1px 3px rgba(255, 255, 255, 0.15);
  --inner-glow-strong: inset 0 2px 4px rgba(255, 255, 255, 0.2);
}
```

## Border Styles

### Glass Borders

```css
:root {
  /* Border Colors */
  --border-glass-subtle: rgba(255, 255, 255, 0.08);
  --border-glass-light: rgba(255, 255, 255, 0.12);
  --border-glass-medium: rgba(255, 255, 255, 0.18);
  --border-glass-strong: rgba(255, 255, 255, 0.25);

  /* Border Widths */
  --border-width-thin: 1px;
  --border-width-medium: 1.5px;
  --border-width-thick: 2px;

  /* Combined Border Styles */
  --border-glass-default: 1px solid rgba(255, 255, 255, 0.12);
  --border-glass-hover: 1.5px solid rgba(255, 255, 255, 0.18);
  --border-glass-focus: 2px solid rgba(59, 130, 246, 0.5);
}
```

## Typography Scale

### Font Families

```css
:root {
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', 'Consolas', monospace;
}
```

### Font Sizes

```css
:root {
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
}
```

### Font Weights

```css
:root {
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

### Line Heights

```css
:root {
  --leading-none: 1;
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;
}
```

## Transitions & Animations

### Timing Functions

```css
:root {
  /* Easing curves */
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-sharp: cubic-bezier(0.4, 0, 0.6, 1);
  --ease-smooth: cubic-bezier(0.25, 0.1, 0.25, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

### Duration Scale

```css
:root {
  --duration-instant: 100ms;
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --duration-slower: 400ms;
  --duration-slowest: 500ms;
}
```

### Transition Presets

```css
:root {
  /* Glass transitions */
  --transition-glass-default:
    background 200ms cubic-bezier(0.4, 0, 0.2, 1),
    backdrop-filter 200ms cubic-bezier(0.4, 0, 0.2, 1),
    border-color 200ms cubic-bezier(0.4, 0, 0.2, 1);

  --transition-glass-depth:
    transform 200ms cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1);

  --transition-glass-glow:
    box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1),
    border-color 300ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

## Z-Index Scale

```css
:root {
  --z-base: 0;
  --z-dropdown: 10;
  --z-sticky: 20;
  --z-fixed: 30;
  --z-modal-backdrop: 40;
  --z-modal: 50;
  --z-popover: 60;
  --z-tooltip: 70;
  --z-toast: 80;
  --z-dialog: 90;
  --z-priority: 100;
}
```

**Glass Layer Z-Index:**
- Background: `--z-base` (0)
- Sidebar: `--z-sticky` (20)
- Header: `--z-sticky` (20)
- Cards/Panels: `--z-base` (0 to 10)
- Modals: `--z-modal` (50)
- Dropdowns: `--z-dropdown` (10)
- Tooltips: `--z-tooltip` (70)

## Breakpoints

```css
:root {
  /* Desktop-first approach (Electron app) */
  --breakpoint-xs: 480px;
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
  --breakpoint-3xl: 1920px;
}
```

## Component-Specific Tokens

### Sidebar

```css
:root {
  --sidebar-width: 240px;
  --sidebar-width-collapsed: 64px;
  --sidebar-bg: var(--glass-surface-primary);
  --sidebar-blur: var(--blur-strong);
  --sidebar-border: var(--border-glass-light);
}
```

### Header

```css
:root {
  --header-height: 64px;
  --header-bg: var(--glass-surface-primary);
  --header-blur: var(--blur-strong);
  --header-border: var(--border-glass-subtle);
}
```

### Cards

```css
:root {
  --card-bg: var(--glass-surface-secondary);
  --card-blur: var(--blur-medium);
  --card-border: var(--border-glass-light);
  --card-shadow: var(--shadow-glass-md);
  --card-radius: var(--radius-xl);
  --card-padding: var(--space-6);
}
```

### Buttons

```css
:root {
  --button-bg: var(--glass-surface-tertiary);
  --button-blur: var(--blur-light);
  --button-border: var(--border-glass-light);
  --button-shadow: var(--shadow-glass-sm);
  --button-radius: var(--radius-lg);
  --button-padding-x: var(--space-6);
  --button-padding-y: var(--space-3);
}
```

## Usage in Tailwind Config

These tokens should be mapped to Tailwind configuration:

```javascript
// tailwind.config.js example
module.exports = {
  theme: {
    extend: {
      backdropBlur: {
        'glass-subtle': '5px',
        'glass-light': '8px',
        'glass-medium': '10px',
        'glass-strong': '12px',
        'glass-heavy': '15px',
      },
      backgroundColor: {
        'glass-light': 'rgba(255, 255, 255, 0.10)',
        'glass-medium': 'rgba(255, 255, 255, 0.15)',
        // ... etc
      },
      // ... other extensions
    }
  }
}
```

## Performance Considerations

**Optimization Tokens:**

```css
:root {
  /* GPU acceleration hints */
  --will-change-glass: transform, backdrop-filter, opacity;

  /* Reduced motion alternatives */
  --blur-reduced-motion: 0px;
  --transition-reduced-motion: none;
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --transition-glass-default: none;
    --transition-glass-depth: none;
    --transition-glass-glow: none;
  }
}
```

These design tokens provide a complete foundation for implementing the glassmorphism design system. All values are carefully chosen to balance aesthetics with performance and usability.
