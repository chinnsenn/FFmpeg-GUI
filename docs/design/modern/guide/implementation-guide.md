# FFmpeg GUI 实施指南

本文档提供详细的开发实施指南，帮助开发人员将设计系统应用到 FFmpeg GUI 项目中。

---

## 目录

1. [前置准备](#1-前置准备)
2. [Tailwind CSS 配置](#2-tailwind-css-配置)
3. [CSS 自定义属性](#3-css-自定义属性)
4. [组件库安装](#4-组件库安装)
5. [组件实施顺序](#5-组件实施顺序)
6. [迁移策略](#6-迁移策略)
7. [关键组件实现](#7-关键组件实现)
8. [视觉回归测试](#8-视觉回归测试)
9. [平台特定考虑](#9-平台特定考虑)
10. [故障排查](#10-故障排查)

---

## 1. 前置准备

### 1.1 开发环境

**确认已安装：**
- Node.js ≥ 18.0.0
- npm ≥ 9.0.0
- Git

**推荐工具：**
- VS Code + 扩展：
  - Tailwind CSS IntelliSense
  - PostCSS Language Support
  - ESLint
  - Prettier

### 1.2 项目依赖

**当前已有依赖：**
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^7.0.0",
    "lucide-react": "^0.263.1",
    "sonner": "^1.0.0"
  },
  "devDependencies": {
    "tailwindcss": "^4.0.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0"
  }
}
```

**需要新增：**
```bash
# 动画库
npm install framer-motion

# 无障碍 UI 组件库
npm install @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-radio-group @radix-ui/react-checkbox @radix-ui/react-slider @radix-ui/react-collapsible

# 工具库
npm install class-variance-authority clsx tailwind-merge

# 拖放（可选）
npm install react-dropzone @dnd-kit/core @dnd-kit/sortable

# 虚拟滚动（可选，任务数 > 50 时）
npm install @tanstack/react-virtual

# 开发依赖
npm install -D tailwindcss-animate autoprefixer postcss
```

---

## 2. Tailwind CSS 配置

### 2.1 完整配置文件

创建或更新 `tailwind.config.js`：

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/renderer/index.html',
    './src/renderer/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // 颜色系统
      colors: {
        // 基础颜色
        background: {
          primary: 'hsl(var(--background-primary))',
          secondary: 'hsl(var(--background-secondary))',
          tertiary: 'hsl(var(--background-tertiary))',
          elevated: 'hsl(var(--background-elevated))'
        },
        surface: {
          base: 'hsl(var(--surface-base))',
          raised: 'hsl(var(--surface-raised))',
          overlay: 'hsla(var(--surface-overlay))'
        },
        text: {
          primary: 'hsl(var(--text-primary))',
          secondary: 'hsl(var(--text-secondary))',
          tertiary: 'hsl(var(--text-tertiary))',
          disabled: 'hsl(var(--text-disabled))'
        },

        // 主色
        primary: {
          50: 'hsl(var(--primary-50))',
          100: 'hsl(var(--primary-100))',
          500: 'hsl(var(--primary-500))',
          600: 'hsl(var(--primary-600))',
          700: 'hsl(var(--primary-700))'
        },

        // 语义颜色
        success: {
          50: 'hsl(var(--success-50))',
          500: 'hsl(var(--success-500))',
          600: 'hsl(var(--success-600))'
        },
        warning: {
          50: 'hsl(var(--warning-50))',
          500: 'hsl(var(--warning-500))',
          600: 'hsl(var(--warning-600))'
        },
        error: {
          50: 'hsl(var(--error-50))',
          500: 'hsl(var(--error-500))',
          600: 'hsl(var(--error-600))'
        },

        // 边框
        border: {
          light: 'hsl(var(--border-light))',
          medium: 'hsl(var(--border-medium))',
          dark: 'hsl(var(--border-dark))'
        }
      },

      // 字体
      fontFamily: {
        sans: ['Inter Variable', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"SF Mono"', '"Monaco"', '"Cascadia Code"', 'monospace']
      },

      // 字体大小
      fontSize: {
        display: ['40px', { lineHeight: '48px', letterSpacing: '-0.02em' }],
        h1: ['32px', { lineHeight: '40px', letterSpacing: '-0.01em' }],
        h2: ['24px', { lineHeight: '32px', letterSpacing: '-0.01em' }],
        h3: ['18px', { lineHeight: '28px', letterSpacing: '0' }],
        'body-lg': ['16px', { lineHeight: '24px', letterSpacing: '0' }],
        body: ['14px', { lineHeight: '20px', letterSpacing: '0' }],
        'body-sm': ['13px', { lineHeight: '18px', letterSpacing: '0' }],
        caption: ['12px', { lineHeight: '16px', letterSpacing: '0' }],
        micro: ['11px', { lineHeight: '14px', letterSpacing: '0.01em' }]
      },

      // 间距
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
        24: '96px'
      },

      // 圆角
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
        full: '9999px'
      },

      // 阴影
      boxShadow: {
        sm: '0 1px 3px 0 hsla(220, 15%, 20%, 0.04), 0 1px 2px 0 hsla(220, 15%, 20%, 0.02)',
        md: '0 4px 6px -1px hsla(220, 15%, 20%, 0.06), 0 2px 4px -1px hsla(220, 15%, 20%, 0.04)',
        lg: '0 10px 15px -3px hsla(220, 15%, 20%, 0.08), 0 4px 6px -2px hsla(220, 15%, 20%, 0.04)',
        xl: '0 20px 25px -5px hsla(220, 15%, 20%, 0.10), 0 10px 10px -5px hsla(220, 15%, 20%, 0.04)',

        // 深色主题
        'sm-dark': '0 1px 3px 0 hsla(0, 0%, 0%, 0.3), 0 1px 2px 0 hsla(0, 0%, 0%, 0.2)',
        'md-dark': '0 4px 6px -1px hsla(0, 0%, 0%, 0.4), 0 2px 4px -1px hsla(0, 0%, 0%, 0.3)',
        'lg-dark': '0 10px 15px -3px hsla(0, 0%, 0%, 0.5), 0 4px 6px -2px hsla(0, 0%, 0%, 0.4)',
        'xl-dark': '0 20px 25px -5px hsla(0, 0%, 0%, 0.6), 0 10px 10px -5px hsla(0, 0%, 0%, 0.5)'
      },

      // 动画时间
      transitionDuration: {
        instant: '100ms',
        fast: '150ms',
        normal: '200ms',
        medium: '300ms',
        slow: '400ms',
        slower: '600ms'
      },

      // 缓动函数
      transitionTimingFunction: {
        bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
        'fast-out': 'cubic-bezier(0.4, 0, 0.6, 1)',
        precise: 'cubic-bezier(0.2, 0, 0, 1)'
      },

      // 关键帧动画
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        indeterminate: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'scale-in': {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        'slide-in': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-10px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(10px)' }
        }
      },

      // 动画
      animation: {
        shimmer: 'shimmer 2s infinite',
        indeterminate: 'indeterminate 1.5s ease-in-out infinite',
        'fade-in': 'fade-in 300ms ease-out',
        'scale-in': 'scale-in 200ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'slide-in': 'slide-in 300ms ease-out',
        shake: 'shake 400ms ease-in-out'
      },

      // 缩放
      scale: {
        98: '0.98',
        102: '1.02'
      }
    }
  },
  plugins: [
    require('tailwindcss-animate')
  ]
}
```

### 2.2 PostCSS 配置

创建或更新 `postcss.config.js`：

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
}
```

---

## 3. CSS 自定义属性

### 3.1 全局样式文件

更新 `src/renderer/src/index.css`：

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* 浅色主题 */

    /* 基础颜色 */
    --background-primary: 0 0% 100%;           /* #FFFFFF */
    --background-secondary: 210 20% 98%;       /* #F9FAFB */
    --background-tertiary: 210 20% 95%;        /* #F1F3F5 */
    --background-elevated: 0 0% 100%;          /* #FFFFFF */

    /* 表面颜色 */
    --surface-base: 0 0% 100%;                 /* #FFFFFF */
    --surface-raised: 0 0% 100%;               /* #FFFFFF */
    --surface-overlay: 0 0% 100% / 0.95;       /* rgba(255, 255, 255, 0.95) */

    /* 文本颜色 */
    --text-primary: 220 20% 10%;               /* #171A1F */
    --text-secondary: 220 10% 45%;             /* #6B7280 */
    --text-tertiary: 220 8% 60%;               /* #9CA3AF */
    --text-disabled: 220 5% 75%;               /* #C4C4C4 */

    /* 主色 */
    --primary-50: 215 100% 97%;                /* #EFF6FF */
    --primary-100: 215 95% 93%;                /* #DBEAFE */
    --primary-500: 217 91% 60%;                /* #3B82F6 */
    --primary-600: 217 91% 52%;                /* #2563EB */
    --primary-700: 217 85% 45%;                /* #1D4ED8 */

    /* 成功色 */
    --success-50: 142 76% 96%;                 /* #ECFDF5 */
    --success-500: 142 71% 45%;                /* #10B981 */
    --success-600: 142 76% 36%;                /* #059669 */

    /* 警告色 */
    --warning-50: 48 100% 96%;                 /* #FEFCE8 */
    --warning-500: 45 93% 58%;                 /* #F59E0B */
    --warning-600: 38 92% 50%;                 /* #D97706 */

    /* 错误色 */
    --error-50: 0 86% 97%;                     /* #FEF2F2 */
    --error-500: 0 84% 60%;                    /* #EF4444 */
    --error-600: 0 72% 51%;                    /* #DC2626 */

    /* 边框 */
    --border-light: 220 15% 90%;               /* #E5E7EB */
    --border-medium: 220 15% 85%;              /* #D1D5DB */
    --border-dark: 220 15% 75%;                /* #9CA3AF */
  }

  .dark {
    /* 深色主题 */

    /* 基础颜色 */
    --background-primary: 220 18% 8%;          /* #0F1419 */
    --background-secondary: 220 16% 12%;       /* #1A1F29 */
    --background-tertiary: 220 15% 16%;        /* #242933 */
    --background-elevated: 220 16% 14%;        /* #1D222C */

    /* 表面颜色 */
    --surface-base: 220 16% 12%;               /* #1A1F29 */
    --surface-raised: 220 15% 16%;             /* #242933 */
    --surface-overlay: 220 16% 12% / 0.95;     /* rgba(26, 31, 41, 0.95) */

    /* 文本颜色 */
    --text-primary: 210 20% 98%;               /* #F9FAFB */
    --text-secondary: 215 15% 75%;             /* #B4BCD0 */
    --text-tertiary: 215 12% 60%;              /* #8B94A8 */
    --text-disabled: 215 10% 45%;              /* #5A6172 */

    /* 主色（深色主题调整） */
    --primary-50: 215 100% 97%;                /* 保持不变 */
    --primary-100: 215 95% 93%;                /* 保持不变 */
    --primary-500: 213 94% 68%;                /* #60A5FA（增亮） */
    --primary-600: 213 90% 62%;                /* #3B82F6（增亮） */
    --primary-700: 213 85% 55%;                /* #2563EB（增亮） */

    /* 成功色（深色主题调整） */
    --success-50: 142 76% 96%;                 /* 保持不变 */
    --success-500: 142 71% 55%;                /* #34D399（增亮） */
    --success-600: 142 71% 50%;                /* #10B981（增亮） */

    /* 警告色（深色主题调整） */
    --warning-50: 48 100% 96%;                 /* 保持不变 */
    --warning-500: 45 93% 65%;                 /* #FBBF24（增亮） */
    --warning-600: 45 93% 58%;                 /* #F59E0B（增亮） */

    /* 错误色（深色主题调整） */
    --error-50: 0 86% 97%;                     /* 保持不变 */
    --error-500: 0 84% 70%;                    /* #F87171（增亮） */
    --error-600: 0 84% 65%;                    /* #EF4444（增亮） */

    /* 边框 */
    --border-light: 220 14% 22%;               /* #2E3440 */
    --border-medium: 220 13% 28%;              /* #3A4250 */
    --border-dark: 220 12% 35%;                /* #4A5463 */
  }

  /* 基础样式重置 */
  * {
    @apply border-border-light;
  }

  body {
    @apply bg-background-primary text-text-primary font-sans antialiased;
  }

  /* 滚动条样式 */
  ::-webkit-scrollbar {
    @apply w-2 h-2;
  }

  ::-webkit-scrollbar-track {
    @apply bg-background-secondary rounded;
  }

  ::-webkit-scrollbar-thumb {
    @apply bg-border-medium rounded hover:bg-border-dark;
  }

  /* 选中文本样式 */
  ::selection {
    @apply bg-primary-100 text-primary-700;
  }

  .dark ::selection {
    @apply bg-primary-600/30 text-primary-100;
  }

  /* 焦点样式 */
  :focus-visible {
    @apply outline-none ring-2 ring-primary-500 ring-offset-2 ring-offset-background-primary;
  }
}

/* 减少动效模式支持 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* 实用工具类 */
@layer utilities {
  /* 截断文本 */
  .truncate {
    @apply overflow-hidden text-ellipsis whitespace-nowrap;
  }

  /* 仅屏幕阅读器可见 */
  .sr-only {
    @apply absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0;
    clip: rect(0, 0, 0, 0);
  }

  .sr-only:not(:focus):not(:active) {
    @apply sr-only;
  }

  /* GPU 加速 */
  .gpu-accelerate {
    will-change: transform, opacity;
    transform: translateZ(0);
  }
}
```

### 3.2 主题切换实现

创建 `src/renderer/src/hooks/useTheme.ts`：

```tsx
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useTheme = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => {
        set({ theme });
        applyTheme(theme);
      }
    }),
    {
      name: 'theme-storage'
    }
  )
);

function applyTheme(theme: Theme) {
  const root = window.document.documentElement;

  // 移除旧类名
  root.classList.remove('light', 'dark');

  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    root.classList.add(systemTheme);
  } else {
    root.classList.add(theme);
  }
}

// 监听系统主题变化
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const { theme } = useTheme.getState();
    if (theme === 'system') {
      applyTheme('system');
    }
  });

  // 初始化主题
  const { theme } = useTheme.getState();
  applyTheme(theme);
}
```

**主题切换按钮组件：**

```tsx
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@renderer/hooks/useTheme';
import { Button } from '@renderer/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    setTheme(nextTheme);
  };

  const Icon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="切换主题"
      className="transition-transform hover:scale-105"
    >
      <Icon className="w-5 h-5" />
    </Button>
  );
}
```

---

## 4. 组件库安装

### 4.1 创建基础组件

创建 `src/renderer/src/lib/utils.ts`：

```ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 4.2 Button 组件

创建 `src/renderer/src/components/ui/button.tsx`：

```tsx
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@renderer/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary:
          "bg-primary-600 text-white shadow-sm hover:bg-primary-700 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-98",
        secondary:
          "bg-background-tertiary text-text-primary border border-border-medium hover:bg-border-light hover:border-border-dark",
        ghost:
          "bg-transparent text-text-secondary hover:bg-background-tertiary hover:text-text-primary",
        destructive:
          "bg-error-600 text-white shadow-sm hover:bg-error-700 hover:shadow-md",
        icon:
          "bg-transparent hover:bg-background-tertiary"
      },
      size: {
        small: "h-8 px-3 text-xs",
        medium: "h-10 px-6 text-sm",
        large: "h-12 px-8 text-base",
        icon: "h-10 w-10 p-0"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "medium"
    }
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
```

---

## 5. 组件实施顺序

### 5.1 第一阶段：基础组件（1-2 天）

**优先级：最高**

1. **Button** - 所有页面都需要
2. **Input** - 表单必需
3. **Select** - 下拉菜单
4. **Checkbox** - 设置页面
5. **Radio** - 压缩页面模式选择

**验收标准：**
- 所有变体（variant）和尺寸（size）正确渲染
- 悬停、聚焦、禁用状态正常
- 键盘导航可用
- 深色主题正常

### 5.2 第二阶段：布局组件（2-3 天）

1. **Sidebar** - 导航栏
2. **PageContainer** - 页面容器
3. **Header/Footer** - 如果需要

**验收标准：**
- 响应式布局正常（< 1024px）
- 路由激活状态高亮
- 主题切换按钮正常工作

### 5.3 第三阶段：复合组件（3-4 天）

1. **FileUploader** - 文件拖放
2. **FileList** - 文件列表（包含折叠/展开）
3. **MediaInfo** - 媒体信息显示
4. **ProgressBar** - 进度条（带 shimmer 动画）

**验收标准：**
- 拖放功能正常
- 展开/折叠动画流畅
- 进度条动画正确

### 5.4 第四阶段：核心组件（4-5 天）

1. **TaskCard** - 任务卡片（所有状态）
2. **ConvertConfig** - 转换配置面板
3. **CompressConfig** - 压缩配置面板

**验收标准：**
- 所有任务状态正确显示
- 状态转换动画流畅
- 实时进度更新正常

### 5.5 第五阶段：页面集成（3-4 天）

1. **首页（Dashboard）**
2. **转换页面（Convert）**
3. **压缩页面（Compress）**
4. **队列页面（Queue）**
5. **设置页面（Settings）**

**验收标准：**
- 所有页面功能正常
- 页面切换动画流畅
- 数据流正确

### 5.6 第六阶段：优化和测试（2-3 天）

1. **性能优化**
   - 虚拟滚动（任务列表 > 50）
   - 进度更新节流
   - 避免不必要的重渲染

2. **视觉回归测试**
   - 截图对比
   - 多分辨率测试
   - 深色主题测试

3. **无障碍测试**
   - 键盘导航
   - 屏幕阅读器
   - 对比度检查

---

## 6. 迁移策略

### 6.1 渐进式迁移

**原则：**
- 一次只迁移一个组件或页面
- 新旧组件可以共存
- 不破坏现有功能

**步骤：**

1. **创建新组件目录**
   ```
   src/renderer/src/components/
   ├── ui/              ← 新的基础组件
   │   ├── button.tsx
   │   ├── input.tsx
   │   └── ...
   ├── [legacy]/        ← 旧组件重命名
   │   ├── Button/
   │   └── ...
   └── [新组件]/
       ├── TaskCard/
       └── ...
   ```

2. **迁移单个组件**
   ```tsx
   // 旧版本（保留）
   import { OldButton } from '@renderer/components/[legacy]/Button';

   // 新版本
   import { Button } from '@renderer/components/ui/button';

   // 逐步替换
   function MyPage() {
     return (
       <>
         <OldButton>旧按钮</OldButton>
         <Button>新按钮</Button>
       </>
     );
   }
   ```

3. **验证新组件**
   - 功能一致
   - 样式一致
   - 无回归错误

4. **删除旧组件**
   - 确认所有引用已更新
   - 删除旧文件
   - 更新导入路径

### 6.2 迁移检查清单

**组件迁移前：**
- [ ] 阅读组件规范文档
- [ ] 了解当前实现
- [ ] 准备测试数据

**迁移中：**
- [ ] 创建新组件
- [ ] 实现所有变体和状态
- [ ] 添加 TypeScript 类型
- [ ] 编写基础测试

**迁移后：**
- [ ] 视觉对比测试
- [ ] 功能测试
- [ ] 无障碍测试
- [ ] 性能测试
- [ ] 更新文档

---

## 7. 关键组件实现

### 7.1 TaskCard 完整实现

参考 `components-specification.md` 中的详细规范。

**关键要点：**

1. **状态管理清晰**
   ```tsx
   const getStatusStyles = (status: TaskStatus) => {
     // 返回对应状态的 Tailwind 类名
   };
   ```

2. **使用 memo 优化**
   ```tsx
   export const TaskCard = memo(function TaskCard({ task, ... }) {
     // 避免不必要的重渲染
   });
   ```

3. **动画流畅**
   ```tsx
   <motion.div
     animate={{
       borderColor: status === 'running' ? '...' : '...'
     }}
     transition={{ duration: 0.3 }}
   >
   ```

### 7.2 ProgressBar 完整实现

```tsx
import { cn } from '@renderer/lib/utils';

interface ProgressBarProps {
  percent: number;
  animated?: boolean;
  indeterminate?: boolean;
  className?: string;
}

export function ProgressBar({
  percent,
  animated = false,
  indeterminate = false,
  className
}: ProgressBarProps) {
  if (indeterminate) {
    return (
      <div className={cn(
        "relative w-full h-2 bg-border-light dark:bg-gray-700 rounded-full overflow-hidden",
        className
      )}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-500 to-transparent bg-[length:200%_100%] animate-indeterminate" />
      </div>
    );
  }

  return (
    <div className={cn(
      "relative w-full h-2 bg-border-light dark:bg-gray-700 rounded-full overflow-hidden",
      className
    )}>
      <div
        className={cn(
          "absolute inset-y-0 left-0 rounded-full transition-all duration-300 ease-out",
          "bg-gradient-to-r from-primary-500 to-primary-600"
        )}
        style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
      >
        {animated && (
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
            style={{ backgroundSize: '200% 100%' }}
          />
        )}
      </div>
    </div>
  );
}
```

---

## 8. 视觉回归测试

### 8.1 使用 Playwright

**安装：**
```bash
npm install -D @playwright/test
npx playwright install
```

**配置：**

创建 `playwright.config.ts`：

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/visual',
  use: {
    baseURL: 'http://localhost:5173',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: !process.env.CI
  }
});
```

**创建视觉测试：**

```ts
// tests/visual/task-card.spec.ts
import { test, expect } from '@playwright/test';

test.describe('TaskCard Visual Tests', () => {
  test('pending state', async ({ page }) => {
    await page.goto('/queue');

    const taskCard = page.locator('[data-testid="task-card-pending"]');
    await expect(taskCard).toHaveScreenshot('task-card-pending.png');
  });

  test('running state', async ({ page }) => {
    await page.goto('/queue');

    const taskCard = page.locator('[data-testid="task-card-running"]');
    await expect(taskCard).toHaveScreenshot('task-card-running.png');
  });

  test('completed state', async ({ page }) => {
    await page.goto('/queue');

    const taskCard = page.locator('[data-testid="task-card-completed"]');
    await expect(taskCard).toHaveScreenshot('task-card-completed.png');
  });
});
```

**运行测试：**
```bash
# 首次运行，生成基准截图
npx playwright test --update-snapshots

# 后续运行，对比截图
npx playwright test
```

### 8.2 使用 Storybook（可选）

**安装：**
```bash
npx sb init --builder vite
```

**创建 Story：**

```tsx
// src/renderer/src/components/TaskCard/TaskCard.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { TaskCard } from './TaskCard';

const meta: Meta<typeof TaskCard> = {
  title: 'Components/TaskCard',
  component: TaskCard,
  parameters: {
    layout: 'padded'
  }
};

export default meta;
type Story = StoryObj<typeof TaskCard>;

export const Pending: Story = {
  args: {
    task: {
      id: '1',
      status: 'pending',
      inputFile: 'video.mp4',
      outputFile: 'video.webm',
      command: ['ffmpeg', '-i', 'video.mp4', 'video.webm']
    }
  }
};

export const Running: Story = {
  args: {
    task: {
      id: '2',
      status: 'running',
      progress: 45,
      progressInfo: {
        speed: 1.8,
        fps: 54,
        bitrate: '1500 kbps'
      },
      inputFile: 'video.mp4',
      outputFile: 'video.webm',
      command: ['ffmpeg', '-i', 'video.mp4', 'video.webm']
    }
  }
};
```

---

## 9. 平台特定考虑

### 9.1 macOS

**原生标题栏 vs 自定义标题栏：**

**选项 A：使用原生标题栏（推荐）**
```ts
// src/main/index.ts
const mainWindow = new BrowserWindow({
  width: 1280,
  height: 800,
  titleBarStyle: 'default', // 使用系统标题栏
  // ...
});
```

**选项 B：无边框窗口 + 自定义标题栏**
```ts
const mainWindow = new BrowserWindow({
  titleBarStyle: 'hidden',
  trafficLightPosition: { x: 16, y: 16 }
});
```

**窗口拖拽区域：**
```css
/* 如果使用自定义标题栏 */
.titlebar {
  -webkit-app-region: drag;
}

.titlebar button {
  -webkit-app-region: no-drag;
}
```

### 9.2 Windows

**窗口控制按钮：**

Windows 需要自定义最小化、最大化、关闭按钮：

```tsx
import { Minus, Square, X } from 'lucide-react';

function WindowControls() {
  const handleMinimize = () => {
    window.electronAPI.window.minimize();
  };

  const handleMaximize = () => {
    window.electronAPI.window.maximize();
  };

  const handleClose = () => {
    window.electronAPI.window.close();
  };

  return (
    <div className="flex h-full">
      <button onClick={handleMinimize} className="px-4 hover:bg-background-tertiary">
        <Minus className="w-4 h-4" />
      </button>
      <button onClick={handleMaximize} className="px-4 hover:bg-background-tertiary">
        <Square className="w-4 h-4" />
      </button>
      <button onClick={handleClose} className="px-4 hover:bg-error-600 hover:text-white">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
```

### 9.3 Linux

**字体渲染：**

Linux 上 Inter 字体可能渲染较差，添加 fallback：

```css
body {
  font-family: 'Inter Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI',
               'Ubuntu', 'Cantarell', sans-serif;
}
```

---

## 10. 故障排查

### 10.1 常见问题

**问题：Tailwind 样式不生效**

解决方案：
1. 检查 `content` 配置是否包含所有文件路径
2. 重启开发服务器
3. 清除缓存：`rm -rf node_modules/.vite`

**问题：深色主题颜色不对**

解决方案：
1. 检查 CSS 变量是否在 `.dark` 类下定义
2. 检查 `darkMode: ['class']` 配置
3. 检查主题切换逻辑是否正确添加/移除类名

**问题：动画卡顿**

解决方案：
1. 使用 `transform` 和 `opacity`（GPU 加速）
2. 避免动画 `height`、`width`（触发重排）
3. 使用 `will-change` 提示浏览器
4. 检查是否有大量同时运行的动画

**问题：字体加载慢**

解决方案：
1. 使用 Google Fonts 的 `display=swap` 参数
2. 考虑自托管字体文件
3. 使用 `<link rel="preload">` 预加载字体

### 10.2 调试技巧

**Tailwind IntelliSense：**
安装 VS Code 扩展，获得自动完成和悬停预览。

**浏览器 DevTools：**
```tsx
// 在组件中添加 data 属性方便调试
<div data-component="TaskCard" data-status={status}>
```

**性能分析：**
```tsx
import { Profiler } from 'react';

<Profiler id="TaskList" onRender={(id, phase, actualDuration) => {
  console.log(`${id} ${phase} took ${actualDuration}ms`);
}}>
  <TaskList tasks={tasks} />
</Profiler>
```

---

## 总结

遵循本指南，您应该能够成功实施 FFmpeg GUI 的现代简约设计系统。记住：

1. **从小处开始**：先完成基础组件
2. **渐进式迁移**：不要一次重写所有代码
3. **测试驱动**：每个组件都要测试
4. **性能优先**：使用 GPU 加速的属性
5. **无障碍第一**：确保键盘导航和屏幕阅读器支持

如有问题，参考其他设计文档：
- `overview.md` - 设计哲学和目标
- `pages-layout.md` - 页面布局规范
- `components-specification.md` - 组件详细规范
- `interaction-patterns.md` - 交互模式
- `animation-motion.md` - 动画和动效

祝实施顺利！🎨✨
