# Task 02: 配置 Tailwind CSS 主题

## 任务目标

扩展 Tailwind CSS 配置，将设计系统 CSS 变量映射到 Tailwind 工具类，并添加自定义字体、间距、动画等扩展。

## 参考文档

- `docs/design/modern/guide/implementation-guide.md` - 第2节 Tailwind CSS 配置
- `docs/design/modern/guide/overview.md` - 间距系统、字体系统
- Tailwind CSS 4.0 文档 - 新配置方式

## 实施步骤

### 步骤 1: 理解 Tailwind CSS 4.0 配置方式

**当前项目使用 Tailwind CSS 4.0**，配置方式与传统版本不同：

**传统方式**（`tailwind.config.js`）：
```js
module.exports = {
  theme: {
    extend: {
      colors: { ... }
    }
  }
}
```

**Tailwind 4.0 方式**（`index.css` 中使用 `@theme`）：
```css
@import 'tailwindcss';

@theme {
  --color-primary: 217 91% 60%;
  --font-family-sans: Inter Variable, system-ui, sans-serif;
}
```

**混合方式**（推荐）：
- `@theme` 用于颜色、字体等基础 token
- `tailwind.config.js` 用于 plugins、content 路径、复杂扩展

### 步骤 2: 在 `index.css` 中添加 `@theme` 配置

更新 `src/renderer/src/index.css`，在 `@import 'tailwindcss';` 后添加：

```css
@import 'tailwindcss';

@theme {
  /* ============ 颜色系统映射 ============ */
  /* 将自定义变量映射到 Tailwind 颜色 */

  /* 背景色 */
  --color-background-primary: oklch(from hsl(var(--background-primary)) l c h);
  --color-background-secondary: oklch(from hsl(var(--background-secondary)) l c h);
  --color-background-tertiary: oklch(from hsl(var(--background-tertiary)) l c h);

  /* 主色 */
  --color-primary-50: oklch(from hsl(var(--primary-50)) l c h);
  --color-primary-100: oklch(from hsl(var(--primary-100)) l c h);
  --color-primary-500: oklch(from hsl(var(--primary-500)) l c h);
  --color-primary-600: oklch(from hsl(var(--primary-600)) l c h);
  --color-primary-700: oklch(from hsl(var(--primary-700)) l c h);

  /* 成功色 */
  --color-success-50: oklch(from hsl(var(--success-50)) l c h);
  --color-success-500: oklch(from hsl(var(--success-500)) l c h);
  --color-success-600: oklch(from hsl(var(--success-600)) l c h);

  /* 警告色 */
  --color-warning-50: oklch(from hsl(var(--warning-50)) l c h);
  --color-warning-500: oklch(from hsl(var(--warning-500)) l c h);
  --color-warning-600: oklch(from hsl(var(--warning-600)) l c h);

  /* 错误色 */
  --color-error-50: oklch(from hsl(var(--error-50)) l c h);
  --color-error-500: oklch(from hsl(var(--error-500)) l c h);
  --color-error-600: oklch(from hsl(var(--error-600)) l c h);

  /* 文本色 */
  --color-text-primary: oklch(from hsl(var(--text-primary)) l c h);
  --color-text-secondary: oklch(from hsl(var(--text-secondary)) l c h);
  --color-text-tertiary: oklch(from hsl(var(--text-tertiary)) l c h);

  /* 边框色 */
  --color-border-light: oklch(from hsl(var(--border-light)) l c h);
  --color-border-medium: oklch(from hsl(var(--border-medium)) l c h);
  --color-border-dark: oklch(from hsl(var(--border-dark)) l c h);

  /* ============ 字体系统 ============ */
  --font-family-sans: 'Inter Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-family-mono: 'JetBrains Mono', 'SF Mono', 'Monaco', 'Cascadia Code', monospace;

  /* 字体大小（保留现有设计标记） */
  --font-size-display: 40px;
  --font-size-h1: 32px;
  --font-size-h2: 24px;
  --font-size-h3: 18px;
  --font-size-body-lg: 16px;
  --font-size-body: 14px;
  --font-size-body-sm: 13px;
  --font-size-caption: 12px;
  --font-size-micro: 11px;

  /* ============ 间距系统（4px 基础单位） ============ */
  --spacing-0: 0px;
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-5: 20px;
  --spacing-6: 24px;
  --spacing-8: 32px;
  --spacing-10: 40px;
  --spacing-12: 48px;
  --spacing-16: 64px;
  --spacing-20: 80px;
  --spacing-24: 96px;

  /* ============ 圆角系统 ============ */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 24px;
  --radius-full: 9999px;

  /* ============ 阴影系统 ============ */
  /* 注：阴影需要在 tailwind.config.js 中配置（因为包含多个值） */
}
```

