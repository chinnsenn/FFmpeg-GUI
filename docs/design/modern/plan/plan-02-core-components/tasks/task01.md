# Task 01: 重构 Button 组件

## 任务目标

创建完全符合 Modern Minimalist 设计系统的 Button 组件，支持 5 种变体 × 3 种尺寸 × 所有状态。

## 参考文档

- `docs/design/modern/demo/component-button.html` - 完整的 Button 实现和所有变体
- `docs/design/modern/guide/components-specification.md` - Button 组件规范
- `docs/design/modern/guide/interaction-patterns.md` - 按钮交互模式

## 实施步骤

### 步骤 1: 创建组件基础结构

使用 CVA (class-variance-authority) 定义变体：

```tsx
// src/renderer/src/components/ui/Button.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';
import { cn } from '@renderer/lib/utils';

const buttonVariants = cva(
  // 基础类（所有按钮共享）
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 shadow-sm hover:shadow-md',
        secondary: 'bg-background-tertiary text-text-primary hover:bg-border-medium border border-border-light',
        ghost: 'text-text-primary hover:bg-background-secondary active:bg-background-tertiary',
        destructive: 'bg-error-500 text-white hover:bg-error-600 active:bg-error-700 shadow-sm hover:shadow-md',
        icon: 'text-text-secondary hover:text-text-primary hover:bg-background-secondary active:bg-background-tertiary',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-11 px-6 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
```

### 步骤 2: 实现组件逻辑

```tsx
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, className, loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={loading || disabled}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && leftIcon}
        {children}
        {!loading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

### 步骤 3: 添加 Icon 变体特殊处理

Icon 按钮需要特殊的尺寸处理（正方形）：

```tsx
const buttonVariants = cva(
  // ... 基础类 ...
  {
    variants: {
      variant: { /* ... */ },
      size: {
        sm: 'h-9 text-sm',
        md: 'h-10 text-base',
        lg: 'h-11 text-lg',
      },
    },
    compoundVariants: [
      // Icon 变体使用正方形尺寸
      {
        variant: 'icon',
        size: 'sm',
        className: 'w-9 px-0',
      },
      {
        variant: 'icon',
        size: 'md',
        className: 'w-10 px-0',
      },
      {
        variant: 'icon',
        size: 'lg',
        className: 'w-11 px-0',
      },
      // 其他变体使用水平内边距
      {
        variant: ['primary', 'secondary', 'ghost', 'destructive'],
        size: 'sm',
        className: 'px-3',
      },
      {
        variant: ['primary', 'secondary', 'ghost', 'destructive'],
        size: 'md',
        className: 'px-4',
      },
      {
        variant: ['primary', 'secondary', 'ghost', 'destructive'],
        size: 'lg',
        className: 'px-6',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);
```

### 步骤 4: 创建工具函数（如果不存在）

```tsx
// src/renderer/src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 步骤 5: 创建测试

```tsx
// src/renderer/src/components/ui/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '../Button';

describe('Button', () => {
  it('should render children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick} disabled>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should not call onClick when loading', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick} loading>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should show loading spinner when loading', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole('button')).toContainHTML('svg');
  });

  it('should render left icon', () => {
    render(
      <Button leftIcon={<span data-testid="left-icon">L</span>}>
        Button
      </Button>
    );
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
  });

  it('should render right icon', () => {
    render(
      <Button rightIcon={<span data-testid="right-icon">R</span>}>
        Button
      </Button>
    );
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });

  describe('variants', () => {
    it('should apply primary variant classes', () => {
      render(<Button variant="primary">Primary</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-primary-500');
    });

    it('should apply secondary variant classes', () => {
      render(<Button variant="secondary">Secondary</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-background-tertiary');
    });

    it('should apply ghost variant classes', () => {
      render(<Button variant="ghost">Ghost</Button>);
      expect(screen.getByRole('button')).toHaveClass('hover:bg-background-secondary');
    });

    it('should apply destructive variant classes', () => {
      render(<Button variant="destructive">Destructive</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-error-500');
    });
  });

  describe('sizes', () => {
    it('should apply small size classes', () => {
      render(<Button size="sm">Small</Button>);
      expect(screen.getByRole('button')).toHaveClass('h-9');
    });

    it('should apply medium size classes', () => {
      render(<Button size="md">Medium</Button>);
      expect(screen.getByRole('button')).toHaveClass('h-10');
    });

    it('should apply large size classes', () => {
      render(<Button size="lg">Large</Button>);
      expect(screen.getByRole('button')).toHaveClass('h-11');
    });
  });
});
```

## 验收标准

### 1. 视觉一致性

- [ ] 与 `component-button.html` 视觉 100% 一致
- [ ] 所有变体颜色正确（primary、secondary、ghost、destructive、icon）
- [ ] 所有尺寸正确（sm: 36px、md: 40px、lg: 44px）
- [ ] hover 状态有视觉反馈（颜色变化 + 阴影）
- [ ] active 状态有按下效果
- [ ] disabled 状态半透明（opacity-50）
- [ ] focus-visible 显示焦点环（ring-2 ring-primary-500）

### 2. 功能完整性

- [ ] onClick 正常触发
- [ ] loading 状态显示旋转图标
- [ ] loading 状态禁用点击
- [ ] disabled 状态禁用点击
- [ ] leftIcon 和 rightIcon 正确显示
- [ ] 支持所有原生 button 属性（type、form、name 等）

### 3. 无障碍性

- [ ] 键盘可访问（Tab 聚焦、Enter/Space 触发）
- [ ] 焦点环清晰可见
- [ ] disabled 状态使用 `disabled` 属性（不是 aria-disabled）
- [ ] loading 状态添加 `aria-busy="true"`（可选）

### 4. 测试覆盖率

- [ ] 所有测试通过
- [ ] 测试覆盖率 ≥ 80%

### 5. TypeScript 类型

- [ ] 无类型错误
- [ ] Props 类型完整
- [ ] 支持泛型 ref

## 潜在问题

### 问题 1: 旋转动画卡顿

**症状**：loading 图标旋转不流畅

**解决方案**：
确保在 Tailwind 配置或 CSS 中定义了 `spin` 动画：

```css
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
```

### 问题 2: Icon 按钮尺寸不一致

**症状**：icon 变体的按钮不是正方形

**解决方案**：
使用 `compoundVariants` 为 icon 变体单独设置宽度：

```tsx
compoundVariants: [
  {
    variant: 'icon',
    size: 'sm',
    className: 'w-9 px-0',
  },
  // ...
]
```

## 输出产物

**新增文件**：
- `src/renderer/src/components/ui/Button.tsx`（约 80-100 行）
- `src/renderer/src/lib/utils.ts`（如果不存在，约 5 行）
- `src/renderer/src/components/ui/__tests__/Button.test.tsx`（约 120-150 行）

**更新文件**：
- `src/renderer/src/components/ui/index.ts`（导出 Button）

## 预计时间

- **实施**：2-2.5 小时
- **测试**：1-1.5 小时
- **总计**：3-4 小时

---

**创建时间**：2025-10-04
**优先级**：P0
**依赖**：Plan-01 完成（CSS 变量和 Tailwind 配置）
**后续任务**：Task 02（表单组件）
