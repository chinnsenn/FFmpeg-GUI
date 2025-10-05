/**
 * Main 进程测试环境设置
 */
import { vi } from 'vitest';

// Mock Electron
vi.mock('electron', () => ({
  app: {
    getPath: vi.fn((name: string) => {
      const paths: Record<string, string> = {
        home: '/mock/home',
        userData: '/mock/userData',
        temp: '/mock/temp',
        appData: '/mock/appData',
      };
      return paths[name] || `/mock/${name}`;
    }),
    getVersion: vi.fn(() => '1.0.0'),
    getName: vi.fn(() => 'FFmpeg GUI'),
    isPackaged: false,
  },
  ipcMain: {
    handle: vi.fn(),
    on: vi.fn(),
    removeHandler: vi.fn(),
  },
  dialog: {
    showOpenDialog: vi.fn(),
    showSaveDialog: vi.fn(),
    showMessageBox: vi.fn(),
  },
  BrowserWindow: vi.fn(),
}));

// Mock child_process
vi.mock('child_process', () => ({
  spawn: vi.fn(),
  execFile: vi.fn((cmd: string, args: string[], callback: (error: Error | null, result: { stdout: string; stderr: string }) => void) => {
    // Default mock implementation
    callback(null, { stdout: '', stderr: '' });
  }),
  exec: vi.fn(),
}));

// Mock fs/promises
vi.mock('fs/promises', () => ({
  readFile: vi.fn(),
  writeFile: vi.fn(),
  mkdir: vi.fn(),
  access: vi.fn(),
  stat: vi.fn(),
  unlink: vi.fn(),
}));
