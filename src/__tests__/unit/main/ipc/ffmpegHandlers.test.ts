/**
 * FFmpeg Handlers 测试
 * 覆盖率目标: 90%+
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { FFmpegInfo } from '@main/ffmpeg/detector';
import type { MediaFileInfo } from '@shared/types';

// Mock electron
const mockIpcMainHandle = vi.fn();

vi.mock('electron', () => ({
  ipcMain: {
    handle: mockIpcMainHandle,
  },
}));

// Mock FFmpegDetector
const mockDetectorDetect = vi.fn();
vi.mock('@main/ffmpeg/detector', () => ({
  FFmpegDetector: vi.fn(() => ({
    detect: mockDetectorDetect,
  })),
}));

// Mock FFprobe
const mockFFprobeGetFileInfo = vi.fn();
vi.mock('@main/ffmpeg/ffprobe', () => ({
  FFprobe: vi.fn(() => ({
    getFileInfo: mockFFprobeGetFileInfo,
  })),
}));

// Mock @ffprobe-installer/ffprobe
const mockFFprobeInstaller = { path: '/mock/path/to/ffprobe' };
vi.mock('@ffprobe-installer/ffprobe', () => ({
  default: mockFFprobeInstaller,
}));

// Import after mocking
const { registerFFmpegHandlers } = await import('@main/ipc/ffmpegHandlers');

describe('ffmpegHandlers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset ffprobe installer mock to default
    mockFFprobeInstaller.path = '/mock/path/to/ffprobe';
  });

  describe('registerFFmpegHandlers', () => {
    it('should register FFMPEG_DETECT handler', () => {
      registerFFmpegHandlers();

      expect(mockIpcMainHandle).toHaveBeenCalledWith(
        'ffmpeg:detect',
        expect.any(Function)
      );
    });

    it('should register FFPROBE_GET_MEDIA_INFO handler', () => {
      registerFFmpegHandlers();

      expect(mockIpcMainHandle).toHaveBeenCalledWith(
        'ffprobe:getMediaInfo',
        expect.any(Function)
      );
    });
  });

  describe('FFMPEG_DETECT handler', () => {
    it('should detect FFmpeg successfully', async () => {
      const mockInfo: FFmpegInfo = {
        isInstalled: true,
        path: '/usr/bin/ffmpeg',
        version: '6.0',
        isVersionValid: true,
      };

      mockDetectorDetect.mockResolvedValue(mockInfo);

      registerFFmpegHandlers();

      const detectHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'ffmpeg:detect'
      )?.[1];

      const result = await detectHandler();

      expect(result).toEqual(mockInfo);
      expect(mockDetectorDetect).toHaveBeenCalled();
    });

    it('should handle detection failure', async () => {
      const mockInfo: FFmpegInfo = {
        isInstalled: false,
      };

      mockDetectorDetect.mockResolvedValue(mockInfo);

      registerFFmpegHandlers();

      const detectHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'ffmpeg:detect'
      )?.[1];

      const result = await detectHandler();

      expect(result).toEqual(mockInfo);
    });
  });

  describe('FFPROBE_GET_MEDIA_INFO handler', () => {
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

    it('should get media info successfully', async () => {
      mockDetectorDetect.mockResolvedValue({
        isInstalled: true,
        path: '/usr/bin/ffmpeg',
        version: '6.0',
      });
      mockFFprobeGetFileInfo.mockResolvedValue(mockMediaInfo);

      registerFFmpegHandlers();

      const getMediaInfoHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'ffprobe:getMediaInfo'
      )?.[1];

      const result = await getMediaInfoHandler(null, '/mock/video.mp4');

      expect(result).toEqual(mockMediaInfo);
      expect(mockFFprobeGetFileInfo).toHaveBeenCalledWith('/mock/video.mp4');
    });

    it('should wrap FFprobe errors with descriptive message', async () => {
      mockDetectorDetect.mockResolvedValue({
        isInstalled: true,
        path: '/usr/bin/ffmpeg',
      });
      mockFFprobeGetFileInfo.mockRejectedValue(new Error('File not found'));

      registerFFmpegHandlers();

      const getMediaInfoHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'ffprobe:getMediaInfo'
      )?.[1];

      await expect(
        getMediaInfoHandler(null, '/mock/video.mp4')
      ).rejects.toThrow('获取文件信息失败: File not found');
    });

    it('should handle ASAR path replacement', async () => {
      mockFFprobeInstaller.path = '/app.asar/node_modules/@ffprobe-installer/darwin-arm64/ffprobe';
      mockFFprobeGetFileInfo.mockResolvedValue(mockMediaInfo);

      registerFFmpegHandlers();

      const getMediaInfoHandler = mockIpcMainHandle.mock.calls.find(
        call => call[0] === 'ffprobe:getMediaInfo'
      )?.[1];

      const result = await getMediaInfoHandler(null, '/mock/video.mp4');

      expect(result).toEqual(mockMediaInfo);
    });
  });
});
