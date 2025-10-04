# Task 02: 重构表单组件

## 任务目标

创建完整的表单组件套件，包括 Input、Select、Radio、Checkbox、Slider，所有组件完全符合 Modern Minimalist 设计系统。

## 参考文档

- `docs/design/modern/demo/component-forms.html` - 所有表单组件的完整实现
- `docs/design/modern/guide/components-specification.md` - 表单组件规范
- `docs/design/modern/guide/interaction-patterns.md` - 表单交互模式

## 实施步骤

### 步骤 1: 创建 Input 组件

```tsx
// src/renderer/src/components/ui/Input.tsx
import { forwardRef } from 'react';
import { cn } from '@renderer/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-text-primary"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              // 基础样式
              'w-full h-10 px-3 rounded-lg border bg-background-primary text-text-primary text-base',
              'transition-all duration-200',
              'placeholder:text-text-tertiary',
              // 焦点状态
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
              // 错误状态
              error
                ? 'border-error-500 focus:ring-error-500'
                : 'border-border-light hover:border-border-medium',
              // 禁用状态
              'disabled:bg-background-secondary disabled:text-text-disabled disabled:cursor-not-allowed',
              // 图标内边距
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} className="text-sm text-error-500">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={`${inputId}-helper`} className="text-sm text-text-secondary">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
```

### 步骤 2: 创建 Select 组件（基于 Radix UI）

```tsx
// src/renderer/src/components/ui/Select.tsx
import * as SelectPrimitive from '@radix-ui/react-select';
import { forwardRef } from 'react';
import { cn } from '@renderer/lib/utils';

export const Select = SelectPrimitive.Root;
export const SelectGroup = SelectPrimitive.Group;
export const SelectValue = SelectPrimitive.Value;

export const SelectTrigger = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex h-10 w-full items-center justify-between rounded-lg border border-border-light bg-background-primary px-3 py-2 text-base text-text-primary',
      'transition-all duration-200',
      'hover:border-border-medium',
      'focus:outline-none focus:ring-2 focus:ring-primary-500',
      'disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon className="ml-2">
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));

SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

export const SelectContent = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        'relative z-50 min-w-[8rem] overflow-hidden rounded-lg border border-border-light bg-background-elevated shadow-md',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        position === 'popper' &&
          'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={cn(
          'p-1',
          position === 'popper' &&
            'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));

SelectContent.displayName = SelectPrimitive.Content.displayName;

export const SelectItem = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-pointer select-none items-center rounded-md py-2 pl-8 pr-2 text-base outline-none',
      'transition-colors duration-150',
      'focus:bg-primary-50 focus:text-primary-700',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      'dark:focus:bg-primary-600/20 dark:focus:text-primary-100',
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));

SelectItem.displayName = SelectPrimitive.Item.displayName;
```

### 步骤 3: 创建 Radio 和 Checkbox 组件

```tsx
// src/renderer/src/components/ui/Radio.tsx
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { forwardRef } from 'react';
import { cn } from '@renderer/lib/utils';

export const RadioGroup = forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root className={cn('space-y-2', className)} {...props} ref={ref} />
));

RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

export const RadioGroupItem = forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      'h-5 w-5 rounded-full border-2 border-border-medium text-primary-500',
      'transition-all duration-200',
      'hover:border-primary-500',
      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'data-[state=checked]:border-primary-500 data-[state=checked]:bg-primary-500',
      className
    )}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
      <div className="h-2 w-2 rounded-full bg-white" />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
));

RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;
```

```tsx
// src/renderer/src/components/ui/Checkbox.tsx
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { forwardRef } from 'react';
import { cn } from '@renderer/lib/utils';

export const Checkbox = forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'h-5 w-5 shrink-0 rounded border-2 border-border-medium',
      'transition-all duration-200',
      'hover:border-primary-500',
      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'data-[state=checked]:bg-primary-500 data-[state=checked]:border-primary-500',
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-white">
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));

Checkbox.displayName = CheckboxPrimitive.Root.displayName;
```

### 步骤 4: 创建 Slider 组件

