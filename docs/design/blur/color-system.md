# Color System - Glassmorphism Design

This document defines the comprehensive color system for the FFmpeg GUI glassmorphism design, including background treatments, glass tints, text colors, and semantic color applications.

## Philosophy

The color system is designed with three core principles:

1. **Depth Through Color**: Colors create spatial hierarchy through subtle gradients and layering
2. **Readability First**: All text maintains WCAG AAA contrast (7:1 minimum) against glass backgrounds
3. **Semantic Clarity**: Colors convey meaning (status, actions, states) without ambiguity

## Background System

### Primary Background Gradients

The app uses rich, dark gradients as the canvas for glass effects.

**Dark Navy Gradient (Primary)**
```css
.bg-primary {
  background: linear-gradient(
    135deg,
    #0f172a 0%,      /* slate-900 */
    #1e293b 25%,     /* slate-800 */
    #334155 50%,     /* slate-700 */
    #1e293b 75%,     /* slate-800 */
    #0f172a 100%     /* slate-900 */
  );
}
```
**Usage**: Main application background
**Mood**: Professional, stable, technical

---

**Deep Purple Gradient (Alternative)**
```css
.bg-secondary {
  background: linear-gradient(
    135deg,
    #1e1b4b 0%,      /* indigo-950 */
    #312e81 25%,     /* indigo-900 */
    #4c1d95 50%,     /* purple-900 */
    #312e81 75%,     /* indigo-900 */
    #1e1b4b 100%     /* indigo-950 */
  );
}
```
**Usage**: Alternative theme, settings/preferences
**Mood**: Creative, premium, sophisticated

---

**Charcoal Gray Gradient (Minimal)**
```css
.bg-minimal {
  background: linear-gradient(
    135deg,
    #18181b 0%,      /* zinc-900 */
    #27272a 50%,     /* zinc-800 */
    #18181b 100%     /* zinc-900 */
  );
}
```
**Usage**: Distraction-free work mode
**Mood**: Clean, minimal, focused

---

**Blue Accent Gradient (Hero Sections)**
```css
.bg-accent {
  background: linear-gradient(
    135deg,
    #1e293b 0%,      /* slate-800 */
    #334155 20%,     /* slate-700 */
    #1e40af 50%,     /* blue-800 */
    #334155 80%,     /* slate-700 */
    #1e293b 100%     /* slate-800 */
  );
}
```
**Usage**: Home page hero, feature highlights
**Mood**: Dynamic, modern, engaging

---

### Background Patterns & Textures

**Subtle Noise Texture**
```css
.bg-noise {
  background-image: url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
}
```
**Purpose**: Add subtle texture to prevent flat appearance
**Opacity**: 3% (barely perceptible)

---

**Grid Pattern (Optional)**
```css
.bg-grid {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 32px 32px;
}
```
**Purpose**: Technical aesthetic for settings/advanced features
**Opacity**: 2% (very subtle)

---

**Radial Gradient Overlay**
```css
.bg-radial-overlay {
  background: radial-gradient(
    circle at 50% 0%,
    rgba(59, 130, 246, 0.08) 0%,
    transparent 50%
  );
}
```
**Purpose**: Add depth to hero sections
**Position**: Top center

---

## Glass Tint System

Glass tints are semi-transparent color overlays applied to glass surfaces.

### Neutral Glass Tints

**Pure White Glass** (Default)
```css
--glass-white-5: rgba(255, 255, 255, 0.05);
--glass-white-8: rgba(255, 255, 255, 0.08);
--glass-white-10: rgba(255, 255, 255, 0.10);
--glass-white-12: rgba(255, 255, 255, 0.12);
--glass-white-15: rgba(255, 255, 255, 0.15);
--glass-white-18: rgba(255, 255, 255, 0.18);
--glass-white-20: rgba(255, 255, 255, 0.20);
--glass-white-25: rgba(255, 255, 255, 0.25);
```

**Usage Hierarchy**:
- `5%`: Minimal surfaces (backgrounds)
- `8-10%`: Tertiary surfaces (inputs, buttons)
- `12-15%`: Secondary surfaces (cards, panels)
- `18-20%`: Primary surfaces (sidebar, header)
- `25%`: Elevated surfaces (modals, overlays)

---

**Cool Gray Glass** (Subtle blue tint)
```css
--glass-gray-8: rgba(148, 163, 184, 0.08);   /* slate-400 */
--glass-gray-10: rgba(148, 163, 184, 0.10);
--glass-gray-15: rgba(148, 163, 184, 0.15);
```
**Usage**: Disabled states, inactive elements

