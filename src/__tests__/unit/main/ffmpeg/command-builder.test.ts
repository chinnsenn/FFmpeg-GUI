/**
 * FFmpeg Command Builder 测试
 * 覆盖率目标: 90%+
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FFmpegCommandBuilder } from '@main/ffmpeg/command-builder';
import type { ConvertOptions, CompressOptions } from '@shared/types';
import * as fs from 'fs';

// Mock fs.existsSync
vi.mock('fs', () => ({
  existsSync: vi.fn(),
}));

describe('FFmpegCommandBuilder', () => {
  let builder: FFmpegCommandBuilder;
  const mockExistsSync = vi.mocked(fs.existsSync);

  beforeEach(() => {
    builder = new FFmpegCommandBuilder();
    vi.clearAllMocks();
    // 默认文件存在
    mockExistsSync.mockReturnValue(true);
  });

  describe('buildConvertCommand', () => {
    it('should build basic convert command with required fields', () => {
      const options: ConvertOptions = {
        input: '/mock/input.mp4',
        output: '/mock/output.avi',
      };

      const result = builder.buildConvertCommand(options);

      expect(result.success).toBe(true);
      expect(result.command).toContain('-i');
      expect(result.command).toEqual(
        expect.arrayContaining([
          expect.stringContaining('input.mp4'),
          expect.stringContaining('output.avi'),
        ])
      );
    });

    it('should include overwrite flag when enabled', () => {
      const options: ConvertOptions = {
        input: '/mock/input.mp4',
        output: '/mock/output.avi',
        overwrite: true,
      };

      const result = builder.buildConvertCommand(options);

      expect(result.success).toBe(true);
      expect(result.command).toContain('-y');
    });

    it('should include video codec when specified', () => {
      const options: ConvertOptions = {
        input: '/mock/input.mp4',
        output: '/mock/output.avi',
        videoCodec: 'libx264',
      };

      const result = builder.buildConvertCommand(options);

      expect(result.success).toBe(true);
      expect(result.command).toContain('-c:v');
      expect(result.command).toContain('libx264');
    });

    it('should include audio codec when specified', () => {
      const options: ConvertOptions = {
        input: '/mock/input.mp4',
        output: '/mock/output.avi',
        audioCodec: 'aac',
      };

      const result = builder.buildConvertCommand(options);

      expect(result.success).toBe(true);
      expect(result.command).toContain('-c:a');
      expect(result.command).toContain('aac');
    });

    it('should include video bitrate when specified', () => {
      const options: ConvertOptions = {
        input: '/mock/input.mp4',
        output: '/mock/output.avi',
        videoBitrate: '2000k',
      };

      const result = builder.buildConvertCommand(options);

      expect(result.success).toBe(true);
      expect(result.command).toContain('-b:v');
      expect(result.command).toContain('2000k');
    });

    it('should include audio bitrate when specified', () => {
      const options: ConvertOptions = {
        input: '/mock/input.mp4',
        output: '/mock/output.avi',
        audioBitrate: '128k',
      };

      const result = builder.buildConvertCommand(options);

      expect(result.success).toBe(true);
      expect(result.command).toContain('-b:a');
      expect(result.command).toContain('128k');
    });

    it('should include fps when specified', () => {
      const options: ConvertOptions = {
        input: '/mock/input.mp4',
        output: '/mock/output.avi',
        fps: 30,
      };

      const result = builder.buildConvertCommand(options);

      expect(result.success).toBe(true);
      expect(result.command).toContain('-r');
      expect(result.command).toContain('30');
    });

    it('should include resolution when specified', () => {
      const options: ConvertOptions = {
        input: '/mock/input.mp4',
        output: '/mock/output.avi',
        resolution: '1920x1080',
      };

      const result = builder.buildConvertCommand(options);

      expect(result.success).toBe(true);
      expect(result.command).toContain('-s');
      expect(result.command).toContain('1920x1080');
    });

    it('should include quality preset when specified', () => {
      const options: ConvertOptions = {
        input: '/mock/input.mp4',
        output: '/mock/output.avi',
        quality: 'medium',
      };

      const result = builder.buildConvertCommand(options);

      expect(result.success).toBe(true);
      expect(result.command).toContain('-preset');
      expect(result.command).toContain('medium');
    });

    it('should build complete command with all options', () => {
      const options: ConvertOptions = {
        input: '/mock/input.mp4',
        output: '/mock/output.avi',
        overwrite: true,
        videoCodec: 'libx264',
        audioCodec: 'aac',
        videoBitrate: '2000k',
        audioBitrate: '128k',
        fps: 30,
        resolution: '1920x1080',
        quality: 'medium',
      };

      const result = builder.buildConvertCommand(options);

      expect(result.success).toBe(true);
      expect(result.command).toEqual([
        '-y',
        '-i', expect.stringContaining('input.mp4'),
        '-c:v', 'libx264',
        '-c:a', 'aac',
        '-b:v', '2000k',
        '-b:a', '128k',
        '-r', '30',
        '-s', '1920x1080',
        '-preset', 'medium',
        expect.stringContaining('output.avi'),
      ]);
    });

    it('should fail when input is empty', () => {
      const options: ConvertOptions = {
        input: '',
        output: '/mock/output.avi',
      };

      const result = builder.buildConvertCommand(options);

      expect(result.success).toBe(false);
      expect(result.error).toContain('输入文件路径不能为空');
    });

    it('should fail when output is empty', () => {
      const options: ConvertOptions = {
        input: '/mock/input.mp4',
        output: '',
      };

      const result = builder.buildConvertCommand(options);

      expect(result.success).toBe(false);
      expect(result.error).toContain('输出文件路径不能为空');
    });

    it('should fail when input file does not exist', () => {
      mockExistsSync.mockReturnValue(false);

      const options: ConvertOptions = {
        input: '/mock/nonexistent.mp4',
        output: '/mock/output.avi',
      };

      const result = builder.buildConvertCommand(options);

      expect(result.success).toBe(false);
      expect(result.error).toContain('输入文件不存在');
    });

    it('should reject dangerous system path /System', () => {
      const options: ConvertOptions = {
        input: '/System/Library/test.mp4',
        output: '/mock/output.avi',
      };

      const result = builder.buildConvertCommand(options);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Access to system directories is not allowed');
    });

    it('should reject dangerous system path /etc', () => {
      const options: ConvertOptions = {
        input: '/etc/passwd',
        output: '/mock/output.avi',
      };

      const result = builder.buildConvertCommand(options);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Access to system directories is not allowed');
    });

    it('should reject dangerous Windows system path', () => {
      // Skip on non-Windows systems as path resolution differs
      if (process.platform !== 'win32') {
        return;
      }

      const options: ConvertOptions = {
        input: 'C:\\Windows\\System32\\test.mp4',
        output: '/mock/output.avi',
      };

      const result = builder.buildConvertCommand(options);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Access to system directories is not allowed');
    });
  });

  describe('buildCompressCommand', () => {
    it('should build basic compress command with CRF', () => {
      const options: CompressOptions = {
        input: '/mock/input.mp4',
        output: '/mock/output.mp4',
        crf: 23,
      };

      const result = builder.buildCompressCommand(options);

      expect(result.success).toBe(true);
      expect(result.command).toContain('-i');
      expect(result.command).toContain('-c:v');
      expect(result.command).toContain('libx264');
      expect(result.command).toContain('-crf');
      expect(result.command).toContain('23');
      expect(result.command).toContain('-c:a');
      expect(result.command).toContain('copy');
    });

    it('should clamp CRF value to valid range (0-51)', () => {
      const options1: CompressOptions = {
        input: '/mock/input.mp4',
        output: '/mock/output.mp4',
        crf: 100, // Too high
      };

      const result1 = builder.buildCompressCommand(options1);
      expect(result1.command).toContain('51'); // Clamped to max

      const options2: CompressOptions = {
        input: '/mock/input.mp4',
        output: '/mock/output.mp4',
        crf: -5, // Too low
      };

      const result2 = builder.buildCompressCommand(options2);
      expect(result2.command).toContain('0'); // Clamped to min
    });

    it('should use target size when CRF is not specified', () => {
      const options: CompressOptions = {
        input: '/mock/input.mp4',
        output: '/mock/output.mp4',
        targetSize: 10, // 10 MB
      };

      const result = builder.buildCompressCommand(options);

      expect(result.success).toBe(true);
      expect(result.command).toContain('-b:v');
      // targetSize (10 MB) * 8 * 1024 / 60 = 1365k
      expect(result.command).toContain('1365k');
    });

    it('should prioritize CRF over target size', () => {
      const options: CompressOptions = {
        input: '/mock/input.mp4',
        output: '/mock/output.mp4',
        crf: 28,
        targetSize: 10,
      };

      const result = builder.buildCompressCommand(options);

      expect(result.success).toBe(true);
      expect(result.command).toContain('-crf');
      expect(result.command).toContain('28');
      expect(result.command).not.toContain('-b:v');
    });

    it('should include preset when specified', () => {
      const options: CompressOptions = {
        input: '/mock/input.mp4',
        output: '/mock/output.mp4',
        crf: 23,
        preset: 'fast',
      };

      const result = builder.buildCompressCommand(options);

      expect(result.success).toBe(true);
      expect(result.command).toContain('-preset');
      expect(result.command).toContain('fast');
    });

    it('should use custom video codec when specified', () => {
      const options: CompressOptions = {
        input: '/mock/input.mp4',
        output: '/mock/output.mp4',
        crf: 23,
        videoCodec: 'libx265',
      };

      const result = builder.buildCompressCommand(options);

      expect(result.success).toBe(true);
      expect(result.command).toContain('-c:v');
      expect(result.command).toContain('libx265');
    });

    it('should use custom audio codec when specified', () => {
      const options: CompressOptions = {
        input: '/mock/input.mp4',
        output: '/mock/output.mp4',
        crf: 23,
        audioCodec: 'aac',
      };

      const result = builder.buildCompressCommand(options);

      expect(result.success).toBe(true);
      expect(result.command).toContain('-c:a');
      expect(result.command).toContain('aac');
    });

    it('should include resolution when specified', () => {
      const options: CompressOptions = {
        input: '/mock/input.mp4',
        output: '/mock/output.mp4',
        crf: 23,
        resolution: '1280x720',
      };

      const result = builder.buildCompressCommand(options);

      expect(result.success).toBe(true);
      expect(result.command).toContain('-s');
      expect(result.command).toContain('1280x720');
    });

    it('should include overwrite flag when enabled', () => {
      const options: CompressOptions = {
        input: '/mock/input.mp4',
        output: '/mock/output.mp4',
        crf: 23,
        overwrite: true,
      };

      const result = builder.buildCompressCommand(options);

      expect(result.success).toBe(true);
      expect(result.command).toContain('-y');
    });

    it('should fail with empty input', () => {
      const options: CompressOptions = {
        input: '',
        output: '/mock/output.mp4',
        crf: 23,
      };

      const result = builder.buildCompressCommand(options);

      expect(result.success).toBe(false);
      expect(result.error).toContain('输入文件路径不能为空');
    });

    it('should fail with empty output', () => {
      const options: CompressOptions = {
        input: '/mock/input.mp4',
        output: '',
        crf: 23,
      };

      const result = builder.buildCompressCommand(options);

      expect(result.success).toBe(false);
      expect(result.error).toContain('输出文件路径不能为空');
    });
  });

  describe('buildExtractAudioCommand', () => {
    it('should build extract audio command with default codec', () => {
      const result = builder.buildExtractAudioCommand(
        '/mock/input.mp4',
        '/mock/output.mp3'
      );

      expect(result.success).toBe(true);
      expect(result.command).toEqual([
        '-y',
        '-i', expect.stringContaining('input.mp4'),
        '-vn',
        '-acodec', 'mp3',
        expect.stringContaining('output.mp3'),
      ]);
    });

    it('should use specified audio codec', () => {
      const result = builder.buildExtractAudioCommand(
        '/mock/input.mp4',
        '/mock/output.aac',
        'aac'
      );

      expect(result.success).toBe(true);
      expect(result.command).toContain('-acodec');
      expect(result.command).toContain('aac');
    });

    it('should fail with empty input', () => {
      const result = builder.buildExtractAudioCommand('', '/mock/output.mp3');

      expect(result.success).toBe(false);
      expect(result.error).toContain('输入文件路径不能为空');
    });

    it('should fail with empty output', () => {
      const result = builder.buildExtractAudioCommand('/mock/input.mp4', '');

      expect(result.success).toBe(false);
      expect(result.error).toContain('输出文件路径不能为空');
    });
  });

  describe('buildTrimCommand', () => {
    it('should build trim command with start time and duration', () => {
      const result = builder.buildTrimCommand(
        '/mock/input.mp4',
        '/mock/output.mp4',
        '00:00:10',
        '00:00:30'
      );

      expect(result.success).toBe(true);
      expect(result.command).toContain('-y');
      expect(result.command).toContain('-ss');
      expect(result.command).toContain('00:00:10');
      expect(result.command).toContain('-t');
      expect(result.command).toContain('00:00:30');
      expect(result.command).toContain('-c');
      expect(result.command).toContain('copy');
    });

    it('should build trim command with start time and end time', () => {
      const result = builder.buildTrimCommand(
        '/mock/input.mp4',
        '/mock/output.mp4',
        '00:00:10',
        undefined,
        '00:01:00'
      );

      expect(result.success).toBe(true);
      expect(result.command).toContain('-ss');
      expect(result.command).toContain('00:00:10');
      expect(result.command).toContain('-to');
      expect(result.command).toContain('00:01:00');
      expect(result.command).not.toContain('-t');
    });

    it('should prioritize duration over end time', () => {
      const result = builder.buildTrimCommand(
        '/mock/input.mp4',
        '/mock/output.mp4',
        '00:00:10',
        '00:00:30',
        '00:01:00'
      );

      expect(result.success).toBe(true);
      expect(result.command).toContain('-t');
      expect(result.command).toContain('00:00:30');
      expect(result.command).not.toContain('-to');
    });

    it('should fail with empty input', () => {
      const result = builder.buildTrimCommand('', '/mock/output.mp4', '00:00:10');

      expect(result.success).toBe(false);
      expect(result.error).toContain('输入文件路径不能为空');
    });

    it('should fail with empty output', () => {
      const result = builder.buildTrimCommand('/mock/input.mp4', '', '00:00:10');

      expect(result.success).toBe(false);
      expect(result.error).toContain('输出文件路径不能为空');
    });
  });

  describe('buildMergeCommand', () => {
    it('should build merge command for multiple videos', () => {
      const inputs = ['/mock/video1.mp4', '/mock/video2.mp4', '/mock/video3.mp4'];
      const result = builder.buildMergeCommand(inputs, '/mock/merged.mp4');

      expect(result.success).toBe(true);
      expect(result.command).toContain('-y');
      expect(result.command).toContain('-filter_complex');
      // Check that the filter_complex contains the concat filter
      const command = result.command!.join(' ');
      expect(command).toContain('concat=n=3:v=1:a=1');
      expect(result.command).toContain('-map');
      expect(result.command).toContain('[outv]');
      expect(result.command).toContain('[outa]');
    });

    it('should include all input files', () => {
      const inputs = ['/mock/video1.mp4', '/mock/video2.mp4'];
      const result = builder.buildMergeCommand(inputs, '/mock/merged.mp4');

      expect(result.success).toBe(true);
      const command = result.command!.join(' ');
      expect(command).toContain('video1.mp4');
      expect(command).toContain('video2.mp4');
    });

    it('should fail with empty inputs array', () => {
      const result = builder.buildMergeCommand([], '/mock/merged.mp4');

      expect(result.success).toBe(false);
      expect(result.error).toContain('输入文件列表不能为空');
    });

    it('should fail when input is undefined', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = builder.buildMergeCommand(undefined as any, '/mock/merged.mp4');

      expect(result.success).toBe(false);
      expect(result.error).toContain('输入文件列表不能为空');
    });

    it('should fail when any input file does not exist', () => {
      mockExistsSync.mockImplementation((path: string) => {
        return !path.includes('nonexistent');
      });

      const inputs = ['/mock/video1.mp4', '/mock/nonexistent.mp4'];
      const result = builder.buildMergeCommand(inputs, '/mock/merged.mp4');

      expect(result.success).toBe(false);
      expect(result.error).toContain('输入文件不存在');
    });

    it('should fail with empty output', () => {
      const inputs = ['/mock/video1.mp4', '/mock/video2.mp4'];
      const result = builder.buildMergeCommand(inputs, '');

      expect(result.success).toBe(false);
      expect(result.error).toContain('输出文件路径不能为空');
    });
  });

  describe('buildWatermarkCommand', () => {
    it('should build watermark command with top-right position (default)', () => {
      const result = builder.buildWatermarkCommand(
        '/mock/video.mp4',
        '/mock/watermark.png',
        '/mock/output.mp4'
      );

      expect(result.success).toBe(true);
      expect(result.command).toContain('-y');
      expect(result.command).toContain('-filter_complex');
      expect(result.command).toContain('overlay=main_w-overlay_w-10:10');
    });

    it('should position watermark at top-left', () => {
      const result = builder.buildWatermarkCommand(
        '/mock/video.mp4',
        '/mock/watermark.png',
        '/mock/output.mp4',
        'top-left'
      );

      expect(result.success).toBe(true);
      expect(result.command).toContain('overlay=10:10');
    });

    it('should position watermark at bottom-left', () => {
      const result = builder.buildWatermarkCommand(
        '/mock/video.mp4',
        '/mock/watermark.png',
        '/mock/output.mp4',
        'bottom-left'
      );

      expect(result.success).toBe(true);
      expect(result.command).toContain('overlay=10:main_h-overlay_h-10');
    });

    it('should position watermark at bottom-right', () => {
      const result = builder.buildWatermarkCommand(
        '/mock/video.mp4',
        '/mock/watermark.png',
        '/mock/output.mp4',
        'bottom-right'
      );

      expect(result.success).toBe(true);
      expect(result.command).toContain('overlay=main_w-overlay_w-10:main_h-overlay_h-10');
    });

    it('should use custom padding', () => {
      const result = builder.buildWatermarkCommand(
        '/mock/video.mp4',
        '/mock/watermark.png',
        '/mock/output.mp4',
        'top-left',
        20
      );

      expect(result.success).toBe(true);
      expect(result.command).toContain('overlay=20:20');
    });

    it('should fail when video input is empty', () => {
      const result = builder.buildWatermarkCommand(
        '',
        '/mock/watermark.png',
        '/mock/output.mp4'
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('输入文件路径不能为空');
    });

    it('should fail when watermark input is empty', () => {
      const result = builder.buildWatermarkCommand(
        '/mock/video.mp4',
        '',
        '/mock/output.mp4'
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('输入文件路径不能为空');
    });

    it('should fail when output is empty', () => {
      const result = builder.buildWatermarkCommand(
        '/mock/video.mp4',
        '/mock/watermark.png',
        ''
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('输出文件路径不能为空');
    });

    it('should fail when video file does not exist', () => {
      mockExistsSync.mockImplementation((path: string) => {
        return !path.includes('nonexistent');
      });

      const result = builder.buildWatermarkCommand(
        '/mock/nonexistent.mp4',
        '/mock/watermark.png',
        '/mock/output.mp4'
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('输入文件不存在');
    });

    it('should fail when watermark file does not exist', () => {
      mockExistsSync.mockImplementation((path: string) => {
        return path.includes('video.mp4');
      });

      const result = builder.buildWatermarkCommand(
        '/mock/video.mp4',
        '/mock/nonexistent.png',
        '/mock/output.mp4'
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('输入文件不存在');
    });
  });
});
