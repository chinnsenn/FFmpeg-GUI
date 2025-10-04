# Task 04: 创建动画工具类和 Keyframes

## 任务目标

配置完整的动画系统，包括关键帧动画（keyframes）、过渡时间、缓动函数，并创建可复用的动画工具类。

## 参考文档

- `docs/design/modern/guide/animation-motion.md` - 动画和动效指南
- `docs/design/modern/guide/implementation-guide.md` - 动画配置
- `docs/design/modern/demo/component-progressbar.html` - Shimmer 动画示例
- `docs/design/modern/demo/component-taskcard.html` - 状态动画示例

## 动画系统设计

### 动画类型

1. **Shimmer 动画** - 进度条加载动画
2. **Indeterminate 动画** - 不确定进度条
3. **Fade In** - 元素淡入
4. **Scale In** - 元素缩放进入（庆祝动画）
5. **Slide In** - 元素滑入
6. **Shake** - 错误抖动
7. **Pulse** - 边框脉冲（运行中状态）

### 动画时长

- **Instant** - 100ms（快速反馈）
- **Fast** - 150ms（按钮点击）
- **Normal** - 200ms（标准过渡）
- **Medium** - 300ms（展开/折叠）
- **Slow** - 400ms（页面进入）
- **Slower** - 600ms（复杂动画）

### 缓动函数

- **ease-out** - 进入动画（快速开始，慢速结束）
- **ease-in-out** - 状态变化（平滑过渡）
- **bounce** - 弹跳效果（庆祝动画）
- **smooth** - 平滑过渡

## 实施步骤

### 步骤 1: 安装动画插件

```bash
npm install -D tailwindcss-animate
```

### 步骤 2: 在 Tailwind 配置中添加动画扩展

更新 `tailwind.config.js`（如果在 Task 02 已部分配置，继续扩展）：

```js
export default {
  theme: {
    extend: {
      // ============ 动画时间 ============
      transitionDuration: {
        instant: '100ms',
        fast: '150ms',
        DEFAULT: '200ms',
        normal: '200ms',
        medium: '300ms',
        slow: '400ms',
        slower: '600ms',
      },

      // ============ 缓动函数 ============
      transitionTimingFunction: {
        bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',      // 弹跳
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',                // 平滑（类似 ease）
        'fast-out': 'cubic-bezier(0.4, 0, 0.6, 1)',            // 快速退出
        precise: 'cubic-bezier(0.2, 0, 0, 1)',                 // 精确（类似 ease-in）
      },

      // ============ 关键帧动画 ============
      keyframes: {
        // 1. Shimmer 动画（进度条光晕）
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },

        // 2. Indeterminate 动画（不确定进度条）
        indeterminate: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },

        // 3. Fade In（淡入）
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },

        // 4. Fade Out（淡出）
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },

        // 5. Scale In（缩放进入，用于完成状态）
        'scale-in': {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },

        // 6. Slide In（从下方滑入）
        'slide-in': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },

        // 7. Slide In from Right（从右侧滑入，Toast 通知）
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },

        // 8. Slide Out to Right（向右侧滑出）
        'slide-out-right': {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },

        // 9. Shake（抖动，用于错误状态）
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-10px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(10px)' },
        },

        // 10. Pulse（脉冲，用于运行中状态）
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },

        // 11. Spin（旋转，加载动画）
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },

        // 12. Bounce（弹跳）
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-25%)' },
        },
      },

      // ============ 动画配置 ============
      animation: {
        // Shimmer 动画（2秒，无限循环）
        shimmer: 'shimmer 2s infinite',

        // Indeterminate 动画（1.5秒，无限循环）
        indeterminate: 'indeterminate 1.5s ease-in-out infinite',

        // Fade In（300ms，ease-out）
        'fade-in': 'fade-in 300ms ease-out',
        'fade-in-fast': 'fade-in 150ms ease-out',
        'fade-in-slow': 'fade-in 400ms ease-out',

        // Fade Out（200ms）
        'fade-out': 'fade-out 200ms ease-in',
        'fade-out-fast': 'fade-out 150ms ease-in',

        // Scale In（200ms，bounce）
        'scale-in': 'scale-in 200ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',

        // Slide In（300ms，ease-out）
        'slide-in': 'slide-in 300ms ease-out',
        'slide-in-fast': 'slide-in 200ms ease-out',

        // Slide In from Right（Toast）
        'slide-in-right': 'slide-in-right 300ms ease-out',

        // Slide Out to Right
        'slide-out-right': 'slide-out-right 200ms ease-in',

        // Shake（400ms，错误状态）
        shake: 'shake 400ms ease-in-out',

        // Pulse（2秒，无限循环）
        pulse: 'pulse 2s ease-in-out infinite',
        'pulse-fast': 'pulse 1s ease-in-out infinite',

        // Spin（1秒，无限循环）
        spin: 'spin 1s linear infinite',
        'spin-fast': 'spin 500ms linear infinite',
        'spin-slow': 'spin 2s linear infinite',

        // Bounce
        bounce: 'bounce 1s ease-in-out infinite',
      },

      // ============ 缩放扩展 ============
      scale: {
        98: '0.98',   // 按下状态
        102: '1.02',  // 悬停状态
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
};
```

