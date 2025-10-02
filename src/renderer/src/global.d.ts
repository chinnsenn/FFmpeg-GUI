// Global type declarations for TypeScript

import type { SystemInfo, FileInfo, AppConfig } from '../../shared/types';

/**
 * Electron API ��I
 */
export interface ElectronAPI {
  // ���s
  getSystemInfo: () => Promise<SystemInfo>;
  getPath: (name: 'home' | 'appData' | 'userData' | 'downloads' | 'documents') => Promise<string>;

  // ���s
  selectFile: (filters?: { name: string; extensions: string[] }[]) => Promise<string | null>;
  getFileInfo: (filePath: string) => Promise<FileInfo>;
  openFolder: (folderPath: string) => Promise<void>;

  // Mn�s
  getConfig: () => Promise<AppConfig>;
  setConfig: (config: Partial<AppConfig>) => Promise<void>;
}

/**
 * iU Window ��
 */
declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};
