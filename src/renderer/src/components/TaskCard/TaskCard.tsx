import { Task, TaskStatus } from '@shared/types';
import { Button } from '../ui/button';
import { Play, Pause, X, RotateCcw, CheckCircle2, XCircle, Clock, Loader2 } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onPause?: (taskId: string) => void;
  onResume?: (taskId: string) => void;
  onCancel?: (taskId: string) => void;
  onRetry?: (taskId: string) => void;
}

export function TaskCard({ task, onPause, onResume, onCancel, onRetry }: TaskCardProps) {
  // 状态图标和颜色
  const getStatusInfo = (status: TaskStatus) => {
    switch (status) {
      case 'pending':
        return {
          icon: <Clock className="w-4 h-4" />,
          label: '等待中',
          color: 'text-gray-500',
          bgColor: 'bg-gray-100 dark:bg-gray-800',
        };
      case 'running':
        return {
          icon: <Loader2 className="w-4 h-4 animate-spin" />,
          label: '处理中',
          color: 'text-blue-500',
          bgColor: 'bg-blue-100 dark:bg-blue-900/20',
        };
      case 'paused':
        return {
          icon: <Pause className="w-4 h-4" />,
          label: '已暂停',
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
        };
      case 'completed':
        return {
          icon: <CheckCircle2 className="w-4 h-4" />,
          label: '已完成',
          color: 'text-green-500',
          bgColor: 'bg-green-100 dark:bg-green-900/20',
        };
      case 'failed':
        return {
          icon: <XCircle className="w-4 h-4" />,
          label: '失败',
          color: 'text-red-500',
          bgColor: 'bg-red-100 dark:bg-red-900/20',
        };
      case 'cancelled':
        return {
          icon: <X className="w-4 h-4" />,
          label: '已取消',
          color: 'text-gray-500',
          bgColor: 'bg-gray-100 dark:bg-gray-800',
        };
      default:
        return {
          icon: <Clock className="w-4 h-4" />,
          label: '未知',
          color: 'text-gray-500',
          bgColor: 'bg-gray-100 dark:bg-gray-800',
        };
    }
  };

  const statusInfo = getStatusInfo(task.status);

  // 提取输入/输出文件名
  const getFileName = (args: string[]): string => {
    const inputIndex = args.findIndex(arg => arg === '-i');
    if (inputIndex !== -1 && inputIndex + 1 < args.length) {
      const path = args[inputIndex + 1];
      return path.split('/').pop() || path;
    }
    return '未知文件';
  };

  const getOutputFileName = (args: string[]): string => {
    // 通常输出文件是最后一个参数
    const lastArg = args[args.length - 1];
    if (lastArg && !lastArg.startsWith('-')) {
      return lastArg.split('/').pop() || lastArg;
    }
    return '未知';
  };

  const inputFile = getFileName(task.command);
  const outputFile = getOutputFileName(task.command);

  // 格式化时间
  const formatTime = (date?: Date): string => {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // 计算耗时
  const getDuration = (): string => {
    if (!task.startedAt) return '-';
    const start = new Date(task.startedAt);
    const end = task.completedAt ? new Date(task.completedAt) : new Date();
    const duration = Math.floor((end.getTime() - start.getTime()) / 1000);

    if (duration < 60) return `${duration}秒`;
    if (duration < 3600) {
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      return `${minutes}分${seconds}秒`;
    }
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    return `${hours}小时${minutes}分`;
  };

  // 计算剩余时间
  const getETA = (): string => {
    if (!task.progressInfo || !task.startedAt) return '-';

    const { speed, percent } = task.progressInfo;
    if (speed <= 0 || percent <= 0 || percent >= 100) return '-';

    const elapsed = (new Date().getTime() - new Date(task.startedAt).getTime()) / 1000; // 秒
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

  // 格式化速度
  const formatSpeed = (speed: number): string => {
    return `${speed.toFixed(2)}x`;
  };

  // 格式化文件大小
  const formatSize = (sizeKB: number): string => {
    if (sizeKB < 1024) return `${sizeKB} KB`;
    if (sizeKB < 1024 * 1024) return `${(sizeKB / 1024).toFixed(2)} MB`;
    return `${(sizeKB / (1024 * 1024)).toFixed(2)} GB`;
  };

  // 格式化比特率
  const formatBitrate = (bitrate: string): string => {
    return bitrate.replace('bits/s', 'bps').replace('kbits/s', 'kbps');
  };

  return (
    <div className={`rounded-lg border-2 ${statusInfo.bgColor} p-4 transition-all`}>
      <div className="flex items-start justify-between mb-3">
        {/* 左侧：状态和文件信息 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={statusInfo.color}>{statusInfo.icon}</span>
            <span className={`text-sm font-medium ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
            {task.status === 'running' && (
              <span className="text-sm text-gray-500">
                {task.progress?.toFixed(0)}%
              </span>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">输入:</span>
              <span className="text-sm font-medium truncate" title={inputFile}>
                {inputFile}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">输出:</span>
              <span className="text-sm truncate" title={outputFile}>
                {outputFile}
              </span>
            </div>
          </div>

          {/* 进度条和详细信息 */}
          {task.status === 'running' && task.progress !== undefined && (
            <div className="mt-3 space-y-2">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${task.progress}%` }}
                />
              </div>
              {/* 详细进度信息 */}
              {task.progressInfo && (
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600 dark:text-gray-400">
                  <div>速度: {formatSpeed(task.progressInfo.speed)}</div>
                  <div>剩余: {getETA()}</div>
                  {task.progressInfo.fps > 0 && (
                    <div>FPS: {task.progressInfo.fps.toFixed(1)}</div>
                  )}
                  {task.progressInfo.totalSize > 0 && (
                    <div>大小: {formatSize(task.progressInfo.totalSize)}</div>
                  )}
                  {task.progressInfo.bitrate && task.progressInfo.bitrate !== '0' && (
                    <div className="col-span-2">比特率: {formatBitrate(task.progressInfo.bitrate)}</div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 错误信息 */}
          {task.error && (
            <div className="mt-2 text-xs text-red-600 dark:text-red-400">
              错误: {task.error}
            </div>
          )}

          {/* 时间信息 */}
          <div className="mt-2 flex gap-4 text-xs text-gray-500">
            <span>创建: {formatTime(task.createdAt)}</span>
            {task.startedAt && <span>开始: {formatTime(task.startedAt)}</span>}
            {task.completedAt && <span>完成: {formatTime(task.completedAt)}</span>}
            {task.startedAt && <span>耗时: {getDuration()}</span>}
          </div>
        </div>

        {/* 右侧：操作按钮 */}
        <div className="flex gap-2 ml-4">
          {task.status === 'running' && onPause && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onPause(task.id)}
              title="暂停"
            >
              <Pause className="w-4 h-4" />
            </Button>
          )}

          {task.status === 'paused' && onResume && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onResume(task.id)}
              title="继续"
            >
              <Play className="w-4 h-4" />
            </Button>
          )}

          {(task.status === 'pending' || task.status === 'running' || task.status === 'paused') && onCancel && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onCancel(task.id)}
              title="取消"
            >
              <X className="w-4 h-4" />
            </Button>
          )}

          {(task.status === 'failed' || task.status === 'cancelled') && onRetry && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onRetry(task.id)}
              title="重试"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
