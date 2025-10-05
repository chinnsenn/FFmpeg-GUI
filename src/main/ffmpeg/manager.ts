import { spawn, ChildProcess } from 'child_process';
import { EventEmitter } from 'events';
import type { Task, TaskManagerStatus } from '@shared/types';
import { FFmpegParser } from './parser';
import { logger } from '../utils/logger';

// Constants for task management
const DEFAULT_MAX_CONCURRENT_TASKS = 2;
const DEFAULT_MAX_COMPLETED_TASKS = 100;
const DEFAULT_TASK_PRIORITY = 0;

/**
 * Task event interface
 */
export interface TaskEvents {
  taskAdded: (task: Task) => void;
  taskStarted: (task: Task) => void;
  taskProgress: (taskId: string, progress: number) => void;
  taskOutput: (taskId: string, output: string) => void;
  taskCompleted: (task: Task) => void;
  taskFailed: (task: Task) => void;
  taskCancelled: (task: Task) => void;
}

/**
 * Internal task interface (includes process reference and parser)
 */
interface InternalTask extends Task {
  process?: ChildProcess;
  parser?: FFmpegParser;
}

/**
 * FFmpeg process manager
 * Manages FFmpeg task queue, concurrency control, and process lifecycle
 */
export class FFmpegManager extends EventEmitter {
  private queue: InternalTask[] = [];
  private running: Map<string, InternalTask> = new Map();
  private completed: Map<string, InternalTask> = new Map();
  private maxConcurrent = DEFAULT_MAX_CONCURRENT_TASKS;
  private maxCompletedTasks = DEFAULT_MAX_COMPLETED_TASKS;
  private ffmpegPath: string;

  constructor(ffmpegPath: string) {
    super();
    this.ffmpegPath = ffmpegPath;
    logger.info('FFmpegManager', 'Manager initialized', { ffmpegPath, maxConcurrent: this.maxConcurrent });
  }

  /**
   * Add task to queue
   */
  async addTask(command: string[], priority = DEFAULT_TASK_PRIORITY): Promise<string> {
    const taskId = this.generateId();
    logger.info('FFmpegManager', 'Adding task', { taskId, priority, commandLength: command.length });

    const task: InternalTask = {
      id: taskId,
      command,
      status: 'pending',
      progress: 0,
      createdAt: new Date(),
      priority,
      parser: new FFmpegParser(), // 为每个任务创建解析器
    };

    // 按优先级插入队列
    const insertIndex = this.queue.findIndex(t => (t.priority || 0) < priority);
    if (insertIndex === -1) {
      this.queue.push(task);
    } else {
      this.queue.splice(insertIndex, 0, task);
    }

    this.emit('taskAdded', this.sanitizeTask(task));
    this.processQueue();

    logger.debug('FFmpegManager', 'Task added to queue', { taskId, queueLength: this.queue.length });
    return taskId;
  }

  /**
   * 处理队列中的任务
   */
  private async processQueue() {
    while (this.queue.length > 0 && this.running.size < this.maxConcurrent) {
      const task = this.queue.shift()!;
      await this.executeTask(task);
    }
  }

  /**
   * 执行单个任务
   */
  private async executeTask(task: InternalTask) {
    task.status = 'running';
    task.startedAt = new Date();
    this.running.set(task.id, task);
    this.emit('taskStarted', this.sanitizeTask(task));

    logger.info('FFmpegManager', 'Task started', { taskId: task.id });

    try {
      const process = spawn(this.ffmpegPath, task.command);
      task.process = process;

      let lastProgressEmit = 0; // 用于限制进度事件发送频率

      // 捕获标准输出
      process.stdout.on('data', (data: Buffer) => {
        const output = data.toString();
        this.emit('taskOutput', task.id, output);
      });

      // 捕获错误输出（FFmpeg 主要输出在 stderr）
      process.stderr.on('data', (data: Buffer) => {
        const output = data.toString();
        this.emit('taskOutput', task.id, output);

        // 使用解析器处理输出
        if (task.parser) {
          // 首先尝试解析持续时间
          const duration = task.parser.parseDuration(output);
          if (duration !== null) {
            // 持续时间已解析并自动设置到 parser
          }

          // 解析进度信息
          const progressInfo = task.parser.parseProgress(output);
          if (progressInfo) {
            task.progress = progressInfo.percent;
            task.progressInfo = progressInfo; // 保存完整的进度信息

            // 限制进度事件发送频率（每 500ms 发送一次）
            const now = Date.now();
            if (now - lastProgressEmit > 500) {
              this.emit('taskProgress', task.id, progressInfo.percent, progressInfo);
              lastProgressEmit = now;
            }
          }

          // 检查错误
          const error = task.parser.parseError(output);
          if (error) {
            task.error = error;
            logger.warn('FFmpegManager', 'Task error detected', { taskId: task.id, error });
          }
        }
      });

      // 进程关闭事件
      process.on('close', (code: number) => {
        this.handleTaskCompletion(task, code);
      });

      // 进程错误事件
      process.on('error', (error: Error) => {
        logger.error('FFmpegManager', 'Process error', { taskId: task.id, error });
        this.handleTaskError(task, error);
      });
    } catch (error) {
      logger.error('FFmpegManager', 'Failed to execute task', { taskId: task.id, error });
      this.handleTaskError(task, error as Error);
    }
  }