**注意**：
- Tailwind 4.0 使用 `oklch()` 颜色空间，需要通过 `oklch(from hsl(...) l c h)` 转换
- 或者直接使用 HSL 值（需要在 `tailwind.config.js` 中配置 `colors` 扩展）

### 步骤 3: 创建或更新 `tailwind.config.js`（如果不存在）

检查项目根目录是否有 `tailwind.config.js`，如果没有，创建：

```js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'], // 深色模式使用 class 策略
  content: [
    './src/renderer/index.html',
    './src/renderer/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // ============ 颜色扩展 ============
      colors: {
        // 背景色
        'background-primary': 'hsl(var(--background-primary) / <alpha-value>)',
        'background-secondary': 'hsl(var(--background-secondary) / <alpha-value>)',
        'background-tertiary': 'hsl(var(--background-tertiary) / <alpha-value>)',
        'background-elevated': 'hsl(var(--background-elevated) / <alpha-value>)',

        // 表面色
        'surface-base': 'hsl(var(--surface-base) / <alpha-value>)',
        'surface-raised': 'hsl(var(--surface-raised) / <alpha-value>)',

        // 文本色
        'text-primary': 'hsl(var(--text-primary) / <alpha-value>)',
        'text-secondary': 'hsl(var(--text-secondary) / <alpha-value>)',
        'text-tertiary': 'hsl(var(--text-tertiary) / <alpha-value>)',
        'text-disabled': 'hsl(var(--text-disabled) / <alpha-value>)',

        // 主色
        primary: {
          50: 'hsl(var(--primary-50) / <alpha-value>)',
          100: 'hsl(var(--primary-100) / <alpha-value>)',
          500: 'hsl(var(--primary-500) / <alpha-value>)',
          600: 'hsl(var(--primary-600) / <alpha-value>)',
          700: 'hsl(var(--primary-700) / <alpha-value>)',
        },

        // 成功色
        success: {
          50: 'hsl(var(--success-50) / <alpha-value>)',
          500: 'hsl(var(--success-500) / <alpha-value>)',
          600: 'hsl(var(--success-600) / <alpha-value>)',
        },

        // 警告色
        warning: {
          50: 'hsl(var(--warning-50) / <alpha-value>)',
          500: 'hsl(var(--warning-500) / <alpha-value>)',
          600: 'hsl(var(--warning-600) / <alpha-value>)',
        },

        // 错误色
        error: {
          50: 'hsl(var(--error-50) / <alpha-value>)',
          500: 'hsl(var(--error-500) / <alpha-value>)',
          600: 'hsl(var(--error-600) / <alpha-value>)',
        },

        // 边框色
        'border-light': 'hsl(var(--border-light) / <alpha-value>)',
        'border-medium': 'hsl(var(--border-medium) / <alpha-value>)',
        'border-dark': 'hsl(var(--border-dark) / <alpha-value>)',
      },

      // ============ 字体扩展 ============
      fontFamily: {
        sans: ['Inter Variable', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"SF Mono"', '"Monaco"', '"Cascadia Code"', 'monospace'],
      },

      // ============ 字体大小扩展 ============
      fontSize: {
        display: ['40px', { lineHeight: '48px', letterSpacing: '-0.02em' }],
        h1: ['32px', { lineHeight: '40px', letterSpacing: '-0.01em' }],
        h2: ['24px', { lineHeight: '32px', letterSpacing: '-0.01em' }],
        h3: ['18px', { lineHeight: '28px', letterSpacing: '0' }],
        'body-lg': ['16px', { lineHeight: '24px', letterSpacing: '0' }],
        body: ['14px', { lineHeight: '20px', letterSpacing: '0' }],
        'body-sm': ['13px', { lineHeight: '18px', letterSpacing: '0' }],
        caption: ['12px', { lineHeight: '16px', letterSpacing: '0' }],
        micro: ['11px', { lineHeight: '14px', letterSpacing: '0.01em' }],
      },

      // ============ 间距扩展 ============
      spacing: {
        0: '0px',
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '20px',
        6: '24px',
        8: '32px',
        10: '40px',
        12: '48px',
        16: '64px',
        20: '80px',
        24: '96px',
      },

      // ============ 圆角扩展 ============
      borderRadius: {
        sm: '4px',
        DEFAULT: '8px', // md
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
        full: '9999px',
      },

      // ============ 阴影扩展 ============
      boxShadow: {
        // 浅色主题阴影
        sm: '0 1px 3px 0 hsla(220, 15%, 20%, 0.04), 0 1px 2px 0 hsla(220, 15%, 20%, 0.02)',
        DEFAULT: '0 4px 6px -1px hsla(220, 15%, 20%, 0.06), 0 2px 4px -1px hsla(220, 15%, 20%, 0.04)',
        md: '0 4px 6px -1px hsla(220, 15%, 20%, 0.06), 0 2px 4px -1px hsla(220, 15%, 20%, 0.04)',
        lg: '0 10px 15px -3px hsla(220, 15%, 20%, 0.08), 0 4px 6px -2px hsla(220, 15%, 20%, 0.04)',
        xl: '0 20px 25px -5px hsla(220, 15%, 20%, 0.10), 0 10px 10px -5px hsla(220, 15%, 20%, 0.04)',

        // 深色主题阴影（在组件中通过 dark: 前缀使用）
        'sm-dark': '0 1px 3px 0 hsla(0, 0%, 0%, 0.3), 0 1px 2px 0 hsla(0, 0%, 0%, 0.2)',
        'md-dark': '0 4px 6px -1px hsla(0, 0%, 0%, 0.4), 0 2px 4px -1px hsla(0, 0%, 0%, 0.3)',
        'lg-dark': '0 10px 15px -3px hsla(0, 0%, 0%, 0.5), 0 4px 6px -2px hsla(0, 0%, 0%, 0.4)',
        'xl-dark': '0 20px 25px -5px hsla(0, 0%, 0%, 0.6), 0 10px 10px -5px hsla(0, 0%, 0%, 0.5)',
      },

      // ============ 动画时间扩展 ============
      transitionDuration: {
        instant: '100ms',
        fast: '150ms',
        DEFAULT: '200ms',
        normal: '200ms',
        medium: '300ms',
        slow: '400ms',
        slower: '600ms',
      },

      // ============ 缓动函数扩展 ============
      transitionTimingFunction: {
        bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
        'fast-out': 'cubic-bezier(0.4, 0, 0.6, 1)',
        precise: 'cubic-bezier(0.2, 0, 0, 1)',
      },

      // ============ 缩放扩展 ============
      scale: {
        98: '0.98',
        102: '1.02',
      },
    },
  },
  plugins: [
    // 动画插件（将在 Task 04 中安装）
    // require('tailwindcss-animate'),
  ],
};
```