---

### Semantic Glass Tints

**Blue Glass** (Primary Actions)
```css
--glass-blue-8: rgba(59, 130, 246, 0.08);    /* blue-500 */
--glass-blue-12: rgba(59, 130, 246, 0.12);
--glass-blue-15: rgba(59, 130, 246, 0.15);
--glass-blue-20: rgba(59, 130, 246, 0.20);
--glass-blue-25: rgba(59, 130, 246, 0.25);
```
**Usage**: Primary buttons, active states, running tasks, links

---

**Green Glass** (Success)
```css
--glass-green-8: rgba(34, 197, 94, 0.08);    /* green-500 */
--glass-green-12: rgba(34, 197, 94, 0.12);
--glass-green-15: rgba(34, 197, 94, 0.15);
```
**Usage**: Completed tasks, success messages, confirmation actions

---

**Red Glass** (Error/Danger)
```css
--glass-red-8: rgba(239, 68, 68, 0.08);      /* red-500 */
--glass-red-12: rgba(239, 68, 68, 0.12);
--glass-red-15: rgba(239, 68, 68, 0.15);
--glass-red-20: rgba(239, 68, 68, 0.20);
```
**Usage**: Failed tasks, error states, destructive actions, warnings

---

**Amber Glass** (Warning/Paused)
```css
--glass-amber-8: rgba(245, 158, 11, 0.08);   /* amber-500 */
--glass-amber-12: rgba(245, 158, 11, 0.12);
--glass-amber-15: rgba(245, 158, 11, 0.15);
```
**Usage**: Paused tasks, warnings, caution states

---

**Purple Glass** (Secondary Actions)
```css
--glass-purple-8: rgba(139, 92, 246, 0.08);  /* violet-500 */
--glass-purple-12: rgba(139, 92, 246, 0.12);
--glass-purple-15: rgba(139, 92, 246, 0.15);
```
**Usage**: Secondary buttons, premium features, special states

---

## Text Color System

All text colors are designed to meet WCAG AAA contrast standards (7:1) on glass backgrounds.

### Primary Text

**High Contrast White**
```css
--text-primary: rgba(255, 255, 255, 0.95);
--text-primary-rgb: 255, 255, 255;
```
**Contrast Ratio**: ~14:1 on dark backgrounds
**Usage**: Headings, important labels, primary content
**Font Weights**: 600-700 (semibold-bold)

---

### Secondary Text

**Medium Contrast White**
```css
--text-secondary: rgba(255, 255, 255, 0.75);
```
**Contrast Ratio**: ~10:1
**Usage**: Body text, descriptions, secondary labels
**Font Weights**: 400-500 (normal-medium)

---

### Tertiary Text

**Low Contrast White**
```css
--text-tertiary: rgba(255, 255, 255, 0.55);
```
**Contrast Ratio**: ~7:1 (meets WCAG AAA minimum)
**Usage**: Hints, placeholders, timestamps, metadata
**Font Weights**: 400-500

---

### Disabled Text

```css
--text-disabled: rgba(255, 255, 255, 0.35);
```
**Contrast Ratio**: ~4.5:1 (meets WCAG AA for disabled)
**Usage**: Disabled inputs, inactive options
**Font Weights**: 400

---

### Accent Text Colors

**Blue (Primary Accent)**
```css
--text-blue-300: #93c5fd;   /* Lighter for emphasis */
--text-blue-400: #60a5fa;   /* Standard accent */
--text-blue-500: #3b82f6;   /* Darker for contrast */
```
**Usage**: Links, primary CTAs, active navigation items

---

**Green (Success)**
```css
--text-green-300: #86efac;
--text-green-400: #4ade80;
--text-green-500: #22c55e;
```
**Usage**: Success messages, completed status, positive metrics

---

**Red (Error)**
```css
--text-red-300: #fca5a5;
--text-red-400: #f87171;
--text-red-500: #ef4444;
```
**Usage**: Error messages, failed status, warnings, destructive actions

---

**Amber (Warning)**
```css
--text-amber-300: #fcd34d;
--text-amber-400: #fbbf24;
--text-amber-500: #f59e0b;
```
**Usage**: Warning messages, paused status, caution indicators

---

**Purple (Secondary)**
```css
--text-purple-300: #c4b5fd;
--text-purple-400: #a78bfa;
--text-purple-500: #8b5cf6;
```
**Usage**: Secondary accents, premium features, special tags

