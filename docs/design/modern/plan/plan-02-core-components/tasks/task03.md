# Task 03: 重构 Card 组件

## 任务目标

创建灵活的 Card 组件，支持多种阴影变体、边框选项和内边距配置，用于构建仪表板和内容区域。

## 参考文档

- `docs/design/modern/demo/dashboard.html` - Card 在仪表板中的应用
- `docs/design/modern/demo/component-taskcard.html` - 任务卡片示例
- `docs/design/modern/guide/components-specification.md` - Card 组件规范

## 实施步骤

### 步骤 1: 创建 Card 基础组件

```tsx
// src/renderer/src/components/ui/Card.tsx
import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@renderer/lib/utils';

const cardVariants = cva(
  'rounded-lg bg-background-elevated transition-all duration-200',
  {
    variants: {
      shadow: {
        none: '',
        sm: 'shadow-sm',
        md: 'shadow-md hover:shadow-lg',
        lg: 'shadow-lg hover:shadow-xl',
      },
      border: {
        none: '',
        light: 'border border-border-light',
        medium: 'border border-border-medium',
      },
      padding: {
        none: '',
        compact: 'p-4',
        default: 'p-6',
        spacious: 'p-8',
      },
      hover: {
        none: '',
        lift: 'hover:-translate-y-1',
      },
    },
    defaultVariants: {
      shadow: 'sm',
      border: 'light',
      padding: 'default',
      hover: 'none',
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, shadow, border, padding, hover, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ shadow, border, padding, hover }), className)}
      {...props}
    />
  )
);

Card.displayName = 'Card';
```

### 步骤 2: 创建 Card 子组件

```tsx
// 继续在 Card.tsx 中添加

export const CardHeader = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5', className)}
    {...props}
  />
));

CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-h3 font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));

CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-body text-text-secondary', className)}
    {...props}
  />
));

CardDescription.displayName = 'CardDescription';

export const CardContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('pt-0', className)} {...props} />
));

CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center pt-4', className)}
    {...props}
  />
));

CardFooter.displayName = 'CardFooter';
```

### 步骤 3: 创建使用示例

```tsx
// 示例用法
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@renderer/components/ui/Card';

function Example() {
  return (
    <Card shadow="md" hover="lift">
      <CardHeader>
        <CardTitle>卡片标题</CardTitle>
        <CardDescription>卡片描述文本</CardDescription>
      </CardHeader>
      <CardContent>
        <p>卡片内容</p>
      </CardContent>
      <CardFooter>
        <Button>操作按钮</Button>
      </CardFooter>
    </Card>
  );
}
```

### 步骤 4: 创建特殊变体（可选）

```tsx
// src/renderer/src/components/ui/StatCard.tsx
// 用于仪表板的统计卡片
import { Card } from './Card';
import { cn } from '@renderer/lib/utils';

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({ title, value, change, icon, className }: StatCardProps) {
  return (
    <Card shadow="sm" hover="lift" className={cn('relative overflow-hidden', className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-caption text-text-secondary mb-1">{title}</p>
          <p className="text-h2 font-semibold text-text-primary">{value}</p>
          {change !== undefined && (
            <p
              className={cn(
                'text-sm mt-1',
                change >= 0 ? 'text-success-500' : 'text-error-500'
              )}
            >
              {change >= 0 ? '+' : ''}
              {change}%
            </p>
          )}
        </div>
        {icon && (
          <div className="text-primary-500 opacity-20">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
```

### 步骤 5: 创建测试

```tsx
// src/renderer/src/components/ui/__tests__/Card.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../Card';

describe('Card', () => {
  it('should render children', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('should apply shadow variant classes', () => {
    const { container } = render(<Card shadow="md">Content</Card>);
    expect(container.firstChild).toHaveClass('shadow-md');
  });

  it('should apply border variant classes', () => {
    const { container } = render(<Card border="light">Content</Card>);
    expect(container.firstChild).toHaveClass('border-border-light');
  });

  it('should apply padding variant classes', () => {
    const { container } = render(<Card padding="compact">Content</Card>);
    expect(container.firstChild).toHaveClass('p-4');
  });

  it('should apply hover lift effect', () => {
    const { container } = render(<Card hover="lift">Content</Card>);
    expect(container.firstChild).toHaveClass('hover:-translate-y-1');
  });

  it('should render complete card structure', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('should forward ref', () => {
    const ref = { current: null };
    render(<Card ref={ref}>Content</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
```

## 验收标准

### 1. 视觉一致性

- [ ] 与 `dashboard.html` 中的卡片视觉 100% 一致
- [ ] 阴影变体正确（none、sm、md、lg）
- [ ] hover 时阴影加深（md → lg、lg → xl）
- [ ] hover lift 效果流畅（-translate-y-1，200ms）
- [ ] 边框颜色正确（light、medium）
- [ ] 内边距变体正确（compact: 16px、default: 24px、spacious: 32px）

### 2. 功能完整性

- [ ] 支持所有 div 原生属性
- [ ] 支持自定义 className（正确合并）
- [ ] CardHeader、CardTitle、CardDescription、CardContent、CardFooter 正常工作
- [ ] 子组件可以单独使用
- [ ] 支持嵌套（Card 内嵌套 Card）

### 3. 响应式

- [ ] 在小屏幕上内边距自动调整（可选）
- [ ] 在移动设备上 hover 效果禁用（可选）

### 4. 测试覆盖率

- [ ] 所有测试通过
- [ ] 测试覆盖率 ≥ 80%

### 5. TypeScript 类型

- [ ] 无类型错误
- [ ] Props 类型完整
- [ ] 支持泛型 ref

## 潜在问题

### 问题 1: 深色模式阴影不明显

**症状**：深色主题下阴影看不清

**解决方案**：
在 Tailwind 配置中为深色模式定义不同的阴影：

```css
/* index.css */
.dark {
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4);
}
```

或使用边框增强：

```tsx
className={cn(
  'shadow-sm',
  'dark:shadow-none dark:border dark:border-border-light'
)}
```

### 问题 2: hover lift 与动画冲突

**症状**：lift 效果与其他动画冲突

**解决方案**：
使用 CSS transform 叠加：

```css
/* 确保 transform 可以叠加 */
.hover\:-translate-y-1:hover {
  transform: translateY(-0.25rem) translateZ(0);
}
```

## 输出产物

**新增文件**：
- `src/renderer/src/components/ui/Card.tsx`（约 100-120 行）
- `src/renderer/src/components/ui/StatCard.tsx`（可选，约 40 行）
- `src/renderer/src/components/ui/__tests__/Card.test.tsx`（约 80-100 行）

**更新文件**：
- `src/renderer/src/components/ui/index.ts`（导出 Card 相关组件）

## 预计时间

- **实施**：1.5-2 小时
- **测试**：0.5-1 小时
- **总计**：2-3 小时

---

**创建时间**：2025-10-04
**优先级**：P0
**依赖**：Task 01（Button 组件）
**后续任务**：Task 04（ProgressBar 组件）
