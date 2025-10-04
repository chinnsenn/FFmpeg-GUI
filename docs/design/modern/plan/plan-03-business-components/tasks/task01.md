# Task 01: 重构 TaskCard 组件

## 任务目标

创建功能完整的任务卡片组件,支持 6 种任务状态(pending、running、paused、completed、failed、cancelled),每种状态有独特的视觉标识和动画效果。

## 参考文档

- `docs/design/modern/demo/component-taskcard.html` - TaskCard 所有状态的完整实现
- `docs/design/modern/demo/queue.html` - TaskCard 在队列页面中的应用
- `docs/design/modern/guide/components-specification.md` - TaskCard 规范

## 实施步骤

### 步骤 1: 创建 TaskCard 基础结构

```tsx
// src/renderer/src/components/business/TaskCard.tsx
import { Card } from '@renderer/components/ui/Card';
import { Button } from '@renderer/components/ui/Button';
import { ProgressBar } from '@renderer/components/ui/ProgressBar';
import { Task } from '@shared/types';
import { cn } from '@renderer/lib/utils';
import { formatDuration, formatBitrate, formatBytes } from '@renderer/lib/formatters';

export interface TaskCardProps {
  task: Task;
  onPause?: (taskId: string) => void;
  onResume?: (taskId: string) => void;
  onCancel?: (taskId: string) => void;
  onRetry?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
}

export function TaskCard({ task, onPause, onResume, onCancel, onRetry, onDelete }: TaskCardProps) {
  const statusConfig = getStatusConfig(task.status);

  return (
    <Card
      className={cn(
        'transition-all duration-200',
        statusConfig.borderClass,
        statusConfig.animationClass
      )}
      shadow="sm"
    >
      {/* Card 内容 */}
    </Card>
  );
}
```

### 步骤 2: 定义状态配置

```tsx
// 在 TaskCard.tsx 中继续

interface StatusConfig {
  borderClass: string;
  iconClass: string;
  bgClass: string;
  textClass: string;
  animationClass?: string;
}

function getStatusConfig(status: Task['status']): StatusConfig {
  const configs: Record<Task['status'], StatusConfig> = {
    pending: {
      borderClass: 'border-border-light',
      iconClass: 'text-text-tertiary',
      bgClass: 'bg-background-secondary',
      textClass: 'text-text-secondary',
    },
    running: {
      borderClass: 'border-primary-500',
      iconClass: 'text-primary-500',
      bgClass: 'bg-primary-50 dark:bg-primary-600/10',
      textClass: 'text-primary-600',
      animationClass: 'animate-pulse-border',
    },
    paused: {
      borderClass: 'border-warning-500',
      iconClass: 'text-warning-500',
      bgClass: 'bg-warning-50 dark:bg-warning-600/10',
      textClass: 'text-warning-600',
      animationClass: 'animate-pulse-border',
    },
    completed: {
      borderClass: 'border-success-500',
      iconClass: 'text-success-500',
      bgClass: 'bg-success-50 dark:bg-success-600/10',
      textClass: 'text-success-600',
      animationClass: 'animate-scale-in',
    },
    failed: {
      borderClass: 'border-error-500',
      iconClass: 'text-error-500',
      bgClass: 'bg-error-50 dark:bg-error-600/10',
      textClass: 'text-error-600',
      animationClass: 'animate-shake',
    },
    cancelled: {
      borderClass: 'border-border-medium',
      iconClass: 'text-text-disabled',
      bgClass: 'bg-background-tertiary',
      textClass: 'text-text-disabled',
    },
  };

  return configs[status];
}
```

### 步骤 3: 实现卡片内容

