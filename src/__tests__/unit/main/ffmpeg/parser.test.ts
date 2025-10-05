/**
 * FFmpeg Parser 测试
 * 覆盖率目标: 90%
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { FFmpegParser } from '@main/ffmpeg/parser';

describe('FFmpegParser', () => {
  let parser: FFmpegParser;

  beforeEach(() => {
    parser = new FFmpegParser();
  });

  describe('parseProgress', () => {
    it('should parse standard FFmpeg progress output', () => {
      parser.setTotalDuration(100);
      const output = 'frame=  123 fps= 30 q=28.0 size=    1024kB time=00:00:05.00 bitrate=1500.0kbits/s speed= 1.5x';
      const result = parser.parseProgress(output);

      expect(result).toBeDefined();
      expect(result?.frame).toBe(123);
      expect(result?.fps).toBe(30);
      expect(result?.totalSize).toBe(1024);
      expect(result?.currentTime).toBe(5);
      expect(result?.speed).toBe(1.5);
      expect(result?.bitrate).toBe('1500.0kbits/s');
    });

    it('should calculate percentage correctly', () => {
      parser.setTotalDuration(60);
      const output = 'frame=  456 fps= 60 q=22.0 size=    5120kB time=00:00:15.20 bitrate=2750.0kbits/s speed= 2.0x';
      const result = parser.parseProgress(output);

      expect(result).toBeDefined();
      expect(result?.currentTime).toBe(15.2);
      expect(result?.percent).toBeCloseTo(25.33, 1);
    });

    it('should return null for invalid output', () => {
      const result = parser.parseProgress('Invalid data or corrupted stream');
      expect(result).toBeNull();
    });

    it('should return null for empty output', () => {
      const result = parser.parseProgress('');
      expect(result).toBeNull();
    });

    it('should handle missing frame/fps fields', () => {
      parser.setTotalDuration(100);
      const output = 'time=00:00:05.00 bitrate=1500.0kbits/s';
      const result = parser.parseProgress(output);

      expect(result).toBeDefined();
      expect(result?.frame).toBe(0);
      expect(result?.fps).toBe(0);
      expect(result?.currentTime).toBe(5);
    });

    it('should limit percent to 100', () => {
      parser.setTotalDuration(10);
      const output = 'time=00:00:15.00'; // Time exceeds duration
      const result = parser.parseProgress(output);

      expect(result).toBeDefined();
      expect(result?.percent).toBe(100);
    });

    it('should handle zero duration', () => {
      parser.setTotalDuration(0);
      const output = 'time=00:00:05.00';
      const result = parser.parseProgress(output);

      expect(result).toBeDefined();
      expect(result?.percent).toBe(0);
    });

    it('should parse time in HH:MM:SS format', () => {
      parser.setTotalDuration(7200);
      const output = 'time=01:00:00.00';
      const result = parser.parseProgress(output);

      expect(result).toBeDefined();
      expect(result?.currentTime).toBe(3600);
    });
  });

  describe('parseDuration', () => {
    it('should parse duration from FFmpeg output', () => {
      const output = 'Duration: 00:05:30.25, start: 0.000000, bitrate: 1234 kb/s';
      const duration = parser.parseDuration(output);

      expect(duration).toBe(330.25);
    });

    it('should parse hours correctly', () => {
      const output = 'Duration: 01:30:45.50';
      const duration = parser.parseDuration(output);

      expect(duration).toBe(5445.5);
    });

    it('should return null for invalid input', () => {
      const duration = parser.parseDuration('No duration info');
      expect(duration).toBeNull();
    });

    it('should return null for empty input', () => {
      const duration = parser.parseDuration('');
      expect(duration).toBeNull();
    });
  });

  describe('parseError', () => {
    it('should detect and parse error messages', () => {
      const output = 'Error opening input file test.mp4: No such file or directory';
      const error = parser.parseError(output);

      expect(error).toBeDefined();
      expect(error).toContain('No such file or directory');
    });

    it('should return null for non-error output', () => {
      const output = 'frame=  123 fps= 30';
      const error = parser.parseError(output);
      expect(error).toBeNull();
    });

    it('should detect various error patterns', () => {
      const errorOutputs = [
        'Error opening input file',
        'Invalid data found when processing input',
        'failed to open file',
        'could not find codec',
      ];

      errorOutputs.forEach(output => {
        const error = parser.parseError(output);
        expect(error).toBeDefined();
      });
    });

    it('should return null for empty input', () => {
      const error = parser.parseError('');
      expect(error).toBeNull();
    });
  });

  describe('parseInputInfo', () => {
    it('should parse video stream info', () => {
      const output = 'Stream #0:0: Video: h264, 1920x1080, 30 fps';
      const info = parser.parseInputInfo(output);

      expect(info).toBeDefined();
      expect(info?.videoCodec).toBe('h264');
      expect(info?.resolution).toBe('1920x1080');
    });

    it('should parse audio stream info', () => {
      const output = 'Stream #0:1: Audio: aac, 48000 Hz, stereo';
      const info = parser.parseInputInfo(output);

      expect(info).toBeDefined();
      expect(info?.audioCodec).toBe('aac');
    });

    it('should parse frame rate', () => {
      const output = 'Video: h264, 1920x1080, 30 fps';
      const info = parser.parseInputInfo(output);

      expect(info).toBeDefined();
      expect(info?.fps).toBe('30');
    });

    it('should return null when no valid info found', () => {
      const info = parser.parseInputInfo('random text without stream info');
      expect(info).toBeNull();
    });
  });

  describe('setTotalDuration and getTotalDuration', () => {
    it('should set and get total duration', () => {
      parser.setTotalDuration(100);
      expect(parser.getTotalDuration()).toBe(100);
    });

    it('should default to 0', () => {
      expect(parser.getTotalDuration()).toBe(0);
    });
  });
});
