import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '../shared/constants';
import type { SystemInfo, FileInfo, AppConfig, MediaFileInfo, ConvertOptions, CompressOptions } from '../shared/types';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // 系统相关
  getSystemInfo: (): Promise<SystemInfo> => ipcRenderer.invoke(IPC_CHANNELS.SYSTEM_GET_INFO),

  getPath: (
    name: 'home' | 'appData' | 'userData' | 'downloads' | 'documents',
  ): Promise<string> => ipcRenderer.invoke(IPC_CHANNELS.SYSTEM_GET_PATH, name),

  // 文件相关
  selectFile: (filters?: { name: string; extensions: string[] }[]): Promise<string | null> =>
    ipcRenderer.invoke(IPC_CHANNELS.FILE_SELECT, filters),

  selectFiles: (filters?: { name: string; extensions: string[] }[]): Promise<FileInfo[]> =>
    ipcRenderer.invoke(IPC_CHANNELS.FILE_SELECT_MULTIPLE, filters),

  getFileInfo: (filePath: string): Promise<FileInfo> =>
    ipcRenderer.invoke(IPC_CHANNELS.FILE_GET_INFO, filePath),

  openFolder: (folderPath: string): Promise<void> =>
    ipcRenderer.invoke(IPC_CHANNELS.FILE_OPEN_FOLDER, folderPath),

  // 配置相关
  getConfig: (): Promise<AppConfig> => ipcRenderer.invoke(IPC_CHANNELS.CONFIG_GET),

  setConfig: (config: Partial<AppConfig>): Promise<void> =>
    ipcRenderer.invoke(IPC_CHANNELS.CONFIG_SET, config),

  // FFmpeg 相关
  ffmpeg: {
    detect: (): Promise<any> => ipcRenderer.invoke(IPC_CHANNELS.FFMPEG_DETECT),

    download: (): Promise<void> => ipcRenderer.invoke(IPC_CHANNELS.FFMPEG_DOWNLOAD),

    getMediaInfo: (filePath: string): Promise<MediaFileInfo> =>
      ipcRenderer.invoke(IPC_CHANNELS.FFPROBE_GET_MEDIA_INFO, filePath),
  },

  // 任务管理相关
  task: {
    add: (command: string[], priority?: number): Promise<string> =>
      ipcRenderer.invoke(IPC_CHANNELS.TASK_ADD, command, priority),

    addConvert: (options: ConvertOptions, priority?: number): Promise<string> =>
      ipcRenderer.invoke(IPC_CHANNELS.TASK_ADD_CONVERT, options, priority),

    addCompress: (options: CompressOptions, priority?: number): Promise<string> =>
      ipcRenderer.invoke(IPC_CHANNELS.TASK_ADD_COMPRESS, options, priority),

    cancel: (taskId: string): Promise<boolean> =>
      ipcRenderer.invoke(IPC_CHANNELS.TASK_CANCEL, taskId),

    pause: (taskId: string): Promise<boolean> =>
      ipcRenderer.invoke(IPC_CHANNELS.TASK_PAUSE, taskId),

    resume: (taskId: string): Promise<boolean> =>
      ipcRenderer.invoke(IPC_CHANNELS.TASK_RESUME, taskId),

    get: (taskId: string): Promise<any> => ipcRenderer.invoke(IPC_CHANNELS.TASK_GET, taskId),

    getAll: (): Promise<any[]> => ipcRenderer.invoke(IPC_CHANNELS.TASK_GET_ALL),

    getQueued: (): Promise<any[]> => ipcRenderer.invoke(IPC_CHANNELS.TASK_GET_QUEUED),

    getRunning: (): Promise<any[]> => ipcRenderer.invoke(IPC_CHANNELS.TASK_GET_RUNNING),

    getCompleted: (): Promise<any[]> => ipcRenderer.invoke(IPC_CHANNELS.TASK_GET_COMPLETED),

    clearCompleted: (): Promise<void> => ipcRenderer.invoke(IPC_CHANNELS.TASK_CLEAR_COMPLETED),

    setMaxConcurrent: (max: number): Promise<void> =>
      ipcRenderer.invoke(IPC_CHANNELS.TASK_SET_MAX_CONCURRENT, max),

    getStatus: (): Promise<any> => ipcRenderer.invoke(IPC_CHANNELS.TASK_GET_STATUS),
  },

  // 事件监听
  on: (channel: string, callback: (...args: any[]) => void) => {
    ipcRenderer.on(channel, (_event, ...args) => callback(...args));
    return () => ipcRenderer.removeAllListeners(channel);
  },
});
