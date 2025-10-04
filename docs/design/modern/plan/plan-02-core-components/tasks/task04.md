# Task 04: 重构 ProgressBar 组件

## 任务目标

创建强大的进度条组件，支持确定/不确定状态、shimmer 动画、多种颜色变体和 prefers-reduced-motion 支持。

## 参考文档

- `docs/design/modern/demo/component-progressbar.html` - 进度条所有变体和动画
- `docs/design/modern/demo/queue.html` - 进度条在任务队列中的应用
- `docs/design/modern/guide/animation-motion.md` - 动画规范

## 实施步骤

### 步骤 1: 创建 ProgressBar 组件

```tsx
// src/renderer/src/components/ui/ProgressBar.tsx
import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@renderer/lib/utils';

const progressVariants = cva('w-full overflow-hidden rounded-full bg-background-tertiary', {
  variants: {
    size: {
      xs: 'h-1',
      sm: 'h-2',
      md: 'h-3',
      lg: 'h-4',
    },
    color: {
      primary: '[&_.progress-fill]:bg-primary-500',
      success: '[&_.progress-fill]:bg-success-500',
      warning: '[&_.progress-fill]:bg-warning-500',
      error: '[&_.progress-fill]:bg-error-500',
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'primary',
  },
});

export interface ProgressBarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants> {
  value?: number; // 0-100, undefined 表示 indeterminate
  showPercentage?: boolean;
  shimmer?: boolean;
  label?: string;
}

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      className,
      value,
      size,
      color,
      showPercentage = false,
      shimmer = false,
      label,
      ...props
    },
    ref
  ) => {
    const isIndeterminate = value === undefined;
    const percentage = isIndeterminate ? 0 : Math.min(100, Math.max(0, value));

    return (
      <div ref={ref} className="space-y-1" {...props}>
        {(label || showPercentage) && (
          <div className="flex justify-between items-center text-sm">
            {label && <span className="text-text-secondary">{label}</span>}
            {showPercentage && !isIndeterminate && (
              <span className="text-text-primary font-medium">{percentage}%</span>
            )}
          </div>
        )}

        <div
          className={cn(progressVariants({ size, color }), className)}
          role="progressbar"
          aria-valuenow={isIndeterminate ? undefined : percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label}
        >
          <div
            className={cn(
              'progress-fill h-full transition-all duration-300 ease-out',
              shimmer && 'animate-shimmer',
              isIndeterminate && 'animate-indeterminate w-1/3'
            )}
            style={
              isIndeterminate
                ? undefined
                : { width: `${percentage}%` }
            }
          />
        </div>
      </div>
    );
  }
);

ProgressBar.displayName = 'ProgressBar';
```

### 步骤 2: 添加动画到 CSS

```css
/* src/renderer/src/index.css */

/* Shimmer 动画 - 从左到右的光泽效果 */
@keyframes shimmer {
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
}

.animate-shimmer {
  background: linear-gradient(
    90deg,
    currentColor 0%,
    currentColor 40%,
    rgba(255, 255, 255, 0.5) 50%,
    currentColor 60%,
    currentColor 100%
  );
  background-size: 200% 100%;
  animation: shimmer 2s linear infinite;
}

/* Indeterminate 动画 - 左右移动 */
@keyframes indeterminate {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(400%);
  }
}

.animate-indeterminate {
  animation: indeterminate 1.5s ease-in-out infinite;
}

/* prefers-reduced-motion 支持 */
@media (prefers-reduced-motion: reduce) {
  .animate-shimmer,
  .animate-indeterminate {
    animation: none;
  }

  .animate-shimmer {
    background: currentColor;
  }
}
```

### 步骤 3: 创建使用示例

```tsx
// 示例：确定进度条
<ProgressBar value={75} showPercentage label="上传进度" />

// 示例：不确定进度条
<ProgressBar label="处理中..." />

// 示例：带 shimmer 的进度条
<ProgressBar value={45} shimmer color="success" />

// 示例：不同尺寸
<ProgressBar value={60} size="xs" />
<ProgressBar value={60} size="sm" />
<ProgressBar value={60} size="md" />
<ProgressBar value={60} size="lg" />

// 示例：不同颜色
<ProgressBar value={60} color="primary" />
<ProgressBar value={60} color="success" />
<ProgressBar value={60} color="warning" />
<ProgressBar value={60} color="error" />
```

### 步骤 4: 创建高级变体（可选）

```tsx
// src/renderer/src/components/ui/CircularProgress.tsx
// 圆形进度条（可选，用于特殊场景）
import { forwardRef } from 'react';
import { cn } from '@renderer/lib/utils';

export interface CircularProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number; // 0-100
  size?: number; // 默认 40px
  strokeWidth?: number; // 默认 4px
  color?: 'primary' | 'success' | 'warning' | 'error';
}

export const CircularProgress = forwardRef<HTMLDivElement, CircularProgressProps>(
  ({ className, value, size = 40, strokeWidth = 4, color = 'primary', ...props }, ref) => {
    const isIndeterminate = value === undefined;
    const percentage = isIndeterminate ? 0 : Math.min(100, Math.max(0, value));
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    const colorMap = {
      primary: 'text-primary-500',
      success: 'text-success-500',
      warning: 'text-warning-500',
      error: 'text-error-500',
    };

    return (
      <div ref={ref} className={cn('inline-flex', className)} {...props}>
        <svg width={size} height={size} className={cn(colorMap[color])}>
          {/* 背景圆 */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="opacity-20"
          />
          {/* 进度圆 */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={cn(
              'transition-all duration-300 ease-out',
              isIndeterminate && 'animate-spin'
            )}
            style={{
              transform: 'rotate(-90deg)',
              transformOrigin: '50% 50%',
            }}
          />
        </svg>
      </div>
    );
  }
);

CircularProgress.displayName = 'CircularProgress';
```

