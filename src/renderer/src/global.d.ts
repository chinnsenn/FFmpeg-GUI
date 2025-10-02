// Global type declarations for TypeScript

import type { SystemInfo, FileInfo, AppConfig } from '../../shared/types';

/**
 * Electron API ¥ãšI
 */
export interface ElectronAPI {
  // ûßøs
  getSystemInfo: () => Promise<SystemInfo>;
  getPath: (name: 'home' | 'appData' | 'userData' | 'downloads' | 'documents') => Promise<string>;

  // ‡öøs
  selectFile: (filters?: { name: string; extensions: string[] }[]) => Promise<string | null>;
  getFileInfo: (filePath: string) => Promise<FileInfo>;
  openFolder: (folderPath: string) => Promise<void>;

  // Mnøs
  getConfig: () => Promise<AppConfig>;
  setConfig: (config: Partial<AppConfig>) => Promise<void>;
}

/**
 * iU Window ¥ã
 */
declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};
