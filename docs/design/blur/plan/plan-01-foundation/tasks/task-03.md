# Task 03: 创建 CSS Design Tokens

## 任务信息

- **任务ID**: PHASE1-TASK03
- **优先级**: P0
- **预计工时**: 1 小时
- **依赖任务**: 无
- **责任人**: 前端开发

## 任务目标

创建一个独立的 CSS Design Tokens 文件，集中定义所有设计系统中的变量（颜色、间距、字体、动画等），确保设计一致性和易维护性。

## 详细说明

### 背景
Design Tokens 是设计系统的基础，将设计决策转化为可复用的变量。通过集中管理这些 tokens，可以确保整个应用的视觉一致性，并方便未来的主题切换。

### 操作步骤

#### 1. 创建 Design Tokens 文件

创建文件: `src/renderer/src/styles/design-tokens.css`

#### 2. 定义颜色系统

```css
:root {
  /* ===== Color System ===== */

  /* Background Colors */
  --bg-gradient-start: #0f172a;
  --bg-gradient-mid-1: #1e293b;
  --bg-gradient-mid-2: #334155;
  --bg-gradient-end: #0f172a;

  /* Glass Colors - White at varying opacity */
  --glass-white-5: rgba(255, 255, 255, 0.05);
  --glass-white-8: rgba(255, 255, 255, 0.08);
  --glass-white-10: rgba(255, 255, 255, 0.10);
  --glass-white-12: rgba(255, 255, 255, 0.12);
  --glass-white-15: rgba(255, 255, 255, 0.15);
  --glass-white-18: rgba(255, 255, 255, 0.18);
  --glass-white-20: rgba(255, 255, 255, 0.20);
  --glass-white-25: rgba(255, 255, 255, 0.25);

  /* Accent Colors */
  --color-primary: #3b82f6;      /* Blue - actions, running */
  --color-success: #22c55e;      /* Green - completed */
  --color-error: #ef4444;        /* Red - failed, warnings */
  --color-warning: #f59e0b;      /* Amber - paused */

  /* Text Colors */
  --text-primary: rgba(255, 255, 255, 0.95);
  --text-secondary: rgba(255, 255, 255, 0.75);
  --text-tertiary: rgba(255, 255, 255, 0.55);
  --text-disabled: rgba(255, 255, 255, 0.38);

  /* Border Colors */
  --border-primary: rgba(255, 255, 255, 0.12);
  --border-secondary: rgba(255, 255, 255, 0.08);
  --border-tertiary: rgba(255, 255, 255, 0.04);
}
```

#### 3. 定义模糊和阴影

```css
:root {
  /* ===== Blur Levels ===== */
  --blur-subtle: 5px;
  --blur-light: 8px;
  --blur-medium: 10px;
  --blur-strong: 12px;
  --blur-heavy: 15px;

  /* ===== Shadows ===== */
  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.08);
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.12);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.16);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.20);
  --shadow-xl: 0 16px 32px rgba(0, 0, 0, 0.24);
  --shadow-2xl: 0 24px 48px rgba(0, 0, 0, 0.32);

  /* Inner Shadows */
  --shadow-inner: inset 0 2px 4px rgba(0, 0, 0, 0.12);
  --shadow-inner-strong: inset 0 4px 8px rgba(0, 0, 0, 0.20);
}
```

#### 4. 定义间距和尺寸

```css
:root {
  /* ===== Spacing ===== */
  --spacing-xs: 0.25rem;   /* 4px */
  --spacing-sm: 0.5rem;    /* 8px */
  --spacing-md: 1rem;      /* 16px */
  --spacing-lg: 1.5rem;    /* 24px */
  --spacing-xl: 2rem;      /* 32px */
  --spacing-2xl: 3rem;     /* 48px */
  --spacing-3xl: 4rem;     /* 64px */

  /* ===== Border Radius ===== */
  --radius-sm: 0.375rem;   /* 6px */
  --radius-md: 0.5rem;     /* 8px */
  --radius-lg: 0.75rem;    /* 12px */
  --radius-xl: 1rem;       /* 16px */
  --radius-2xl: 1.5rem;    /* 24px */
  --radius-full: 9999px;

  /* ===== Component Sizes ===== */
  --sidebar-width: 240px;
  --header-height: 64px;
  --footer-height: 48px;
}
```

