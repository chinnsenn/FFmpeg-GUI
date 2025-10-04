# Plan-02: Core Components（核心组件）

## 阶段概述

重构所有基础 UI 组件，使其完全遵循 Modern Minimalist 设计系统。这些组件是构建业务页面的基础，必须保证高质量和一致性。

## 目标

1. 重构 Button 组件（5 变体 × 3 尺寸 × 所有状态）
2. 重构表单组件（Input/Select/Radio/Checkbox/Slider）
3. 重构 Card 组件（多种阴影和边框变体）
4. 重构 ProgressBar 组件（shimmer + indeterminate 动画）
5. 重构 Modal 组件（动画 + 焦点陷阱 + 无障碍）
6. 重构 Toast 组件（堆叠 + 自动消失 + 手势交互）

## 参考文档

- `docs/design/modern/demo/component-button.html` - Button 组件完整实现
- `docs/design/modern/demo/component-forms.html` - 所有表单组件
- `docs/design/modern/demo/component-progressbar.html` - 进度条动画
- `docs/design/modern/demo/component-modal.html` - 模态框交互
- `docs/design/modern/demo/component-toast.html` - 通知组件
- `docs/design/modern/guide/components-specification.md` - 组件规范
- `docs/design/modern/guide/interaction-patterns.md` - 交互模式

## 任务清单

| 任务 | 描述 | 预计时间 | 优先级 |
|------|------|----------|--------|
| Task 01 | 重构 Button 组件（5 变体 × 3 尺寸） | 3-4 小时 | P0 |
| Task 02 | 重构表单组件（Input/Select/Radio/Checkbox/Slider） | 4-5 小时 | P0 |
| Task 03 | 重构 Card 组件 | 2-3 小时 | P0 |
| Task 04 | 重构 ProgressBar 组件（shimmer + indeterminate） | 2-3 小时 | P1 |
| Task 05 | 重构 Modal 组件（动画 + 焦点陷阱） | 3-4 小时 | P1 |
| Task 06 | 重构 Toast 组件（堆叠 + 自动消失） | 3-4 小时 | P1 |

**总计预估时间**：17-23 小时（2-3 个工作日）

## 验收标准

### 1. Button 组件

- [ ] 5 种变体（Primary、Secondary、Ghost、Destructive、Icon）完整实现
- [ ] 3 种尺寸（sm、md、lg）正确应用
- [ ] 所有状态（default、hover、active、disabled、focus）视觉正确
- [ ] 支持 loading 状态（旋转图标）
- [ ] 支持左/右图标
- [ ] 使用 CVA (class-variance-authority) 管理变体
- [ ] 键盘导航（Enter/Space 触发）
- [ ] 与 HTML Demo 100% 一致

### 2. 表单组件

#### Input
- [ ] 默认、hover、focus、error、disabled 状态完整
- [ ] 支持前缀/后缀图标
- [ ] 支持标签和辅助文本
- [ ] 支持错误消息显示
- [ ] 正确的焦点环（ring-2 ring-primary-500）

#### Select
- [ ] 自定义下拉样式（与原生 select 不同）
- [ ] 键盘导航支持（↑↓ 选择、Enter 确认、Escape 关闭）
- [ ] 选中项高亮
- [ ] 动画过渡（fade + slide）

#### Radio & Checkbox
- [ ] 自定义样式（圆形 radio、方形 checkbox）
- [ ] 选中动画（scale-in）
- [ ] 组件支持（RadioGroup、CheckboxGroup）
- [ ] 键盘导航（↑↓ 选择、Space 切换）

#### Slider
- [ ] 轨道、填充、滑块样式
- [ ] 拖动交互流畅
- [ ] 显示当前值
- [ ] 键盘支持（←→ 调整）
- [ ] 无障碍属性（aria-valuemin、aria-valuemax、aria-valuenow）

### 3. Card 组件

- [ ] 3 种阴影变体（none、sm、md）
- [ ] hover 抬起效果（阴影加深）
- [ ] 可选边框
- [ ] 内边距变体（compact、default、spacious）
- [ ] 支持 header、body、footer 插槽

### 4. ProgressBar 组件

- [ ] 确定进度条（0-100%）
- [ ] shimmer 动画（2s 循环）
- [ ] 不确定进度条（indeterminate 动画，1.5s）
- [ ] 颜色变体（primary、success、warning、error）
- [ ] 高度变体（xs、sm、md、lg）
- [ ] 显示百分比文本（可选）
- [ ] prefers-reduced-motion 支持

### 5. Modal 组件

- [ ] 遮罩层（backdrop，半透明黑色）
- [ ] 模态框动画（scale + fade，200ms 进入、150ms 退出）
- [ ] 焦点陷阱（无法 Tab 到外部元素）
- [ ] Escape 键关闭
- [ ] 点击遮罩关闭（可配置）
- [ ] body 滚动锁定（打开时）
- [ ] 3 种尺寸（sm、md、lg）
- [ ] 支持 header、body、footer
- [ ] 无障碍属性（role="dialog"、aria-modal="true"）

### 6. Toast 组件

- [ ] 4 种类型（success、error、warning、info）
- [ ] slide-in from right 动画（300ms）
- [ ] 自动消失（默认 4s，hover 暂停）
- [ ] 手动关闭按钮
- [ ] 多个 toast 堆叠（最多 5 个）
- [ ] 进度条（倒计时）
- [ ] 支持 action 按钮
- [ ] 支持 Promise 模式（toast.promise）
- [ ] 无障碍属性（role="status"、aria-live="polite"）

