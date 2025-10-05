/**
 * useFileManager Hook 测试
 * 覆盖率目标: 90%+
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFileManager } from '@renderer/hooks/useFileManager';
import type { FileInfo, MediaFileInfo } from '@shared/types';

describe('useFileManager', () => {
  const mockMediaInfo: MediaFileInfo = {
    filename: 'test.mp4',
    format: 'mp4',
    formatLongName: 'MP4',
    duration: 125.5,
    size: 41943040,
    bitrate: 2670000,
    videoStreams: [{
      codec: 'h264',
      codecLongName: 'H.264',
      width: 1920,
      height: 1080,
      frameRate: '30.00',
      bitrate: '2500000',
      duration: 125.5,
    }],
    audioStreams: [{
      codec: 'aac',
      codecLongName: 'AAC',
      sampleRate: '48000',
      channels: 2,
      bitrate: '128000',
      duration: 125.5,
    }],
    subtitleCount: 0,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset electronAPI mock
    global.window.electronAPI.ffmpeg.getMediaInfo = vi.fn().mockResolvedValue(mockMediaInfo);
  });

  describe('initialization', () => {
    it('should initialize with empty state', () => {
      const { result } = renderHook(() => useFileManager());

      expect(result.current.selectedFiles).toEqual([]);
      expect(result.current.selectedFile).toBeNull();
    });
  });

  describe('handleFilesSelected', () => {
    it('should add files to selectedFiles', async () => {
      const { result } = renderHook(() => useFileManager());

      const mockFiles: File[] = [
        Object.assign(new File(['content'], 'video1.mp4', { type: 'video/mp4' }), {
          path: '/mock/video1.mp4'
        }),
        Object.assign(new File(['content'], 'video2.mp4', { type: 'video/mp4' }), {
          path: '/mock/video2.mp4'
        }),
      ];

      await act(async () => {
        await result.current.handleFilesSelected(mockFiles);
      });

      expect(result.current.selectedFiles).toHaveLength(2);
      expect(result.current.selectedFiles[0].file).toBe(mockFiles[0]);
      expect(result.current.selectedFiles[1].file).toBe(mockFiles[1]);
    });

    it('should auto-select first file when no file is selected', async () => {
      const { result } = renderHook(() => useFileManager());

      const mockFiles: File[] = [
        Object.assign(new File(['content'], 'video1.mp4', { type: 'video/mp4' }), {
          path: '/mock/video1.mp4'
        }),
      ];

      await act(async () => {
        await result.current.handleFilesSelected(mockFiles);
      });

      expect(result.current.selectedFile).not.toBeNull();
      expect(result.current.selectedFile?.file).toBe(mockFiles[0]);
    });

    it('should not auto-select when a file is already selected', async () => {
      const { result } = renderHook(() => useFileManager());

      const firstFile = Object.assign(new File(['content'], 'video1.mp4', { type: 'video/mp4' }), {
        path: '/mock/video1.mp4'
      });

      await act(async () => {
        await result.current.handleFilesSelected([firstFile]);
      });

      const currentSelected = result.current.selectedFile;

      const secondFile = Object.assign(new File(['content'], 'video2.mp4', { type: 'video/mp4' }), {
        path: '/mock/video2.mp4'
      });

      await act(async () => {
        await result.current.handleFilesSelected([secondFile]);
      });

      // Should still be the first file
      expect(result.current.selectedFile?.id).toBe(currentSelected?.id);
    });
  });

  describe('handleFilesFromDialog', () => {
    it('should add FileInfo objects to selectedFiles', async () => {
      const { result } = renderHook(() => useFileManager());

      const mockFileInfos: FileInfo[] = [
        { path: '/mock/video1.mp4', name: 'video1.mp4' },
        { path: '/mock/video2.mp4', name: 'video2.mp4' },
      ];

      await act(async () => {
        await result.current.handleFilesFromDialog(mockFileInfos);
      });

      expect(result.current.selectedFiles).toHaveLength(2);
      expect(result.current.selectedFiles[0].file).toBe(mockFileInfos[0]);
      expect(result.current.selectedFiles[1].file).toBe(mockFileInfos[1]);
    });

    it('should auto-select first file when no file is selected', async () => {
      const { result } = renderHook(() => useFileManager());

      const mockFileInfos: FileInfo[] = [
        { path: '/mock/video1.mp4', name: 'video1.mp4' },
      ];

      await act(async () => {
        await result.current.handleFilesFromDialog(mockFileInfos);
      });

      expect(result.current.selectedFile).not.toBeNull();
      expect(result.current.selectedFile?.file).toBe(mockFileInfos[0]);
    });
  });

  describe('handleRemoveFile', () => {
    it('should remove file by id', async () => {
      const { result } = renderHook(() => useFileManager());

      const mockFiles: File[] = [
        Object.assign(new File(['content'], 'video1.mp4', { type: 'video/mp4' }), {
          path: '/mock/video1.mp4'
        }),
        Object.assign(new File(['content'], 'video2.mp4', { type: 'video/mp4' }), {
          path: '/mock/video2.mp4'
        }),
      ];

      await act(async () => {
        await result.current.handleFilesSelected(mockFiles);
      });

      const firstFileId = result.current.selectedFiles[0].id;

      act(() => {
        result.current.handleRemoveFile(firstFileId);
      });

      expect(result.current.selectedFiles).toHaveLength(1);
      expect(result.current.selectedFiles[0].file).toBe(mockFiles[1]);
    });

    it('should clear selected file when removing it', async () => {
      const { result } = renderHook(() => useFileManager());

      const mockFile = Object.assign(new File(['content'], 'video1.mp4', { type: 'video/mp4' }), {
        path: '/mock/video1.mp4'
      });

      await act(async () => {
        await result.current.handleFilesSelected([mockFile]);
      });

      const fileId = result.current.selectedFile!.id;

      act(() => {
        result.current.handleRemoveFile(fileId);
      });

      expect(result.current.selectedFile).toBeNull();
    });

    it('should not clear selected file when removing a different file', async () => {
      const { result } = renderHook(() => useFileManager());

      const mockFiles: File[] = [
        Object.assign(new File(['content'], 'video1.mp4', { type: 'video/mp4' }), {
          path: '/mock/video1.mp4'
        }),
        Object.assign(new File(['content'], 'video2.mp4', { type: 'video/mp4' }), {
          path: '/mock/video2.mp4'
        }),
      ];

      await act(async () => {
        await result.current.handleFilesSelected(mockFiles);
      });

      const firstFileId = result.current.selectedFiles[0].id;
      const secondFileId = result.current.selectedFiles[1].id;

      // Select first file explicitly
      act(() => {
        result.current.setSelectedFile(result.current.selectedFiles[0]);
      });

      // Remove second file
      act(() => {
        result.current.handleRemoveFile(secondFileId);
      });

      // First file should still be selected
      expect(result.current.selectedFile?.id).toBe(firstFileId);
    });
  });

  describe('clearAllFiles', () => {
    it('should clear all files and selection', async () => {
      const { result } = renderHook(() => useFileManager());

      const mockFiles: File[] = [
        Object.assign(new File(['content'], 'video1.mp4', { type: 'video/mp4' }), {
          path: '/mock/video1.mp4'
        }),
        Object.assign(new File(['content'], 'video2.mp4', { type: 'video/mp4' }), {
          path: '/mock/video2.mp4'
        }),
      ];

      await act(async () => {
        await result.current.handleFilesSelected(mockFiles);
      });

      expect(result.current.selectedFiles).toHaveLength(2);
      expect(result.current.selectedFile).not.toBeNull();

      act(() => {
        result.current.clearAllFiles();
      });

      expect(result.current.selectedFiles).toEqual([]);
      expect(result.current.selectedFile).toBeNull();
    });
  });

  describe('setSelectedFile', () => {
    it('should update selected file', async () => {
      const { result } = renderHook(() => useFileManager());

      const mockFiles: File[] = [
        Object.assign(new File(['content'], 'video1.mp4', { type: 'video/mp4' }), {
          path: '/mock/video1.mp4'
        }),
        Object.assign(new File(['content'], 'video2.mp4', { type: 'video/mp4' }), {
          path: '/mock/video2.mp4'
        }),
      ];

      await act(async () => {
        await result.current.handleFilesSelected(mockFiles);
      });

      const secondFile = result.current.selectedFiles[1];

      act(() => {
        result.current.setSelectedFile(secondFile);
      });

      expect(result.current.selectedFile).toBe(secondFile);
    });

    it('should allow clearing selected file', async () => {
      const { result } = renderHook(() => useFileManager());

      const mockFile = Object.assign(new File(['content'], 'video1.mp4', { type: 'video/mp4' }), {
        path: '/mock/video1.mp4'
      });

      await act(async () => {
        await result.current.handleFilesSelected([mockFile]);
      });

      expect(result.current.selectedFile).not.toBeNull();

      act(() => {
        result.current.setSelectedFile(null);
      });

      expect(result.current.selectedFile).toBeNull();
    });
  });
});
