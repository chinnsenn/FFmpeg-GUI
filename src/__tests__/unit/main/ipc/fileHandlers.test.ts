/**
 * File Handlers 测试
 * 覆盖率目标: 90%+
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock electron
const mockIpcMainHandle = vi.fn();
const mockDialogShowOpenDialog = vi.fn();
const mockShellOpenPath = vi.fn();

vi.mock('electron', () => ({
  ipcMain: {
    handle: mockIpcMainHandle,
  },
  dialog: {
    showOpenDialog: mockDialogShowOpenDialog,
  },
  shell: {
    openPath: mockShellOpenPath,
  },
}));

// Mock fs/promises
const mockStat = vi.fn();
vi.mock('fs/promises', () => ({
  stat: mockStat,
}));

// Mock path
vi.mock('path', () => ({
  extname: vi.fn((path: string) => {
    const parts = path.split('.');
    return parts.length > 1 ? '.' + parts[parts.length - 1] : '';
  }),
  basename: vi.fn((path: string) => {
    const parts = path.split('/');
    return parts[parts.length - 1];
  }),
}));

// Import after mocking
const { registerFileHandlers } = await import('@main/ipc/fileHandlers');

describe('fileHandlers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('registerFileHandlers', () => {
    it('should register FILE_SELECT handler', () => {
      registerFileHandlers();

      expect(mockIpcMainHandle).toHaveBeenCalledWith(
        'file:select',
        expect.any(Function)
      );
    });

    it('should register FILE_SELECT_MULTIPLE handler', () => {
      registerFileHandlers();

      expect(mockIpcMainHandle).toHaveBeenCalledWith(
        'file:selectMultiple',
        expect.any(Function)
      );
    });

    it('should register FILE_SELECT_DIRECTORY handler', () => {
      registerFileHandlers();

      expect(mockIpcMainHandle).toHaveBeenCalledWith(
        'file:selectDirectory',
        expect.any(Function)
      );
    });

    it('should register FILE_GET_INFO handler', () => {
      registerFileHandlers();

      expect(mockIpcMainHandle).toHaveBeenCalledWith(
        'file:getInfo',
        expect.any(Function)
      );
    });

    it('should register FILE_OPEN_FOLDER handler', () => {
      registerFileHandlers();

      expect(mockIpcMainHandle).toHaveBeenCalledWith(
        'file:openFolder',
        expect.any(Function)
      );
    });
  });

  describe('FILE_SELECT handler', () => {
    it('should return selected file path', async () => {
      mockDialogShowOpenDialog.mockResolvedValue({
        canceled: false,
        filePaths: ['/mock/video.mp4'],
      });

      registerFileHandlers();

      const selectHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'file:select'
      )?.[1];

      const result = await selectHandler();

      expect(result).toBe('/mock/video.mp4');
      expect(mockDialogShowOpenDialog).toHaveBeenCalledWith({
        properties: ['openFile'],
        filters: [
          { name: 'Video Files', extensions: ['mp4', 'avi', 'mkv', 'mov', 'flv', 'wmv'] },
          { name: 'All Files', extensions: ['*'] },
        ],
      });
    });

    it('should return null when user cancels', async () => {
      mockDialogShowOpenDialog.mockResolvedValue({
        canceled: true,
        filePaths: [],
      });

      registerFileHandlers();

      const selectHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'file:select'
      )?.[1];

      const result = await selectHandler();

      expect(result).toBeNull();
    });

    it('should return null when no file selected', async () => {
      mockDialogShowOpenDialog.mockResolvedValue({
        canceled: false,
        filePaths: [],
      });

      registerFileHandlers();

      const selectHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'file:select'
      )?.[1];

      const result = await selectHandler();

      expect(result).toBeNull();
    });

    it('should use custom filters when provided', async () => {
      mockDialogShowOpenDialog.mockResolvedValue({
        canceled: false,
        filePaths: ['/mock/audio.mp3'],
      });

      registerFileHandlers();

      const selectHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'file:select'
      )?.[1];

      const customFilters = [
        { name: 'Audio Files', extensions: ['mp3', 'wav'] },
      ];

      await selectHandler(null, customFilters);

      expect(mockDialogShowOpenDialog).toHaveBeenCalledWith({
        properties: ['openFile'],
        filters: customFilters,
      });
    });
  });

  describe('FILE_SELECT_MULTIPLE handler', () => {
    it('should return array of FileInfo objects', async () => {
      mockDialogShowOpenDialog.mockResolvedValue({
        canceled: false,
        filePaths: ['/mock/video1.mp4', '/mock/video2.avi'],
      });

      mockStat.mockResolvedValueOnce({ size: 1024000 });
      mockStat.mockResolvedValueOnce({ size: 2048000 });

      registerFileHandlers();

      const selectMultipleHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'file:selectMultiple'
      )?.[1];

      const result = await selectMultipleHandler();

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        name: 'video1.mp4',
        path: '/mock/video1.mp4',
        size: 1024000,
        ext: '.mp4',
      });
      expect(result[1]).toEqual({
        name: 'video2.avi',
        path: '/mock/video2.avi',
        size: 2048000,
        ext: '.avi',
      });
    });

    it('should return empty array when user cancels', async () => {
      mockDialogShowOpenDialog.mockResolvedValue({
        canceled: true,
        filePaths: [],
      });

      registerFileHandlers();

      const selectMultipleHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'file:selectMultiple'
      )?.[1];

      const result = await selectMultipleHandler();

      expect(result).toEqual([]);
    });

    it('should return empty array when no files selected', async () => {
      mockDialogShowOpenDialog.mockResolvedValue({
        canceled: false,
        filePaths: [],
      });

      registerFileHandlers();

      const selectMultipleHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'file:selectMultiple'
      )?.[1];

      const result = await selectMultipleHandler();

      expect(result).toEqual([]);
    });

    it('should use default filters for video and audio files', async () => {
      mockDialogShowOpenDialog.mockResolvedValue({
        canceled: false,
        filePaths: ['/mock/file.mp4'],
      });

      mockStat.mockResolvedValue({ size: 1024 });

      registerFileHandlers();

      const selectMultipleHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'file:selectMultiple'
      )?.[1];

      await selectMultipleHandler();

      expect(mockDialogShowOpenDialog).toHaveBeenCalledWith({
        properties: ['openFile', 'multiSelections'],
        filters: [
          { name: 'Video Files', extensions: ['mp4', 'avi', 'mkv', 'mov', 'flv', 'wmv', 'webm'] },
          { name: 'Audio Files', extensions: ['mp3', 'wav', 'aac', 'flac', 'm4a', 'ogg'] },
          { name: 'All Files', extensions: ['*'] },
        ],
      });
    });

    it('should use custom filters when provided', async () => {
      mockDialogShowOpenDialog.mockResolvedValue({
        canceled: false,
        filePaths: ['/mock/file.txt'],
      });

      mockStat.mockResolvedValue({ size: 1024 });

      registerFileHandlers();

      const selectMultipleHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'file:selectMultiple'
      )?.[1];

      const customFilters = [
        { name: 'Text Files', extensions: ['txt', 'md'] },
      ];

      await selectMultipleHandler(null, customFilters);

      expect(mockDialogShowOpenDialog).toHaveBeenCalledWith({
        properties: ['openFile', 'multiSelections'],
        filters: customFilters,
      });
    });

    it('should handle files without extension', async () => {
      mockDialogShowOpenDialog.mockResolvedValue({
        canceled: false,
        filePaths: ['/mock/README'],
      });

      mockStat.mockResolvedValue({ size: 512 });

      registerFileHandlers();

      const selectMultipleHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'file:selectMultiple'
      )?.[1];

      const result = await selectMultipleHandler();

      expect(result[0]).toEqual({
        name: 'README',
        path: '/mock/README',
        size: 512,
        ext: '',
      });
    });
  });

  describe('FILE_SELECT_DIRECTORY handler', () => {
    it('should return selected directory path', async () => {
      mockDialogShowOpenDialog.mockResolvedValue({
        canceled: false,
        filePaths: ['/mock/output'],
      });

      registerFileHandlers();

      const selectDirectoryHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'file:selectDirectory'
      )?.[1];

      const result = await selectDirectoryHandler();

      expect(result).toBe('/mock/output');
      expect(mockDialogShowOpenDialog).toHaveBeenCalledWith({
        properties: ['openDirectory', 'createDirectory'],
      });
    });

    it('should return null when user cancels', async () => {
      mockDialogShowOpenDialog.mockResolvedValue({
        canceled: true,
        filePaths: [],
      });

      registerFileHandlers();

      const selectDirectoryHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'file:selectDirectory'
      )?.[1];

      const result = await selectDirectoryHandler();

      expect(result).toBeNull();
    });

    it('should return null when no directory selected', async () => {
      mockDialogShowOpenDialog.mockResolvedValue({
        canceled: false,
        filePaths: [],
      });

      registerFileHandlers();

      const selectDirectoryHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'file:selectDirectory'
      )?.[1];

      const result = await selectDirectoryHandler();

      expect(result).toBeNull();
    });
  });

  describe('FILE_GET_INFO handler', () => {
    it('should return file info for given path', async () => {
      mockStat.mockResolvedValue({ size: 4096000 });

      registerFileHandlers();

      const getInfoHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'file:getInfo'
      )?.[1];

      const result = await getInfoHandler(null, '/mock/document.pdf');

      expect(result).toEqual({
        name: 'document.pdf',
        path: '/mock/document.pdf',
        size: 4096000,
        ext: '.pdf',
      });
      expect(mockStat).toHaveBeenCalledWith('/mock/document.pdf');
    });

    it('should handle files in nested directories', async () => {
      mockStat.mockResolvedValue({ size: 2048 });

      registerFileHandlers();

      const getInfoHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'file:getInfo'
      )?.[1];

      const result = await getInfoHandler(null, '/mock/dir1/dir2/file.txt');

      expect(result).toEqual({
        name: 'file.txt',
        path: '/mock/dir1/dir2/file.txt',
        size: 2048,
        ext: '.txt',
      });
    });

    it('should handle files without extension', async () => {
      mockStat.mockResolvedValue({ size: 1024 });

      registerFileHandlers();

      const getInfoHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'file:getInfo'
      )?.[1];

      const result = await getInfoHandler(null, '/mock/Makefile');

      expect(result).toEqual({
        name: 'Makefile',
        path: '/mock/Makefile',
        size: 1024,
        ext: '',
      });
    });

    it('should propagate stat errors', async () => {
      mockStat.mockRejectedValue(new Error('File not found'));

      registerFileHandlers();

      const getInfoHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'file:getInfo'
      )?.[1];

      await expect(
        getInfoHandler(null, '/mock/nonexistent.txt')
      ).rejects.toThrow('File not found');
    });
  });

  describe('FILE_OPEN_FOLDER handler', () => {
    it('should open folder in system file explorer', async () => {
      mockShellOpenPath.mockResolvedValue('');

      registerFileHandlers();

      const openFolderHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'file:openFolder'
      )?.[1];

      await openFolderHandler(null, '/mock/output');

      expect(mockShellOpenPath).toHaveBeenCalledWith('/mock/output');
    });

    it('should handle nested directory paths', async () => {
      mockShellOpenPath.mockResolvedValue('');

      registerFileHandlers();

      const openFolderHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'file:openFolder'
      )?.[1];

      await openFolderHandler(null, '/mock/parent/child/grandchild');

      expect(mockShellOpenPath).toHaveBeenCalledWith('/mock/parent/child/grandchild');
    });

    it('should propagate shell errors', async () => {
      mockShellOpenPath.mockRejectedValue(new Error('Failed to open path'));

      registerFileHandlers();

      const openFolderHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'file:openFolder'
      )?.[1];

      await expect(
        openFolderHandler(null, '/invalid/path')
      ).rejects.toThrow('Failed to open path');
    });
  });
});
