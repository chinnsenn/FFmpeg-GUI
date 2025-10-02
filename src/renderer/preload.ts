import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '../shared/constants';
import type { SystemInfo, FileInfo, AppConfig } from '../shared/types';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // 系统相关
  getSystemInfo: (): Promise<SystemInfo> =>
    ipcRenderer.invoke(IPC_CHANNELS.SYSTEM_GET_INFO),

  getPath: (name: 'home' | 'appData' | 'userData' | 'downloads' | 'documents'): Promise<string> =>
    ipcRenderer.invoke(IPC_CHANNELS.SYSTEM_GET_PATH, name),

  // 文件相关
  selectFile: (filters?: { name: string; extensions: string[] }[]): Promise<string | null> =>
    ipcRenderer.invoke(IPC_CHANNELS.FILE_SELECT, filters),

  getFileInfo: (filePath: string): Promise<FileInfo> =>
    ipcRenderer.invoke(IPC_CHANNELS.FILE_GET_INFO, filePath),

  openFolder: (folderPath: string): Promise<void> =>
    ipcRenderer.invoke(IPC_CHANNELS.FILE_OPEN_FOLDER, folderPath),

  // 配置相关
  getConfig: (): Promise<AppConfig> =>
    ipcRenderer.invoke(IPC_CHANNELS.CONFIG_GET),

  setConfig: (config: Partial<AppConfig>): Promise<void> =>
    ipcRenderer.invoke(IPC_CHANNELS.CONFIG_SET, config),

  // FFmpeg 相关（暂时保留接口定义，实现在后续任务）
  // convertVideo: (options: any): Promise<void> =>
  //   ipcRenderer.invoke(IPC_CHANNELS.FFMPEG_CONVERT, options),

  // cancelConvert: (taskId: string): Promise<void> =>
  //   ipcRenderer.invoke(IPC_CHANNELS.FFMPEG_CANCEL, taskId),

  // onProgress: (callback: (progress: any) => void) => {
  //   ipcRenderer.on(IPC_CHANNELS.FFMPEG_PROGRESS, (_event, progress) => callback(progress));
  // },
});
