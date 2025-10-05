import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, Archive, ArrowRight } from 'lucide-react';
import { Card } from '@renderer/components/ui/card';
import { TaskCard } from '@renderer/components/TaskCard/TaskCard';
import { Task } from '@shared/types';
import { IPC_CHANNELS } from '@shared/constants';
import { cn } from '@renderer/lib/utils';
import { logger } from '@renderer/utils/logger';

export function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // 加载任务列表
  const loadTasks = useCallback(async () => {
    try {
      const allTasks = await window.electronAPI.task.getAll();
      setTasks(allTasks);
    } catch (error) {
      logger.errorFromCatch('Home', '加载任务列表失败', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 初始加载
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // 监听任务事件 - 实时更新
  useEffect(() => {
    const unsubscribers: (() => void)[] = [];

    // 任务添加
    const unsubTaskAdded = window.electronAPI.on(IPC_CHANNELS.TASK_ADDED, (task: Task) => {
      setTasks(prev => [...prev, task]);
    });

    // 任务开始
    const unsubTaskStarted = window.electronAPI.on(IPC_CHANNELS.TASK_STARTED, (payload) => {
      setTasks(prev => prev.map(t => (t.id === payload.task.id ? payload.task : t)));
    });

    // 任务进度
    const unsubTaskProgress = window.electronAPI.on(
      IPC_CHANNELS.TASK_PROGRESS,
      ({ taskId, progress, progressInfo }: { taskId: string; progress: number; progressInfo?: any }) => {
        setTasks(prev =>
          prev.map(t => (t.id === taskId ? { ...t, progress, progressInfo } : t))
        );
      }
    );

    // 任务完成
    const unsubTaskCompleted = window.electronAPI.on(IPC_CHANNELS.TASK_COMPLETED, (payload) => {
      setTasks(prev => prev.map(t => (t.id === payload.task.id ? payload.task : t)));
    });

    // 任务失败
    const unsubTaskFailed = window.electronAPI.on(IPC_CHANNELS.TASK_FAILED, (payload) => {
      setTasks(prev => prev.map(t => (t.id === payload.task.id ? payload.task : t)));
    });

    // 任务取消
    const unsubTaskCancelled = window.electronAPI.on(IPC_CHANNELS.TASK_CANCELLED, (payload) => {
      setTasks(prev => prev.map(t => (t.id === payload.task.id ? payload.task : t)));
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
      logger.errorFromCatch('Home', '暂停任务失败', error);
    }
  }, []);

  const handleResume = useCallback(async (taskId: string) => {
    try {
      await window.electronAPI.task.resume(taskId);
    } catch (error) {
      logger.errorFromCatch('Home', '恢复任务失败', error);
    }
  }, []);

  const handleCancel = useCallback(async (taskId: string) => {
    try {
      await window.electronAPI.task.cancel(taskId);
    } catch (error) {
      logger.errorFromCatch('Home', '取消任务失败', error);
    }
  }, []);

  const handleRetry = useCallback(
    async (taskId: string) => {
      try {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
          await window.electronAPI.task.add(task.command, task.priority);
        }
      } catch (error) {
        logger.errorFromCatch('Home', '重试任务失败', error);
      }
    },
    [tasks]
  );

  // 统计各状态任务数量
  const statistics = useMemo(() => {
    const running = tasks.filter(t => t.status === 'running').length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const failed = tasks.filter(t => t.status === 'failed' || t.status === 'cancelled').length;

    return { running, pending, completed, failed };
  }, [tasks]);

  // 最近任务（最多 5 条，按创建时间倒序）
  const recentTasks = useMemo(() => {
    return [...tasks]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [tasks]);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1
          className="text-4xl font-bold tracking-tight text-text-primary mb-2"
          style={{ letterSpacing: '-0.02em' }}
        >
          首页
        </h1>
        <p className="text-sm text-text-secondary">查看任务概览和快速开始</p>
      </div>

      {/* Task Statistics Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {/* Running Tasks */}
        <Card
          padding="default"
          className={cn(
            'h-30 transition-all duration-200 hover:shadow-md hover:-translate-y-1 cursor-default'
          )}
        >
          <div className="text-sm font-medium text-text-secondary mb-2">运行中</div>
          <div className="text-4xl font-bold text-primary-600">{statistics.running}</div>
        </Card>

        {/* Pending Tasks */}
        <Card
          padding="default"
          className={cn(
            'h-30 transition-all duration-200 hover:shadow-md hover:-translate-y-1 cursor-default'
          )}
        >
          <div className="text-sm font-medium text-text-secondary mb-2">队列中</div>
          <div className="text-4xl font-bold text-text-tertiary">{statistics.pending}</div>
        </Card>

        {/* Completed Tasks */}
        <Card
          padding="default"
          className={cn(
            'h-30 transition-all duration-200 hover:shadow-md hover:-translate-y-1 cursor-default'
          )}
        >
          <div className="text-sm font-medium text-text-secondary mb-2">已完成</div>
          <div className="text-4xl font-bold text-success-600">{statistics.completed}</div>
        </Card>

        {/* Failed Tasks */}
        <Card
          padding="default"
          className={cn(
            'h-30 transition-all duration-200 hover:shadow-md hover:-translate-y-1 cursor-default'
          )}
        >
          <div className="text-sm font-medium text-text-secondary mb-2">失败</div>
          <div className="text-4xl font-bold text-error-600">{statistics.failed}</div>
        </Card>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Quick Convert */}
        <Link to="/convert">
          <Card
            padding="spacious"
            className={cn(
              'h-40 border-2 transition-all duration-200',
              'hover:shadow-md hover:border-primary-500 hover:-translate-y-0.5',
              'cursor-pointer flex flex-col items-center justify-center text-center'
            )}
          >
            <RefreshCw className="w-12 h-12 text-primary-600 mb-3" />
            <h3 className="text-lg font-semibold text-text-primary mb-1">快速转换</h3>
            <p className="text-sm text-text-secondary">点击开始格式转换</p>
          </Card>
        </Link>

        {/* Quick Compress */}
        <Link to="/compress">
          <Card
            padding="spacious"
            className={cn(
              'h-40 border-2 transition-all duration-200',
              'hover:shadow-md hover:border-primary-500 hover:-translate-y-0.5',
              'cursor-pointer flex flex-col items-center justify-center text-center'
            )}
          >
            <Archive className="w-12 h-12 text-primary-600 mb-3" />
            <h3 className="text-lg font-semibold text-text-primary mb-1">快速压缩</h3>
            <p className="text-sm text-text-secondary">点击开始视频压缩</p>
          </Card>
        </Link>
      </div>

      {/* Recent Tasks */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">最近任务</h2>
          {tasks.length > 0 && (
            <Link
              to="/queue"
              className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              查看全部
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-text-secondary">加载中...</div>
          </div>
        ) : recentTasks.length === 0 ? (
          <Card padding="default" className="text-center py-12">
            <p className="text-lg mb-2 text-text-secondary">暂无任务</p>
            <p className="text-sm text-text-tertiary">
              开始转换或压缩文件，任务将显示在这里
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {recentTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onPause={handlePause}
                onResume={handleResume}
                onCancel={handleCancel}
                onRetry={handleRetry}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