### 步骤 3: 添加 prefers-reduced-motion 支持

在 `src/renderer/src/index.css` 中添加：

```css
/* 减少动效模式支持（辅助功能） */
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
```

### 步骤 4: 创建动画工具类

在 `src/renderer/src/index.css` 的 `@layer utilities` 中添加：

```css
@layer utilities {
  /* GPU 加速 */
  .gpu-accelerate {
    will-change: transform, opacity;
    transform: translateZ(0);
  }

  /* 禁用动画 */
  .no-animation {
    animation: none !important;
    transition: none !important;
  }

  /* 平滑过渡（常用组合） */
  .transition-smooth {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 200ms;
  }

  /* 交互状态过渡 */
  .transition-interactive {
    transition-property: transform, opacity, background-color, border-color, box-shadow;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
  }

  /* 悬停提升效果 */
  .hover-lift {
    @apply transition-interactive;
  }

  .hover-lift:hover {
    @apply -translate-y-0.5 shadow-md;
  }

  /* 点击缩小效果 */
  .active-scale {
    @apply transition-transform duration-fast;
  }

  .active-scale:active {
    @apply scale-98;
  }

  /* 边框脉冲（运行中状态） */
  .border-pulse {
    animation: pulse 2s ease-in-out infinite;
  }

  /* 旋转加载 */
  .loading-spin {
    animation: spin 1s linear infinite;
  }
}
```

### 步骤 5: 创建可复用的动画组件

创建 `src/renderer/src/components/ui/animations.tsx`：

```tsx
import { cn } from '@renderer/lib/utils';
import { HTMLAttributes } from 'react';

// Shimmer 容器（用于进度条）
export function ShimmerContainer({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('relative overflow-hidden', className)} {...props}>
      {children}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
    </div>
  );
}

// Fade In 容器
export function FadeIn({
  className,
  children,
  delay = 0,
  ...props
}: HTMLAttributes<HTMLDivElement> & { delay?: number }) {
  return (
    <div
      className={cn('animate-fade-in', className)}
      style={{ animationDelay: `${delay}ms` }}
      {...props}
    >
      {children}
    </div>
  );
}

// Scale In 容器（庆祝动画）
export function ScaleIn({
  className,
  children,
  delay = 0,
  ...props
}: HTMLAttributes<HTMLDivElement> & { delay?: number }) {
  return (
    <div
      className={cn('animate-scale-in', className)}
      style={{ animationDelay: `${delay}ms` }}
      {...props}
    >
      {children}
    </div>
  );
}

// Slide In 容器
export function SlideIn({
  className,
  children,
  delay = 0,
  ...props
}: HTMLAttributes<HTMLDivElement> & { delay?: number }) {
  return (
    <div
      className={cn('animate-slide-in', className)}
      style={{ animationDelay: `${delay}ms` }}
      {...props}
    >
      {children}
    </div>
  );
}

// 加载旋转器
export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin',
        className
      )}
    />
  );
}
```

## 验收标准

### 1. 动画功能测试

创建测试页面 `src/renderer/src/pages/__tests__/AnimationTest.tsx`：