### 步骤 4: 创建 PostCSS 配置（如果不存在）

创建 `postcss.config.js`：

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### 步骤 5: 验证配置

创建测试页面验证 Tailwind 类名是否生效：

```tsx
// src/renderer/src/pages/__tests__/TailwindTest.tsx
export function TailwindTest() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-h1 text-text-primary">Tailwind 配置测试</h1>

      {/* 颜色测试 */}
      <div className="space-y-2">
        <div className="bg-background-primary p-4 border border-border-light">
          背景色 Primary
        </div>
        <div className="bg-background-secondary p-4">背景色 Secondary</div>
        <div className="bg-primary-500 text-white p-4 rounded-md">主色 500</div>
        <div className="bg-success-500 text-white p-4 rounded-md">成功色</div>
      </div>

      {/* 字体测试 */}
      <div className="space-y-2">
        <p className="font-sans text-body">Sans 字体（Inter Variable）</p>
        <p className="font-mono text-body">Mono 字体（JetBrains Mono）</p>
        <p className="text-display">Display 字号 (40px)</p>
        <p className="text-h1">H1 字号 (32px)</p>
        <p className="text-caption text-text-secondary">Caption 字号 (12px)</p>
      </div>

      {/* 间距测试 */}
      <div className="flex gap-4">
        <div className="p-1 bg-primary-100">间距 1 (4px)</div>
        <div className="p-2 bg-primary-100">间距 2 (8px)</div>
        <div className="p-4 bg-primary-100">间距 4 (16px)</div>
        <div className="p-6 bg-primary-100">间距 6 (24px)</div>
      </div>

      {/* 圆角测试 */}
      <div className="flex gap-4">
        <div className="p-4 bg-primary-500 text-white rounded-sm">圆角 sm</div>
        <div className="p-4 bg-primary-500 text-white rounded-md">圆角 md</div>
        <div className="p-4 bg-primary-500 text-white rounded-lg">圆角 lg</div>
        <div className="p-4 bg-primary-500 text-white rounded-full">圆角 full</div>
      </div>

      {/* 阴影测试 */}
      <div className="flex gap-4">
        <div className="p-4 bg-surface-raised shadow-sm">阴影 sm</div>
        <div className="p-4 bg-surface-raised shadow-md">阴影 md</div>
        <div className="p-4 bg-surface-raised shadow-lg">阴影 lg</div>
        <div className="p-4 bg-surface-raised shadow-xl">阴影 xl</div>
      </div>
    </div>
  );
}
```