  /**
   * 处理任务完成
   */
  private handleTaskCompletion(task: InternalTask, exitCode: number) {
    this.running.delete(task.id);
    task.completedAt = new Date();

    if (exitCode === 0) {
      task.status = 'completed';
      task.progress = 100;
      this.completed.set(task.id, task);
      this.emit('taskCompleted', this.sanitizeTask(task));
    } else {
      task.status = 'failed';
      if (!task.error) {
        task.error = `Process exited with code ${exitCode}`;
      }
      this.completed.set(task.id, task);
      this.emit('taskFailed', this.sanitizeTask(task));
    }

    // 清理旧的已完成任务（保留最新的 maxCompletedTasks 个）
    this.cleanupCompletedTasks();

    this.processQueue();
  }

  /**
   * 处理任务错误
   */
  private handleTaskError(task: InternalTask, error: Error) {
    this.running.delete(task.id);
    task.status = 'failed';
    task.error = error.message;
    task.completedAt = new Date();
    this.completed.set(task.id, task);
    this.emit('taskFailed', this.sanitizeTask(task));
    this.processQueue();
  }

  /**
   * 取消任务
   */
  cancelTask(taskId: string): boolean {
    // 检查是否在队列中
    const queueIndex = this.queue.findIndex(t => t.id === taskId);
    if (queueIndex !== -1) {
      const task = this.queue.splice(queueIndex, 1)[0];
      task.status = 'cancelled';
      task.completedAt = new Date();
      this.completed.set(task.id, task);
      this.emit('taskCancelled', this.sanitizeTask(task));
      this.cleanupCompletedTasks();
      return true;
    }

    // 检查是否正在运行
    const task = this.running.get(taskId);
    if (task?.process) {
      // 强制杀死进程，确保资源释放
      task.process.kill('SIGKILL');
      task.status = 'cancelled';
      task.error = 'Cancelled by user';
      task.completedAt = new Date();
      this.running.delete(taskId);
      this.completed.set(task.id, task);
      this.emit('taskCancelled', this.sanitizeTask(task));
      this.cleanupCompletedTasks();
      this.processQueue();
      return true;
    }

    return false;
  }

  /**
   * 暂停任务（通过 SIGSTOP 信号）
   */
  pauseTask(taskId: string): boolean {
    const task = this.running.get(taskId);
    if (task?.process && task.status === 'running') {
      task.process.kill('SIGSTOP');
      task.status = 'paused';
      return true;
    }
    return false;
  }

  /**
   * 恢复任务（通过 SIGCONT 信号）
   */
  resumeTask(taskId: string): boolean {
    const task = this.running.get(taskId);
    if (task?.process && task.status === 'paused') {
      task.process.kill('SIGCONT');
      task.status = 'running';
      return true;
    }
    return false;
  }

  /**
   * 获取单个任务信息
   */
  getTask(taskId: string): Task | undefined {
    const task =
      this.queue.find(t => t.id === taskId) ||
      this.running.get(taskId) ||
      this.completed.get(taskId);
    return task ? this.sanitizeTask(task) : undefined;
  }

  /**
   * 获取所有任务
   */
  getAllTasks(): Task[] {
    return [
      ...this.queue.map(t => this.sanitizeTask(t)),
      ...Array.from(this.running.values()).map(t => this.sanitizeTask(t)),
      ...Array.from(this.completed.values()).map(t => this.sanitizeTask(t)),
    ];
  }

  /**
   * 获取队列中的任务
   */
  getQueuedTasks(): Task[] {
    return this.queue.map(t => this.sanitizeTask(t));
  }

  /**
   * 获取正在运行的任务
   */
  getRunningTasks(): Task[] {
    return Array.from(this.running.values()).map(t => this.sanitizeTask(t));
  }

  /**
   * 获取已完成的任务
   */
  getCompletedTasks(): Task[] {
    return Array.from(this.completed.values()).map(t => this.sanitizeTask(t));
  }

  /**
   * 设置最大并发数
   */
  setMaxConcurrent(max: number) {
    this.maxConcurrent = Math.max(1, max);
    this.processQueue();
  }

  /**
   * 获取最大并发数
   */
  getMaxConcurrent(): number {
    return this.maxConcurrent;
  }

  /**
   * 清理已完成的任务
   */
  clearCompleted() {
    this.completed.clear();
  }

  /**
   * 自动清理旧的已完成任务（保留最新的 maxCompletedTasks 个）
   */
  private cleanupCompletedTasks() {
    if (this.completed.size > this.maxCompletedTasks) {
      // 将 Map 转换为数组并按完成时间排序
      const sortedTasks = Array.from(this.completed.values()).sort((a, b) => {
        const timeA = a.completedAt?.getTime() || 0;
        const timeB = b.completedAt?.getTime() || 0;
        return timeB - timeA; // 降序，最新的在前
      });

      // 清空 Map
      this.completed.clear();

      // 只保留最新的 maxCompletedTasks 个
      sortedTasks.slice(0, this.maxCompletedTasks).forEach(task => {
        this.completed.set(task.id, task);
      });
    }
  }

  /**
   * 设置最大保留已完成任务数
   */
  setMaxCompletedTasks(max: number) {
    this.maxCompletedTasks = Math.max(10, max); // 最少保留 10 个
    this.cleanupCompletedTasks();
  }

  /**
   * 生成唯一任务 ID
   */
  private generateId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 获取管理器状态
   */
  getStatus(): TaskManagerStatus {
    return {
      queued: this.queue.length,
      running: this.running.size,
      completed: this.completed.size,
      maxConcurrent: this.maxConcurrent,
    };
  }

  /**
   * 移除进程引用和解析器以便安全传输到渲染进程
   */
  private sanitizeTask(task: InternalTask): Task {
    const { process: _process, parser: _parser, ...sanitized } = task;
    return sanitized;
  }
}
