# Component Patterns - Glassmorphism Components

This document provides detailed design specifications for each UI component in the FFmpeg GUI glassmorphism design system.

## Core Glass Component Pattern

All glass components follow this base structure:

```css
.glass-component {
  /* Background with gradient */
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08));

  /* Blur effect */
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  /* Border */
  border: 1px solid rgba(255, 255, 255, 0.12);

  /* Shadow for depth */
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.16),
    0 2px 4px rgba(0, 0, 0, 0.10),
    inset 0 1px 2px rgba(255, 255, 255, 0.1);

  /* Rounded corners */
  border-radius: 16px;

  /* Smooth transitions */
  transition:
    background 200ms cubic-bezier(0.4, 0, 0.2, 1),
    backdrop-filter 200ms cubic-bezier(0.4, 0, 0.2, 1),
    border-color 200ms cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

## Layout Components

### 1. Sidebar Navigation

**Purpose**: Primary navigation panel with persistent visibility

**Design Specifications:**

```css
.glass-sidebar {
  /* Dimensions */
  width: 240px;
  min-height: 100vh;

  /* Glass Effect */
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.12) 0%,
    rgba(255, 255, 255, 0.08) 100%
  );
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  /* Border */
  border-right: 1px solid rgba(255, 255, 255, 0.12);

  /* Shadow */
  box-shadow:
    2px 0 16px rgba(0, 0, 0, 0.12),
    inset -1px 0 2px rgba(255, 255, 255, 0.1);

  /* Layout */
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  /* Z-index */
  position: relative;
  z-index: 20;
}
```

**Navigation Items:**

```css
.glass-sidebar-item {
  /* Base State */
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 12px 16px;

  /* Typography */
  color: rgba(255, 255, 255, 0.75);
  font-size: 14px;
  font-weight: 500;

  /* Transition */
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);

  /* Interaction */
  cursor: pointer;
}

.glass-sidebar-item:hover {
  background: rgba(255, 255, 255, 0.10);
  border-color: rgba(255, 255, 255, 0.18);
  color: rgba(255, 255, 255, 0.95);
  transform: translateX(4px);
}

.glass-sidebar-item.active {
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.20),
    rgba(59, 130, 246, 0.12)
  );
  border-color: rgba(59, 130, 246, 0.4);
  color: #60a5fa;
  box-shadow:
    0 0 20px rgba(59, 130, 246, 0.2),
    inset 0 1px 2px rgba(255, 255, 255, 0.15);
}
```

**Tailwind Classes:**

```jsx
<aside className="w-60 min-h-screen bg-gradient-to-b from-white/12 to-white/8 backdrop-blur-[12px] border-r border-white/12 shadow-[2px_0_16px_rgba(0,0,0,0.12),inset_-1px_0_2px_rgba(255,255,255,0.1)] p-6 flex flex-col gap-2">
  <nav className="space-y-2">
    <a className="block px-4 py-3 rounded-xl bg-white/5 backdrop-blur-[8px] border border-white/8 text-white/75 text-sm font-medium transition-all duration-200 hover:bg-white/10 hover:border-white/18 hover:text-white/95 hover:translate-x-1">
      Home
    </a>
    <a className="block px-4 py-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/12 backdrop-blur-[8px] border border-blue-500/40 text-blue-400 text-sm font-medium shadow-[0_0_20px_rgba(59,130,246,0.2),inset_0_1px_2px_rgba(255,255,255,0.15)]">
      Convert
    </a>
  </nav>
</aside>
```

---

### 2. Header Bar

**Purpose**: Top navigation with app title and actions

**Design Specifications:**

```css
.glass-header {
  /* Dimensions */
  height: 64px;
  width: 100%;

  /* Glass Effect */
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.12) 0%,
    rgba(255, 255, 255, 0.08) 100%
  );
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  /* Border */
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  /* Shadow */
  box-shadow:
    0 2px 16px rgba(0, 0, 0, 0.08),
    inset 0 -1px 2px rgba(255, 255, 255, 0.08);

  /* Layout */
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  /* Z-index */
  position: sticky;
  top: 0;
  z-index: 20;
}

.glass-header-title {
  color: rgba(255, 255, 255, 0.95);
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.02em;
}
```

**Tailwind Classes:**

```jsx
<header className="h-16 w-full bg-gradient-to-b from-white/12 to-white/8 backdrop-blur-[12px] border-b border-white/8 shadow-[0_2px_16px_rgba(0,0,0,0.08),inset_0_-1px_2px_rgba(255,255,255,0.08)] px-6 flex items-center justify-between sticky top-0 z-20">
  <h1 className="text-white/95 text-lg font-semibold tracking-tight">
    FFmpeg GUI
  </h1>
