# Task 06: 重构 Toast 组件

## 任务目标

创建功能丰富的 Toast 通知组件，支持多种类型、堆叠、自动消失、进度条、Promise 模式和手势交互。

## 参考文档

- `docs/design/modern/demo/component-toast.html` - Toast 完整实现和交互
- `docs/design/modern/guide/components-specification.md` - Toast 组件规范
- 当前项目已使用 Sonner 库 - 可基于现有实现升级样式

## 实施步骤

### 步骤 1: 升级现有 Sonner 样式

项目已使用 `sonner` 库，只需升级样式以符合设计系统：

```tsx
// src/renderer/src/components/ui/Toast.tsx
import { Toaster as SonnerToaster, toast as sonnerToast } from 'sonner';
import { cn } from '@renderer/lib/utils';

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      expand={false}
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: cn(
            'rounded-lg border border-border-light bg-background-elevated shadow-lg',
            'p-4 flex items-start gap-3',
            'data-[type=success]:border-success-500',
            'data-[type=error]:border-error-500',
            'data-[type=warning]:border-warning-500',
            'data-[type=info]:border-primary-500'
          ),
          title: 'text-base font-medium text-text-primary',
          description: 'text-sm text-text-secondary mt-1',
          actionButton: cn(
            'bg-primary-500 text-white px-3 py-1.5 rounded-md text-sm font-medium',
            'hover:bg-primary-600 transition-colors'
          ),
          cancelButton: cn(
            'bg-background-tertiary text-text-primary px-3 py-1.5 rounded-md text-sm font-medium',
            'hover:bg-border-medium transition-colors'
          ),
          closeButton: cn(
            'absolute top-2 right-2 rounded-md p-1',
            'text-text-tertiary hover:text-text-primary hover:bg-background-secondary',
            'transition-colors'
          ),
          success: 'text-success-500',
          error: 'text-error-500',
          warning: 'text-warning-500',
          info: 'text-primary-500',
        },
      }}
    />
  );
}

// 重新导出 toast 函数
export const toast = sonnerToast;
```

### 步骤 2: 创建自定义 Toast 函数

```tsx
// 继续在 Toast.tsx 中添加

import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react';

// 自定义图标
const ToastIcon = {
  success: <CheckCircle2 className="h-5 w-5 text-success-500 flex-shrink-0" />,
  error: <AlertCircle className="h-5 w-5 text-error-500 flex-shrink-0" />,
  warning: <AlertTriangle className="h-5 w-5 text-warning-500 flex-shrink-0" />,
  info: <Info className="h-5 w-5 text-primary-500 flex-shrink-0" />,
};

// 增强的 toast 函数
export const enhancedToast = {
  success: (message: string, options?: Parameters<typeof sonnerToast>[1]) => {
    return sonnerToast.success(message, {
      icon: ToastIcon.success,
      ...options,
    });
  },

  error: (message: string, options?: Parameters<typeof sonnerToast>[1]) => {
    return sonnerToast.error(message, {
      icon: ToastIcon.error,
      duration: 5000, // 错误消息显示更长时间
      ...options,
    });
  },

  warning: (message: string, options?: Parameters<typeof sonnerToast>[1]) => {
    return sonnerToast.warning(message, {
      icon: ToastIcon.warning,
      ...options,
    });
  },

  info: (message: string, options?: Parameters<typeof sonnerToast>[1]) => {
    return sonnerToast.info(message, {
      icon: ToastIcon.info,
      ...options,
    });
  },

  promise: <T,>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    }
  ) => {
    return sonnerToast.promise(promise, {
      loading,
      success,
      error,
      icon: ToastIcon.info,
    });
  },

  // 带操作按钮的 toast
  withAction: (
    message: string,
    {
      type = 'info',
      action,
    }: {
      type?: 'success' | 'error' | 'warning' | 'info';
      action: {
        label: string;
        onClick: () => void;
      };
    }
  ) => {
    const toastFn = type === 'success' ? sonnerToast.success :
                    type === 'error' ? sonnerToast.error :
                    type === 'warning' ? sonnerToast.warning :
                    sonnerToast.info;

    return toastFn(message, {
      icon: ToastIcon[type],
      action: {
        label: action.label,
        onClick: action.onClick,
      },
    });
  },
};
```

