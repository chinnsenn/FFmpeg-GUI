# Task 05: 重构 Modal 组件

## 任务目标

创建功能完整的 Modal 组件，支持焦点陷阱、键盘交互、动画、body 滚动锁定和完整的无障碍支持。

## 参考文档

- `docs/design/modern/demo/component-modal.html` - Modal 完整实现和交互
- `docs/design/modern/guide/components-specification.md` - Modal 组件规范
- `docs/design/modern/guide/interaction-patterns.md` - 模态框交互模式

## 实施步骤

### 步骤 1: 创建 Modal 基础组件（基于 Radix UI）

```tsx
// src/renderer/src/components/ui/Modal.tsx
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@renderer/lib/utils';

export const Modal = DialogPrimitive.Root;
export const ModalTrigger = DialogPrimitive.Trigger;
export const ModalPortal = DialogPrimitive.Portal;
export const ModalClose = DialogPrimitive.Close;

// 遮罩层
export const ModalOverlay = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm',
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
));

ModalOverlay.displayName = DialogPrimitive.Overlay.displayName;

// Modal 内容
const modalContentVariants = cva(
  'fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] bg-background-elevated border border-border-light rounded-lg shadow-lg',
  {
    variants: {
      size: {
        sm: 'w-full max-w-sm',
        md: 'w-full max-w-md',
        lg: 'w-full max-w-lg',
        xl: 'w-full max-w-xl',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface ModalContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof modalContentVariants> {}

export const ModalContent = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  ModalContentProps
>(({ className, children, size, ...props }, ref) => (
  <ModalPortal>
    <ModalOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        modalContentVariants({ size }),
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'data-[state=closed]:slide-out-to-top-[2%] data-[state=open]:slide-in-from-top-[2%]',
        'duration-200',
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </ModalPortal>
));

ModalContent.displayName = DialogPrimitive.Content.displayName;

// Modal Header
export const ModalHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex items-center justify-between p-6 border-b border-border-light', className)}
    {...props}
  />
);

ModalHeader.displayName = 'ModalHeader';

// Modal Title
export const ModalTitle = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-h3 font-semibold text-text-primary', className)}
    {...props}
  />
));

ModalTitle.displayName = DialogPrimitive.Title.displayName;

// Modal Description
export const ModalDescription = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-body text-text-secondary', className)}
    {...props}
  />
));

ModalDescription.displayName = DialogPrimitive.Description.displayName;

// Modal Body
export const ModalBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('p-6', className)} {...props} />
);

ModalBody.displayName = 'ModalBody';

// Modal Footer
export const ModalFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex items-center justify-end gap-3 p-6 border-t border-border-light', className)}
    {...props}
  />
);

ModalFooter.displayName = 'ModalFooter';
```

### 步骤 2: 创建 CloseButton 组件

```tsx
// 在 Modal.tsx 中添加
import { X } from 'lucide-react'; // 或使用其他图标库

export const ModalCloseButton = () => (
  <DialogPrimitive.Close
    className={cn(
      'absolute right-4 top-4 rounded-md p-1.5',
      'text-text-tertiary hover:text-text-primary hover:bg-background-secondary',
      'transition-colors duration-150',
      'focus:outline-none focus:ring-2 focus:ring-primary-500'
    )}
  >
    <X className="h-5 w-5" />
    <span className="sr-only">关闭</span>
  </DialogPrimitive.Close>
);

ModalCloseButton.displayName = 'ModalCloseButton';
```

### 步骤 3: 创建使用示例

```tsx
// 基础示例
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from '@renderer/components/ui/Modal';
import { Button } from '@renderer/components/ui/Button';

function Example() {
  return (
    <Modal>
      <ModalTrigger asChild>
        <Button>打开对话框</Button>
      </ModalTrigger>
      <ModalContent size="md">
        <ModalCloseButton />
        <ModalHeader>
          <ModalTitle>确认操作</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <ModalDescription>
            您确定要执行此操作吗？此操作无法撤销。
          </ModalDescription>
        </ModalBody>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="ghost">取消</Button>
          </ModalClose>
          <Button variant="destructive">确认删除</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// 受控示例
function ControlledExample() {
  const [open, setOpen] = useState(false);

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <Button>打开</Button>
      </ModalTrigger>
      <ModalContent>
        {/* ... */}
      </ModalContent>
    </Modal>
  );
}
```

### 步骤 4: 添加动画到 Tailwind 配置

```css
/* src/renderer/src/index.css */

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes zoom-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes zoom-out {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}

@keyframes slide-in-from-top {
  from {
    transform: translateY(-2%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes slide-out-to-top {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-2%);
  }
}

/* Radix UI data-state 动画 */
.animate-in {
  animation-fill-mode: forwards;
}

.animate-out {
  animation-fill-mode: forwards;
}

.fade-in-0 {
  animation: fade-in 200ms ease-out;
}

.fade-out-0 {
  animation: fade-out 150ms ease-in;
}

.zoom-in-95 {
  animation: zoom-in 200ms ease-out;
}

.zoom-out-95 {
  animation: zoom-out 150ms ease-in;
}

.slide-in-from-top-\[2\%\] {
  animation: slide-in-from-top 200ms ease-out;
}

.slide-out-to-top-\[2\%\] {
  animation: slide-out-to-top 150ms ease-in;
}
```

### 步骤 5: 创建测试

