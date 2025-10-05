/**
 * FFmpeg Detector 测试
 * 覆盖率目标: 90%+
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as fs from 'fs';

// Mock fs
vi.mock('fs', () => ({
  existsSync: vi.fn(),
}));

// Create mock function
const mockExecAsync = vi.fn<[string], Promise<{ stdout: string; stderr: string }>>();

// Mock child_process
vi.mock('child_process', () => ({
  exec: vi.fn(),
}));

// Mock util promisify
vi.mock('util', () => ({
  promisify: () => mockExecAsync,
}));

// Mock @ffmpeg-installer/ffmpeg
const mockFFmpegInstaller = { path: '/mock/path/to/ffmpeg' };
vi.mock('@ffmpeg-installer/ffmpeg', () => ({
  default: mockFFmpegInstaller,
}));

// Import after mocking
const { FFmpegDetector } = await import('@main/ffmpeg/detector');

describe('FFmpegDetector', () => {
  let detector: InstanceType<typeof import('@main/ffmpeg/detector').FFmpegDetector>;
  const mockExistsSync = vi.mocked(fs.existsSync);

  beforeEach(() => {
    detector = new FFmpegDetector();
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create detector instance', () => {
      expect(detector).toBeDefined();
    });
  });

  describe('detect', () => {
    const mockFFmpegOutput = 'ffmpeg version 6.0 Copyright (c) 2000-2023 the FFmpeg developers';

    it('should detect bundled FFmpeg when it exists', async () => {
      mockFFmpegInstaller.path = '/mock/path/to/ffmpeg';
      mockExistsSync.mockReturnValue(true);
      mockExecAsync.mockResolvedValue({ stdout: mockFFmpegOutput, stderr: '' });

      const result = await detector.detect();

      expect(result.isInstalled).toBe(true);
      expect(result.path).toBe('/mock/path/to/ffmpeg');
      expect(result.version).toBe('6.0');
      expect(result.isVersionValid).toBe(true);
    });

    it('should handle ASAR path replacement', async () => {
      mockFFmpegInstaller.path = '/app/path/app.asar/node_modules/@ffmpeg-installer/ffmpeg';
      mockExistsSync.mockReturnValue(true);
      mockExecAsync.mockResolvedValue({ stdout: mockFFmpegOutput, stderr: '' });

      const result = await detector.detect();

      expect(result.isInstalled).toBe(true);
      expect(result.path).toContain('app.asar.unpacked');
      expect(result.version).toBe('6.0');
    });

    it('should fallback to system FFmpeg when bundled FFmpeg not found', async () => {
      mockExistsSync.mockReturnValue(false);
      mockExecAsync.mockResolvedValue({ stdout: mockFFmpegOutput, stderr: '' });

      const result = await detector.detect();

      expect(result.isInstalled).toBe(true);
      expect(result.path).toBe('ffmpeg');
      expect(result.version).toBe('6.0');
    });

    it('should return not installed when FFmpeg not found', async () => {
      mockExistsSync.mockReturnValue(false);
      mockExecAsync.mockRejectedValue(new Error('Command not found'));

      const result = await detector.detect();

      expect(result.isInstalled).toBe(false);
      expect(result.path).toBeUndefined();
      expect(result.version).toBeUndefined();
    });

    it('should skip bundled FFmpeg if version check fails', async () => {
      mockExistsSync.mockReturnValue(true);
      mockExecAsync
        .mockRejectedValueOnce(new Error('Failed to get version'))
        .mockResolvedValueOnce({ stdout: mockFFmpegOutput, stderr: '' });

      const result = await detector.detect();

      expect(result.isInstalled).toBe(true);
      expect(result.path).toBe('ffmpeg');
      expect(result.version).toBe('6.0');
    });

    it('should validate FFmpeg version correctly', async () => {
      mockExistsSync.mockReturnValue(false);
      mockExecAsync.mockResolvedValue({
        stdout: 'ffmpeg version 4.4 Copyright...',
        stderr: ''
      });

      const result = await detector.detect();

      expect(result.isInstalled).toBe(true);
      expect(result.version).toBe('4.4');
      expect(result.isVersionValid).toBe(true); // 4.4 >= MIN_VERSION (4.4)
    });

    it('should mark invalid version when below minimum', async () => {
      mockExistsSync.mockReturnValue(false);
      mockExecAsync.mockResolvedValue({
        stdout: 'ffmpeg version 3.0 Copyright...',
        stderr: ''
      });

      const result = await detector.detect();

      expect(result.isInstalled).toBe(true);
      expect(result.version).toBe('3.0');
      expect(result.isVersionValid).toBe(false);
    });

    it('should handle bundled FFmpeg load errors gracefully', async () => {
      // Simulate bundled FFmpeg throwing an error
      mockFFmpegInstaller.path = undefined as unknown as string;
      mockExistsSync.mockReturnValue(false);
      mockExecAsync.mockResolvedValue({ stdout: mockFFmpegOutput, stderr: '' });

      const result = await detector.detect();

      // Should fallback to system FFmpeg
      expect(result.isInstalled).toBe(true);
      expect(result.path).toBe('ffmpeg');
    });
  });

  describe('parseVersion', () => {
    it('should parse standard version format', async () => {
      mockExistsSync.mockReturnValue(false);
      mockExecAsync.mockResolvedValue({
        stdout: 'ffmpeg version 5.1.2-static https://johnvansickle.com/ffmpeg/',
        stderr: ''
      });

      const result = await detector.detect();

      expect(result.version).toBe('5.1.2');
    });

    it('should parse version with two parts', async () => {
      mockExistsSync.mockReturnValue(false);
      mockExecAsync.mockResolvedValue({
        stdout: 'ffmpeg version 6.0 Copyright (c) 2000-2023 the FFmpeg developers',
        stderr: ''
      });

      const result = await detector.detect();

      expect(result.version).toBe('6.0');
    });

    it('should handle unknown version format', async () => {
      mockExistsSync.mockReturnValue(false);
      mockExecAsync.mockResolvedValue({
        stdout: 'ffmpeg unknown version output',
        stderr: ''
      });

      const result = await detector.detect();

      expect(result.version).toBe('unknown');
      expect(result.isVersionValid).toBe(false);
    });
  });

  describe('isVersionValid', () => {
    it('should accept version higher than minimum major version', async () => {
      mockExistsSync.mockReturnValue(false);
      mockExecAsync.mockResolvedValue({
        stdout: 'ffmpeg version 7.0',
        stderr: ''
      });

      const result = await detector.detect();

      expect(result.isVersionValid).toBe(true);
    });

    it('should accept version equal to minimum with higher minor', async () => {
      mockExistsSync.mockReturnValue(false);
      mockExecAsync.mockResolvedValue({
        stdout: 'ffmpeg version 4.4',
        stderr: ''
      });

      const result = await detector.detect();

      expect(result.isVersionValid).toBe(true);
    });

    it('should reject version lower than minimum major version', async () => {
      mockExistsSync.mockReturnValue(false);
      mockExecAsync.mockResolvedValue({
        stdout: 'ffmpeg version 2.8',
        stderr: ''
      });

      const result = await detector.detect();

      expect(result.isVersionValid).toBe(false);
    });

    it('should accept version equal to minimum', async () => {
      mockExistsSync.mockReturnValue(false);
      // MIN_FFMPEG_VERSION is 4.4
      mockExecAsync.mockResolvedValue({
        stdout: 'ffmpeg version 4.4',
        stderr: ''
      });

      const result = await detector.detect();

      expect(result.isVersionValid).toBe(true);
    });

    it('should reject version with same major but lower minor', async () => {
      mockExistsSync.mockReturnValue(false);
      // MIN_FFMPEG_VERSION is 4.4, so 4.3 should be invalid
      mockExecAsync.mockResolvedValue({
        stdout: 'ffmpeg version 4.3',
        stderr: ''
      });

      const result = await detector.detect();

      expect(result.isVersionValid).toBe(false);
    });

    it('should reject unknown version', async () => {
      mockExistsSync.mockReturnValue(false);
      mockExecAsync.mockResolvedValue({
        stdout: 'ffmpeg invalid output',
        stderr: ''
      });

      const result = await detector.detect();

      expect(result.version).toBe('unknown');
      expect(result.isVersionValid).toBe(false);
    });
  });

  describe('getVersion', () => {
    it('should get version from specific path', async () => {
      mockExistsSync.mockReturnValue(true);
      mockExecAsync.mockResolvedValue({
        stdout: 'ffmpeg version 5.1.3 Copyright...',
        stderr: ''
      });

      const result = await detector.detect();

      expect(result.version).toBe('5.1.3');
    });

    it('should return undefined when version command fails', async () => {
      mockFFmpegInstaller.path = '/mock/path/to/ffmpeg';
      mockExistsSync.mockReturnValue(true);
      mockExecAsync
        .mockRejectedValueOnce(new Error('Command failed')) // bundled version check fails
        .mockResolvedValueOnce({
          stdout: 'ffmpeg version 6.0',
          stderr: ''
        }); // system FFmpeg succeeds

      const result = await detector.detect();

      // Should fallback to system FFmpeg
      expect(result.isInstalled).toBe(true);
      expect(result.path).toBe('ffmpeg');
    });
  });

  describe('edge cases', () => {
    it('should handle version with extra build info', async () => {
      mockExistsSync.mockReturnValue(false);
      mockExecAsync.mockResolvedValue({
        stdout: 'ffmpeg version 6.0-tessus https://evermeet.cx/ffmpeg/',
        stderr: ''
      });

      const result = await detector.detect();

      expect(result.version).toBe('6.0');
      expect(result.isVersionValid).toBe(true);
    });

    it('should handle version with git commit', async () => {
      mockExistsSync.mockReturnValue(false);
      mockExecAsync.mockResolvedValue({
        stdout: 'ffmpeg version N-109911-g6d49776f38-static',
        stderr: ''
      });

      const result = await detector.detect();

      expect(result.version).toBe('unknown');
    });

    it('should handle empty output', async () => {
      mockExistsSync.mockReturnValue(false);
      mockExecAsync.mockResolvedValue({
        stdout: '',
        stderr: ''
      });

      const result = await detector.detect();

      expect(result.version).toBe('unknown');
      expect(result.isVersionValid).toBe(false);
    });
  });
});
