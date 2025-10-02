import { exec } from 'child_process';
import { promisify } from 'util';
import { existsSync } from 'fs';
import { resolve } from 'path';
import type { MediaFileInfo, VideoStreamInfo, AudioStreamInfo } from '@shared/types';

const execAsync = promisify(exec);

/**
 * FFprobe 返回的流信息
 */
interface FFprobeStream {
  index: number;
  codec_name: string;
  codec_long_name: string;
  codec_type: 'video' | 'audio' | 'subtitle' | 'data' | 'attachment';
  width?: number;
  height?: number;
  r_frame_rate?: string;
  duration?: string;
  bit_rate?: string;
  sample_rate?: string;
  channels?: number;
  channel_layout?: string;
}

/**
 * FFprobe 返回的格式信息
 */
interface FFprobeFormat {
  filename: string;
  nb_streams: number;
  format_name: string;
  format_long_name: string;
  duration: string;
  size: string;
  bit_rate: string;
  tags?: {
    [key: string]: string;
  };
}

/**
 * FFprobe 原始输出
 */
interface FFprobeOutput {
  streams: FFprobeStream[];
  format: FFprobeFormat;
}

/**
 * FFprobe 工具类
 * 用于读取视频文件的元信息
 */
export class FFprobe {
  private ffprobePath: string;

  constructor(ffprobePath?: string) {
    // 如果没有提供路径，假设 ffprobe 在 PATH 中
    this.ffprobePath = ffprobePath || 'ffprobe';
  }

  /**
   * 设置 FFprobe 路径
   */
  setPath(path: string): void {
    this.ffprobePath = path;
  }

  /**
   * 获取文件元信息
   */
  async getFileInfo(filePath: string): Promise<MediaFileInfo> {
    // 验证文件存在
    const resolvedPath = resolve(filePath);
    if (!existsSync(resolvedPath)) {
      throw new Error(`文件不存在: ${resolvedPath}`);
    }

    try {
      // 调用 ffprobe 获取 JSON 格式的文件信息
      const { stdout } = await execAsync(
        `"${this.ffprobePath}" -v quiet -print_format json -show_format -show_streams "${resolvedPath}"`
      );

      const probeData: FFprobeOutput = JSON.parse(stdout);

      return this.parseProbeData(probeData);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`FFprobe 执行失败: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * 解析 FFprobe 输出数据
   */
  private parseProbeData(data: FFprobeOutput): MediaFileInfo {
    const videoStreams: VideoStreamInfo[] = [];
    const audioStreams: AudioStreamInfo[] = [];
    let subtitleCount = 0;

    // 解析所有流
    for (const stream of data.streams) {
      if (stream.codec_type === 'video') {
        videoStreams.push({
          codec: stream.codec_name,
          codecLongName: stream.codec_long_name,
          width: stream.width || 0,
          height: stream.height || 0,
          frameRate: this.parseFrameRate(stream.r_frame_rate || '0/1'),
          bitrate: stream.bit_rate,
          duration: stream.duration ? parseFloat(stream.duration) : undefined,
        });
      } else if (stream.codec_type === 'audio') {
        audioStreams.push({
          codec: stream.codec_name,
          codecLongName: stream.codec_long_name,
          sampleRate: stream.sample_rate,
          channels: stream.channels,
          channelLayout: stream.channel_layout,
          bitrate: stream.bit_rate,
          duration: stream.duration ? parseFloat(stream.duration) : undefined,
        });
      } else if (stream.codec_type === 'subtitle') {
        subtitleCount++;
      }
    }

    return {
      filename: data.format.filename,
      format: data.format.format_name,
      formatLongName: data.format.format_long_name,
      duration: parseFloat(data.format.duration),
      size: parseInt(data.format.size),
      bitrate: parseInt(data.format.bit_rate),
      videoStreams,
      audioStreams,
      subtitleCount,
      tags: data.format.tags,
    };
  }

  /**
   * 解析帧率字符串（如 "30/1" -> "30"）
   */
  private parseFrameRate(frameRate: string): string {
    const parts = frameRate.split('/');
    if (parts.length === 2) {
      const num = parseFloat(parts[0]);
      const den = parseFloat(parts[1]);
      if (den !== 0) {
        return (num / den).toFixed(2);
      }
    }
    return frameRate;
  }

  /**
   * 格式化时长（秒 -> HH:MM:SS）
   */
  static formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    return [hours, minutes, secs]
      .map((v) => v.toString().padStart(2, '0'))
      .join(':');
  }

  /**
   * 格式化文件大小
   */
  static formatSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * 格式化比特率
   */
  static formatBitrate(bps: number): string {
    if (bps === 0) return '0 bps';
    const k = 1000;
    const sizes = ['bps', 'Kbps', 'Mbps', 'Gbps'];
    const i = Math.floor(Math.log(bps) / Math.log(k));
    return Math.round(bps / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}