</header>
```

---

### 3. Footer Status Bar

**Purpose**: Bottom status information and quick actions

```css
.glass-footer {
  /* Dimensions */
  height: 48px;
  width: 100%;

  /* Glass Effect */
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  /* Border */
  border-top: 1px solid rgba(255, 255, 255, 0.08);

  /* Layout */
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 16px;

  /* Typography */
  font-size: 12px;
  color: rgba(255, 255, 255, 0.65);

  /* Z-index */
  position: sticky;
  bottom: 0;
  z-index: 10;
}
```

---

## Content Components

### 4. Glass Card

**Purpose**: Container for grouped content (features, tasks, settings sections)

**Design Specifications:**

```css
.glass-card {
  /* Glass Effect */
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.15),
    rgba(255, 255, 255, 0.08)
  );
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  /* Border */
  border: 1px solid rgba(255, 255, 255, 0.12);

  /* Shadow */
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.16),
    0 2px 4px rgba(0, 0, 0, 0.10),
    inset 0 1px 2px rgba(255, 255, 255, 0.1);

  /* Dimensions */
  border-radius: 16px;
  padding: 24px;

  /* Transition */
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-card:hover {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.18),
    rgba(255, 255, 255, 0.10)
  );
  border-color: rgba(255, 255, 255, 0.18);
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.20),
    0 4px 8px rgba(0, 0, 0, 0.12),
    inset 0 1px 3px rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}
```

**Variants:**

```css
/* Task Card - Running State */
.glass-card-running {
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.18),
    rgba(59, 130, 246, 0.10)
  );
  border-color: rgba(59, 130, 246, 0.3);
  box-shadow:
    0 0 24px rgba(59, 130, 246, 0.25),
    0 4px 16px rgba(0, 0, 0, 0.16),
    inset 0 1px 2px rgba(255, 255, 255, 0.15);
}

/* Task Card - Completed State */
.glass-card-completed {
  background: linear-gradient(
    135deg,
    rgba(34, 197, 94, 0.15),
    rgba(34, 197, 94, 0.08)
  );
  border-color: rgba(34, 197, 94, 0.25);
}

/* Task Card - Failed State */
.glass-card-failed {
  background: linear-gradient(
    135deg,
    rgba(239, 68, 68, 0.15),
    rgba(239, 68, 68, 0.08)
  );
  border-color: rgba(239, 68, 68, 0.25);
}
```

**Tailwind Classes:**

```jsx
<div className="rounded-2xl bg-gradient-to-br from-white/15 to-white/8 backdrop-blur-[10px] border border-white/12 shadow-[0_4px_16px_rgba(0,0,0,0.16),0_2px_4px_rgba(0,0,0,0.10),inset_0_1px_2px_rgba(255,255,255,0.1)] p-6 transition-all duration-200 hover:from-white/18 hover:to-white/10 hover:border-white/18 hover:shadow-[0_8px_24px_rgba(0,0,0,0.20),0_4px_8px_rgba(0,0,0,0.12),inset_0_1px_3px_rgba(255,255,255,0.15)] hover:-translate-y-0.5">
  {/* Card content */}
</div>

{/* Running state variant */}
<div className="rounded-2xl bg-gradient-to-br from-blue-500/18 to-blue-500/10 backdrop-blur-[10px] border border-blue-500/30 shadow-[0_0_24px_rgba(59,130,246,0.25),0_4px_16px_rgba(0,0,0,0.16),inset_0_1px_2px_rgba(255,255,255,0.15)] p-6">
  {/* Running task content */}
</div>
```

---

### 5. File List Panel

**Purpose**: Display selected files with metadata

```css
.glass-file-list {
  /* Glass Effect */
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.10);
  border-radius: 12px;
  padding: 16px;

  /* Layout */
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
}

