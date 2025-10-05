/**
 * Config Handlers 测试
 * 覆盖率目标: 90%+
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { AppConfig } from '@shared/types';

// Mock fs/promises
const mockReadFile = vi.fn();
const mockWriteFile = vi.fn();
const mockMkdir = vi.fn();

vi.mock('fs/promises', () => ({
  readFile: mockReadFile,
  writeFile: mockWriteFile,
  mkdir: mockMkdir,
}));

// Mock electron
const mockIpcMainHandle = vi.fn();
vi.mock('electron', () => ({
  ipcMain: {
    handle: mockIpcMainHandle,
  },
  app: {
    getPath: vi.fn(() => '/mock/userData'),
  },
}));

// Import after mocking
const { registerConfigHandlers } = await import('@main/ipc/configHandlers');

describe('configHandlers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMkdir.mockResolvedValue(undefined);
  });

  describe('registerConfigHandlers', () => {
    it('should register CONFIG_GET handler', () => {
      registerConfigHandlers();

      expect(mockIpcMainHandle).toHaveBeenCalledWith(
        'config:get',
        expect.any(Function)
      );
    });

    it('should register CONFIG_SET handler', () => {
      registerConfigHandlers();

      expect(mockIpcMainHandle).toHaveBeenCalledWith(
        'config:set',
        expect.any(Function)
      );
    });
  });

  describe('CONFIG_GET handler', () => {
    it('should return config from file', async () => {
      const mockConfig: AppConfig = {
        theme: 'dark',
        language: 'en-US',
        maxConcurrentTasks: 5,
      };

      mockReadFile.mockResolvedValue(JSON.stringify(mockConfig));

      registerConfigHandlers();

      // Get the handler function
      const getHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'config:get'
      )?.[1];

      const result = await getHandler();

      expect(result).toEqual(mockConfig);
      expect(mockReadFile).toHaveBeenCalledWith(expect.stringContaining('config.json'), 'utf-8');
    });

    it('should return default config when file does not exist', async () => {
      mockReadFile.mockRejectedValue(new Error('ENOENT'));

      registerConfigHandlers();

      const getHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'config:get'
      )?.[1];

      const result = await getHandler();

      expect(result).toEqual({
        theme: 'system',
        language: 'zh-CN',
        maxConcurrentTasks: 3,
      });
    });

    it('should return default config when JSON parse fails', async () => {
      mockReadFile.mockResolvedValue('invalid json');

      registerConfigHandlers();

      const getHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'config:get'
      )?.[1];

      const result = await getHandler();

      expect(result).toEqual({
        theme: 'system',
        language: 'zh-CN',
        maxConcurrentTasks: 3,
      });
    });

    it('should merge config with defaults', async () => {
      const partialConfig = {
        theme: 'dark',
      };

      mockReadFile.mockResolvedValue(JSON.stringify(partialConfig));

      registerConfigHandlers();

      const getHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'config:get'
      )?.[1];

      const result = await getHandler();

      expect(result).toEqual({
        theme: 'dark',
        language: 'zh-CN',
        maxConcurrentTasks: 3,
      });
    });
  });

  describe('CONFIG_SET handler', () => {
    it('should save config to file', async () => {
      mockReadFile.mockResolvedValue(
        JSON.stringify({
          theme: 'system',
          language: 'zh-CN',
          maxConcurrentTasks: 3,
        })
      );
      mockWriteFile.mockResolvedValue(undefined);

      registerConfigHandlers();

      const setHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'config:set'
      )?.[1];

      const newConfig: Partial<AppConfig> = {
        theme: 'dark',
      };

      await setHandler(null, newConfig);

      expect(mockWriteFile).toHaveBeenCalledWith(
        expect.stringContaining('config.json'),
        expect.stringContaining('"theme": "dark"'),
        'utf-8'
      );
    });

    it('should merge new config with existing config', async () => {
      const existingConfig: AppConfig = {
        theme: 'light',
        language: 'zh-CN',
        maxConcurrentTasks: 3,
      };

      mockReadFile.mockResolvedValue(JSON.stringify(existingConfig));
      mockWriteFile.mockResolvedValue(undefined);

      registerConfigHandlers();

      const setHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'config:set'
      )?.[1];

      const updates: Partial<AppConfig> = {
        maxConcurrentTasks: 5,
      };

      await setHandler(null, updates);

      const savedConfig = JSON.parse(mockWriteFile.mock.calls[0][1]);
      expect(savedConfig).toEqual({
        theme: 'light',
        language: 'zh-CN',
        maxConcurrentTasks: 5,
      });
    });

    it('should create userData directory if it does not exist', async () => {
      mockReadFile.mockResolvedValue(JSON.stringify({}));
      mockWriteFile.mockResolvedValue(undefined);

      registerConfigHandlers();

      const setHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'config:set'
      )?.[1];

      await setHandler(null, { theme: 'dark' });

      expect(mockMkdir).toHaveBeenCalledWith('/mock/userData', { recursive: true });
    });

    it('should format JSON with 2 spaces', async () => {
      mockReadFile.mockResolvedValue(JSON.stringify({}));
      mockWriteFile.mockResolvedValue(undefined);

      registerConfigHandlers();

      const setHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'config:set'
      )?.[1];

      const config: Partial<AppConfig> = {
        theme: 'dark',
        language: 'en-US',
      };

      await setHandler(null, config);

      const savedContent = mockWriteFile.mock.calls[0][1];
      expect(savedContent).toContain('  "theme"');
      expect(savedContent).toContain('  "language"');
    });

    it('should handle empty update object', async () => {
      const existingConfig: AppConfig = {
        theme: 'light',
        language: 'zh-CN',
        maxConcurrentTasks: 3,
      };

      mockReadFile.mockResolvedValue(JSON.stringify(existingConfig));
      mockWriteFile.mockResolvedValue(undefined);

      registerConfigHandlers();

      const setHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'config:set'
      )?.[1];

      await setHandler(null, {});

      const savedConfig = JSON.parse(mockWriteFile.mock.calls[0][1]);
      expect(savedConfig).toEqual(existingConfig);
    });

    it('should merge with defaults when existing config is empty', async () => {
      mockReadFile.mockRejectedValue(new Error('ENOENT'));
      mockWriteFile.mockResolvedValue(undefined);

      registerConfigHandlers();

      const setHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'config:set'
      )?.[1];

      await setHandler(null, { theme: 'dark' });

      const savedConfig = JSON.parse(mockWriteFile.mock.calls[0][1]);
      expect(savedConfig).toEqual({
        theme: 'dark',
        language: 'zh-CN',
        maxConcurrentTasks: 3,
      });
    });
  });
});
