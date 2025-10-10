import { contextBridge, ipcRenderer, IpcRendererEvent, webUtils } from 'electron';
import { IPC_CHANNELS } from '../shared/constants';
import type {
  SystemInfo,
  FileInfo,
  AppConfig,
  MediaFileInfo,
  ConvertOptions,
  CompressOptions,
  FFmpegInfo,
  Task,
  TaskManagerStatus,
  IPCEventPayloads,
} from '../shared/types';

// Whitelist of allowed IPC event channels for security
const ALLOWED_EVENT_CHANNELS: readonly (keyof IPCEventPayloads)[] = [
  IPC_CHANNELS.TASK_ADDED,
  IPC_CHANNELS.TASK_STARTED,
  IPC_CHANNELS.TASK_PROGRESS,
  IPC_CHANNELS.TASK_OUTPUT,
  IPC_CHANNELS.TASK_COMPLETED,
  IPC_CHANNELS.TASK_FAILED,
  IPC_CHANNELS.TASK_CANCELLED,
] as const;

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

  selectDirectory: (): Promise<string | null> =>
    ipcRenderer.invoke(IPC_CHANNELS.FILE_SELECT_DIRECTORY),

  getFileInfo: (filePath: string): Promise<FileInfo> =>
    ipcRenderer.invoke(IPC_CHANNELS.FILE_GET_INFO, filePath),

  openFolder: (folderPath: string): Promise<void> =>
    ipcRenderer.invoke(IPC_CHANNELS.FILE_OPEN_FOLDER, folderPath),

  // 获取拖拽文件的真实路径 (Electron webUtils)
  getPathForFile: (file: File): string => webUtils.getPathForFile(file),

  // 配置相关
  getConfig: (): Promise<AppConfig> => ipcRenderer.invoke(IPC_CHANNELS.CONFIG_GET),

  setConfig: (config: Partial<AppConfig>): Promise<void> =>
    ipcRenderer.invoke(IPC_CHANNELS.CONFIG_SET, config),

  // FFmpeg 相关
  ffmpeg: {
    detect: (): Promise<FFmpegInfo> => ipcRenderer.invoke(IPC_CHANNELS.FFMPEG_DETECT),

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

    get: (taskId: string): Promise<Task | undefined> => ipcRenderer.invoke(IPC_CHANNELS.TASK_GET, taskId),

    getAll: (): Promise<Task[]> => ipcRenderer.invoke(IPC_CHANNELS.TASK_GET_ALL),

    getQueued: (): Promise<Task[]> => ipcRenderer.invoke(IPC_CHANNELS.TASK_GET_QUEUED),

    getRunning: (): Promise<Task[]> => ipcRenderer.invoke(IPC_CHANNELS.TASK_GET_RUNNING),

    getCompleted: (): Promise<Task[]> => ipcRenderer.invoke(IPC_CHANNELS.TASK_GET_COMPLETED),

    clearCompleted: (): Promise<void> => ipcRenderer.invoke(IPC_CHANNELS.TASK_CLEAR_COMPLETED),

    setMaxConcurrent: (max: number): Promise<void> =>
      ipcRenderer.invoke(IPC_CHANNELS.TASK_SET_MAX_CONCURRENT, max),

    getStatus: (): Promise<TaskManagerStatus> => ipcRenderer.invoke(IPC_CHANNELS.TASK_GET_STATUS),
  },

  // 事件监听 - 类型安全且安全的事件订阅
  on: <K extends keyof IPCEventPayloads>(
    channel: K,
    callback: (payload: IPCEventPayloads[K]) => void,
  ): (() => void) => {
    // 安全检查：只允许白名单中的事件通道
    if (!ALLOWED_EVENT_CHANNELS.includes(channel)) {
      throw new Error(`Unauthorized IPC channel: ${channel}`);
    }

    // 创建包装的回调函数，保持引用以便后续移除
    const wrappedCallback = (_event: IpcRendererEvent, payload: IPCEventPayloads[K]) => {
      callback(payload);
    };

    ipcRenderer.on(channel, wrappedCallback);

    // 返回清理函数，只移除这个特定的监听器
    return () => {
      ipcRenderer.removeListener(channel, wrappedCallback);
    };
  },
});