.glass-file-item {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 12px 16px;

  display: flex;
  align-items: center;
  gap: 12px;

  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-file-item:hover {
  background: rgba(255, 255, 255, 0.10);
  border-color: rgba(255, 255, 255, 0.15);
}
```

---

### 6. Media Info Display

**Purpose**: Show detailed media file metadata

```css
.glass-media-info {
  /* Glass Effect */
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.10),
    rgba(255, 255, 255, 0.05)
  );
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.10);
  border-radius: 12px;
  padding: 20px;

  /* Layout */
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.glass-media-info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.glass-media-info-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.55);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.glass-media-info-value {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 600;
  font-family: var(--font-mono);
}
```

---

## Interactive Components

### 7. Glass Button

**Purpose**: Primary interactive element

**Design Specifications:**

```css
/* Primary Button */
.glass-button-primary {
  /* Glass Effect */
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.25),
    rgba(59, 130, 246, 0.15)
  );
  backdrop-filter: blur(8px);
  border: 1.5px solid rgba(59, 130, 246, 0.4);

  /* Dimensions */
  border-radius: 12px;
  padding: 12px 24px;

  /* Typography */
  color: #60a5fa;
  font-size: 14px;
  font-weight: 600;

  /* Shadow */
  box-shadow:
    0 2px 8px rgba(59, 130, 246, 0.2),
    inset 0 1px 2px rgba(255, 255, 255, 0.15);

  /* Transition */
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.glass-button-primary:hover {
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.35),
    rgba(59, 130, 246, 0.25)
  );
  border-color: rgba(59, 130, 246, 0.6);
  box-shadow:
    0 0 24px rgba(59, 130, 246, 0.4),
    0 4px 12px rgba(59, 130, 246, 0.3),
    inset 0 1px 3px rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.glass-button-primary:active {
  transform: translateY(0);
  box-shadow:
    0 0 16px rgba(59, 130, 246, 0.3),
    0 2px 6px rgba(59, 130, 246, 0.2),
    inset 0 1px 2px rgba(255, 255, 255, 0.15);
}

/* Secondary Button */
.glass-button-secondary {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 12px 24px;

  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
  font-weight: 600;

  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-button-secondary:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.18);
  color: rgba(255, 255, 255, 0.95);
}

/* Danger Button */
.glass-button-danger {
  background: linear-gradient(
    135deg,
    rgba(239, 68, 68, 0.20),
    rgba(239, 68, 68, 0.12)
  );
  border: 1.5px solid rgba(239, 68, 68, 0.35);
  color: #f87171;
}

.glass-button-danger:hover {
  background: linear-gradient(
    135deg,
    rgba(239, 68, 68, 0.30),
    rgba(239, 68, 68, 0.20)
  );
  border-color: rgba(239, 68, 68, 0.5);
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.35);
}
```

**Tailwind Classes:**

```jsx
{/* Primary Button */}
<button className="px-6 py-3 rounded-xl bg-gradient-to-br from-blue-500/25 to-blue-500/15 backdrop-blur-[8px] border-[1.5px] border-blue-500/40 text-blue-400 text-sm font-semibold shadow-[0_2px_8px_rgba(59,130,246,0.2),inset_0_1px_2px_rgba(255,255,255,0.15)] transition-all duration-200 hover:from-blue-500/35 hover:to-blue-500/25 hover:border-blue-500/60 hover:shadow-[0_0_24px_rgba(59,130,246,0.4),0_4px_12px_rgba(59,130,246,0.3),inset_0_1px_3px_rgba(255,255,255,0.2)] hover:-translate-y-px active:translate-y-0">
  Start Conversion
</button>

{/* Secondary Button */}
<button className="px-6 py-3 rounded-xl bg-white/8 backdrop-blur-[8px] border border-white/12 text-white/85 text-sm font-semibold transition-all duration-200 hover:bg-white/15 hover:border-white/18 hover:text-white/95">
  Cancel
</button>
```

---

### 8. Glass Input Field

**Purpose**: Text input with glass styling

```css
.glass-input {
  /* Glass Effect */
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  padding: 12px 16px;

  /* Typography */
  color: rgba(255, 255, 255, 0.95);
  font-size: 14px;

  /* Transition */
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-input::placeholder {
  color: rgba(255, 255, 255, 0.45);
}

.glass-input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.10);
  border-color: rgba(59, 130, 246, 0.5);
  box-shadow:
    0 0 0 3px rgba(59, 130, 246, 0.15),
    inset 0 1px 2px rgba(255, 255, 255, 0.1);
}

.glass-input:hover:not(:focus) {
  border-color: rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.08);
}
```

**Tailwind Classes:**

```jsx
<input
  type="text"
  placeholder="Enter value..."
  className="w-full px-4 py-3 rounded-lg bg-white/6 backdrop-blur-[8px] border border-white/12 text-white/95 text-sm placeholder:text-white/45 transition-all duration-200 focus:outline-none focus:bg-white/10 focus:border-blue-500/50 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15),inset_0_1px_2px_rgba(255,255,255,0.1)] hover:border-white/18 hover:bg-white/8"
/>
```

---

### 9. Glass Select Dropdown

**Purpose**: Selection input with options

```css
.glass-select {
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  padding: 12px 16px;

  color: rgba(255, 255, 255, 0.95);
  font-size: 14px;

  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='rgba(255,255,255,0.75)' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  padding-right: 48px;
}
```

---

### 10. Glass Progress Bar

**Purpose**: Show task progress with glass styling

```css
.glass-progress-container {
  /* Glass Effect */
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.10);
  border-radius: 999px;
  padding: 3px;

  /* Dimensions */
  height: 32px;
  width: 100%;
  overflow: hidden;
}