## 测试步骤

### 1. 视觉回归测试

创建 Storybook 或测试页面，展示所有组件的所有变体：

```tsx
// src/renderer/src/pages/__tests__/ComponentShowcase.tsx
export function ComponentShowcase() {
  return (
    <div className="p-8 space-y-8">
      <section>
        <h2 className="text-h2 mb-4">Buttons</h2>
        <div className="flex gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="icon"><Icon name="settings" /></Button>
        </div>
      </section>

      {/* ... 其他组件 ... */}
    </div>
  );
}
```

### 2. 交互测试

使用 Vitest + Testing Library：

```tsx
describe('Button', () => {
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
});
```

### 3. 无障碍测试

使用 axe-core：

```tsx
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Button accessibility', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(<Button>Accessible Button</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### 4. 深色主题测试

所有组件在深色模式下应保持正确的对比度和视觉效果：

```tsx
describe('Button dark mode', () => {
  beforeEach(() => {
    document.documentElement.classList.add('dark');
  });

  afterEach(() => {
    document.documentElement.classList.remove('dark');
  });

  it('should render correctly in dark mode', () => {
    render(<Button variant="primary">Dark Mode Button</Button>);
    // 检查颜色、对比度等
  });
});
```

## 输出产物

### 1. 组件文件

```
src/renderer/src/components/ui/
├── Button.tsx                 # Button 组件
├── Input.tsx                  # Input 组件
├── Select.tsx                 # Select 组件
├── Radio.tsx                  # Radio 组件
├── Checkbox.tsx               # Checkbox 组件
├── Slider.tsx                 # Slider 组件
├── Card.tsx                   # Card 组件
├── ProgressBar.tsx            # ProgressBar 组件
├── Modal.tsx                  # Modal 组件
└── Toast.tsx                  # Toast 组件及 Provider
```

### 2. 测试文件

```
src/renderer/src/components/ui/__tests__/
├── Button.test.tsx
├── Input.test.tsx
├── Select.test.tsx
├── Radio.test.tsx
├── Checkbox.test.tsx
├── Slider.test.tsx
├── Card.test.tsx
├── ProgressBar.test.tsx
├── Modal.test.tsx
└── Toast.test.tsx
```

### 3. 类型定义

```typescript
// src/renderer/src/components/ui/types.ts
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// ... 其他组件的类型定义
```

### 4. Storybook Stories（可选）

```tsx
// src/renderer/src/components/ui/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

// ... 其他 stories
```

## 依赖安装

```bash
# 核心依赖（已存在）
npm install react react-dom

# 变体管理
npm install class-variance-authority clsx tailwind-merge

# 无障碍工具
npm install @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-slider
npm install @radix-ui/react-radio-group @radix-ui/react-checkbox

# Toast 库（或自实现）
npm install sonner  # 已在项目中使用

# 测试工具（已存在）
npm install -D @testing-library/react @testing-library/user-event jest-axe

# Storybook（可选）
npm install -D @storybook/react @storybook/addon-essentials
```

## 注意事项

### 1. 使用 CVA 管理变体

推荐使用 `class-variance-authority` 管理组件变体：

```tsx
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  // 基础类
  'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700',
        secondary: 'bg-background-tertiary text-text-primary hover:bg-border-medium',
        ghost: 'text-text-primary hover:bg-background-secondary',
        destructive: 'bg-error-500 text-white hover:bg-error-600',
        icon: 'text-text-secondary hover:text-text-primary hover:bg-background-secondary',
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
}

export function Button({ variant, size, className, loading, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={loading || props.disabled}
      {...props}
    />
  );
}
```

### 2. 无障碍最佳实践

- **键盘导航**：所有交互组件必须支持键盘操作
- **ARIA 属性**：正确使用 `role`、`aria-label`、`aria-describedby` 等
- **焦点管理**：Modal 打开时焦点移入，关闭时返回触发元素
- **屏幕阅读器**：使用 `sr-only` 类提供额外信息

```tsx
// 示例：无障碍的 Modal
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title" className="sr-only">Modal Title</h2>
  <p id="modal-description">Modal content...</p>
</div>
```

### 3. 动画性能优化

- **GPU 加速**：只使用 `transform` 和 `opacity`
- **减少重排**：避免改变 `width`、`height`、`left`、`top`
- **will-change**：谨慎使用，仅在动画开始前设置

```css
/* ✅ GPU 加速 */
.modal-enter {
  opacity: 0;
  transform: scale(0.95);
  will-change: opacity, transform;
}

.modal-enter-active {
  opacity: 1;
  transform: scale(1);
  transition: opacity 200ms, transform 200ms;
}

/* ❌ 触发重排 */
.modal-enter {
  width: 0;
  height: 0;
}
```

### 4. 深色主题支持

所有组件必须在深色模式下正确显示：

```tsx
// 使用 CSS 变量确保主题一致性
className="bg-background-primary text-text-primary border-border-light"

// 避免硬编码颜色
// ❌ className="bg-white text-black"
// ✅ className="bg-background-primary text-text-primary"
```

## 下一步

完成 Plan-02 后，进入 **Plan-03: Business Components**（业务组件），开始重构应用特定的复杂组件。

---

**创建时间**：2025-10-04
**预计完成时间**：2025-10-07
**依赖**：Plan-01 完成（设计系统基础）
**负责人**：fullstack-engineer