```tsx
// src/renderer/src/components/ui/__tests__/Modal.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Modal, ModalTrigger, ModalContent, ModalTitle, ModalBody, ModalFooter } from '../Modal';
import { Button } from '../Button';

describe('Modal', () => {
  it('should open when trigger is clicked', async () => {
    render(
      <Modal>
        <ModalTrigger asChild>
          <Button>Open</Button>
        </ModalTrigger>
        <ModalContent>
          <ModalTitle>Test Modal</ModalTitle>
          <ModalBody>Modal content</ModalBody>
        </ModalContent>
      </Modal>
    );

    fireEvent.click(screen.getByText('Open'));

    await waitFor(() => {
      expect(screen.getByText('Test Modal')).toBeInTheDocument();
      expect(screen.getByText('Modal content')).toBeInTheDocument();
    });
  });

  it('should close when Escape is pressed', async () => {
    render(
      <Modal defaultOpen>
        <ModalContent>
          <ModalTitle>Test Modal</ModalTitle>
        </ModalContent>
      </Modal>
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    });
  });

  it('should close when overlay is clicked', async () => {
    render(
      <Modal defaultOpen>
        <ModalContent>
          <ModalTitle>Test Modal</ModalTitle>
        </ModalContent>
      </Modal>
    );

    const overlay = screen.getByText('Test Modal').closest('[data-radix-portal]')?.querySelector('[data-state="open"]');
    if (overlay) {
      fireEvent.click(overlay);
    }

    await waitFor(() => {
      expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    });
  });

  it('should call onOpenChange when opening/closing', async () => {
    const handleOpenChange = vi.fn();

    render(
      <Modal onOpenChange={handleOpenChange}>
        <ModalTrigger asChild>
          <Button>Open</Button>
        </ModalTrigger>
        <ModalContent>
          <ModalTitle>Test Modal</ModalTitle>
        </ModalContent>
      </Modal>
    );

    fireEvent.click(screen.getByText('Open'));
    expect(handleOpenChange).toHaveBeenCalledWith(true);

    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => {
      expect(handleOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it('should trap focus within modal', async () => {
    render(
      <Modal defaultOpen>
        <ModalContent>
          <ModalTitle>Test Modal</ModalTitle>
          <ModalBody>
            <input type="text" placeholder="Input 1" />
            <input type="text" placeholder="Input 2" />
          </ModalBody>
          <ModalFooter>
            <Button>Cancel</Button>
            <Button>Confirm</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );

    const inputs = screen.getAllByPlaceholderText(/Input/);
    const buttons = screen.getAllByRole('button');

    // Focus should be trapped within modal
    inputs[0].focus();
    expect(document.activeElement).toBe(inputs[0]);

    // Tab should cycle within modal
    fireEvent.keyDown(inputs[0], { key: 'Tab' });
    // Note: Full Tab cycling test requires more complex setup
  });
});
```

## 验收标准

### 1. 视觉一致性

- [ ] 与 `component-modal.html` 视觉 100% 一致
- [ ] 遮罩层半透明黑色（bg-black/50）
- [ ] 遮罩层有模糊效果（backdrop-blur-sm）
- [ ] 模态框居中显示
- [ ] 模态框有白色背景和边框
- [ ] 模态框有阴影（shadow-lg）
- [ ] 尺寸变体正确（sm: 384px、md: 448px、lg: 512px、xl: 576px）

### 2. 动画效果

- [ ] 打开动画：fade-in + zoom-in + slide-in（200ms）
- [ ] 关闭动画：fade-out + zoom-out + slide-out（150ms）
- [ ] 动画流畅，无卡顿
- [ ] prefers-reduced-motion 时禁用动画

### 3. 交互功能

- [ ] 点击触发器打开模态框
- [ ] 点击遮罩关闭模态框
- [ ] 按 Escape 键关闭模态框
- [ ] 点击关闭按钮关闭模态框
- [ ] 焦点陷阱正常工作（无法 Tab 到外部）
- [ ] 打开时焦点移到模态框内
- [ ] 关闭时焦点返回触发器
- [ ] body 滚动锁定（打开时）

### 4. 无障碍性

- [ ] role="dialog" 正确设置
- [ ] aria-modal="true" 正确设置
- [ ] aria-labelledby 关联到标题
- [ ] aria-describedby 关联到描述
- [ ] 关闭按钮有 sr-only 文本
- [ ] 键盘可访问

### 5. 测试覆盖率

- [ ] 所有测试通过
- [ ] 测试覆盖率 ≥ 80%

## 潜在问题

### 问题 1: 焦点陷阱不生效

**症状**：Tab 键可以聚焦到模态框外的元素

**解决方案**：
Radix UI Dialog 自动处理焦点陷阱，确保没有自定义覆盖：

```tsx
<DialogPrimitive.Content
  // 不要设置 onPointerDownOutside={(e) => e.preventDefault()}
  // Radix UI 会自动处理
>
```

### 问题 2: body 滚动未锁定

**症状**：模态框打开时仍可滚动背景

**解决方案**：
Radix UI 默认锁定滚动，如果不生效，手动添加：

```tsx
<DialogPrimitive.Root
  onOpenChange={(open) => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }}
>
```

## 输出产物

**新增文件**：
- `src/renderer/src/components/ui/Modal.tsx`（约 150-180 行）
- `src/renderer/src/components/ui/__tests__/Modal.test.tsx`（约 120-150 行）

**更新文件**：
- `src/renderer/src/index.css`（添加动画，约 60 行）
- `src/renderer/src/components/ui/index.ts`（导出 Modal 相关组件）

## 预计时间

- **实施**：2-2.5 小时
- **测试**：1-1.5 小时
- **总计**：3-4 小时

---

**创建时间**：2025-10-04
**优先级**：P1
**依赖**：Task 01（Button 组件）
**后续任务**：Task 06（Toast 组件）