### 步骤 3: 在 App 中添加 Toaster

```tsx
// src/renderer/src/App.tsx
import { Toaster } from '@renderer/components/ui/Toast';

function App() {
  return (
    <>
      {/* 其他内容 */}
      <Toaster />
    </>
  );
}
```

### 步骤 4: 创建使用示例

```tsx
// 使用示例
import { enhancedToast } from '@renderer/components/ui/Toast';

// 基础用法
enhancedToast.success('操作成功！');
enhancedToast.error('操作失败，请重试');
enhancedToast.warning('警告：磁盘空间不足');
enhancedToast.info('新版本可用');

// 带描述
enhancedToast.success('文件上传成功', {
  description: '文件 "video.mp4" 已成功上传',
});

// 带操作按钮
enhancedToast.withAction('任务已完成', {
  type: 'success',
  action: {
    label: '查看',
    onClick: () => {
      // 跳转到任务详情
    },
  },
});

// Promise 模式
enhancedToast.promise(
  uploadFile(file),
  {
    loading: '正在上传文件...',
    success: '文件上传成功',
    error: '文件上传失败',
  }
);

// 自定义持续时间
enhancedToast.info('这条消息会显示 10 秒', {
  duration: 10000,
});

// 手动关闭
const toastId = enhancedToast.info('这条消息需要手动关闭', {
  duration: Infinity,
});

// 稍后关闭
setTimeout(() => {
  sonnerToast.dismiss(toastId);
}, 5000);
```

### 步骤 5: 添加自定义样式（如果需要）

```css
/* src/renderer/src/index.css */

/* Toast 进入动画 */
[data-sonner-toast] {
  animation: slide-in-right 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Toast 退出动画 */
[data-sonner-toast][data-removed="true"] {
  animation: slide-out-right 200ms cubic-bezier(0.4, 0, 1, 1);
}

@keyframes slide-in-right {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slide-out-right {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

/* 进度条样式 */
[data-sonner-toast] [data-progress] {
  background: currentColor;
  opacity: 0.3;
}

/* Hover 暂停效果 */
[data-sonner-toast]:hover [data-progress] {
  animation-play-state: paused;
}

/* prefers-reduced-motion 支持 */
@media (prefers-reduced-motion: reduce) {
  [data-sonner-toast] {
    animation: fade-in 200ms ease-out;
  }

  [data-sonner-toast][data-removed="true"] {
    animation: fade-out 150ms ease-in;
  }
}
```

### 步骤 6: 创建测试

```tsx
// src/renderer/src/components/ui/__tests__/Toast.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Toaster, enhancedToast } from '../Toast';

describe('Toast', () => {
  beforeEach(() => {
    render(<Toaster />);
  });

  it('should show success toast', async () => {
    enhancedToast.success('Success message');

    await waitFor(() => {
      expect(screen.getByText('Success message')).toBeInTheDocument();
    });
  });

  it('should show error toast', async () => {
    enhancedToast.error('Error message');

    await waitFor(() => {
      expect(screen.getByText('Error message')).toBeInTheDocument();
    });
  });

  it('should show warning toast', async () => {
    enhancedToast.warning('Warning message');

    await waitFor(() => {
      expect(screen.getByText('Warning message')).toBeInTheDocument();
    });
  });

  it('should show info toast', async () => {
    enhancedToast.info('Info message');

    await waitFor(() => {
      expect(screen.getByText('Info message')).toBeInTheDocument();
    });
  });

  it('should show toast with description', async () => {
    enhancedToast.success('Title', {
      description: 'Description text',
    });

    await waitFor(() => {
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description text')).toBeInTheDocument();
    });
  });

  it('should show toast with action button', async () => {
    const handleAction = vi.fn();

    enhancedToast.withAction('Message', {
      type: 'info',
      action: {
        label: 'View',
        onClick: handleAction,
      },
    });

    await waitFor(() => {
      const actionButton = screen.getByText('View');
      expect(actionButton).toBeInTheDocument();

      actionButton.click();
      expect(handleAction).toHaveBeenCalledTimes(1);
    });
  });

  it('should handle promise toast', async () => {
    const promise = Promise.resolve('Success');

    enhancedToast.promise(promise, {
      loading: 'Loading...',
      success: 'Success!',
      error: 'Error!',
    });

    // 加载状态
    await waitFor(() => {
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    // 成功状态
    await waitFor(() => {
      expect(screen.getByText('Success!')).toBeInTheDocument();
    });
  });

  it('should auto-dismiss after duration', async () => {
    enhancedToast.info('Auto dismiss', {
      duration: 1000,
    });

    await waitFor(() => {
      expect(screen.getByText('Auto dismiss')).toBeInTheDocument();
    });

    await waitFor(
      () => {
        expect(screen.queryByText('Auto dismiss')).not.toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });
});
```