---

## State-Based Color System

Colors for different application states and task statuses.

### Task Status Colors

**Pending**
```css
.task-pending {
  /* Glass tint */
  background: linear-gradient(
    135deg,
    rgba(148, 163, 184, 0.12),  /* slate-400 */
    rgba(148, 163, 184, 0.06)
  );
  border-color: rgba(148, 163, 184, 0.25);
}
.task-pending-text {
  color: #cbd5e1; /* slate-300 */
}
```

---

**Running (Active)**
```css
.task-running {
  /* Glass tint with blue */
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.20),
    rgba(59, 130, 246, 0.12)
  );
  border-color: rgba(59, 130, 246, 0.40);

  /* Glow effect */
  box-shadow:
    0 0 24px rgba(59, 130, 246, 0.30),
    0 4px 16px rgba(0, 0, 0, 0.16),
    inset 0 1px 2px rgba(255, 255, 255, 0.15);
}
.task-running-text {
  color: #60a5fa; /* blue-400 */
}
```

---

**Completed (Success)**
```css
.task-completed {
  /* Glass tint with green */
  background: linear-gradient(
    135deg,
    rgba(34, 197, 94, 0.15),
    rgba(34, 197, 94, 0.08)
  );
  border-color: rgba(34, 197, 94, 0.30);
}
.task-completed-text {
  color: #4ade80; /* green-400 */
}
```

---

**Failed (Error)**
```css
.task-failed {
  /* Glass tint with red */
  background: linear-gradient(
    135deg,
    rgba(239, 68, 68, 0.15),
    rgba(239, 68, 68, 0.08)
  );
  border-color: rgba(239, 68, 68, 0.30);
}
.task-failed-text {
  color: #f87171; /* red-400 */
}
```

---

**Paused**
```css
.task-paused {
  /* Glass tint with amber */
  background: linear-gradient(
    135deg,
    rgba(245, 158, 11, 0.15),
    rgba(245, 158, 11, 0.08)
  );
  border-color: rgba(245, 158, 11, 0.30);
}
.task-paused-text {
  color: #fbbf24; /* amber-400 */
}
```

---

**Cancelled**
```css
.task-cancelled {
  /* Glass tint with gray */
  background: linear-gradient(
    135deg,
    rgba(148, 163, 184, 0.10),
    rgba(148, 163, 184, 0.05)
  );
  border-color: rgba(148, 163, 184, 0.20);
}
.task-cancelled-text {
  color: #94a3b8; /* slate-400 */
}
```

---

### Interactive States

**Hover State**
```css
.interactive-hover {
  /* Increase glass opacity */
  background: rgba(255, 255, 255, 0.18);
  border-color: rgba(255, 255, 255, 0.25);

  /* Subtle glow */
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.12),
    inset 0 1px 3px rgba(255, 255, 255, 0.15);
}
```

---

**Active/Pressed State**
```css
.interactive-active {
  /* Reduce opacity slightly */
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.20);

  /* Inner shadow for depth */
  box-shadow:
    inset 0 2px 4px rgba(0, 0, 0, 0.10),
    inset 0 1px 2px rgba(255, 255, 255, 0.08);
}
```

---

**Focus State**
```css
.interactive-focus {
  /* Blue accent */
  border-color: rgba(59, 130, 246, 0.60);

  /* Focus ring */
  box-shadow:
    0 0 0 3px rgba(59, 130, 246, 0.30),
    0 0 0 6px rgba(59, 130, 246, 0.15);
}
```

---

**Disabled State**
```css
.interactive-disabled {
  /* Reduced opacity */
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.06);

  /* No shadow */
  box-shadow: none;

  /* Cursor */
  cursor: not-allowed;
  opacity: 0.5;
}
```

---

## Color Accessibility

### Contrast Requirements

All color combinations meet these standards:

| Text Size | Weight | Minimum Contrast | Target Contrast |
|-----------|--------|------------------|-----------------|
| < 18px | Normal | 7:1 (AAA) | 10:1+ |
| < 18px | Bold | 7:1 (AAA) | 10:1+ |
| ≥ 18px | Any | 4.5:1 (AA Large) | 7:1+ |
| UI Components | - | 3:1 | 4.5:1+ |

### Contrast Testing

Test all glass components with these background scenarios:

1. **Primary gradient** (slate-900 to slate-800)
2. **Behind glass blur** (with content underneath)
3. **Light content behind** (worst case for contrast)
4. **Dark content behind** (best case for contrast)

