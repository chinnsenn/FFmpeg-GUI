import { useEffect, useState, useMemo, useCallback } from 'react';
import { TaskCard } from '@renderer/components/TaskCard/TaskCard';
import { Card } from '@renderer/components/ui/card';
import { Task, TaskManagerStatus } from '@shared/types';
import { IPC_CHANNELS } from '@shared/constants';
import { Trash2 } from 'lucide-react';
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

  // 处理最大并发数修改
  const handleMaxConcurrentChange = useCallback(async (value: number) => {
    try {
      await window.electronAPI.task.setMaxConcurrent(value);
      setStatus((prev: TaskManagerStatus) => ({ ...prev, maxConcurrent: value }));
    } catch (error) {
      console.error('设置最大并发数失败:', error);
    }
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="space-y-6">
        {/* 顶部状态栏 - 单行紧凑显示 */}
        <Card padding="default">
          <div className="flex items-center justify-between">
            {/* 左侧：状态统计 */}
            <div className="flex items-center gap-4 text-sm">
              <span className="text-text-secondary">
                运行中: <span className="font-semibold text-primary-600">{runningCount}</span>
              </span>
              <span className="text-text-tertiary">|</span>
              <span className="text-text-secondary">
                队列中: <span className="font-semibold text-text-primary">{pendingCount}</span>
              </span>
              <span className="text-text-tertiary">|</span>
              <span className="text-text-secondary">
                已完成: <span className="font-semibold text-success-600">{completedCount}</span>
              </span>
              <span className="text-text-tertiary">|</span>
              <span className="text-text-secondary">
                失败: <span className="font-semibold text-error-600">{failedCount}</span>
              </span>
            </div>

            {/* 右侧：最大并发下拉框 */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-text-secondary">最大并发:</label>
              <select
                value={status.maxConcurrent}
                onChange={(e) => handleMaxConcurrentChange(Number(e.target.value))}
                className="h-8 px-2 py-1 rounded border border-border-medium bg-surface-base text-text-primary text-sm transition-all hover:border-border-dark focus:outline-none focus:border-primary-500"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </div>
          </div>
        </Card>

        {/* 筛选和操作栏 */}
        <div className="flex items-center justify-between">
          {/* 左侧：筛选下拉菜单 */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-text-secondary">筛选:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="h-10 px-3 py-2 rounded-lg border border-border-medium bg-surface-base text-text-primary text-sm transition-all hover:border-border-dark focus:outline-none focus:border-primary-500"
            >
              <option value="all">全部</option>
              <option value="pending">等待中</option>
              <option value="running">运行中</option>
              <option value="completed">已完成</option>
              <option value="failed">失败/取消</option>
            </select>
          </div>

          {/* 右侧：清除已完成按钮 */}
          <button
            onClick={handleClearCompleted}
            disabled={completedCount === 0}
            className={cn(
              'flex items-center gap-2 h-10 px-4 rounded-lg text-sm font-medium transition-all',
              'bg-error-50 text-error-600 border border-error-200',
              'hover:bg-error-100 hover:border-error-300',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            <Trash2 className="w-4 h-4" />
            清空已完成
          </button>
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
      </div>
    </div>
  );
}