## 验收标准

### 1. 视觉一致性

- [ ] 与 `component-toast.html` 视觉 100% 一致
- [ ] 4 种类型颜色正确（success、error、warning、info）
- [ ] 图标正确显示
- [ ] 边框颜色与类型匹配
- [ ] 阴影正确（shadow-lg）
- [ ] 位置正确（top-right）

### 2. 动画效果

- [ ] 进入动画：slide-in from right（300ms）
- [ ] 退出动画：slide-out to right（200ms）
- [ ] 堆叠时有偏移效果
- [ ] 动画流畅，无卡顿
- [ ] prefers-reduced-motion 时使用 fade 动画

### 3. 功能完整性

- [ ] 自动消失（默认 4s，可配置）
- [ ] hover 时暂停倒计时
- [ ] 手动关闭按钮正常工作
- [ ] 最多显示 5 个（超出时自动移除最早的）
- [ ] 支持 action 按钮
- [ ] Promise 模式正常工作
- [ ] 支持自定义 duration（包括 Infinity）

### 4. 无障碍性

- [ ] role="status" 或 role="alert" 正确设置
- [ ] aria-live="polite" 或 "assertive" 正确设置
- [ ] 关闭按钮有 aria-label
- [ ] 键盘可关闭（Escape）

### 5. 测试覆盖率

- [ ] 所有测试通过
- [ ] 测试覆盖率 ≥ 80%

## 潜在问题

### 问题 1: Toast 在 Electron 中位置不正确

**症状**：Toast 没有显示在正确位置

**解决方案**：
确保 Toaster 在 React 根组件中渲染，而不是在某个嵌套组件中：

```tsx
// ✅ 正确
function App() {
  return (
    <>
      <Router />
      <Toaster />
    </>
  );
}

// ❌ 错误
function SomePage() {
  return (
    <>
      <PageContent />
      <Toaster />  {/* 不要在页面中渲染 */}
    </>
  );
}
```

### 问题 2: Toast 样式与深色模式冲突

**症状**：深色模式下 Toast 颜色不正确

**解决方案**：
使用 CSS 变量确保主题一致：

```tsx
toast: cn(
  'bg-background-elevated',  // 使用 CSS 变量
  // 不要用 'bg-white'
)
```

## 输出产物

**更新文件**：
- `src/renderer/src/components/ui/Toast.tsx`（升级现有实现，约 150 行）
- `src/renderer/src/App.tsx`（添加 Toaster）

**新增文件**：
- `src/renderer/src/components/ui/__tests__/Toast.test.tsx`（约 120-150 行）

**更新文件**：
- `src/renderer/src/index.css`（添加动画，约 40 行）

## 预计时间

- **实施**：2-2.5 小时（基于现有 Sonner 实现，主要是样式升级）
- **测试**：1-1.5 小时
- **总计**：3-4 小时

---

**创建时间**：2025-10-04
**优先级**：P1
**依赖**：无（项目已使用 Sonner）
**后续任务**：Plan-03（业务组件）