### Color Blindness Considerations

**Deuteranopia/Protanopia (Red-Green)**:
- Never rely solely on red vs. green
- Use icons + text labels
- Combine color with patterns/shapes

**Tritanopia (Blue-Yellow)**:
- Ensure blue and yellow are distinguishable by brightness
- Use high contrast for critical states

**Approach**: Always combine color with another indicator (icon, text, pattern)

---

## Dark Theme (Default)

The default theme uses the color system as defined above.

### Glass Layer Tints

| Layer | Background | Border | Shadow |
|-------|------------|--------|--------|
| Level 1 (Sidebar/Header) | `rgba(255,255,255,0.12)` | `rgba(255,255,255,0.12)` | `0 4px 16px rgba(0,0,0,0.16)` |
| Level 2 (Cards/Panels) | `rgba(255,255,255,0.15)` | `rgba(255,255,255,0.12)` | `0 4px 16px rgba(0,0,0,0.16)` |
| Level 3 (Buttons/Inputs) | `rgba(255,255,255,0.10)` | `rgba(255,255,255,0.12)` | `0 2px 8px rgba(0,0,0,0.12)` |
| Level 4 (Modals) | `rgba(255,255,255,0.20)` | `rgba(255,255,255,0.18)` | `0 16px 48px rgba(0,0,0,0.30)` |

---

## Light Theme (Optional)

For users who prefer light mode, the color system inverts:

### Light Background Gradients

**Light Gray Gradient**
```css
.bg-light-primary {
  background: linear-gradient(
    135deg,
    #f8fafc 0%,      /* slate-50 */
    #f1f5f9 50%,     /* slate-100 */
    #f8fafc 100%     /* slate-50 */
  );
}
```

### Dark Glass Tints (for Light Mode)

```css
--glass-dark-5: rgba(0, 0, 0, 0.05);
--glass-dark-8: rgba(0, 0, 0, 0.08);
--glass-dark-10: rgba(0, 0, 0, 0.10);
--glass-dark-15: rgba(0, 0, 0, 0.15);
--glass-dark-20: rgba(0, 0, 0, 0.20);
```

### Light Mode Text

```css
--text-light-primary: rgba(0, 0, 0, 0.95);
--text-light-secondary: rgba(0, 0, 0, 0.75);
--text-light-tertiary: rgba(0, 0, 0, 0.55);
```

**Note**: Light mode is less effective for glassmorphism. Consider it optional or secondary.

---

## Implementation Guidelines

### CSS Custom Properties Structure

```css
:root {
  /* Background */
  --bg-primary: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);

  /* Glass tints */
  --glass-white-10: rgba(255, 255, 255, 0.10);
  --glass-blue-15: rgba(59, 130, 246, 0.15);
  /* ... etc */

  /* Text colors */
  --text-primary: rgba(255, 255, 255, 0.95);
  /* ... etc */

  /* Semantic colors */
  --color-success: #22c55e;
  --color-error: #ef4444;
  /* ... etc */
}
```

### Tailwind CSS Configuration

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        glass: {
          white: {
            5: 'rgba(255, 255, 255, 0.05)',
            8: 'rgba(255, 255, 255, 0.08)',
            10: 'rgba(255, 255, 255, 0.10)',
            // ... etc
          },
          blue: {
            8: 'rgba(59, 130, 246, 0.08)',
            12: 'rgba(59, 130, 246, 0.12)',
            // ... etc
          },
        },
        text: {
          primary: 'rgba(255, 255, 255, 0.95)',
          secondary: 'rgba(255, 255, 255, 0.75)',
          // ... etc
        },
      },
    },
  },
};
```

### Usage Examples

```jsx
{/* Card with blue accent for running task */}
<div className="bg-gradient-to-br from-blue-500/20 to-blue-500/12 border-blue-500/40 text-blue-400">
  <h3 className="text-white/95 font-semibold">Converting video...</h3>
  <p className="text-white/75">50% complete</p>
</div>

{/* Success message */}
<div className="bg-gradient-to-br from-green-500/15 to-green-500/8 border-green-500/30">
  <p className="text-green-400">Task completed successfully</p>
</div>

{/* Error state */}
<div className="bg-gradient-to-br from-red-500/15 to-red-500/8 border-red-500/30">
  <p className="text-red-400">Conversion failed</p>
</div>
```

---

This color system provides a complete foundation for implementing glassmorphism while maintaining excellent readability and semantic clarity throughout the FFmpeg GUI application.