```tsx
// 在 TaskCard.tsx 中继续

export function TaskCard({ task, onPause, onResume, onCancel, onRetry, onDelete }: TaskCardProps) {
  const statusConfig = getStatusConfig(task.status);
  const statusIcon = getStatusIcon(task.status);

  return (
    <Card
      className={cn(
        'transition-all duration-200',
        statusConfig.borderClass,
        statusConfig.animationClass
      )}
      shadow="sm"
      border="light"
      padding="default"
    >
      {/* 头部：文件信息 + 状态图标 */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-medium text-text-primary truncate" title={task.inputPath}>
            {getFileName(task.inputPath)}
          </h3>
          <p className="text-sm text-text-secondary">
            {task.type === 'convert' ? '格式转换' : '视频压缩'} → {task.outputFormat}
          </p>
        </div>
        <div className={cn('flex-shrink-0', statusConfig.iconClass)}>
          {statusIcon}
        </div>
      </div>

      {/* 进度条（仅在 running/paused 时显示） */}
      {(task.status === 'running' || task.status === 'paused') && (
        <div className="mb-3">
          <ProgressBar
            value={task.progress}
            shimmer={task.status === 'running'}
            showPercentage
            size="md"
            color="primary"
          />
        </div>
      )}

      {/* 实时信息（仅在 running 时显示） */}
      {task.status === 'running' && task.progressInfo && (
        <div className="grid grid-cols-4 gap-2 mb-3 text-sm">
          <div>
            <span className="text-text-tertiary">速度:</span>{' '}
            <span className="text-text-primary font-mono">{task.progressInfo.speed}x</span>
          </div>
          <div>
            <span className="text-text-tertiary">FPS:</span>{' '}
            <span className="text-text-primary font-mono">{task.progressInfo.fps}</span>
          </div>
          <div>
            <span className="text-text-tertiary">比特率:</span>{' '}
            <span className="text-text-primary font-mono">
              {formatBitrate(task.progressInfo.bitrate)}
            </span>
          </div>
          <div>
            <span className="text-text-tertiary">ETA:</span>{' '}
            <span className="text-text-primary font-mono">
              {formatDuration(task.progressInfo.eta)}
            </span>
          </div>
        </div>
      )}

      {/* 错误信息（仅在 failed 时显示） */}
      {task.status === 'failed' && task.error && (
        <div className="mb-3 p-2 rounded bg-error-50 dark:bg-error-600/10 border border-error-500">
          <p className="text-sm text-error-600">{task.error}</p>
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex items-center justify-end gap-2">
        {renderActionButtons(task, { onPause, onResume, onCancel, onRetry, onDelete })}
      </div>
    </Card>
  );
}

// 获取状态图标
function getStatusIcon(status: Task['status']) {
  const icons = {
    pending: <Clock className="h-5 w-5" />,
    running: <Loader2 className="h-5 w-5 animate-spin" />,
    paused: <Pause className="h-5 w-5" />,
    completed: <CheckCircle2 className="h-5 w-5" />,
    failed: <XCircle className="h-5 w-5" />,
    cancelled: <XCircle className="h-5 w-5" />,
  };
  return icons[status];
}

// 渲染操作按钮
function renderActionButtons(
  task: Task,
  handlers: Pick<TaskCardProps, 'onPause' | 'onResume' | 'onCancel' | 'onRetry' | 'onDelete'>
) {
  const { onPause, onResume, onCancel, onRetry, onDelete } = handlers;

  if (task.status === 'running') {
    return (
      <>
        {onPause && (
          <Button size="sm" variant="secondary" onClick={() => onPause(task.id)}>
            暂停
          </Button>
        )}
        {onCancel && (
          <Button size="sm" variant="ghost" onClick={() => onCancel(task.id)}>
            取消
          </Button>
        )}
      </>
    );
  }

  if (task.status === 'paused') {
    return (
      <>
        {onResume && (
          <Button size="sm" variant="primary" onClick={() => onResume(task.id)}>
            继续
          </Button>
        )}
        {onCancel && (
          <Button size="sm" variant="ghost" onClick={() => onCancel(task.id)}>
            取消
          </Button>
        )}
      </>
    );
  }

  if (task.status === 'failed') {
    return (
      <>
        {onRetry && (
          <Button size="sm" variant="primary" onClick={() => onRetry(task.id)}>
            重试
          </Button>
        )}
        {onDelete && (
          <Button size="sm" variant="ghost" onClick={() => onDelete(task.id)}>
            删除
          </Button>
        )}
      </>
    );
  }

  if (task.status === 'completed' || task.status === 'cancelled') {
    return (
      <>
        {onDelete && (
          <Button size="sm" variant="ghost" onClick={() => onDelete(task.id)}>
            删除
          </Button>
        )}
      </>
    );
  }

  return null;
}

// 辅助函数
function getFileName(path: string): string {
  return path.split('/').pop() || path;
}
```

### 步骤 4: 添加动画 CSS

```css
/* src/renderer/src/index.css */

/* Pulse 边框动画 */
@keyframes pulse-border {
  0%, 100% {
    border-color: hsl(var(--primary-500));
    opacity: 1;
  }
  50% {
    border-color: hsl(var(--primary-500));
    opacity: 0.5;
  }
}

.animate-pulse-border {
  animation: pulse-border 2s ease-in-out infinite;
}

/* Scale-in 动画（完成状态） */
@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-scale-in {
  animation: scale-in 200ms ease-out;
}

/* Shake 动画（失败状态） */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.animate-shake {
  animation: shake 400ms ease-in-out;
}

/* prefers-reduced-motion 支持 */
@media (prefers-reduced-motion: reduce) {
  .animate-pulse-border,
  .animate-scale-in,
  .animate-shake {
    animation: none;
  }
}
```