```tsx
// src/renderer/src/components/ui/Slider.tsx
import * as SliderPrimitive from '@radix-ui/react-slider';
import { forwardRef } from 'react';
import { cn } from '@renderer/lib/utils';

export const Slider = forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn('relative flex w-full touch-none select-none items-center', className)}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-background-tertiary">
      <SliderPrimitive.Range className="absolute h-full bg-primary-500 transition-all" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className={cn(
        'block h-5 w-5 rounded-full border-2 border-primary-500 bg-white shadow-sm',
        'transition-all duration-200',
        'hover:scale-110',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50'
      )}
    />
  </SliderPrimitive.Root>
));

Slider.displayName = SliderPrimitive.Root.displayName;
```

### 步骤 5: 创建统一的表单标签组件

```tsx
// src/renderer/src/components/ui/FormLabel.tsx
import { forwardRef } from 'react';
import { cn } from '@renderer/lib/utils';

export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const FormLabel = forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, children, required, ...props }, ref) => (
    <label
      ref={ref}
      className={cn('block text-sm font-medium text-text-primary mb-1.5', className)}
      {...props}
    >
      {children}
      {required && <span className="text-error-500 ml-1">*</span>}
    </label>
  )
);

FormLabel.displayName = 'FormLabel';
```

## 验收标准

### 1. Input 组件

- [ ] 默认、hover、focus、error、disabled 状态视觉正确
- [ ] 支持 label、helperText、error 消息
- [ ] 支持 leftIcon 和 rightIcon
- [ ] 焦点环正确显示（ring-2 ring-primary-500）
- [ ] 错误状态边框为红色（border-error-500）
- [ ] 与 HTML Demo 100% 一致

### 2. Select 组件

- [ ] 下拉菜单动画流畅（fade + zoom，200ms）
- [ ] 选中项显示勾选图标
- [ ] 键盘导航（↑↓ 选择、Enter 确认、Escape 关闭）
- [ ] hover 高亮正确
- [ ] 焦点状态正确

### 3. Radio 和 Checkbox

- [ ] 选中动画流畅（scale-in）
- [ ] 圆形 radio、方形 checkbox
- [ ] 选中状态显示指示器（radio 内圈、checkbox 勾选）
- [ ] 键盘支持（Space 切换）
- [ ] 禁用状态半透明

### 4. Slider

- [ ] 拖动流畅，无延迟
- [ ] 滑块 hover 放大（scale-110）
- [ ] 范围填充颜色正确（bg-primary-500）
- [ ] 键盘支持（←→ 调整）
- [ ] ARIA 属性完整（aria-valuemin、aria-valuemax、aria-valuenow）

### 5. 无障碍性

- [ ] 所有表单元素有关联的 label（通过 id 或嵌套）
- [ ] 错误消息通过 aria-describedby 关联
- [ ] 必填字段有视觉提示（* 号）
- [ ] disabled 状态使用原生属性

## 潜在问题

### 问题 1: Radix UI 动画不生效

**症状**：Select 下拉菜单没有动画

**解决方案**：
确保 Tailwind 配置中包含动画：

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'zoom-in': {
          '0%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
};
```

### 问题 2: Input 内边距不一致

**症状**：有图标时文本位置偏移

**解决方案**：
使用条件类名根据图标存在与否调整内边距：

```tsx
className={cn(
  'px-3',
  leftIcon && 'pl-10',
  rightIcon && 'pr-10'
)}
```

## 输出产物

**新增文件**：
- `src/renderer/src/components/ui/Input.tsx`
- `src/renderer/src/components/ui/Select.tsx`
- `src/renderer/src/components/ui/Radio.tsx`
- `src/renderer/src/components/ui/Checkbox.tsx`
- `src/renderer/src/components/ui/Slider.tsx`
- `src/renderer/src/components/ui/FormLabel.tsx`
- `src/renderer/src/components/ui/__tests__/Input.test.tsx`
- `src/renderer/src/components/ui/__tests__/Select.test.tsx`
- `src/renderer/src/components/ui/__tests__/Radio.test.tsx`
- `src/renderer/src/components/ui/__tests__/Checkbox.test.tsx`
- `src/renderer/src/components/ui/__tests__/Slider.test.tsx`

## 预计时间

- **实施**：3-3.5 小时
- **测试**：1-1.5 小时
- **总计**：4-5 小时

---

**创建时间**：2025-10-04
**优先级**：P0
**依赖**：Task 01（Button 组件）
**后续任务**：Task 03（Card 组件）
