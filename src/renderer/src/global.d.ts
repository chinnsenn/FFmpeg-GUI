// Global type declarations for TypeScript

import type {
  SystemInfo,
  FileInfo,
  AppConfig,
  Task,
  TaskManagerStatus,
  MediaFileInfo,
  ConvertOptions,
  CompressOptions,
  IPCEventPayloads,
  FFmpegInfo,
} from '../../shared/types';

// Re-export FFmpegInfo for use in other files
export type { FFmpegInfo } from '../../shared/types';

/**
 * Electron API 接口定义
 */
export interface ElectronAPI {
  // 系统相关
  getSystemInfo: () => Promise<SystemInfo>;
  getPath: (name: 'home' | 'appData' | 'userData' | 'downloads' | 'documents') => Promise<string>;

  // 文件相关
  selectFile: (filters?: { name: string; extensions: string[] }[]) => Promise<string | null>;
  selectFiles: (filters?: { name: string; extensions: string[] }[]) => Promise<FileInfo[]>;
  selectDirectory: () => Promise<string | null>;
  getFileInfo: (filePath: string) => Promise<FileInfo>;
  openFolder: (folderPath: string) => Promise<void>;

  // 配置相关
  getConfig: () => Promise<AppConfig>;
  setConfig: (config: Partial<AppConfig>) => Promise<void>;

  // FFmpeg 相关
  ffmpeg: {
    detect: () => Promise<FFmpegInfo>;
    download: () => Promise<void>;
    getMediaInfo: (filePath: string) => Promise<MediaFileInfo>;
  };

  // 任务管理相关
  task: {
    add: (command: string[], priority?: number) => Promise<string>;
    addConvert: (options: ConvertOptions, priority?: number) => Promise<string>;
    addCompress: (options: CompressOptions, priority?: number) => Promise<string>;
    cancel: (taskId: string) => Promise<boolean>;
    pause: (taskId: string) => Promise<boolean>;
    resume: (taskId: string) => Promise<boolean>;
    get: (taskId: string) => Promise<Task | undefined>;
    getAll: () => Promise<Task[]>;
    getQueued: () => Promise<Task[]>;
    getRunning: () => Promise<Task[]>;
    getCompleted: () => Promise<Task[]>;
    clearCompleted: () => Promise<void>;
    setMaxConcurrent: (max: number) => Promise<void>;
    getStatus: () => Promise<TaskManagerStatus>;
  };

  // 事件监听
  on: <K extends keyof IPCEventPayloads>(
    channel: K,
    callback: (payload: IPCEventPayloads[K]) => void,
  ) => () => void;
}

/**
 * 扩展 Window 对象
 */
declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }

  /**
   * 扩展 File 接口以支持 Electron 的 path 属性
   */
  interface File {
    path?: string;
  }
}

export {};