### 步骤 5: 创建测试

```tsx
// src/renderer/src/components/business/__tests__/TaskCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TaskCard } from '../TaskCard';
import { Task } from '@shared/types';

const mockTask: Task = {
  id: '1',
  type: 'convert',
  inputPath: '/path/to/video.mp4',
  outputPath: '/path/to/output.webm',
  outputFormat: 'webm',
  status: 'pending',
  progress: 0,
  createdAt: Date.now(),
};

describe('TaskCard', () => {
  it('should render task information', () => {
    render(<TaskCard task={mockTask} />);

    expect(screen.getByText('video.mp4')).toBeInTheDocument();
    expect(screen.getByText(/格式转换.*webm/)).toBeInTheDocument();
  });

  it('should show progress bar when running', () => {
    const runningTask = { ...mockTask, status: 'running' as const, progress: 50 };
    render(<TaskCard task={runningTask} />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('should show pause and cancel buttons when running', () => {
    const runningTask = { ...mockTask, status: 'running' as const };
    const handlePause = vi.fn();
    const handleCancel = vi.fn();

    render(<TaskCard task={runningTask} onPause={handlePause} onCancel={handleCancel} />);

    expect(screen.getByText('暂停')).toBeInTheDocument();
    expect(screen.getByText('取消')).toBeInTheDocument();
  });

  it('should call onPause when pause button is clicked', () => {
    const runningTask = { ...mockTask, status: 'running' as const };
    const handlePause = vi.fn();

    render(<TaskCard task={runningTask} onPause={handlePause} />);

    fireEvent.click(screen.getByText('暂停'));
    expect(handlePause).toHaveBeenCalledWith('1');
  });

  it('should show retry button when failed', () => {
    const failedTask = { ...mockTask, status: 'failed' as const, error: 'Encoding failed' };
    const handleRetry = vi.fn();

    render(<TaskCard task={failedTask} onRetry={handleRetry} />);

    expect(screen.getByText('重试')).toBeInTheDocument();
    expect(screen.getByText('Encoding failed')).toBeInTheDocument();
  });

  it('should show completed status with green icon', () => {
    const completedTask = { ...mockTask, status: 'completed' as const, progress: 100 };
    const { container } = render(<TaskCard task={completedTask} />);

    expect(container.querySelector('.border-success-500')).toBeInTheDocument();
  });

  it('should apply shimmer animation when running', () => {
    const runningTask = { ...mockTask, status: 'running' as const, progress: 50 };
    const { container } = render(<TaskCard task={runningTask} />);

    const progressBar = container.querySelector('.animate-shimmer');
    expect(progressBar).toBeInTheDocument();
  });
});
```

## 验收标准

### 1. 视觉一致性
- [ ] 6 种状态视觉与 HTML Demo 100% 一致
- [ ] 边框颜色正确
- [ ] 图标颜色和类型正确
- [ ] 背景色正确

### 2. 动画效果
- [ ] running: pulse 边框动画流畅
- [ ] completed: scale-in 动画流畅
- [ ] failed: shake 动画流畅
- [ ] shimmer 进度条在 running 时显示

### 3. 功能完整性
- [ ] 所有操作按钮正确显示和工作
- [ ] 进度信息实时更新
- [ ] 错误信息正确显示
- [ ] 文件名过长时截断并显示 tooltip

### 4. 测试覆盖率
- [ ] 所有测试通过
- [ ] 测试覆盖率 ≥ 80%

## 潜在问题

### 问题 1: 动画在状态切换时重复触发

**解决方案**: 使用 key 强制重新挂载组件

```tsx
<TaskCard key={task.id + task.status} task={task} />
```

### 问题 2: 实时信息更新导致频繁重渲染

**解决方案**: 使用 React.memo 并自定义比较函数

```tsx
export const TaskCard = React.memo(TaskCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.task.id === nextProps.task.id &&
    prevProps.task.status === nextProps.task.status &&
    prevProps.task.progress === nextProps.task.progress
  );
});
```

## 输出产物

**新增文件**:
- `src/renderer/src/components/business/TaskCard.tsx`（约 200-250 行）
- `src/renderer/src/components/business/__tests__/TaskCard.test.tsx`（约 150-200 行）

**更新文件**:
- `src/renderer/src/index.css`（添加动画，约 50 行）

## 预计时间

- **实施**: 2-2.5 小时
- **测试**: 1-1.5 小时
- **总计**: 3-4 小时

---

**创建时间**: 2025-10-04
**优先级**: P0
**依赖**: Plan-02 完成（Card、Button、ProgressBar 组件）
**后续任务**: Task 02（FileUploader 组件）
