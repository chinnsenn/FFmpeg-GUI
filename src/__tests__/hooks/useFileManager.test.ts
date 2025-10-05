import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useFileManager } from '@renderer/hooks/useFileManager';
import type { MediaFileInfo, FileInfo } from '@shared/types';

// Mock window.electronAPI
const mockGetMediaInfo = vi.fn();

beforeEach(() => {
  global.window.electronAPI = {
    ffmpeg: {
      getMediaInfo: mockGetMediaInfo,
    },
  } as any;

  vi.clearAllMocks();
});

describe('useFileManager', () => {
  it('should initialize with empty state', () => {
    const { result } = renderHook(() => useFileManager());

    expect(result.current.selectedFiles).toEqual([]);
    expect(result.current.selectedFile).toBeNull();
  });

  describe('handleFilesSelected', () => {
    it('should add files from drag and drop', async () => {
      const mockMediaInfo: MediaFileInfo = {
        format: 'mp4',
        duration: 120.5,
        size: 1024000,
        bitrate: 2000000,
        videoStreams: [{
          codec: 'h264',
          width: 1920,
          height: 1080,
          fps: 30,
          bitrate: 1800000,
        }],
        audioStreams: [{
          codec: 'aac',
          sampleRate: 48000,
          channels: 2,
          bitrate: 192000,
        }],
      };

      mockGetMediaInfo.mockResolvedValue(mockMediaInfo);

      const { result } = renderHook(() => useFileManager());

      const mockFile = new File(['content'], 'test.mp4', { type: 'video/mp4' });
      Object.defineProperty(mockFile, 'path', { value: '/path/to/test.mp4' });

      await act(async () => {
        await result.current.handleFilesSelected([mockFile]);
      });

      // File should be added immediately
      expect(result.current.selectedFiles).toHaveLength(1);
      expect(result.current.selectedFiles[0].file.name).toBe('test.mp4');

      // First file should be auto-selected
      expect(result.current.selectedFile).not.toBeNull();
      expect(result.current.selectedFile?.file.name).toBe('test.mp4');

      // Wait for media info to be fetched
      await waitFor(() => {
        expect(mockGetMediaInfo).toHaveBeenCalledWith('/path/to/test.mp4');
      });

      await waitFor(() => {
        expect(result.current.selectedFiles[0].mediaInfo).toEqual(mockMediaInfo);
      });
    });

    it('should add multiple files', async () => {
      mockGetMediaInfo.mockResolvedValue({
        format: 'mp4',
        duration: 100,
        size: 1000000,
      });

      const { result } = renderHook(() => useFileManager());

      const file1 = new File(['content1'], 'test1.mp4', { type: 'video/mp4' });
      const file2 = new File(['content2'], 'test2.mp4', { type: 'video/mp4' });
      Object.defineProperty(file1, 'path', { value: '/path/to/test1.mp4' });
      Object.defineProperty(file2, 'path', { value: '/path/to/test2.mp4' });

      await act(async () => {
        await result.current.handleFilesSelected([file1, file2]);
      });

      expect(result.current.selectedFiles).toHaveLength(2);
      expect(result.current.selectedFiles[0].file.name).toBe('test1.mp4');
      expect(result.current.selectedFiles[1].file.name).toBe('test2.mp4');
    });

    it('should not auto-select if file already selected', async () => {
      mockGetMediaInfo.mockResolvedValue({ format: 'mp4', duration: 100, size: 1000000 });

      const { result } = renderHook(() => useFileManager());

      const file1 = new File(['content1'], 'test1.mp4', { type: 'video/mp4' });
      const file2 = new File(['content2'], 'test2.mp4', { type: 'video/mp4' });
      Object.defineProperty(file1, 'path', { value: '/path/to/test1.mp4' });
      Object.defineProperty(file2, 'path', { value: '/path/to/test2.mp4' });

      // Add first file
      await act(async () => {
        await result.current.handleFilesSelected([file1]);
      });

      const firstSelectedFile = result.current.selectedFile;
      expect(firstSelectedFile?.file.name).toBe('test1.mp4');

      // Add second file
      await act(async () => {
        await result.current.handleFilesSelected([file2]);
      });

      // Selected file should still be the first one
      expect(result.current.selectedFile?.file.name).toBe('test1.mp4');
      expect(result.current.selectedFiles).toHaveLength(2);
    });

    it('should skip media info fetch for files without path', async () => {
      const { result } = renderHook(() => useFileManager());

      const mockFile = new File(['content'], 'test.mp4', { type: 'video/mp4' });
      // Don't set path property

      await act(async () => {
        await result.current.handleFilesSelected([mockFile]);
      });

      expect(result.current.selectedFiles).toHaveLength(1);
      expect(mockGetMediaInfo).not.toHaveBeenCalled();
      expect(result.current.selectedFiles[0].mediaInfo).toBeUndefined();
    });

    it('should handle media info fetch errors gracefully', async () => {
      mockGetMediaInfo.mockRejectedValue(new Error('Failed to get media info'));

      const { result } = renderHook(() => useFileManager());

      const mockFile = new File(['content'], 'test.mp4', { type: 'video/mp4' });
      Object.defineProperty(mockFile, 'path', { value: '/path/to/test.mp4' });

      await act(async () => {
        await result.current.handleFilesSelected([mockFile]);
      });

      // File should still be added even if media info fails
      expect(result.current.selectedFiles).toHaveLength(1);
      expect(result.current.selectedFiles[0].file.name).toBe('test.mp4');
      expect(result.current.selectedFiles[0].mediaInfo).toBeUndefined();
    });

    it('should update selected file media info', async () => {
      const mockMediaInfo: MediaFileInfo = {
        format: 'mp4',
        duration: 120,
        size: 1024000,
      };

      mockGetMediaInfo.mockResolvedValue(mockMediaInfo);

      const { result } = renderHook(() => useFileManager());

      const mockFile = new File(['content'], 'test.mp4', { type: 'video/mp4' });
      Object.defineProperty(mockFile, 'path', { value: '/path/to/test.mp4' });

      await act(async () => {
        await result.current.handleFilesSelected([mockFile]);
      });

      // Wait for media info
      await waitFor(() => {
        expect(result.current.selectedFile?.mediaInfo).toEqual(mockMediaInfo);
      });
    });
  });

  describe('handleFilesFromDialog', () => {
    it('should add files from dialog', async () => {
      const mockMediaInfo: MediaFileInfo = {
        format: 'mp4',
        duration: 150,
        size: 2048000,
      };

      mockGetMediaInfo.mockResolvedValue(mockMediaInfo);

      const { result } = renderHook(() => useFileManager());

      const fileInfo: FileInfo = {
        name: 'dialog-file.mp4',
        path: '/path/to/dialog-file.mp4',
        size: 2048000,
      };

      await act(async () => {
        await result.current.handleFilesFromDialog([fileInfo]);
      });

      expect(result.current.selectedFiles).toHaveLength(1);
      expect(result.current.selectedFiles[0].file.name).toBe('dialog-file.mp4');

      // Wait for media info
      await waitFor(() => {
        expect(mockGetMediaInfo).toHaveBeenCalledWith('/path/to/dialog-file.mp4');
        expect(result.current.selectedFiles[0].mediaInfo).toEqual(mockMediaInfo);
      });
    });

    it('should add multiple files from dialog', async () => {
      mockGetMediaInfo.mockResolvedValue({ format: 'mp4', duration: 100, size: 1000000 });

      const { result } = renderHook(() => useFileManager());

      const fileInfos: FileInfo[] = [
        { name: 'file1.mp4', path: '/path/to/file1.mp4', size: 1000000 },
        { name: 'file2.mp4', path: '/path/to/file2.mp4', size: 1500000 },
      ];

      await act(async () => {
        await result.current.handleFilesFromDialog(fileInfos);
      });

      expect(result.current.selectedFiles).toHaveLength(2);
      expect(result.current.selectedFiles[0].file.name).toBe('file1.mp4');
      expect(result.current.selectedFiles[1].file.name).toBe('file2.mp4');
    });

    it('should handle media info fetch errors', async () => {
      mockGetMediaInfo.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useFileManager());

      const fileInfo: FileInfo = {
        name: 'error-file.mp4',
        path: '/path/to/error-file.mp4',
        size: 1000000,
      };

      await act(async () => {
        await result.current.handleFilesFromDialog([fileInfo]);
      });

      // File should still be added
      expect(result.current.selectedFiles).toHaveLength(1);
      expect(result.current.selectedFiles[0].mediaInfo).toBeUndefined();
    });
  });

  describe('handleRemoveFile', () => {
    it('should remove file by id', async () => {
      mockGetMediaInfo.mockResolvedValue({ format: 'mp4', duration: 100, size: 1000000 });

      const { result } = renderHook(() => useFileManager());

      const file1 = new File(['content1'], 'test1.mp4', { type: 'video/mp4' });
      const file2 = new File(['content2'], 'test2.mp4', { type: 'video/mp4' });
      Object.defineProperty(file1, 'path', { value: '/path/to/test1.mp4' });
      Object.defineProperty(file2, 'path', { value: '/path/to/test2.mp4' });

      await act(async () => {
        await result.current.handleFilesSelected([file1, file2]);
      });

      const fileIdToRemove = result.current.selectedFiles[0].id;

      act(() => {
        result.current.handleRemoveFile(fileIdToRemove);
      });

      expect(result.current.selectedFiles).toHaveLength(1);
      expect(result.current.selectedFiles[0].file.name).toBe('test2.mp4');
    });

    it('should clear selected file if removed', async () => {
      mockGetMediaInfo.mockResolvedValue({ format: 'mp4', duration: 100, size: 1000000 });

      const { result } = renderHook(() => useFileManager());

      const mockFile = new File(['content'], 'test.mp4', { type: 'video/mp4' });
      Object.defineProperty(mockFile, 'path', { value: '/path/to/test.mp4' });

      await act(async () => {
        await result.current.handleFilesSelected([mockFile]);
      });

      expect(result.current.selectedFile).not.toBeNull();

      const fileId = result.current.selectedFiles[0].id;

      act(() => {
        result.current.handleRemoveFile(fileId);
      });

      expect(result.current.selectedFiles).toHaveLength(0);
      expect(result.current.selectedFile).toBeNull();
    });

    it('should not clear selected file if different file removed', async () => {
      mockGetMediaInfo.mockResolvedValue({ format: 'mp4', duration: 100, size: 1000000 });

      const { result } = renderHook(() => useFileManager());

      const file1 = new File(['content1'], 'test1.mp4', { type: 'video/mp4' });
      const file2 = new File(['content2'], 'test2.mp4', { type: 'video/mp4' });
      Object.defineProperty(file1, 'path', { value: '/path/to/test1.mp4' });
      Object.defineProperty(file2, 'path', { value: '/path/to/test2.mp4' });

      await act(async () => {
        await result.current.handleFilesSelected([file1, file2]);
      });

      // First file is auto-selected
      const selectedFileName = result.current.selectedFile?.file.name;
      const fileToRemove = result.current.selectedFiles[1]; // Remove second file

      act(() => {
        result.current.handleRemoveFile(fileToRemove.id);
      });

      expect(result.current.selectedFile?.file.name).toBe(selectedFileName);
    });
  });

  describe('clearAllFiles', () => {
    it('should clear all files and selected file', async () => {
      mockGetMediaInfo.mockResolvedValue({ format: 'mp4', duration: 100, size: 1000000 });

      const { result } = renderHook(() => useFileManager());

      const file1 = new File(['content1'], 'test1.mp4', { type: 'video/mp4' });
      const file2 = new File(['content2'], 'test2.mp4', { type: 'video/mp4' });
      Object.defineProperty(file1, 'path', { value: '/path/to/test1.mp4' });
      Object.defineProperty(file2, 'path', { value: '/path/to/test2.mp4' });

      await act(async () => {
        await result.current.handleFilesSelected([file1, file2]);
      });

      expect(result.current.selectedFiles).toHaveLength(2);
      expect(result.current.selectedFile).not.toBeNull();

      act(() => {
        result.current.clearAllFiles();
      });

      expect(result.current.selectedFiles).toHaveLength(0);
      expect(result.current.selectedFile).toBeNull();
    });
  });

  describe('setSelectedFile', () => {
    it('should manually set selected file', async () => {
      mockGetMediaInfo.mockResolvedValue({ format: 'mp4', duration: 100, size: 1000000 });

      const { result } = renderHook(() => useFileManager());

      const file1 = new File(['content1'], 'test1.mp4', { type: 'video/mp4' });
      const file2 = new File(['content2'], 'test2.mp4', { type: 'video/mp4' });
      Object.defineProperty(file1, 'path', { value: '/path/to/test1.mp4' });
      Object.defineProperty(file2, 'path', { value: '/path/to/test2.mp4' });

      await act(async () => {
        await result.current.handleFilesSelected([file1, file2]);
      });

      const secondFile = result.current.selectedFiles[1];

      act(() => {
        result.current.setSelectedFile(secondFile);
      });

      expect(result.current.selectedFile?.file.name).toBe('test2.mp4');
    });
  });

  describe('File ID generation', () => {
    it('should generate unique IDs for files', async () => {
      mockGetMediaInfo.mockResolvedValue({ format: 'mp4', duration: 100, size: 1000000 });

      const { result } = renderHook(() => useFileManager());

      const file1 = new File(['content1'], 'test1.mp4', { type: 'video/mp4' });
      const file2 = new File(['content2'], 'test2.mp4', { type: 'video/mp4' });
      Object.defineProperty(file1, 'path', { value: '/path/to/test1.mp4' });
      Object.defineProperty(file2, 'path', { value: '/path/to/test2.mp4' });

      await act(async () => {
        await result.current.handleFilesSelected([file1, file2]);
      });

      const ids = result.current.selectedFiles.map(f => f.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(2);
      expect(ids[0]).not.toBe(ids[1]);
    });
  });
});
