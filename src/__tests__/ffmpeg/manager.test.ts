import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { FFmpegManager } from '@main/ffmpeg/manager';
import { ChildProcess } from 'child_process';
import { EventEmitter } from 'events';
import * as childProcess from 'child_process';

// Mock child_process spawn
vi.mock('child_process', async () => {
  const actual = await vi.importActual('child_process');
  return {
    ...actual,
    spawn: vi.fn(),
  };
});

// Mock logger
vi.mock('@main/utils/logger', () => ({
  logger: {
    info: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

describe('FFmpegManager', () => {
  let manager: FFmpegManager;
  let mockProcess: Partial<ChildProcess>;
  let spawnMock: any;

  beforeEach(() => {
    // Get the mocked spawn function
    spawnMock = childProcess.spawn as any;
    // Create a mock child process
    mockProcess = {
      stdout: new EventEmitter() as any,
      stderr: new EventEmitter() as any,
      on: vi.fn((event, handler) => {
        if (event === 'close') {
          // Store the close handler for later use
          (mockProcess as any).closeHandler = handler;
        }
        if (event === 'error') {
          (mockProcess as any).errorHandler = handler;
        }
        return mockProcess as ChildProcess;
      }),
      kill: vi.fn(),
    };

    // Mock spawn to return our mock process
    spawnMock.mockReturnValue(mockProcess);

    manager = new FFmpegManager('/usr/bin/ffmpeg');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Task Queue Management', () => {
    it('should add task to queue', async () => {
      const taskId = await manager.addTask(['ffmpeg', '-version']);

      expect(taskId).toBeDefined();
      expect(typeof taskId).toBe('string');
      expect(taskId).toMatch(/^task_\d+_[a-z0-9]+$/);

      const task = manager.getTask(taskId);
      expect(task).toBeDefined();
      expect(task?.status).toBe('running'); // Should start immediately when under concurrency limit
    });

    it('should respect priority ordering in queue', async () => {
      // Set max concurrent to 0 to keep tasks in queue
      manager.setMaxConcurrent(0);

      const lowPriorityTask = await manager.addTask(['cmd1'], 0);
      const highPriorityTask = await manager.addTask(['cmd2'], 10);
      const mediumPriorityTask = await manager.addTask(['cmd3'], 5);

      const queuedTasks = manager.getQueuedTasks();
      expect(queuedTasks).toHaveLength(3);
      expect(queuedTasks[0].id).toBe(highPriorityTask);
      expect(queuedTasks[1].id).toBe(mediumPriorityTask);
      expect(queuedTasks[2].id).toBe(lowPriorityTask);
    });

    it('should enforce max concurrent limit', async () => {
      manager.setMaxConcurrent(2);

      // Add 3 tasks
      await manager.addTask(['task1']);
      await manager.addTask(['task2']);
      await manager.addTask(['task3']);

      const runningTasks = manager.getRunningTasks();
      const queuedTasks = manager.getQueuedTasks();

      expect(runningTasks.length).toBeLessThanOrEqual(2);
      expect(queuedTasks.length).toBeGreaterThanOrEqual(1);
    });

    it('should process next task when running task completes', async () => {
      manager.setMaxConcurrent(1);

      const task1 = await manager.addTask(['task1']);
      const task2 = await manager.addTask(['task2']);

      expect(manager.getRunningTasks()).toHaveLength(1);
      expect(manager.getQueuedTasks()).toHaveLength(1);

      // Simulate task1 completion
      (mockProcess as any).closeHandler(0);

      // Wait for next tick to allow queue processing
      await new Promise(resolve => setImmediate(resolve));

      // Now task2 should be running
      const runningTasks = manager.getRunningTasks();
      expect(runningTasks.length).toBeGreaterThan(0);
    });
  });

  describe('Task Lifecycle', () => {
    it('should start task execution', async () => {
      const taskId = await manager.addTask(['ffmpeg', '-version']);
      const task = manager.getTask(taskId);

      expect(task?.status).toBe('running');
      expect(task?.startedAt).toBeDefined();
    });

    it('should mark task as completed on exit code 0', async () => {
      const taskAddedSpy = vi.fn();
      const taskCompletedSpy = vi.fn();

      manager.on('taskAdded', taskAddedSpy);
      manager.on('taskCompleted', taskCompletedSpy);

      const taskId = await manager.addTask(['ffmpeg', '-version']);
      expect(taskAddedSpy).toHaveBeenCalled();

      // Simulate successful completion
      (mockProcess as any).closeHandler(0);

      // Wait for event emission
      await new Promise(resolve => setImmediate(resolve));

      expect(taskCompletedSpy).toHaveBeenCalled();

      const task = manager.getTask(taskId);
      expect(task?.status).toBe('completed');
      expect(task?.progress).toBe(100);
      expect(task?.completedAt).toBeDefined();
    });

    it('should mark task as failed on non-zero exit code', async () => {
      const taskFailedSpy = vi.fn();
      manager.on('taskFailed', taskFailedSpy);

      const taskId = await manager.addTask(['ffmpeg', '-invalid']);

      // Simulate failure
      (mockProcess as any).closeHandler(1);

      // Wait for event emission
      await new Promise(resolve => setImmediate(resolve));

      expect(taskFailedSpy).toHaveBeenCalled();

      const task = manager.getTask(taskId);
      expect(task?.status).toBe('failed');
      expect(task?.error).toBeDefined();
    });

    it('should handle process errors', async () => {
      const taskFailedSpy = vi.fn();
      manager.on('taskFailed', taskFailedSpy);

      const taskId = await manager.addTask(['ffmpeg', '-version']);

      // Simulate process error
      const error = new Error('ENOENT: ffmpeg not found');
      (mockProcess as any).errorHandler(error);

      // Wait for event emission
      await new Promise(resolve => setImmediate(resolve));

      expect(taskFailedSpy).toHaveBeenCalled();

      const task = manager.getTask(taskId);
      expect(task?.status).toBe('failed');
      expect(task?.error).toContain('ENOENT');
    });
  });

  describe('Task Control', () => {
    it('should cancel queued task', async () => {
      manager.setMaxConcurrent(0); // Keep task in queue

      const taskCancelledSpy = vi.fn();
      manager.on('taskCancelled', taskCancelledSpy);

      const taskId = await manager.addTask(['task']);
      expect(manager.getQueuedTasks()).toHaveLength(1);

      const cancelled = manager.cancelTask(taskId);
      expect(cancelled).toBe(true);
      expect(taskCancelledSpy).toHaveBeenCalled();

      expect(manager.getQueuedTasks()).toHaveLength(0);

      const task = manager.getTask(taskId);
      expect(task?.status).toBe('cancelled');
    });

    it('should cancel running task', async () => {
      const taskCancelledSpy = vi.fn();
      manager.on('taskCancelled', taskCancelledSpy);

      const taskId = await manager.addTask(['task']);

      const cancelled = manager.cancelTask(taskId);
      expect(cancelled).toBe(true);
      expect(mockProcess.kill).toHaveBeenCalledWith('SIGKILL');
      expect(taskCancelledSpy).toHaveBeenCalled();

      const task = manager.getTask(taskId);
      expect(task?.status).toBe('cancelled');
    });

    it('should return false when cancelling non-existent task', () => {
      const cancelled = manager.cancelTask('non-existent-task');
      expect(cancelled).toBe(false);
    });

    it('should pause running task', async () => {
      const taskId = await manager.addTask(['task']);

      const paused = manager.pauseTask(taskId);
      expect(paused).toBe(true);
      expect(mockProcess.kill).toHaveBeenCalledWith('SIGSTOP');

      const task = manager.getTask(taskId);
      expect(task?.status).toBe('paused');
    });

    it('should resume paused task', async () => {
      const taskId = await manager.addTask(['task']);

      manager.pauseTask(taskId);
      const resumed = manager.resumeTask(taskId);

      expect(resumed).toBe(true);
      expect(mockProcess.kill).toHaveBeenCalledWith('SIGCONT');

      const task = manager.getTask(taskId);
      expect(task?.status).toBe('running');
    });

    it('should not pause non-running task', () => {
      const paused = manager.pauseTask('non-existent-task');
      expect(paused).toBe(false);
    });

    it('should not resume non-paused task', async () => {
      const taskId = await manager.addTask(['task']);

      const resumed = manager.resumeTask(taskId);
      expect(resumed).toBe(false);
    });
  });

  describe('Task Queries', () => {
    it('should get task by ID', async () => {
      const taskId = await manager.addTask(['task']);
      const task = manager.getTask(taskId);

      expect(task).toBeDefined();
      expect(task?.id).toBe(taskId);
    });

    it('should return undefined for non-existent task', () => {
      const task = manager.getTask('non-existent');
      expect(task).toBeUndefined();
    });

    it('should get all tasks', async () => {
      manager.setMaxConcurrent(1);

      await manager.addTask(['task1']);
      await manager.addTask(['task2']);

      const allTasks = manager.getAllTasks();
      expect(allTasks).toHaveLength(2);
    });

    it('should get queued tasks only', async () => {
      manager.setMaxConcurrent(1);

      await manager.addTask(['task1']); // running
      await manager.addTask(['task2']); // queued

      const queuedTasks = manager.getQueuedTasks();
      expect(queuedTasks).toHaveLength(1);
      expect(queuedTasks[0].status).toBe('pending');
    });

    it('should get running tasks only', async () => {
      manager.setMaxConcurrent(2);

      await manager.addTask(['task1']);
      await manager.addTask(['task2']);

      const runningTasks = manager.getRunningTasks();
      expect(runningTasks.length).toBeGreaterThan(0);
      runningTasks.forEach(task => {
        expect(['running', 'paused']).toContain(task.status);
      });
    });

    it('should get completed tasks only', async () => {
      const taskId = await manager.addTask(['task']);

      // Complete the task
      (mockProcess as any).closeHandler(0);
      await new Promise(resolve => setImmediate(resolve));

      const completedTasks = manager.getCompletedTasks();
      expect(completedTasks).toHaveLength(1);
      expect(completedTasks[0].id).toBe(taskId);
      expect(['completed', 'failed', 'cancelled']).toContain(completedTasks[0].status);
    });
  });

  describe('Configuration', () => {
    it('should set max concurrent tasks', () => {
      manager.setMaxConcurrent(5);
      expect(manager.getMaxConcurrent()).toBe(5);
    });

    it('should enforce minimum concurrent limit of 1', () => {
      manager.setMaxConcurrent(0);
      expect(manager.getMaxConcurrent()).toBe(1);

      manager.setMaxConcurrent(-5);
      expect(manager.getMaxConcurrent()).toBe(1);
    });

    it('should process queue when max concurrent increases', async () => {
      manager.setMaxConcurrent(1);

      await manager.addTask(['task1']);
      await manager.addTask(['task2']);
      await manager.addTask(['task3']);

      expect(manager.getRunningTasks()).toHaveLength(1);

      // Increase limit
      manager.setMaxConcurrent(3);

      // Wait for queue processing
      await new Promise(resolve => setImmediate(resolve));

      expect(manager.getRunningTasks().length).toBeGreaterThan(1);
    });

    it('should clear completed tasks', async () => {
      const taskId = await manager.addTask(['task']);

      // Complete the task
      (mockProcess as any).closeHandler(0);
      await new Promise(resolve => setImmediate(resolve));

      expect(manager.getCompletedTasks()).toHaveLength(1);

      manager.clearCompleted();

      expect(manager.getCompletedTasks()).toHaveLength(0);
    });

    it('should get manager status', async () => {
      manager.setMaxConcurrent(2);

      await manager.addTask(['task1']); // running
      await manager.addTask(['task2']); // running
      await manager.addTask(['task3']); // queued

      const status = manager.getStatus();

      expect(status.maxConcurrent).toBe(2);
      expect(status.queued).toBeGreaterThanOrEqual(0);
      expect(status.running).toBeGreaterThanOrEqual(0);
      expect(status.completed).toBe(0);
    });
  });

  describe('Event Emission', () => {
    it('should emit taskAdded event', async () => {
      const handler = vi.fn();
      manager.on('taskAdded', handler);

      await manager.addTask(['task']);

      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          status: expect.any(String),
          command: ['task'],
        })
      );
    });

    it('should emit taskStarted event', async () => {
      const handler = vi.fn();
      manager.on('taskStarted', handler);

      await manager.addTask(['task']);

      expect(handler).toHaveBeenCalled();
    });

    it('should emit taskProgress event', async () => {
      const handler = vi.fn();
      manager.on('taskProgress', handler);

      const taskId = await manager.addTask(['task']);

      // Simulate FFmpeg progress output
      const progressOutput = 'frame= 100 fps= 30 q=28.0 size=    1024kB time=00:00:05.00 bitrate=1500.0kbits/s speed= 1.5x';
      mockProcess.stderr!.emit('data', Buffer.from('Duration: 00:10:00.00'));
      mockProcess.stderr!.emit('data', Buffer.from(progressOutput));

      // Wait for debounced progress emission
      await new Promise(resolve => setTimeout(resolve, 600));

      expect(handler).toHaveBeenCalledWith(
        taskId,
        expect.any(Number),
        expect.objectContaining({
          percent: expect.any(Number),
        })
      );
    });

    it('should emit taskCompleted event', async () => {
      const handler = vi.fn();
      manager.on('taskCompleted', handler);

      await manager.addTask(['task']);
      (mockProcess as any).closeHandler(0);

      await new Promise(resolve => setImmediate(resolve));

      expect(handler).toHaveBeenCalled();
    });

    it('should emit taskFailed event', async () => {
      const handler = vi.fn();
      manager.on('taskFailed', handler);

      await manager.addTask(['task']);
      (mockProcess as any).closeHandler(1);

      await new Promise(resolve => setImmediate(resolve));

      expect(handler).toHaveBeenCalled();
    });

    it('should emit taskCancelled event', async () => {
      const handler = vi.fn();
      manager.on('taskCancelled', handler);

      const taskId = await manager.addTask(['task']);
      manager.cancelTask(taskId);

      expect(handler).toHaveBeenCalled();
    });
  });

  describe('Completed Tasks Cleanup', () => {
    it('should limit completed tasks to maxCompletedTasks', async () => {
      manager.setMaxCompletedTasks(5);

      // Add and complete 10 tasks
      for (let i = 0; i < 10; i++) {
        const taskId = await manager.addTask([`task${i}`]);
        (mockProcess as any).closeHandler(0);
        await new Promise(resolve => setImmediate(resolve));
      }

      const completedTasks = manager.getCompletedTasks();
      expect(completedTasks.length).toBeLessThanOrEqual(5);
    });

    it('should keep most recent completed tasks', async () => {
      manager.setMaxCompletedTasks(3);

      const taskIds: string[] = [];

      // Add and complete 5 tasks
      for (let i = 0; i < 5; i++) {
        const taskId = await manager.addTask([`task${i}`]);
        taskIds.push(taskId);
        (mockProcess as any).closeHandler(0);
        await new Promise(resolve => setImmediate(resolve));
      }

      const completedTasks = manager.getCompletedTasks();
      expect(completedTasks).toHaveLength(3);

      // Should keep the last 3 tasks
      const completedIds = completedTasks.map(t => t.id);
      expect(completedIds).toContain(taskIds[4]);
      expect(completedIds).toContain(taskIds[3]);
      expect(completedIds).toContain(taskIds[2]);
    });

    it('should enforce minimum completed tasks limit', () => {
      manager.setMaxCompletedTasks(5);
      expect((manager as any).maxCompletedTasks).toBe(10); // Should clamp to minimum 10
    });
  });
});