#### 5. 定义字体和排版

```css
:root {
  /* ===== Typography ===== */
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-mono: "SF Mono", Menlo, Monaco, "Courier New", monospace;

  /* Font Sizes */
  --text-xs: 0.75rem;      /* 12px */
  --text-sm: 0.875rem;     /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg: 1.125rem;     /* 18px */
  --text-xl: 1.25rem;      /* 20px */
  --text-2xl: 1.5rem;      /* 24px */
  --text-3xl: 1.875rem;    /* 30px */
  --text-4xl: 2.25rem;     /* 36px */

  /* Line Heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;

  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

#### 6. 定义动画系统

```css
:root {
  /* ===== Animation Timing ===== */
  --duration-instant: 100ms;
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --duration-slower: 400ms;

  /* ===== Easing Curves ===== */
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-smooth: cubic-bezier(0.25, 0.1, 0.25, 1);
  --ease-sharp: cubic-bezier(0.4, 0, 0.6, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

  /* ===== Transitions ===== */
  --transition-glass: background var(--duration-normal) var(--ease-default),
                      backdrop-filter var(--duration-normal) var(--ease-default);
  --transition-transform: transform var(--duration-normal) var(--ease-default);
  --transition-color: color var(--duration-normal) var(--ease-default);
  --transition-all: all var(--duration-normal) var(--ease-default);
}
```

#### 7. 定义 Z-Index 层级

```css
:root {
  /* ===== Z-Index Layers ===== */
  --z-base: 0;
  --z-primary-surface: 10;
  --z-secondary-surface: 20;
  --z-interactive: 30;
  --z-overlay: 40;
  --z-dropdown: 50;
  --z-modal: 60;
  --z-toast: 70;
  --z-tooltip: 80;
}
```

#### 8. 在主 CSS 文件中导入

在 `src/renderer/src/index.css` 顶部添加：

```css
@import "./styles/design-tokens.css";
```

#### 9. 验证

```bash
npm run dev
```

在浏览器控制台验证：

```javascript
// 检查颜色变量
getComputedStyle(document.documentElement).getPropertyValue('--color-primary')

// 检查动画时长
getComputedStyle(document.documentElement).getPropertyValue('--duration-normal')

// 检查模糊级别
getComputedStyle(document.documentElement).getPropertyValue('--blur-medium')
```

### 预期产出

- ✅ `design-tokens.css` 文件创建完成
- ✅ 包含至少 80 个设计 tokens
- ✅ 分类清晰：颜色、间距、字体、动画、阴影、模糊等
- ✅ 所有变量可在浏览器中访问
- ✅ 在主 CSS 文件中正确导入

## 潜在问题和解决方案

### 问题 1: CSS 变量无法访问

**现象**: `getComputedStyle` 返回空字符串

**原因**: CSS 文件未正确导入或 :root 选择器优先级问题

**解决方案**:
```css
/* 确保 :root 选择器在最外层 */
:root {
  /* variables here */
}

/* 或使用更高优先级 */
:root, html {
  /* variables here */
}
```

### 问题 2: 变量值在某些浏览器中不生效

**现象**: Safari 或 Firefox 中 CSS 变量显示不正确

**原因**: rgba() 颜色语法问题

**解决方案**:
确保所有 rgba 颜色使用标准语法：
```css
/* 正确 */
--glass-white-10: rgba(255, 255, 255, 0.10);

/* 错误 */
--glass-white-10: rgb(255 255 255 / 0.1);
```

## 验收标准

- [x] `design-tokens.css` 文件包含至少 80 个 CSS 变量
- [x] 变量分类清晰，有注释说明
- [x] 所有颜色变量包含透明度值
- [x] 所有动画时长使用毫秒（ms）单位
- [x] 文件在主 CSS 中正确导入
- [x] `npm run type-check` 通过
- [x] 在浏览器中可以访问所有变量
- [x] 变量命名符合设计文档规范

## 后续任务

- Task 04-08: 所有组件将使用这些 design tokens
- Phase 2-5: 所有页面和布局使用这些变量

## 参考资料

- [CSS Custom Properties MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [设计文档 - Design Tokens](../../design-tokens.md)
- [设计文档 - Color System](../../color-system.md)
