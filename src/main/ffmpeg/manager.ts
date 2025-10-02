import { spawn, ChildProcess } from 'child_process';
import { EventEmitter } from 'events';
import type { Task, TaskStatus, TaskManagerStatus } from '@shared/types';
import { FFmpegParser } from './parser';

/**
 * 任务事件接口
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
 * 内部任务接口（包含进程引用和解析器）
 */
interface InternalTask extends Task {
  process?: ChildProcess;
  parser?: FFmpegParser;
}

/**
 * FFmpeg 进程管理器
 * 负责管理 FFmpeg 任务队列、并发控制和进程生命周期
 */
export class FFmpegManager extends EventEmitter {
  private queue: InternalTask[] = [];
  private running: Map<string, InternalTask> = new Map();
  private completed: Map<string, InternalTask> = new Map();
  private maxConcurrent = 2;
  private ffmpegPath: string;

  constructor(ffmpegPath: string) {
    super();
    this.ffmpegPath = ffmpegPath;
  }

  /**
   * 添加任务到队列
   */
  async addTask(command: string[], priority = 0): Promise<string> {
    const taskId = this.generateId();
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

    try {
      const process = spawn(this.ffmpegPath, task.command);
      task.process = process;

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
            this.emit('taskProgress', task.id, progressInfo.percent, progressInfo);
          }

          // 检查错误
          const error = task.parser.parseError(output);
          if (error) {
            task.error = error;
          }
        }
      });

      // 进程关闭事件
      process.on('close', (code: number) => {
        this.handleTaskCompletion(task, code);
      });

      // 进程错误事件
      process.on('error', (error: Error) => {
        this.handleTaskError(task, error);
      });
    } catch (error) {
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
      return true;
    }

    // 检查是否正在运行
    const task = this.running.get(taskId);
    if (task?.process) {
      task.process.kill('SIGTERM');
      task.status = 'cancelled';
      task.error = 'Cancelled by user';
      task.completedAt = new Date();
      this.running.delete(taskId);
      this.completed.set(task.id, task);
      this.emit('taskCancelled', this.sanitizeTask(task));
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
   * 清除已完成的任务
   */
  clearCompleted() {
    this.completed.clear();
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
    const { process, parser, ...sanitized } = task;
    return sanitized;
  }
}