在路由中添加测试页面：

```tsx
// src/renderer/src/router/index.tsx
import { TailwindTest } from '../pages/__tests__/TailwindTest';

{
  path: '/__test__/tailwind',
  element: <TailwindTest />,
}
```

访问 `http://localhost:5173/#/__test__/tailwind` 查看效果。

## 验收标准

- [ ] `bg-background-primary` 正确应用背景色
- [ ] `text-text-primary` 正确应用文字颜色
- [ ] `bg-primary-500` 正确应用主色
- [ ] `font-sans` 应用 Inter Variable 字体
- [ ] `font-mono` 应用 JetBrains Mono 字体
- [ ] `text-h1`、`text-body`、`text-caption` 字号正确
- [ ] `p-4`、`gap-6` 等间距正确（符合 4px 基础单位）
- [ ] `rounded-md`、`rounded-lg` 圆角正确
- [ ] `shadow-md`、`shadow-lg` 阴影正确
- [ ] 深色模式切换后，所有 Tailwind 类名仍然正常工作

## 潜在问题

### 问题 1: Tailwind CSS 4.0 与配置文件冲突

**症状**：同时使用 `@theme` 和 `tailwind.config.js` 导致样式不一致

**解决方案**：
- 优先使用 `@theme` 定义基础 token
- `tailwind.config.js` 仅用于扩展（如 `colors` 映射、复杂配置）
- 如果冲突，以 `@theme` 为准

### 问题 2: 颜色透明度不工作

**症状**：`bg-primary-500/50` 不生效

**原因**：未使用 `<alpha-value>` 占位符

**解决方案**：
```js
// tailwind.config.js
colors: {
  primary: {
    500: 'hsl(var(--primary-500) / <alpha-value>)', // ✅
  }
}
```

### 问题 3: 阴影在深色模式下不明显

**症状**：深色主题下阴影几乎看不见

**解决方案**：
使用深色主题专用阴影：
```tsx
<div className="shadow-md dark:shadow-md-dark">卡片</div>
```

## 输出产物

**新增/更新文件**：
- `tailwind.config.js`（如果不存在则创建）
- `postcss.config.js`（如果不存在则创建）
- `src/renderer/src/index.css`（添加 `@theme` 配置）
- `src/renderer/src/pages/__tests__/TailwindTest.tsx`（测试页面）

## 预计时间

- **实施**：1.5-2 小时
- **测试**：0.5-1 小时
- **总计**：2-3 小时

---

**创建时间**：2025-10-04
**优先级**：P0
**依赖**：Task 01（CSS 变量系统）
**后续任务**：Task 03（字体系统）