```tsx
import { useState } from 'react';
import { ShimmerContainer, FadeIn, ScaleIn, SlideIn, Spinner } from '@renderer/components/ui/animations';

export function AnimationTest() {
  const [shake, setShake] = useState(false);
  const [show, setShow] = useState(true);

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-h1">动画系统测试</h1>

      {/* Shimmer 动画 */}
      <section>
        <h2 className="text-h2 mb-4">Shimmer 动画（进度条）</h2>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <ShimmerContainer className="w-3/4 h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full" />
        </div>
      </section>

      {/* Indeterminate 动画 */}
      <section>
        <h2 className="text-h2 mb-4">Indeterminate 动画</h2>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-transparent via-primary-500 to-transparent bg-[length:200%_100%] animate-indeterminate" />
        </div>
      </section>

      {/* Fade/Scale/Slide 动画 */}
      <section>
        <h2 className="text-h2 mb-4">进入动画</h2>
        <button
          onClick={() => setShow(!show)}
          className="mb-4 px-4 py-2 bg-primary-500 text-white rounded"
        >
          切换显示
        </button>

        {show && (
          <div className="grid grid-cols-3 gap-4">
            <FadeIn className="p-4 bg-primary-100 rounded">Fade In</FadeIn>
            <ScaleIn className="p-4 bg-success-100 rounded">Scale In</ScaleIn>
            <SlideIn className="p-4 bg-warning-100 rounded">Slide In</SlideIn>
          </div>
        )}
      </section>

      {/* Shake 动画 */}
      <section>
        <h2 className="text-h2 mb-4">Shake 动画（错误）</h2>
        <button
          onClick={() => {
            setShake(true);
            setTimeout(() => setShake(false), 400);
          }}
          className="mb-4 px-4 py-2 bg-error-500 text-white rounded"
        >
          触发抖动
        </button>

        <div
          className={cn(
            'p-4 bg-error-100 border-2 border-error-500 rounded',
            shake && 'animate-shake'
          )}
        >
          错误提示框
        </div>
      </section>

      {/* Pulse 动画 */}
      <section>
        <h2 className="text-h2 mb-4">Pulse 动画（运行中）</h2>
        <div className="p-4 bg-primary-100 border-2 border-primary-500 rounded animate-pulse">
          运行中的任务
        </div>
      </section>

      {/* Spin 动画 */}
      <section>
        <h2 className="text-h2 mb-4">Spin 动画（加载）</h2>
        <div className="flex gap-4">
          <Spinner className="text-primary-500" />
          <Spinner className="w-6 h-6 text-success-500" />
          <Spinner className="w-8 h-8 text-error-500" />
        </div>
      </section>

      {/* 交互动画 */}
      <section>
        <h2 className="text-h2 mb-4">交互动画</h2>
        <div className="grid grid-cols-3 gap-4">
          <button className="px-4 py-2 bg-primary-500 text-white rounded hover-lift">
            悬停提升
          </button>
          <button className="px-4 py-2 bg-primary-500 text-white rounded active-scale">
            点击缩小
          </button>
          <button className="px-4 py-2 bg-primary-500 text-white rounded transition-interactive hover:scale-102">
            悬停放大
          </button>
        </div>
      </section>
    </div>
  );
}
```

添加路由：

```tsx
{
  path: '/__test__/animations',
  element: <AnimationTest />,
}
```

访问 `http://localhost:5173/#/__test__/animations`，检查：

- [ ] Shimmer 动画流畅（光晕从左到右移动）
- [ ] Indeterminate 动画流畅（渐变背景移动）
- [ ] Fade/Scale/Slide In 动画正确触发
- [ ] Shake 动画抖动效果正确
- [ ] Pulse 动画脉冲效果明显
- [ ] Spin 动画旋转流畅
- [ ] 悬停提升效果正常
- [ ] 点击缩小效果正常

### 2. 性能测试

使用浏览器 DevTools Performance 面板：

- [ ] 动画帧率 ≥ 60fps
- [ ] 无明显掉帧
- [ ] CPU 使用率合理（< 30%）
- [ ] 使用 `transform` 和 `opacity`（GPU 加速）

### 3. 辅助功能测试

启用系统"减少动效"设置：

**macOS**：系统设置 → 辅助功能 → 显示 → 减弱动态效果
**Windows**：设置 → 轻松使用 → 显示 → 显示动画

- [ ] 动画立即完成（几乎无持续时间）
- [ ] 功能仍然正常（无阻塞）

## 潜在问题

### 问题 1: 动画卡顿

**原因**：动画属性触发重排（layout）

**解决方案**：
仅动画 `transform` 和 `opacity`，避免 `width`、`height`、`top`、`left` 等。

✅ 正确：
```tsx
<div className="transition-transform hover:-translate-y-1">...</div>
```

❌ 错误：
```tsx
<div className="transition-all hover:top-[-4px]">...</div>
```

### 问题 2: Shimmer 动画不显示

**原因**：容器缺少 `overflow-hidden` 或 `relative`

**解决方案**：
```tsx
<div className="relative overflow-hidden">
  <div className="animate-shimmer">...</div>
</div>
```

### 问题 3: 动画延迟明显

**原因**：动画时长过长

**解决方案**：
缩短动画时长，常用交互动画应 ≤ 200ms：
```js
animation: {
  'fade-in': 'fade-in 200ms ease-out', // ✅ 快速
  'fade-in-slow': 'fade-in 600ms ease-out', // ❌ 太慢
}
```

## 输出产物

**更新文件**：
- `tailwind.config.js`（添加 keyframes 和 animation 配置）
- `src/renderer/src/index.css`（添加工具类和 prefers-reduced-motion）

**新增文件**：
- `src/renderer/src/components/ui/animations.tsx`（可复用动画组件）
- `src/renderer/src/pages/__tests__/AnimationTest.tsx`（测试页面）

**安装依赖**：
- `tailwindcss-animate`

## 预计时间

- **配置**：1-1.5 小时
- **创建组件**：0.5-1 小时
- **测试**：0.5-1 小时
- **总计**：2-3.5 小时

---

**创建时间**：2025-10-04
**优先级**：P1
**依赖**：Task 02（Tailwind 配置）
**后续任务**：Plan-02: Core Components
