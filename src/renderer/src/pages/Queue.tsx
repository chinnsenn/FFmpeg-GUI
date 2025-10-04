import { useEffect, useState, useMemo, useCallback } from 'react';
import { TaskCard } from '@renderer/components/TaskCard/TaskCard';
import { Button } from '@renderer/components/ui/button';
import { Card } from '@renderer/components/ui/card';
import { Task, TaskManagerStatus } from '@shared/types';
import { IPC_CHANNELS } from '@shared/constants';
import { Trash2, RefreshCw } from 'lucide-react';
import { cn } from '@renderer/lib/utils';

export function Queue() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [status, setStatus] = useState<TaskManagerStatus>({
    queued: 0,
    running: 0,
    completed: 0,
    maxConcurrent: 2,
  });
  const [filter, setFilter] = useState<'all' | 'pending' | 'running' | 'completed' | 'failed'>('all');
  const [loading, setLoading] = useState(true);

  // 加载任务列表
  const loadTasks = useCallback(async () => {
    try {
      const allTasks = await window.electronAPI.task.getAll();
      setTasks(allTasks);

      const managerStatus = await window.electronAPI.task.getStatus();
      setStatus(managerStatus);
    } catch (error) {
      console.error('加载任务列表失败:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 初始加载
  useEffect(() => {
    loadTasks();
  }, []);

  // 监听任务事件
  useEffect(() => {
    const unsubscribers: (() => void)[] = [];

    // 任务添加
    const unsubTaskAdded = window.electronAPI.on(IPC_CHANNELS.TASK_ADDED, (task: Task) => {
      setTasks((prev: Task[]) => [...prev, task]);
      setStatus((prev: TaskManagerStatus) => ({ ...prev, queued: prev.queued + 1 }));
    });

    // 任务开始
    const unsubTaskStarted = window.electronAPI.on(IPC_CHANNELS.TASK_STARTED, (task: Task) => {
      setTasks((prev: Task[]) => prev.map(t => (t.id === task.id ? task : t)));
      setStatus((prev: TaskManagerStatus) => ({ ...prev, queued: Math.max(0, prev.queued - 1), running: prev.running + 1 }));
    });

    // 任务进度
    const unsubTaskProgress = window.electronAPI.on(
      IPC_CHANNELS.TASK_PROGRESS,
      ({ taskId, progress, progressInfo }: { taskId: string; progress: number; progressInfo?: any }) => {
        setTasks(prev =>
          prev.map(t =>
            t.id === taskId ? { ...t, progress, progressInfo } : t
          )
        );
      }
    );

    // 任务完成
    const unsubTaskCompleted = window.electronAPI.on(IPC_CHANNELS.TASK_COMPLETED, (task: Task) => {
      setTasks((prev: Task[]) => prev.map(t => (t.id === task.id ? task : t)));
      setStatus((prev: TaskManagerStatus) => ({ ...prev, running: Math.max(0, prev.running - 1), completed: prev.completed + 1 }));
    });

    // 任务失败
    const unsubTaskFailed = window.electronAPI.on(IPC_CHANNELS.TASK_FAILED, (task: Task) => {
      setTasks((prev: Task[]) => prev.map(t => (t.id === task.id ? task : t)));
      setStatus((prev: TaskManagerStatus) => ({ ...prev, running: Math.max(0, prev.running - 1) }));
    });

    // 任务取消
    const unsubTaskCancelled = window.electronAPI.on(IPC_CHANNELS.TASK_CANCELLED, (task: Task) => {
      setTasks((prev: Task[]) => prev.map(t => (t.id === task.id ? task : t)));
      setStatus((prev: TaskManagerStatus) => ({
        ...prev,
        queued: Math.max(0, prev.queued - 1),
        running: Math.max(0, prev.running - 1),
      }));
    });

    unsubscribers.push(
      unsubTaskAdded,
      unsubTaskStarted,
      unsubTaskProgress,
      unsubTaskCompleted,
      unsubTaskFailed,
      unsubTaskCancelled
    );

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, []);

  // 任务操作
  const handlePause = useCallback(async (taskId: string) => {
    try {
      await window.electronAPI.task.pause(taskId);
    } catch (error) {
      console.error('暂停任务失败:', error);
    }
  }, []);

  const handleResume = useCallback(async (taskId: string) => {
    try {
      await window.electronAPI.task.resume(taskId);
    } catch (error) {
      console.error('恢复任务失败:', error);
    }
  }, []);

  const handleCancel = useCallback(async (taskId: string) => {
    try {
      await window.electronAPI.task.cancel(taskId);
    } catch (error) {
      console.error('取消任务失败:', error);
    }
  }, []);

  const handleRetry = useCallback(async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        await window.electronAPI.task.add(task.command, task.priority);
      }
    } catch (error) {
      console.error('重试任务失败:', error);
    }
  }, [tasks]);

  const handleClearCompleted = useCallback(async () => {
    try {
      await window.electronAPI.task.clearCompleted();
      setTasks((prev: Task[]) => prev.filter(t => t.status !== 'completed'));
      setStatus((prev: TaskManagerStatus) => ({ ...prev, completed: 0 }));
    } catch (error) {
      console.error('清除已完成任务失败:', error);
    }
  }, []);

  // 过滤任务
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (filter === 'all') return true;
      if (filter === 'pending') return task.status === 'pending';
      if (filter === 'running') return task.status === 'running' || task.status === 'paused';
      if (filter === 'completed') return task.status === 'completed';
      if (filter === 'failed') return task.status === 'failed' || task.status === 'cancelled';
      return true;
    });
  }, [tasks, filter]);

  // 统计各状态任务数量
  const { pendingCount, runningCount, completedCount, failedCount } = useMemo(() => {
    return {
      pendingCount: tasks.filter(t => t.status === 'pending').length,
      runningCount: tasks.filter(t => t.status === 'running' || t.status === 'paused').length,
      completedCount: tasks.filter(t => t.status === 'completed').length,
      failedCount: tasks.filter(t => t.status === 'failed' || t.status === 'cancelled').length,
    };
  }, [tasks]);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1
          className="text-4xl font-bold tracking-tight text-text-primary mb-2"
          style={{ letterSpacing: '-0.02em' }}
        >
          任务队列
        </h1>
        <p className="text-sm text-text-secondary">
          共 {tasks.length} 个任务 | 等待: {pendingCount} | 运行: {runningCount} | 完成: {completedCount} | 失败: {failedCount}
        </p>
      </div>

      <div className="space-y-6">
        {/* 过滤和操作栏 */}
        <div className="flex items-center justify-between">
          {/* 过滤按钮 */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                filter === 'all'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-surface-raised border border-border-light text-text-secondary hover:bg-background-tertiary hover:text-text-primary'
              )}
            >
              全部 ({tasks.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                filter === 'pending'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-surface-raised border border-border-light text-text-secondary hover:bg-background-tertiary hover:text-text-primary'
              )}
            >
              等待中 ({pendingCount})
            </button>
            <button
              onClick={() => setFilter('running')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                filter === 'running'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-surface-raised border border-border-light text-text-secondary hover:bg-background-tertiary hover:text-text-primary'
              )}
            >
              运行中 ({runningCount})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                filter === 'completed'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-surface-raised border border-border-light text-text-secondary hover:bg-background-tertiary hover:text-text-primary'
              )}
            >
              已完成 ({completedCount})
            </button>
            <button
              onClick={() => setFilter('failed')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                filter === 'failed'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-surface-raised border border-border-light text-text-secondary hover:bg-background-tertiary hover:text-text-primary'
              )}
            >
              失败/取消 ({failedCount})
            </button>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={loadTasks}
              disabled={loading}
            >
              <RefreshCw className={cn('w-4 h-4 mr-2', loading && 'animate-spin')} />
              刷新
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleClearCompleted}
              disabled={completedCount === 0}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              清除已完成
            </Button>
          </div>
        </div>

        {/* 任务列表 */}
        <div className="space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-text-secondary">加载中...</div>
            </div>
          ) : filteredTasks.length === 0 ? (
            <Card padding="default" className="text-center py-12">
              <p className="text-lg mb-2 text-text-secondary">暂无任务</p>
              <p className="text-sm text-text-tertiary">
                {filter === 'all'
                  ? '开始转换或压缩文件，任务将显示在这里'
                  : `当前过滤条件下没有任务`}
              </p>
            </Card>
          ) : (
            filteredTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onPause={handlePause}
                onResume={handleResume}
                onCancel={handleCancel}
                onRetry={handleRetry}
              />
            ))
          )}
        </div>

        {/* 队列状态信息 */}
        {tasks.length > 0 && (
          <Card padding="default">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-text-tertiary">
                  {status.queued}
                </div>
                <div className="text-sm text-text-secondary mt-1">队列中</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-600">
                  {status.running}
                </div>
                <div className="text-sm text-text-secondary mt-1">运行中</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-success-600">
                  {status.completed}
                </div>
                <div className="text-sm text-text-secondary mt-1">已完成</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-text-secondary">
                  {status.maxConcurrent}
                </div>
                <div className="text-sm text-text-secondary mt-1">最大并发</div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
