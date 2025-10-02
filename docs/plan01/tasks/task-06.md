# Task-06: FFmpeg 进程管理器

**任务ID**：Task-06
**所属阶段**：阶段二 - FFmpeg 集成
**难度**：⭐⭐⭐ 困难
**预估时间**：3天
**优先级**：P0
**依赖任务**：Task-05

---

## 任务目标

实现 FFmpeg 进程管理器,支持任务队列、并发控制、进程监控和生命周期管理。

---

## 详细需求

### 1. 进程管理
- [ ] 创建和管理 FFmpeg 子进程
- [ ] 监控进程状态(运行中/暂停/完成/失败)
- [ ] 支持暂停/恢复/取消任务
- [ ] 进程异常处理和重试机制

### 2. 任务队列
- [ ] 实现任务队列数据结构
- [ ] 支持任务优先级
- [ ] 并发数量控制(默认2个)
- [ ] 任务状态管理

### 3. 输出捕获
- [ ] 捕获 FFmpeg stdout 输出
- [ ] 捕获 FFmpeg stderr 输出
- [ ] 解析输出日志
- [ ] 错误信息提取

---

## 技术方案

```typescript
// src/main/ffmpeg/manager.ts
import { spawn, ChildProcess } from 'child_process';
import { EventEmitter } from 'events';

export interface Task {
  id: string;
  command: string[];
  status: 'pending' | 'running' | 'paused' | 'completed' | 'failed';
  progress: number;
  error?: string;
  process?: ChildProcess;
}

export class FFmpegManager extends EventEmitter {
  private queue: Task[] = [];
  private running: Map<string, Task> = new Map();
  private maxConcurrent = 2;
  private ffmpegPath: string;

  constructor(ffmpegPath: string) {
    super();
    this.ffmpegPath = ffmpegPath;
  }

  async addTask(command: string[]): Promise<string> {
    const taskId = this.generateId();
    const task: Task = {
      id: taskId,
      command,
      status: 'pending',
      progress: 0,
    };

    this.queue.push(task);
    this.emit('taskAdded', task);
    this.processQueue();

    return taskId;
  }

  private async processQueue() {
    while (this.queue.length > 0 && this.running.size < this.maxConcurrent) {
      const task = this.queue.shift()!;
      await this.executeTask(task);
    }
  }

  private async executeTask(task: Task) {
    task.status = 'running';
    this.running.set(task.id, task);
    this.emit('taskStarted', task);

    const process = spawn(this.ffmpegPath, task.command);
    task.process = process;

    process.stderr.on('data', (data: Buffer) => {
      const output = data.toString();
      this.emit('taskOutput', task.id, output);
    });

    process.on('close', (code: number) => {
      this.running.delete(task.id);

      if (code === 0) {
        task.status = 'completed';
        task.progress = 100;
        this.emit('taskCompleted', task);
      } else {
        task.status = 'failed';
        task.error = `Process exited with code ${code}`;
        this.emit('taskFailed', task);
      }

      this.processQueue();
    });

    process.on('error', (error: Error) => {
      this.running.delete(task.id);
      task.status = 'failed';
      task.error = error.message;
      this.emit('taskFailed', task);
      this.processQueue();
    });
  }

  cancelTask(taskId: string) {
    const task = this.running.get(taskId);
    if (task?.process) {
      task.process.kill('SIGTERM');
      task.status = 'failed';
      task.error = 'Cancelled by user';
      this.running.delete(taskId);
    }
  }

  private generateId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getTasks(): Task[] {
    return [...this.queue, ...Array.from(this.running.values())];
  }

  setMaxConcurrent(max: number) {
    this.maxConcurrent = max;
    this.processQueue();
  }
}
```

---

## 验收标准

- [ ] 能成功执行 FFmpeg 命令
- [ ] 任务队列正常工作
- [ ] 并发控制有效
- [ ] 能取消运行中的任务
- [ ] 进程错误能正确捕获
- [ ] 事件通知正常工作

---

## 完成检查清单

- [ ] FFmpegManager 类实现
- [ ] 任务队列逻辑实现
- [ ] IPC 集成
- [ ] 单元测试编写
- [ ] 代码已提交

---

**任务状态**：待开始
**创建日期**：2025-10-02
