import { Task, TaskStatus } from '@shared/types';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Card } from '../ui/card';
import { Play, Pause, X, RotateCcw, CheckCircle2, XCircle, Clock, Loader2 } from 'lucide-react';
import { memo, useMemo } from 'react';
import { formatTime, calculateDuration, formatSpeed, formatFileSize, formatBitrate } from '@renderer/lib/formatters';
import { cn } from '@renderer/lib/utils';

interface TaskCardProps {
  task: Task;
  onPause?: (taskId: string) => void;
  onResume?: (taskId: string) => void;
  onCancel?: (taskId: string) => void;
  onRetry?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
}

export const TaskCard = memo(function TaskCard({
  task,
  onPause,
  onResume,
  onCancel,
  onRetry,
  onDelete
}: TaskCardProps) {
  // 状态图标和样式配置
  const getStatusConfig = (status: TaskStatus) => {
    switch (status) {
      case 'pending':
        return {
          icon: <Clock className="w-5 h-5" />,
          label: '等待中',
          iconColor: 'text-text-tertiary',
          labelColor: 'text-text-secondary',
          cardClass: 'bg-background-secondary border-border-light',
          animation: '',
        };
      case 'running':
        return {
          icon: <Loader2 className="w-5 h-5 animate-spin" />,
          label: '运行中',
          iconColor: 'text-primary-600',
          labelColor: 'text-primary-600',
          cardClass: 'bg-surface-raised border-primary-500 border-2 shadow-md animate-border-pulse',
          animation: 'animate-border-pulse',
        };
      case 'paused':
        return {
          icon: <Pause className="w-5 h-5" />,
          label: '已暂停',
          iconColor: 'text-warning-600',
          labelColor: 'text-warning-600',
          cardClass: 'bg-warning-50 dark:bg-warning-600/10 border-warning-500',
          animation: '',
        };
      case 'completed':
        return {
          icon: <CheckCircle2 className="w-5 h-5 animate-scale-in" />,
          label: '已完成',
          iconColor: 'text-success-600',
          labelColor: 'text-success-600',
          cardClass: 'bg-success-50 dark:bg-success-600/10 border-success-500',
          animation: 'animate-scale-in',
        };
      case 'failed':
        return {
          icon: <XCircle className="w-5 h-5 animate-shake" />,
          label: '失败',
          iconColor: 'text-error-600',
          labelColor: 'text-error-600',
          cardClass: 'bg-error-50 dark:bg-error-600/10 border-error-500',
          animation: 'animate-shake',
        };
      case 'cancelled':
        return {
          icon: <X className="w-5 h-5 animate-fade-out" />,
          label: '已取消',
          iconColor: 'text-text-tertiary',
          labelColor: 'text-text-secondary',
          cardClass: 'bg-background-secondary border-border-light opacity-60',
          animation: 'animate-fade-out',
        };
      default:
        return {
          icon: <Clock className="w-5 h-5" />,
          label: '未知',
          iconColor: 'text-text-tertiary',
          labelColor: 'text-text-secondary',
          cardClass: 'bg-background-secondary border-border-light',
          animation: '',
        };
    }
  };

  const statusConfig = useMemo(() => getStatusConfig(task.status), [task.status]);

  // 提取输入/输出文件名
  const inputFile = useMemo(() => {
    const inputIndex = task.command.findIndex(arg => arg === '-i');
    if (inputIndex !== -1 && inputIndex + 1 < task.command.length) {
      const path = task.command[inputIndex + 1];
      return path.split('/').pop() || path;
    }
    return '未知文件';
  }, [task.command]);

  const outputFile = useMemo(() => {
    const lastArg = task.command[task.command.length - 1];
    if (lastArg && !lastArg.startsWith('-')) {
      return lastArg.split('/').pop() || lastArg;
    }
    return '未知';
  }, [task.command]);

  // 计算剩余时间
  const getETA = (): string => {
    if (!task.progressInfo || !task.startedAt) return '-';

    const { speed, percent } = task.progressInfo;
    if (speed <= 0 || percent <= 0 || percent >= 100) return '-';

    const elapsed = (new Date().getTime() - new Date(task.startedAt).getTime()) / 1000;
    const estimatedTotal = elapsed / (percent / 100);
    const remaining = estimatedTotal - elapsed;

    if (remaining < 60) return `${Math.floor(remaining)}秒`;
    if (remaining < 3600) {
      const minutes = Math.floor(remaining / 60);
      const seconds = Math.floor(remaining % 60);
      return `${minutes}分${seconds}秒`;
    }
    const hours = Math.floor(remaining / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    return `${hours}小时${minutes}分`;
  };

  return (
    <Card
      padding="none"
      className={cn(
        'min-h-[120px] transition-all duration-300',
        statusConfig.cardClass
      )}
    >
      <div className="p-6">
        {/* Header: Status + Actions */}
        <div className="flex items-start justify-between mb-4">
          {/* Left: Status Info */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className={cn('flex-shrink-0 mt-0.5', statusConfig.iconColor)}>
              {statusConfig.icon}
            </div>
            <div className="flex-1 min-w-0">
              {/* Status Label + Progress */}
              <div className="flex items-center gap-2 mb-2">
                <span className={cn('text-sm font-medium', statusConfig.labelColor)}>
                  {statusConfig.label}
                </span>
                {task.status === 'running' && task.progress !== undefined && (
                  <span className={cn('text-base font-semibold', statusConfig.labelColor)}>
                    {task.progress.toFixed(0)}%
                  </span>
                )}
              </div>

              {/* File Info */}
              <div className="space-y-1 text-sm">
                <div className="text-text-secondary">
                  <span className="text-xs">输入:</span>{' '}
                  <span className="font-medium text-text-primary truncate" title={inputFile}>
                    {inputFile}
                  </span>
                </div>
                <div className="text-text-secondary">
                  <span className="text-xs">输出:</span>{' '}
                  <span className="truncate" title={outputFile}>
                    {outputFile}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex gap-2 ml-4 flex-shrink-0">
            {task.status === 'running' && onPause && (
              <Button
                size="sm"
                variant="icon"
                onClick={() => onPause(task.id)}
                title="暂停"
              >
                <Pause className="w-4 h-4" />
              </Button>
            )}

            {task.status === 'paused' && onResume && (
              <Button
                size="sm"
                variant="icon"
                onClick={() => onResume(task.id)}
                title="继续"
              >
                <Play className="w-4 h-4" />
              </Button>
            )}

            {(task.status === 'pending' || task.status === 'running' || task.status === 'paused') && onCancel && (
              <Button
                size="sm"
                variant="icon"
                onClick={() => onCancel(task.id)}
                title="取消"
              >
                <X className="w-4 h-4" />
              </Button>
            )}

            {(task.status === 'failed' || task.status === 'cancelled') && onRetry && (
              <Button
                size="sm"
                variant="icon"
                onClick={() => onRetry(task.id)}
                title="重试"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Progress Bar + Details (Running state only) */}
        {task.status === 'running' && task.progress !== undefined && (
          <div className="space-y-3">
            <Progress value={task.progress} animated size="md" />

            {/* Progress Details */}
            {task.progressInfo && (
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-text-secondary">
                <div>速度: <span className="font-medium text-text-primary">{formatSpeed(task.progressInfo.speed)}</span></div>
                <div>剩余: <span className="font-medium text-text-primary">{getETA()}</span></div>
                {task.progressInfo.fps > 0 && (
                  <div>FPS: <span className="font-medium text-text-primary">{task.progressInfo.fps.toFixed(1)}</span></div>
                )}
                {task.progressInfo.totalSize > 0 && (
                  <div>大小: <span className="font-medium text-text-primary">{formatFileSize(task.progressInfo.totalSize * 1024)}</span></div>
                )}
                {task.progressInfo.bitrate && task.progressInfo.bitrate !== '0' && (
                  <div className="col-span-2">比特率: <span className="font-medium text-text-primary">{formatBitrate(task.progressInfo.bitrate)}</span></div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {task.error && (
          <div className="mt-3 p-3 bg-error-50 dark:bg-error-600/10 border border-error-200 dark:border-error-600/30 rounded-md">
            <p className="text-sm text-error-600 dark:text-error-400">
              <span className="font-medium">错误: </span>
              {task.error}
            </p>
          </div>
        )}

        {/* Time Info Footer */}
        <div className="mt-3 pt-3 border-t border-border-light flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-tertiary">
          <span>创建: {formatTime(task.createdAt)}</span>
          {task.startedAt && <span>开始: {formatTime(task.startedAt)}</span>}
          {task.completedAt && <span>完成: {formatTime(task.completedAt)}</span>}
          {task.startedAt && <span>耗时: {calculateDuration(task.startedAt, task.completedAt)}</span>}
        </div>
      </div>
    </Card>
  );
});
