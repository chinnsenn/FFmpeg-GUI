/**
 * Task Handlers 测试
 * 覆盖率目标: 90%+
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EventEmitter } from 'events';
import type { ConvertOptions, CompressOptions, Task } from '@shared/types';

// Mock electron
const mockIpcMainHandle = vi.fn();
const mockWebContentsSend = vi.fn();
const mockGetAllWindows = vi.fn();

vi.mock('electron', () => ({
  ipcMain: {
    handle: mockIpcMainHandle,
  },
  BrowserWindow: {
    getAllWindows: mockGetAllWindows,
  },
}));

// Mock FFmpegManager
class MockFFmpegManager extends EventEmitter {
  addTask = vi.fn();
  cancelTask = vi.fn();
  pauseTask = vi.fn();
  resumeTask = vi.fn();
  getTask = vi.fn();
  getAllTasks = vi.fn();
  getQueuedTasks = vi.fn();
  getRunningTasks = vi.fn();
  getCompletedTasks = vi.fn();
  clearCompleted = vi.fn();
  setMaxConcurrent = vi.fn();
  getStatus = vi.fn();
}

let mockManagerInstance: MockFFmpegManager | null = null;

const MockFFmpegManagerConstructor = vi.fn().mockImplementation(() => {
  // Always return the current mockManagerInstance (set in beforeEach)
  return mockManagerInstance;
});

vi.mock('@main/ffmpeg/manager', () => ({
  FFmpegManager: MockFFmpegManagerConstructor,
}));

// Mock FFmpegDetector
const mockDetectorDetect = vi.fn();
vi.mock('@main/ffmpeg/detector', () => ({
  FFmpegDetector: vi.fn(() => ({
    detect: mockDetectorDetect,
  })),
}));

// Mock FFmpegCommandBuilder
const mockBuildConvertCommand = vi.fn();
const mockBuildCompressCommand = vi.fn();
vi.mock('@main/ffmpeg/command-builder', () => ({
  FFmpegCommandBuilder: vi.fn(() => ({
    buildConvertCommand: mockBuildConvertCommand,
    buildCompressCommand: mockBuildCompressCommand,
  })),
}));

// Mock logger
const mockLoggerError = vi.fn();
const mockLoggerWarn = vi.fn();
vi.mock('@main/utils/logger', () => ({
  logger: {
    error: mockLoggerError,
    warn: mockLoggerWarn,
  },
}));

describe('taskHandlers', () => {
  let mockWindow: { webContents: { send: ReturnType<typeof vi.fn> } };

  beforeEach(() => {
    vi.clearAllMocks();

    // Create manager instance before each test
    mockManagerInstance = new MockFFmpegManager();

    // Setup mock window
    mockWindow = {
      webContents: {
        send: mockWebContentsSend,
      },
    };
    mockGetAllWindows.mockReturnValue([mockWindow]);

    // Reset module to clear manager instance
    vi.resetModules();
  });

  describe('registerTaskHandlers', () => {
    it('should register all task handlers', async () => {
      const { registerTaskHandlers } = await import('@main/ipc/taskHandlers');
      registerTaskHandlers();

      const channels = mockIpcMainHandle.mock.calls.map(call => call[0]);
      expect(channels).toContain('task:add');
      expect(channels).toContain('task:addConvert');
      expect(channels).toContain('task:addCompress');
      expect(channels).toContain('task:cancel');
      expect(channels).toContain('task:pause');
      expect(channels).toContain('task:resume');
      expect(channels).toContain('task:get');
      expect(channels).toContain('task:getAll');
      expect(channels).toContain('task:getQueued');
      expect(channels).toContain('task:getRunning');
      expect(channels).toContain('task:getCompleted');
      expect(channels).toContain('task:clearCompleted');
      expect(channels).toContain('task:setMaxConcurrent');
      expect(channels).toContain('task:getStatus');
    });
  });

  describe('TASK_ADD handler', () => {
    it('should add task and return task ID', async () => {
      mockDetectorDetect.mockResolvedValue({
        isInstalled: true,
        path: '/usr/bin/ffmpeg',
      });

      const { registerTaskHandlers } = await import('@main/ipc/taskHandlers');
      registerTaskHandlers();

      const handler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'task:add'
      )?.[1];

      const command = ['ffmpeg', '-i', 'input.mp4', 'output.mp4'];

      // Setup mock before calling handler
      mockManagerInstance!.addTask.mockResolvedValue('task-123');

      const result = await handler(null, command, 1);

      expect(result).toBe('task-123');
    });

    it('should throw error when FFmpeg is not installed', async () => {
      mockDetectorDetect.mockResolvedValue({
        isInstalled: false,
      });

      const { registerTaskHandlers } = await import('@main/ipc/taskHandlers');
      registerTaskHandlers();

      const handler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'task:add'
      )?.[1];

      await expect(handler(null, ['ffmpeg', '-i', 'test.mp4'])).rejects.toThrow(
        'FFmpeg is not installed'
      );
    });
  });

  describe('TASK_ADD_CONVERT handler', () => {
    it('should build convert command and add task', async () => {
      mockDetectorDetect.mockResolvedValue({
        isInstalled: true,
        path: '/usr/bin/ffmpeg',
      });

      
      mockManagerInstance!.addTask.mockResolvedValue('task-456');

      mockBuildConvertCommand.mockReturnValue({
        success: true,
        command: ['ffmpeg', '-i', 'input.mp4', 'output.avi'],
      });

      const { registerTaskHandlers } = await import('@main/ipc/taskHandlers');
      registerTaskHandlers();

      const handler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'task:addConvert'
      )?.[1];

      const options: ConvertOptions = {
        input: '/test/input.mp4',
        output: '/test/output.avi',
        format: 'avi',
      };

      const result = await handler(null, options, 2);

      expect(mockBuildConvertCommand).toHaveBeenCalledWith(options);
      expect(result).toBe('task-456');
    });

    it('should throw error when command build fails', async () => {
      mockDetectorDetect.mockResolvedValue({
        isInstalled: true,
        path: '/usr/bin/ffmpeg',
      });

      mockBuildConvertCommand.mockReturnValue({
        success: false,
        error: 'Invalid input path',
      });

      const { registerTaskHandlers } = await import('@main/ipc/taskHandlers');
      registerTaskHandlers();

      const handler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'task:addConvert'
      )?.[1];

      const options: ConvertOptions = {
        input: '/invalid/path.mp4',
        output: '/test/output.avi',
      };

      await expect(handler(null, options)).rejects.toThrow('Invalid input path');
    });
  });

  describe('TASK_ADD_COMPRESS handler', () => {
    it('should build compress command and add task', async () => {
      mockDetectorDetect.mockResolvedValue({
        isInstalled: true,
        path: '/usr/bin/ffmpeg',
      });

      
      mockManagerInstance!.addTask.mockResolvedValue('task-789');

      mockBuildCompressCommand.mockReturnValue({
        success: true,
        command: ['ffmpeg', '-i', 'input.mp4', '-crf', '23', 'output.mp4'],
      });

      const { registerTaskHandlers } = await import('@main/ipc/taskHandlers');
      registerTaskHandlers();

      const handler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'task:addCompress'
      )?.[1];

      const options: CompressOptions = {
        input: '/test/input.mp4',
        output: '/test/output.mp4',
        mode: 'crf',
        crf: 23,
      };

      const result = await handler(null, options);

      expect(mockBuildCompressCommand).toHaveBeenCalledWith(options);
      expect(result).toBe('task-789');
    });
  });

  describe('TASK_CANCEL handler', () => {
    it('should cancel task successfully', async () => {
      mockDetectorDetect.mockResolvedValue({
        isInstalled: true,
        path: '/usr/bin/ffmpeg',
      });

      
      mockManagerInstance!.addTask.mockResolvedValue('task-123');
      mockManagerInstance!.cancelTask.mockReturnValue(true);

      const { registerTaskHandlers } = await import('@main/ipc/taskHandlers');
      registerTaskHandlers();

      // First add a task to initialize manager
      const addHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'task:add'
      )?.[1];
      await addHandler(null, ['ffmpeg', '-i', 'test.mp4']);

      const cancelHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'task:cancel'
      )?.[1];

      const result = await cancelHandler(null, 'task-123');

      expect(mockManagerInstance!.cancelTask).toHaveBeenCalledWith('task-123');
      expect(result).toBe(true);
    });

    it('should throw error when manager not initialized', async () => {
      const { registerTaskHandlers } = await import('@main/ipc/taskHandlers');
      registerTaskHandlers();

      const handler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'task:cancel'
      )?.[1];

      await expect(handler(null, 'task-123')).rejects.toThrow(
        'FFmpeg manager not initialized'
      );
    });

    it('should throw error when unable to cancel task', async () => {
      mockDetectorDetect.mockResolvedValue({
        isInstalled: true,
        path: '/usr/bin/ffmpeg',
      });

      
      mockManagerInstance!.addTask.mockResolvedValue('task-123');
      mockManagerInstance!.cancelTask.mockReturnValue(false);

      const { registerTaskHandlers } = await import('@main/ipc/taskHandlers');
      registerTaskHandlers();

      const addHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'task:add'
      )?.[1];
      await addHandler(null, ['ffmpeg', '-i', 'test.mp4']);

      const cancelHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'task:cancel'
      )?.[1];

      await expect(cancelHandler(null, 'task-123')).rejects.toThrow(
        'Unable to cancel task task-123'
      );
    });
  });

  describe('TASK_PAUSE handler', () => {
    it('should pause task successfully', async () => {
      mockDetectorDetect.mockResolvedValue({
        isInstalled: true,
        path: '/usr/bin/ffmpeg',
      });

      
      mockManagerInstance!.addTask.mockResolvedValue('task-123');
      mockManagerInstance!.pauseTask.mockReturnValue(true);

      const { registerTaskHandlers } = await import('@main/ipc/taskHandlers');
      registerTaskHandlers();

      const addHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'task:add'
      )?.[1];
      await addHandler(null, ['ffmpeg', '-i', 'test.mp4']);

      const pauseHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'task:pause'
      )?.[1];

      const result = await pauseHandler(null, 'task-123');

      expect(mockManagerInstance!.pauseTask).toHaveBeenCalledWith('task-123');
      expect(result).toBe(true);
    });
  });

  describe('TASK_RESUME handler', () => {
    it('should resume task successfully', async () => {
      mockDetectorDetect.mockResolvedValue({
        isInstalled: true,
        path: '/usr/bin/ffmpeg',
      });

      
      mockManagerInstance!.addTask.mockResolvedValue('task-123');
      mockManagerInstance!.resumeTask.mockReturnValue(true);

      const { registerTaskHandlers } = await import('@main/ipc/taskHandlers');
      registerTaskHandlers();

      const addHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'task:add'
      )?.[1];
      await addHandler(null, ['ffmpeg', '-i', 'test.mp4']);

      const resumeHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'task:resume'
      )?.[1];

      const result = await resumeHandler(null, 'task-123');

      expect(mockManagerInstance!.resumeTask).toHaveBeenCalledWith('task-123');
      expect(result).toBe(true);
    });
  });

  describe('task query handlers', () => {
    it('should get single task', async () => {
      mockDetectorDetect.mockResolvedValue({
        isInstalled: true,
        path: '/usr/bin/ffmpeg',
      });

      const mockTask: Task = {
        id: 'task-123',
        command: ['ffmpeg', '-i', 'test.mp4'],
        status: 'running',
        progress: 50,
        createdAt: new Date().toISOString(),
      };

      
      mockManagerInstance!.addTask.mockResolvedValue('task-123');
      mockManagerInstance!.getTask.mockReturnValue(mockTask);

      const { registerTaskHandlers } = await import('@main/ipc/taskHandlers');
      registerTaskHandlers();

      const addHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'task:add'
      )?.[1];
      await addHandler(null, ['ffmpeg', '-i', 'test.mp4']);

      const getHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'task:get'
      )?.[1];

      const result = await getHandler(null, 'task-123');

      expect(result).toEqual(mockTask);
    });

    it('should get all tasks', async () => {
      mockDetectorDetect.mockResolvedValue({
        isInstalled: true,
        path: '/usr/bin/ffmpeg',
      });

      const mockTasks: Task[] = [
        { id: 'task-1', command: ['ffmpeg'], status: 'completed', progress: 100, createdAt: new Date().toISOString() },
        { id: 'task-2', command: ['ffmpeg'], status: 'running', progress: 50, createdAt: new Date().toISOString() },
      ];

      
      mockManagerInstance!.addTask.mockResolvedValue('task-1');
      mockManagerInstance!.getAllTasks.mockReturnValue(mockTasks);

      const { registerTaskHandlers } = await import('@main/ipc/taskHandlers');
      registerTaskHandlers();

      const addHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'task:add'
      )?.[1];
      await addHandler(null, ['ffmpeg', '-i', 'test.mp4']);

      const getAllHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'task:getAll'
      )?.[1];

      const result = await getAllHandler();

      expect(result).toEqual(mockTasks);
    });

    it('should return empty array when manager not initialized for getAll', async () => {
      const { registerTaskHandlers } = await import('@main/ipc/taskHandlers');
      registerTaskHandlers();

      const handler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'task:getAll'
      )?.[1];

      const result = await handler();

      expect(result).toEqual([]);
    });

    it('should get queued tasks', async () => {
      mockDetectorDetect.mockResolvedValue({
        isInstalled: true,
        path: '/usr/bin/ffmpeg',
      });

      
      mockManagerInstance!.addTask.mockResolvedValue('task-1');
      mockManagerInstance!.getQueuedTasks.mockReturnValue([
        { id: 'task-1', command: ['ffmpeg'], status: 'queued', progress: 0, createdAt: new Date().toISOString() },
      ]);

      const { registerTaskHandlers } = await import('@main/ipc/taskHandlers');
      registerTaskHandlers();

      const addHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'task:add'
      )?.[1];
      await addHandler(null, ['ffmpeg', '-i', 'test.mp4']);

      const handler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'task:getQueued'
      )?.[1];

      const result = await handler();

      expect(result).toHaveLength(1);
    });

    it('should get running tasks', async () => {
      mockDetectorDetect.mockResolvedValue({
        isInstalled: true,
        path: '/usr/bin/ffmpeg',
      });

      
      mockManagerInstance!.addTask.mockResolvedValue('task-1');
      mockManagerInstance!.getRunningTasks.mockReturnValue([
        { id: 'task-1', command: ['ffmpeg'], status: 'running', progress: 50, createdAt: new Date().toISOString() },
      ]);

      const { registerTaskHandlers } = await import('@main/ipc/taskHandlers');
      registerTaskHandlers();

      const addHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'task:add'
      )?.[1];
      await addHandler(null, ['ffmpeg', '-i', 'test.mp4']);

      const handler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'task:getRunning'
      )?.[1];

      const result = await handler();

      expect(result).toHaveLength(1);
    });

    it('should get completed tasks', async () => {
      mockDetectorDetect.mockResolvedValue({
        isInstalled: true,
        path: '/usr/bin/ffmpeg',
      });

      
      mockManagerInstance!.addTask.mockResolvedValue('task-1');
      mockManagerInstance!.getCompletedTasks.mockReturnValue([
        { id: 'task-1', command: ['ffmpeg'], status: 'completed', progress: 100, createdAt: new Date().toISOString() },
      ]);

      const { registerTaskHandlers } = await import('@main/ipc/taskHandlers');
      registerTaskHandlers();

      const addHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'task:add'
      )?.[1];
      await addHandler(null, ['ffmpeg', '-i', 'test.mp4']);

      const handler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'task:getCompleted'
      )?.[1];

      const result = await handler();

      expect(result).toHaveLength(1);
    });
  });

  describe('TASK_CLEAR_COMPLETED handler', () => {
    it('should clear completed tasks', async () => {
      mockDetectorDetect.mockResolvedValue({
        isInstalled: true,
        path: '/usr/bin/ffmpeg',
      });

      
      mockManagerInstance!.addTask.mockResolvedValue('task-1');

      const { registerTaskHandlers } = await import('@main/ipc/taskHandlers');
      registerTaskHandlers();

      const addHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'task:add'
      )?.[1];
      await addHandler(null, ['ffmpeg', '-i', 'test.mp4']);

      const handler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'task:clearCompleted'
      )?.[1];

      await handler();

      expect(mockManagerInstance!.clearCompleted).toHaveBeenCalled();
    });
  });

  describe('TASK_SET_MAX_CONCURRENT handler', () => {
    it('should set max concurrent tasks', async () => {
      mockDetectorDetect.mockResolvedValue({
        isInstalled: true,
        path: '/usr/bin/ffmpeg',
      });

      
      mockManagerInstance!.addTask.mockResolvedValue('task-1');

      const { registerTaskHandlers } = await import('@main/ipc/taskHandlers');
      registerTaskHandlers();

      const addHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'task:add'
      )?.[1];
      await addHandler(null, ['ffmpeg', '-i', 'test.mp4']);

      const handler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'task:setMaxConcurrent'
      )?.[1];

      await handler(null, 5);

      expect(mockManagerInstance!.setMaxConcurrent).toHaveBeenCalledWith(5);
    });
  });

  describe('TASK_GET_STATUS handler', () => {
    it('should get manager status', async () => {
      mockDetectorDetect.mockResolvedValue({
        isInstalled: true,
        path: '/usr/bin/ffmpeg',
      });

      
      mockManagerInstance!.addTask.mockResolvedValue('task-1');
      mockManagerInstance!.getStatus.mockReturnValue({
        queued: 2,
        running: 1,
        completed: 5,
        maxConcurrent: 3,
      });

      const { registerTaskHandlers } = await import('@main/ipc/taskHandlers');
      registerTaskHandlers();

      const addHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'task:add'
      )?.[1];
      await addHandler(null, ['ffmpeg', '-i', 'test.mp4']);

      const handler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'task:getStatus'
      )?.[1];

      const result = await handler();

      expect(result).toEqual({
        queued: 2,
        running: 1,
        completed: 5,
        maxConcurrent: 3,
      });
    });

    it('should return default status when manager not initialized', async () => {
      const { registerTaskHandlers } = await import('@main/ipc/taskHandlers');
      registerTaskHandlers();

      const handler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'task:getStatus'
      )?.[1];

      const result = await handler();

      expect(result).toEqual({
        queued: 0,
        running: 0,
        completed: 0,
        maxConcurrent: 2,
      });
    });
  });

  describe('Manager event forwarding', () => {
    it('should forward taskAdded event to windows', async () => {
      mockDetectorDetect.mockResolvedValue({
        isInstalled: true,
        path: '/usr/bin/ffmpeg',
      });

      
      mockManagerInstance!.addTask.mockImplementation(async () => {
        const task: Task = {
          id: 'task-123',
          command: ['ffmpeg'],
          status: 'queued',
          progress: 0,
          createdAt: new Date().toISOString(),
        };
        mockManagerInstance!.emit('taskAdded', task);
        return 'task-123';
      });

      const { registerTaskHandlers } = await import('@main/ipc/taskHandlers');
      registerTaskHandlers();

      const addHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'task:add'
      )?.[1];
      await addHandler(null, ['ffmpeg', '-i', 'test.mp4']);

      expect(mockWebContentsSend).toHaveBeenCalledWith(
        'task:added',
        expect.objectContaining({ id: 'task-123' })
      );
    });

    it('should forward taskStarted event to windows', async () => {
      mockDetectorDetect.mockResolvedValue({
        isInstalled: true,
        path: '/usr/bin/ffmpeg',
      });

      
      mockManagerInstance!.addTask.mockResolvedValue('task-123');

      const { registerTaskHandlers } = await import('@main/ipc/taskHandlers');
      registerTaskHandlers();

      const addHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'task:add'
      )?.[1];
      await addHandler(null, ['ffmpeg', '-i', 'test.mp4']);

      const task: Task = {
        id: 'task-123',
        command: ['ffmpeg'],
        status: 'running',
        progress: 0,
        createdAt: new Date().toISOString(),
      };

      mockManagerInstance!.emit('taskStarted', task);

      expect(mockWebContentsSend).toHaveBeenCalledWith('task:started', task);
    });

    it('should forward taskProgress event to windows', async () => {
      mockDetectorDetect.mockResolvedValue({
        isInstalled: true,
        path: '/usr/bin/ffmpeg',
      });

      
      mockManagerInstance!.addTask.mockResolvedValue('task-123');

      const { registerTaskHandlers } = await import('@main/ipc/taskHandlers');
      registerTaskHandlers();

      const addHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'task:add'
      )?.[1];
      await addHandler(null, ['ffmpeg', '-i', 'test.mp4']);

      const progressInfo = { frame: 100, fps: 30, speed: 1.5 };
      mockManagerInstance!.emit('taskProgress', 'task-123', 50, progressInfo);

      expect(mockWebContentsSend).toHaveBeenCalledWith('task:progress', {
        taskId: 'task-123',
        progress: 50,
        progressInfo,
      });
    });

    it('should forward taskCompleted event to windows', async () => {
      mockDetectorDetect.mockResolvedValue({
        isInstalled: true,
        path: '/usr/bin/ffmpeg',
      });

      
      mockManagerInstance!.addTask.mockResolvedValue('task-123');

      const { registerTaskHandlers } = await import('@main/ipc/taskHandlers');
      registerTaskHandlers();

      const addHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'task:add'
      )?.[1];
      await addHandler(null, ['ffmpeg', '-i', 'test.mp4']);

      const task: Task = {
        id: 'task-123',
        command: ['ffmpeg'],
        status: 'completed',
        progress: 100,
        createdAt: new Date().toISOString(),
      };

      mockManagerInstance!.emit('taskCompleted', task);

      expect(mockWebContentsSend).toHaveBeenCalledWith('task:completed', task);
    });

    it('should forward taskFailed event to windows', async () => {
      mockDetectorDetect.mockResolvedValue({
        isInstalled: true,
        path: '/usr/bin/ffmpeg',
      });

      
      mockManagerInstance!.addTask.mockResolvedValue('task-123');

      const { registerTaskHandlers } = await import('@main/ipc/taskHandlers');
      registerTaskHandlers();

      const addHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'task:add'
      )?.[1];
      await addHandler(null, ['ffmpeg', '-i', 'test.mp4']);

      const task: Task = {
        id: 'task-123',
        command: ['ffmpeg'],
        status: 'failed',
        progress: 50,
        error: 'Encoding failed',
        createdAt: new Date().toISOString(),
      };

      mockManagerInstance!.emit('taskFailed', task);

      expect(mockWebContentsSend).toHaveBeenCalledWith('task:failed', task);
    });

    it('should forward taskCancelled event to windows', async () => {
      mockDetectorDetect.mockResolvedValue({
        isInstalled: true,
        path: '/usr/bin/ffmpeg',
      });

      
      mockManagerInstance!.addTask.mockResolvedValue('task-123');

      const { registerTaskHandlers } = await import('@main/ipc/taskHandlers');
      registerTaskHandlers();

      const addHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'task:add'
      )?.[1];
      await addHandler(null, ['ffmpeg', '-i', 'test.mp4']);

      const task: Task = {
        id: 'task-123',
        command: ['ffmpeg'],
        status: 'cancelled',
        progress: 30,
        createdAt: new Date().toISOString(),
      };

      mockManagerInstance!.emit('taskCancelled', task);

      expect(mockWebContentsSend).toHaveBeenCalledWith('task:cancelled', task);
    });

    it('should forward taskOutput event to windows', async () => {
      mockDetectorDetect.mockResolvedValue({
        isInstalled: true,
        path: '/usr/bin/ffmpeg',
      });

      
      mockManagerInstance!.addTask.mockResolvedValue('task-123');

      const { registerTaskHandlers } = await import('@main/ipc/taskHandlers');
      registerTaskHandlers();

      const addHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'task:add'
      )?.[1];
      await addHandler(null, ['ffmpeg', '-i', 'test.mp4']);

      mockManagerInstance!.emit('taskOutput', 'task-123', 'Encoding video...');

      expect(mockWebContentsSend).toHaveBeenCalledWith('task:output', {
        taskId: 'task-123',
        output: 'Encoding video...',
      });
    });
  });
});
