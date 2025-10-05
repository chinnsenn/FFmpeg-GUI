/**
 * Formatters 工具函数测试
 * 覆盖率目标: 100%
 */
import { describe, it, expect } from 'vitest';
import {
  formatFileSize,
  formatBitrate,
  formatDuration,
  formatTime,
  formatSpeed,
  formatPercent,
  calculateDuration,
} from '@renderer/lib/formatters';

describe('formatters', () => {
  describe('formatFileSize', () => {
    it('should format 0 bytes', () => {
      expect(formatFileSize(0)).toBe('0 B');
    });

    it('should format bytes (< 1 KB)', () => {
      expect(formatFileSize(500)).toBe('500 B');
      expect(formatFileSize(1000)).toBe('1000 B');
    });

    it('should format kilobytes', () => {
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(2048)).toBe('2 KB');
      expect(formatFileSize(1536)).toBe('1.5 KB');
    });

    it('should format megabytes', () => {
      expect(formatFileSize(1024 * 1024)).toBe('1 MB');
      expect(formatFileSize(1024 * 1024 * 2.5)).toBe('2.5 MB');
    });

    it('should format gigabytes', () => {
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
    });

    it('should format terabytes', () => {
      expect(formatFileSize(1024 * 1024 * 1024 * 1024)).toBe('1 TB');
    });
  });

  describe('formatBitrate', () => {
    it('should format 0 bps', () => {
      expect(formatBitrate(0)).toBe('0 bps');
    });

    it('should format bits per second (< 1 Kbps)', () => {
      expect(formatBitrate(500)).toBe('500 bps');
    });

    it('should format kilobits per second', () => {
      expect(formatBitrate(1000)).toBe('1 Kbps');
      expect(formatBitrate(2500)).toBe('2.5 Kbps');
    });

    it('should format megabits per second', () => {
      expect(formatBitrate(1000000)).toBe('1 Mbps');
      expect(formatBitrate(2500000)).toBe('2.5 Mbps');
    });

    it('should format gigabits per second', () => {
      expect(formatBitrate(1000000000)).toBe('1 Gbps');
    });

    it('should format string bitrate', () => {
      expect(formatBitrate('1500bits/s')).toBe('1500bps');
      expect(formatBitrate('2000kbits/s')).toBe('2000kbps');
    });
  });

  describe('formatDuration', () => {
    it('should format 0 seconds', () => {
      expect(formatDuration(0)).toBe('00:00:00');
    });

    it('should format seconds only', () => {
      expect(formatDuration(30)).toBe('00:00:30');
      expect(formatDuration(59)).toBe('00:00:59');
    });

    it('should format minutes and seconds', () => {
      expect(formatDuration(60)).toBe('00:01:00');
      expect(formatDuration(90)).toBe('00:01:30');
      expect(formatDuration(125)).toBe('00:02:05');
    });

    it('should format hours, minutes, and seconds', () => {
      expect(formatDuration(3600)).toBe('01:00:00');
      expect(formatDuration(3665)).toBe('01:01:05');
      expect(formatDuration(7200)).toBe('02:00:00');
    });

    it('should handle decimal seconds', () => {
      expect(formatDuration(90.5)).toBe('00:01:30');
      expect(formatDuration(125.9)).toBe('00:02:05');
    });

    it('should pad single digits with zeros', () => {
      expect(formatDuration(5)).toBe('00:00:05');
      expect(formatDuration(305)).toBe('00:05:05');
    });
  });

  describe('formatTime', () => {
    it('should return "-" for undefined', () => {
      expect(formatTime(undefined)).toBe('-');
    });

    it('should format date to time string', () => {
      const date = new Date('2023-01-15T10:30:45');
      const result = formatTime(date);
      // Result will be locale-specific, just check it contains time parts
      expect(result).toContain(':');
    });
  });

  describe('formatSpeed', () => {
    it('should format speed with 2 decimals', () => {
      expect(formatSpeed(1.5)).toBe('1.50x');
      expect(formatSpeed(2.0)).toBe('2.00x');
      expect(formatSpeed(0.5)).toBe('0.50x');
    });
  });

  describe('formatPercent', () => {
    it('should format percentage with default decimals', () => {
      expect(formatPercent(50)).toBe('50%');
      expect(formatPercent(75.5)).toBe('76%');
    });

    it('should format percentage with specified decimals', () => {
      expect(formatPercent(50.123, 2)).toBe('50.12%');
      expect(formatPercent(75.5, 1)).toBe('75.5%');
    });
  });

  describe('calculateDuration', () => {
    it('should return "-" for undefined start date', () => {
      expect(calculateDuration(undefined)).toBe('-');
    });

    it('should calculate duration in seconds', () => {
      const start = new Date('2023-01-01T10:00:00');
      const end = new Date('2023-01-01T10:00:30');
      expect(calculateDuration(start, end)).toBe('30秒');
    });

    it('should calculate duration in minutes', () => {
      const start = new Date('2023-01-01T10:00:00');
      const end = new Date('2023-01-01T10:02:15');
      expect(calculateDuration(start, end)).toBe('2分15秒');
    });

    it('should calculate duration in hours', () => {
      const start = new Date('2023-01-01T10:00:00');
      const end = new Date('2023-01-01T12:30:00');
      expect(calculateDuration(start, end)).toBe('2小时30分');
    });
  });
});