### 步骤 5: 创建测试

```tsx
// src/renderer/src/components/ui/__tests__/ProgressBar.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProgressBar } from '../ProgressBar';

describe('ProgressBar', () => {
  it('should render with value', () => {
    const { container } = render(<ProgressBar value={50} />);
    const progressbar = container.querySelector('[role="progressbar"]');
    expect(progressbar).toBeInTheDocument();
    expect(progressbar).toHaveAttribute('aria-valuenow', '50');
  });

  it('should render indeterminate when value is undefined', () => {
    const { container } = render(<ProgressBar />);
    const progressbar = container.querySelector('[role="progressbar"]');
    expect(progressbar).not.toHaveAttribute('aria-valuenow');
  });

  it('should show percentage when showPercentage is true', () => {
    render(<ProgressBar value={75} showPercentage />);
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('should show label', () => {
    render(<ProgressBar value={50} label="Loading..." />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should clamp value between 0 and 100', () => {
    const { container: container1 } = render(<ProgressBar value={-10} />);
    const { container: container2 } = render(<ProgressBar value={150} />);

    expect(container1.querySelector('[role="progressbar"]')).toHaveAttribute('aria-valuenow', '0');
    expect(container2.querySelector('[role="progressbar"]')).toHaveAttribute('aria-valuenow', '100');
  });

  it('should apply color variant classes', () => {
    const { container } = render(<ProgressBar value={50} color="success" />);
    expect(container.firstChild).toHaveClass('[&_.progress-fill]:bg-success-500');
  });

  it('should apply size variant classes', () => {
    const { container } = render(<ProgressBar value={50} size="lg" />);
    const progressbar = container.querySelector('[role="progressbar"]');
    expect(progressbar).toHaveClass('h-4');
  });

  it('should apply shimmer animation when shimmer is true', () => {
    const { container } = render(<ProgressBar value={50} shimmer />);
    const fill = container.querySelector('.progress-fill');
    expect(fill).toHaveClass('animate-shimmer');
  });

  it('should apply indeterminate animation when value is undefined', () => {
    const { container } = render(<ProgressBar />);
    const fill = container.querySelector('.progress-fill');
    expect(fill).toHaveClass('animate-indeterminate');
  });
});
```

## 验收标准

### 1. 视觉一致性

- [ ] 与 `component-progressbar.html` 视觉 100% 一致
- [ ] 轨道颜色正确（bg-background-tertiary）
- [ ] 填充颜色正确（primary、success、warning、error）
- [ ] 尺寸正确（xs: 4px、sm: 8px、md: 12px、lg: 16px）
- [ ] shimmer 动画流畅（2s 循环）
- [ ] indeterminate 动画流畅（1.5s 循环）

### 2. 功能完整性

- [ ] value 范围自动钳制到 0-100
- [ ] value 变化时平滑过渡（300ms）
- [ ] showPercentage 正确显示百分比
- [ ] label 正确显示
- [ ] 支持所有 div 原生属性

### 3. 无障碍性

- [ ] role="progressbar" 正确设置
- [ ] aria-valuenow、aria-valuemin、aria-valuemax 正确
- [ ] aria-label 通过 label prop 设置
- [ ] 不确定状态不设置 aria-valuenow

### 4. 动画性能

- [ ] shimmer 动画使用 GPU 加速
- [ ] indeterminate 动画使用 transform（不是 left/right）
- [ ] prefers-reduced-motion 时禁用动画
- [ ] 帧率稳定 ≥ 60fps

### 5. 测试覆盖率

- [ ] 所有测试通过
- [ ] 测试覆盖率 ≥ 80%

## 潜在问题

### 问题 1: shimmer 动画不流畅

**症状**：shimmer 效果有卡顿

**解决方案**：
确保使用 `background-position` 而不是 `transform`，并且使用 `will-change`：

```css
.animate-shimmer {
  will-change: background-position;
  background: linear-gradient(...);
  background-size: 200% 100%;
  animation: shimmer 2s linear infinite;
}
```

### 问题 2: 进度条宽度变化有跳跃

**症状**：进度从 0 到 100 时有跳跃

**解决方案**：
确保使用 `transition` 而不是 `animation`：

```tsx
className="transition-all duration-300 ease-out"
style={{ width: `${percentage}%` }}
```

## 输出产物

**新增文件**：
- `src/renderer/src/components/ui/ProgressBar.tsx`（约 80-100 行）
- `src/renderer/src/components/ui/CircularProgress.tsx`（可选，约 60 行）
- `src/renderer/src/components/ui/__tests__/ProgressBar.test.tsx`（约 80-100 行）

**更新文件**：
- `src/renderer/src/index.css`（添加动画，约 30 行）
- `src/renderer/src/components/ui/index.ts`（导出 ProgressBar）

## 预计时间

- **实施**：1.5-2 小时
- **测试**：0.5-1 小时
- **总计**：2-3 小时

---

**创建时间**：2025-10-04
**优先级**：P1
**依赖**：Task 01（Button 组件）
**后续任务**：Task 05（Modal 组件）
