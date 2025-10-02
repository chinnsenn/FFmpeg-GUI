import { describe, it, expect } from 'vitest';
import { FFmpegParser } from '@main/ffmpeg/parser';

describe('FFmpegParser', () => {
  let parser: FFmpegParser;

  beforeEach(() => {
    parser = new FFmpegParser();
  });

  describe('parseDuration', () => {
    it('should parse duration from ffmpeg output', () => {
      const output = '  Duration: 00:05:30.25, start: 0.000000, bitrate: 2000 kb/s';
      const duration = parser.parseDuration(output);
      expect(duration).toBe(330.25);
    });

    it('should return null for invalid duration', () => {
      const output = 'Invalid output';
      const duration = parser.parseDuration(output);
      expect(duration).toBeNull();
    });
  });

  describe('parseProgress', () => {
    it('should parse progress information', () => {
      // First set duration
      parser.parseDuration('  Duration: 00:10:00.00, start: 0.000000');

      const output = 'frame= 1500 fps= 30 q=28.0 size=   10240kB time=00:05:00.00 bitrate= 280.0kbits/s speed=1.5x';
      const progress = parser.parseProgress(output);

      expect(progress).toBeDefined();
      expect(progress?.frame).toBe(1500);
      expect(progress?.fps).toBe(30);
      expect(progress?.speed).toBe(1.5);
      expect(progress?.percent).toBeCloseTo(50, 0);
    });
  });

  describe('parseError', () => {
    it('should parse error messages', () => {
      const output = 'Error: Invalid input file format';
      const error = parser.parseError(output);
      expect(error).toContain('Invalid input file');
    });

    it('should return null for non-error output', () => {
      const output = 'frame= 100 fps= 25';
      const error = parser.parseError(output);
      expect(error).toBeNull();
    });
  });
});
