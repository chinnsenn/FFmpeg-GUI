import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { IPC_CHANNELS } from '@shared/constants';
import { FFmpegManager } from '../ffmpeg/manager';
import { FFmpegDetector } from '../ffmpeg/detector';
import { FFmpegCommandBuilder } from '../ffmpeg/command-builder';
import type { ConvertOptions, CompressOptions } from '@shared/types';

let manager: FFmpegManager | null = null;
const commandBuilder = new FFmpegCommandBuilder();

/**
 * 初始化 FFmpeg 管理器
 */
async function initializeManager(): Promise<FFmpegManager> {
  if (!manager) {
    const detector = new FFmpegDetector();
    const info = await detector.detect();

    if (!info.isInstalled || !info.path) {
      throw new Error('FFmpeg is not installed. Please install FFmpeg first.');
    }

    manager = new FFmpegManager(info.path);

    // 设置事件监听器，将管理器事件转发到渲染进程
    manager.on('taskAdded', (task) => {
      // 发送到所有窗口
      const windows = require('electron').BrowserWindow.getAllWindows();
      windows.forEach((window) => {
        window.webContents.send(IPC_CHANNELS.TASK_ADDED, task);
      });
    });

    manager.on('taskStarted', (task) => {
      const windows = require('electron').BrowserWindow.getAllWindows();
      windows.forEach((window) => {
        window.webContents.send(IPC_CHANNELS.TASK_STARTED, task);
      });
    });

    manager.on('taskProgress', (taskId, progress, progressInfo) => {
      const windows = require('electron').BrowserWindow.getAllWindows();
      windows.forEach((window) => {
        window.webContents.send(IPC_CHANNELS.TASK_PROGRESS, {
          taskId,
          progress,
          progressInfo // 传递完整的进度信息
        });
      });
    });

    manager.on('taskOutput', (taskId, output) => {
      const windows = require('electron').BrowserWindow.getAllWindows();
      windows.forEach((window) => {
        window.webContents.send(IPC_CHANNELS.TASK_OUTPUT, { taskId, output });
      });
    });

    manager.on('taskCompleted', (task) => {
      const windows = require('electron').BrowserWindow.getAllWindows();
      windows.forEach((window) => {
        window.webContents.send(IPC_CHANNELS.TASK_COMPLETED, task);
      });
    });

    manager.on('taskFailed', (task) => {
      const windows = require('electron').BrowserWindow.getAllWindows();
      windows.forEach((window) => {
        window.webContents.send(IPC_CHANNELS.TASK_FAILED, task);
      });
    });

    manager.on('taskCancelled', (task) => {
      const windows = require('electron').BrowserWindow.getAllWindows();
      windows.forEach((window) => {
        window.webContents.send(IPC_CHANNELS.TASK_CANCELLED, task);
      });
    });
  }

  return manager;
}

/**
 * 注册任务管理相关的 IPC 处理器
 */
export function registerTaskHandlers() {
  // 添加任务
  ipcMain.handle(
    IPC_CHANNELS.TASK_ADD,
    async (_event: IpcMainInvokeEvent, command: string[], priority?: number) => {
      const mgr = await initializeManager();
      return await mgr.addTask(command, priority);
    },
  );

  // 添加转换任务
  ipcMain.handle(
    IPC_CHANNELS.TASK_ADD_CONVERT,
    async (_event: IpcMainInvokeEvent, options: ConvertOptions, priority?: number) => {
      const result = commandBuilder.buildConvertCommand(options);

      if (!result.success || !result.command) {
        throw new Error(result.error || 'Failed to build convert command');
      }

      const mgr = await initializeManager();
      return await mgr.addTask(result.command, priority);
    },
  );

  // 添加压缩任务
  ipcMain.handle(
    IPC_CHANNELS.TASK_ADD_COMPRESS,
    async (_event: IpcMainInvokeEvent, options: CompressOptions, priority?: number) => {
      const result = commandBuilder.buildCompressCommand(options);

      if (!result.success || !result.command) {
        throw new Error(result.error || 'Failed to build compress command');
      }

      const mgr = await initializeManager();
      return await mgr.addTask(result.command, priority);
    },
  );

  // 取消任务
  ipcMain.handle(IPC_CHANNELS.TASK_CANCEL, async (_event: IpcMainInvokeEvent, taskId: string) => {
    if (!manager) throw new Error('Manager not initialized');
    return manager.cancelTask(taskId);
  });

  // 暂停任务
  ipcMain.handle(IPC_CHANNELS.TASK_PAUSE, async (_event: IpcMainInvokeEvent, taskId: string) => {
    if (!manager) throw new Error('Manager not initialized');
    return manager.pauseTask(taskId);
  });

  // 恢复任务
  ipcMain.handle(IPC_CHANNELS.TASK_RESUME, async (_event: IpcMainInvokeEvent, taskId: string) => {
    if (!manager) throw new Error('Manager not initialized');
    return manager.resumeTask(taskId);
  });

  // 获取单个任务
  ipcMain.handle(IPC_CHANNELS.TASK_GET, async (_event: IpcMainInvokeEvent, taskId: string) => {
    if (!manager) throw new Error('Manager not initialized');
    return manager.getTask(taskId);
  });

  // 获取所有任务
  ipcMain.handle(IPC_CHANNELS.TASK_GET_ALL, async () => {
    if (!manager) return [];
    return manager.getAllTasks();
  });

  // 获取队列中的任务
  ipcMain.handle(IPC_CHANNELS.TASK_GET_QUEUED, async () => {
    if (!manager) return [];
    return manager.getQueuedTasks();
  });

  // 获取正在运行的任务
  ipcMain.handle(IPC_CHANNELS.TASK_GET_RUNNING, async () => {
    if (!manager) return [];
    return manager.getRunningTasks();
  });

  // 获取已完成的任务
  ipcMain.handle(IPC_CHANNELS.TASK_GET_COMPLETED, async () => {
    if (!manager) return [];
    return manager.getCompletedTasks();
  });

  // 清除已完成的任务
  ipcMain.handle(IPC_CHANNELS.TASK_CLEAR_COMPLETED, async () => {
    if (!manager) throw new Error('Manager not initialized');
    manager.clearCompleted();
  });

  // 设置最大并发数
  ipcMain.handle(
    IPC_CHANNELS.TASK_SET_MAX_CONCURRENT,
    async (_event: IpcMainInvokeEvent, max: number) => {
      if (!manager) throw new Error('Manager not initialized');
      manager.setMaxConcurrent(max);
    },
  );

  // 获取管理器状态
  ipcMain.handle(IPC_CHANNELS.TASK_GET_STATUS, async () => {
    if (!manager) {
      return {
        queued: 0,
        running: 0,
        completed: 0,
        maxConcurrent: 2,
      };
    }
    return manager.getStatus();
  });
}