.glass-progress-bar {
  height: 100%;
  border-radius: 999px;

  /* Animated gradient */
  background: linear-gradient(
    90deg,
    rgba(59, 130, 246, 0.8) 0%,
    rgba(59, 130, 246, 0.6) 50%,
    rgba(59, 130, 246, 0.8) 100%
  );
  background-size: 200% 100%;
  animation: progressShimmer 2s ease-in-out infinite;

  /* Glass effect on progress */
  backdrop-filter: blur(4px);
  border: 1px solid rgba(59, 130, 246, 0.4);

  box-shadow:
    0 0 16px rgba(59, 130, 246, 0.4),
    inset 0 1px 2px rgba(255, 255, 255, 0.3);

  /* Transition */
  transition: width 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes progressShimmer {
  0%, 100% { background-position: 0% 0%; }
  50% { background-position: 100% 0%; }
}
```

---

### 11. Glass Modal/Dialog

**Purpose**: Overlay panels for important interactions

```css
/* Backdrop */
.glass-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  z-index: 50;

  /* Animation */
  animation: fadeIn 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Modal */
.glass-modal {
  /* Glass Effect */
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.20),
    rgba(255, 255, 255, 0.12)
  );
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);

  /* Border */
  border: 1.5px solid rgba(255, 255, 255, 0.18);

  /* Shadow */
  box-shadow:
    0 16px 48px rgba(0, 0, 0, 0.30),
    0 8px 16px rgba(0, 0, 0, 0.20),
    inset 0 2px 4px rgba(255, 255, 255, 0.15);

  /* Dimensions */
  border-radius: 20px;
  padding: 32px;
  max-width: 600px;
  width: 90vw;

  /* Position */
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 51;

  /* Animation */
  animation:
    fadeIn 200ms cubic-bezier(0.4, 0, 0.2, 1),
    slideUp 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    transform: translate(-50%, -48%);
    opacity: 0;
  }
  to {
    transform: translate(-50%, -50%);
    opacity: 1;
  }
}
```

---

### 12. Glass Tooltip

**Purpose**: Contextual help on hover

```css
.glass-tooltip {
  /* Glass Effect */
  background: rgba(20, 20, 30, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 8px 12px;

  /* Typography */
  color: rgba(255, 255, 255, 0.95);
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;

  /* Shadow */
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.4),
    inset 0 1px 1px rgba(255, 255, 255, 0.1);

  /* Position */
  position: absolute;
  z-index: 70;

  /* Animation */
  animation: tooltipFadeIn 150ms cubic-bezier(0.4, 0, 0.2, 1);
}

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
```

---

## Specialized Components

### 13. Task Card (Queue Item)

**Purpose**: Display individual task with real-time progress

```css
.glass-task-card {
  /* Base glass card */
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.15),
    rgba(255, 255, 255, 0.08)
  );
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  padding: 20px;

  /* Layout */
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.glass-task-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.glass-task-title {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  font-family: var(--font-mono);
}

.glass-task-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-top: 8px;
}

.glass-task-stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.glass-task-stat-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.55);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
}

.glass-task-stat-value {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 700;
  font-family: var(--font-mono);
}
```

---

### 14. File Dropzone

**Purpose**: Drag-and-drop file upload area

```css
.glass-dropzone {
  /* Glass Effect */
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
  border: 2px dashed rgba(255, 255, 255, 0.20);
  border-radius: 16px;
  padding: 48px 32px;

  /* Layout */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;

  /* Transition */
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.glass-dropzone:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.30);
}

.glass-dropzone.active {
  background: rgba(59, 130, 246, 0.12);
  border-color: rgba(59, 130, 246, 0.5);
  border-style: solid;
  box-shadow: 0 0 24px rgba(59, 130, 246, 0.3);
}
```

---

## Accessibility Features

### Focus Indicators

All interactive glass components must have highly visible focus states:

```css
.glass-interactive:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 3px rgba(59, 130, 246, 0.5),
    0 0 0 6px rgba(59, 130, 246, 0.2);
}
```

### Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  .glass-component {
    transition: none;
    animation: none;
  }
}
```

### High Contrast Mode

```css
@media (prefers-contrast: high) {
  .glass-component {
    border-width: 2px;
    border-color: rgba(255, 255, 255, 0.4);
  }
}
```

---

These component patterns provide comprehensive guidance for implementing glassmorphism across the FFmpeg GUI application while maintaining usability, accessibility, and visual consistency.
