/**
 * FFprobe 测试
 * 覆盖率目标: 90%+
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as fs from 'fs';

// Mock fs
vi.mock('fs', () => ({
  existsSync: vi.fn(),
}));

// Create mock function outside of mock
const mockExecAsync = vi.fn<[string], Promise<{ stdout: string; stderr: string }>>();

// Mock child_process exec
vi.mock('child_process', () => ({
  exec: vi.fn(),
}));

// Mock util promisify to return a mocked async exec
vi.mock('util', () => ({
  promisify: () => mockExecAsync,
}));

// Import after mocking
const { FFprobe } = await import('@main/ffmpeg/ffprobe');

describe('FFprobe', () => {
  let ffprobe: InstanceType<typeof import('@main/ffmpeg/ffprobe').FFprobe>;
  const mockExistsSync = vi.mocked(fs.existsSync);

  beforeEach(() => {
    ffprobe = new FFprobe();
    vi.clearAllMocks();
    // 默认文件存在
    mockExistsSync.mockReturnValue(true);
  });

  describe('constructor', () => {
    it('should use default ffprobe path when not provided', () => {
      const instance = new FFprobe();
      expect(instance).toBeDefined();
    });

    it('should use custom ffprobe path when provided', () => {
      const instance = new FFprobe('/custom/path/ffprobe');
      expect(instance).toBeDefined();
    });
  });

  describe('setPath', () => {
    it('should update ffprobe path', () => {
      ffprobe.setPath('/new/path/ffprobe');
      // Path should be updated (verified implicitly in getFileInfo calls)
    });
  });

  describe('getFileInfo', () => {
    const mockFFprobeOutput = {
      streams: [
        {
          index: 0,
          codec_name: 'h264',
          codec_long_name: 'H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10',
          codec_type: 'video' as const,
          width: 1920,
          height: 1080,
          r_frame_rate: '30/1',
          bit_rate: '2500000',
          duration: '125.5',
        },
        {
          index: 1,
          codec_name: 'aac',
          codec_long_name: 'AAC (Advanced Audio Coding)',
          codec_type: 'audio' as const,
          sample_rate: '48000',
          channels: 2,
          channel_layout: 'stereo',
          bit_rate: '128000',
          duration: '125.5',
        },
        {
          index: 2,
          codec_name: 'subrip',
          codec_long_name: 'SubRip subtitle',
          codec_type: 'subtitle' as const,
        },
      ],
      format: {
        filename: '/mock/video.mp4',
        nb_streams: 3,
        format_name: 'mov,mp4,m4a,3gp,3g2,mj2',
        format_long_name: 'QuickTime / MOV',
        duration: '125.5',
        size: '41943040',
        bit_rate: '2670000',
        tags: {
          title: 'Test Video',
          encoder: 'Lavf58.45.100',
        },
      },
    };

    it('should get file info successfully', async () => {
      mockExecAsync.mockResolvedValue({ stdout: JSON.stringify(mockFFprobeOutput), stderr: '' });

      const result = await ffprobe.getFileInfo('/mock/video.mp4');

      expect(result).toBeDefined();
      expect(result.filename).toBe('/mock/video.mp4');
      expect(result.format).toBe('mov,mp4,m4a,3gp,3g2,mj2');
      expect(result.formatLongName).toBe('QuickTime / MOV');
      expect(result.duration).toBe(125.5);
      expect(result.size).toBe(41943040);
      expect(result.bitrate).toBe(2670000);
      expect(result.subtitleCount).toBe(1);
    });

    it('should parse video streams correctly', async () => {
      mockExecAsync.mockResolvedValue({ stdout: JSON.stringify(mockFFprobeOutput), stderr: '' });

      const result = await ffprobe.getFileInfo('/mock/video.mp4');

      expect(result.videoStreams).toHaveLength(1);
      expect(result.videoStreams[0]).toEqual({
        codec: 'h264',
        codecLongName: 'H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10',
        width: 1920,
        height: 1080,
        frameRate: '30.00',
        bitrate: '2500000',
        duration: 125.5,
      });
    });

    it('should parse audio streams correctly', async () => {
      mockExecAsync.mockResolvedValue({ stdout: JSON.stringify(mockFFprobeOutput), stderr: '' });

      const result = await ffprobe.getFileInfo('/mock/video.mp4');

      expect(result.audioStreams).toHaveLength(1);
      expect(result.audioStreams[0]).toEqual({
        codec: 'aac',
        codecLongName: 'AAC (Advanced Audio Coding)',
        sampleRate: '48000',
        channels: 2,
        channelLayout: 'stereo',
        bitrate: '128000',
        duration: 125.5,
      });
    });

    it('should count subtitle streams', async () => {
      mockExecAsync.mockResolvedValue({ stdout: JSON.stringify(mockFFprobeOutput), stderr: '' });

      const result = await ffprobe.getFileInfo('/mock/video.mp4');

      expect(result.subtitleCount).toBe(1);
    });

    it('should include tags when present', async () => {
      mockExecAsync.mockResolvedValue({ stdout: JSON.stringify(mockFFprobeOutput), stderr: '' });

      const result = await ffprobe.getFileInfo('/mock/video.mp4');

      expect(result.tags).toBeDefined();
      expect(result.tags?.title).toBe('Test Video');
      expect(result.tags?.encoder).toBe('Lavf58.45.100');
    });

    it('should handle missing optional fields in video stream', async () => {
      const outputWithoutOptionals = {
        ...mockFFprobeOutput,
        streams: [
          {
            index: 0,
            codec_name: 'h264',
            codec_long_name: 'H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10',
            codec_type: 'video' as const,
          },
        ],
      };

      mockExecAsync.mockResolvedValue({ stdout: JSON.stringify(outputWithoutOptionals), stderr: '' });

      const result = await ffprobe.getFileInfo('/mock/video.mp4');

      expect(result.videoStreams[0].width).toBe(0);
      expect(result.videoStreams[0].height).toBe(0);
      expect(result.videoStreams[0].frameRate).toBe('0.00');
    });

    it('should handle file with only audio', async () => {
      const audioOnlyOutput = {
        streams: [
          {
            index: 0,
            codec_name: 'mp3',
            codec_long_name: 'MP3 (MPEG audio layer 3)',
            codec_type: 'audio' as const,
            sample_rate: '44100',
            channels: 2,
          },
        ],
        format: {
          filename: '/mock/audio.mp3',
          nb_streams: 1,
          format_name: 'mp3',
          format_long_name: 'MP2/3 (MPEG audio layer 2/3)',
          duration: '180.0',
          size: '2880000',
          bit_rate: '128000',
        },
      };

      mockExecAsync.mockResolvedValue({ stdout: JSON.stringify(audioOnlyOutput), stderr: '' });

      const result = await ffprobe.getFileInfo('/mock/audio.mp3');

      expect(result.videoStreams).toHaveLength(0);
      expect(result.audioStreams).toHaveLength(1);
      expect(result.audioStreams[0].codec).toBe('mp3');
    });

    it('should throw error when file does not exist', async () => {
      mockExistsSync.mockReturnValue(false);

      await expect(ffprobe.getFileInfo('/mock/nonexistent.mp4')).rejects.toThrow(
        '文件不存在'
      );
    });

    it('should throw error when ffprobe execution fails', async () => {
      mockExecAsync.mockRejectedValue(new Error('FFprobe command failed'));

      await expect(ffprobe.getFileInfo('/mock/video.mp4')).rejects.toThrow(
        'FFprobe 执行失败'
      );
    });

    it('should throw error when JSON parsing fails', async () => {
      mockExecAsync.mockResolvedValue({ stdout: 'Invalid JSON', stderr: '' });

      await expect(ffprobe.getFileInfo('/mock/video.mp4')).rejects.toThrow(
        'FFprobe 执行失败'
      );
    });

    it('should use custom ffprobe path', async () => {
      ffprobe.setPath('/custom/ffprobe');

      mockExecAsync.mockImplementation((cmd: string) => {
        expect(cmd).toContain('/custom/ffprobe');
        return Promise.resolve({ stdout: JSON.stringify(mockFFprobeOutput), stderr: '' });
      });

      await ffprobe.getFileInfo('/mock/video.mp4');
    });

    it('should handle multiple video streams', async () => {
      const multiVideoOutput = {
        ...mockFFprobeOutput,
        streams: [
          {
            index: 0,
            codec_name: 'h264',
            codec_long_name: 'H.264',
            codec_type: 'video' as const,
            width: 1920,
            height: 1080,
            r_frame_rate: '30/1',
          },
          {
            index: 1,
            codec_name: 'h264',
            codec_long_name: 'H.264',
            codec_type: 'video' as const,
            width: 1280,
            height: 720,
            r_frame_rate: '24/1',
          },
        ],
      };

      mockExecAsync.mockResolvedValue({ stdout: JSON.stringify(multiVideoOutput), stderr: '' });

      const result = await ffprobe.getFileInfo('/mock/video.mp4');

      expect(result.videoStreams).toHaveLength(2);
      expect(result.videoStreams[0].width).toBe(1920);
      expect(result.videoStreams[1].width).toBe(1280);
    });

    it('should handle multiple audio streams', async () => {
      const multiAudioOutput = {
        ...mockFFprobeOutput,
        streams: [
          {
            index: 0,
            codec_name: 'aac',
            codec_long_name: 'AAC',
            codec_type: 'audio' as const,
            channels: 2,
          },
          {
            index: 1,
            codec_name: 'ac3',
            codec_long_name: 'AC-3',
            codec_type: 'audio' as const,
            channels: 6,
          },
        ],
      };

      mockExecAsync.mockResolvedValue({ stdout: JSON.stringify(multiAudioOutput), stderr: '' });

      const result = await ffprobe.getFileInfo('/mock/video.mp4');

      expect(result.audioStreams).toHaveLength(2);
      expect(result.audioStreams[0].channels).toBe(2);
      expect(result.audioStreams[1].channels).toBe(6);
    });

    it('should handle file with multiple subtitle streams', async () => {
      const multiSubtitleOutput = {
        ...mockFFprobeOutput,
        streams: [
          ...mockFFprobeOutput.streams,
          {
            index: 3,
            codec_name: 'srt',
            codec_long_name: 'SubRip',
            codec_type: 'subtitle' as const,
          },
          {
            index: 4,
            codec_name: 'ass',
            codec_long_name: 'ASS',
            codec_type: 'subtitle' as const,
          },
        ],
      };

      mockExecAsync.mockResolvedValue({ stdout: JSON.stringify(multiSubtitleOutput), stderr: '' });

      const result = await ffprobe.getFileInfo('/mock/video.mp4');

      expect(result.subtitleCount).toBe(3);
    });
  });

  describe('parseFrameRate (tested via getFileInfo)', () => {
    it('should parse standard frame rate', async () => {
      const output = {
        streams: [
          {
            index: 0,
            codec_name: 'h264',
            codec_long_name: 'H.264',
            codec_type: 'video' as const,
            r_frame_rate: '30/1',
          },
        ],
        format: {
          filename: 'test.mp4',
          nb_streams: 1,
          format_name: 'mp4',
          format_long_name: 'MP4',
          duration: '10',
          size: '1000',
          bit_rate: '800',
        },
      };

      mockExecAsync.mockResolvedValue({ stdout: JSON.stringify(output), stderr: '' });

      const result = await ffprobe.getFileInfo('/mock/video.mp4');
      expect(result.videoStreams[0].frameRate).toBe('30.00');
    });

    it('should parse fractional frame rate', async () => {
      const output = {
        streams: [
          {
            index: 0,
            codec_name: 'h264',
            codec_long_name: 'H.264',
            codec_type: 'video' as const,
            r_frame_rate: '24000/1001', // 23.976 fps
          },
        ],
        format: {
          filename: 'test.mp4',
          nb_streams: 1,
          format_name: 'mp4',
          format_long_name: 'MP4',
          duration: '10',
          size: '1000',
          bit_rate: '800',
        },
      };

      mockExecAsync.mockResolvedValue({ stdout: JSON.stringify(output), stderr: '' });

      const result = await ffprobe.getFileInfo('/mock/video.mp4');
      expect(result.videoStreams[0].frameRate).toBe('23.98');
    });

    it('should handle invalid frame rate format', async () => {
      const output = {
        streams: [
          {
            index: 0,
            codec_name: 'h264',
            codec_long_name: 'H.264',
            codec_type: 'video' as const,
            r_frame_rate: 'invalid',
          },
        ],
        format: {
          filename: 'test.mp4',
          nb_streams: 1,
          format_name: 'mp4',
          format_long_name: 'MP4',
          duration: '10',
          size: '1000',
          bit_rate: '800',
        },
      };

      mockExecAsync.mockResolvedValue({ stdout: JSON.stringify(output), stderr: '' });

      const result = await ffprobe.getFileInfo('/mock/video.mp4');
      expect(result.videoStreams[0].frameRate).toBe('invalid');
    });
  });

  describe('formatDuration', () => {
    it('should format seconds only', () => {
      expect(FFprobe.formatDuration(30)).toBe('00:00:30');
      expect(FFprobe.formatDuration(59)).toBe('00:00:59');
    });

    it('should format minutes and seconds', () => {
      expect(FFprobe.formatDuration(90)).toBe('00:01:30');
      expect(FFprobe.formatDuration(125)).toBe('00:02:05');
    });

    it('should format hours, minutes, and seconds', () => {
      expect(FFprobe.formatDuration(3600)).toBe('01:00:00');
      expect(FFprobe.formatDuration(3665)).toBe('01:01:05');
      expect(FFprobe.formatDuration(7384)).toBe('02:03:04');
    });

    it('should format zero', () => {
      expect(FFprobe.formatDuration(0)).toBe('00:00:00');
    });

    it('should handle decimal seconds', () => {
      expect(FFprobe.formatDuration(90.7)).toBe('00:01:30');
      expect(FFprobe.formatDuration(125.9)).toBe('00:02:05');
    });
  });

  describe('formatSize', () => {
    it('should format bytes', () => {
      expect(FFprobe.formatSize(0)).toBe('0 B');
      expect(FFprobe.formatSize(500)).toBe('500 B');
      expect(FFprobe.formatSize(1000)).toBe('1000 B');
    });

    it('should format kilobytes', () => {
      expect(FFprobe.formatSize(1024)).toBe('1 KB');
      expect(FFprobe.formatSize(2048)).toBe('2 KB');
      expect(FFprobe.formatSize(1536)).toBe('1.5 KB');
    });

    it('should format megabytes', () => {
      expect(FFprobe.formatSize(1024 * 1024)).toBe('1 MB');
      expect(FFprobe.formatSize(1024 * 1024 * 2.5)).toBe('2.5 MB');
    });

    it('should format gigabytes', () => {
      expect(FFprobe.formatSize(1024 * 1024 * 1024)).toBe('1 GB');
      expect(FFprobe.formatSize(1024 * 1024 * 1024 * 3.7)).toBe('3.7 GB');
    });

    it('should format terabytes', () => {
      expect(FFprobe.formatSize(1024 * 1024 * 1024 * 1024)).toBe('1 TB');
    });
  });

  describe('formatBitrate', () => {
    it('should format bits per second', () => {
      expect(FFprobe.formatBitrate(0)).toBe('0 bps');
      expect(FFprobe.formatBitrate(500)).toBe('500 bps');
      expect(FFprobe.formatBitrate(999)).toBe('999 bps');
    });

    it('should format kilobits per second', () => {
      expect(FFprobe.formatBitrate(1000)).toBe('1 Kbps');
      expect(FFprobe.formatBitrate(2500)).toBe('2.5 Kbps');
      expect(FFprobe.formatBitrate(128000)).toBe('128 Kbps');
    });

    it('should format megabits per second', () => {
      expect(FFprobe.formatBitrate(1000000)).toBe('1 Mbps');
      expect(FFprobe.formatBitrate(2500000)).toBe('2.5 Mbps');
    });

    it('should format gigabits per second', () => {
      expect(FFprobe.formatBitrate(1000000000)).toBe('1 Gbps');
      expect(FFprobe.formatBitrate(3700000000)).toBe('3.7 Gbps');
    });
  });
});
