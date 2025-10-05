/**
 * FFmpeg 进度信息
 */
export interface FFmpegProgress {
  frame: number;
  fps: number;
  bitrate: string;
  totalSize: number;
  currentTime: number;
  speed: number;
  percent: number;
}

/**
 * FFmpeg 输出解析器
 * 负责解析 FFmpeg 的 stderr 输出，提取进度信息、持续时间和错误信息
 */
export class FFmpegParser {
  private totalDuration: number = 0;

  /**
   * 设置总时长（秒）
   */
  setTotalDuration(duration: number) {
    this.totalDuration = duration;
  }

  /**
   * 获取总时长
   */
  getTotalDuration(): number {
    return this.totalDuration;
  }

  /**
   * 解析进度信息
   * FFmpeg 输出格式示例:
   * frame=  123 fps= 45 q=28.0 size=1024kB time=00:00:05.12 bitrate=1638.4kbits/s speed=1.87x
   */
  parseProgress(output: string): FFmpegProgress | null {
    const frameMatch = output.match(/frame=\s*(\d+)/);
    const fpsMatch = output.match(/fps=\s*([\d.]+)/);
    const bitrateMatch = output.match(/bitrate=\s*([\d.]+\s*\w*bits?\/s)/);
    const sizeMatch = output.match(/size=\s*(\d+)kB/);
    const timeMatch = output.match(/time=(\d+):(\d+):([\d.]+)/);
    const speedMatch = output.match(/speed=\s*([\d.]+)x/);

    // 必须有时间信息才能算作有效的进度输出
    if (!timeMatch) return null;

    const hours = parseInt(timeMatch[1]);
    const minutes = parseInt(timeMatch[2]);
    const seconds = parseFloat(timeMatch[3]);
    const currentTime = hours * 3600 + minutes * 60 + seconds;

    // 计算百分比
    const percent =
      this.totalDuration > 0 ? (currentTime / this.totalDuration) * 100 : 0;

    return {
      frame: frameMatch ? parseInt(frameMatch[1]) : 0,
      fps: fpsMatch ? parseFloat(fpsMatch[1]) : 0,
      bitrate: bitrateMatch ? bitrateMatch[1].trim() : '0',
      totalSize: sizeMatch ? parseInt(sizeMatch[1]) : 0,
      currentTime,
      speed: speedMatch ? parseFloat(speedMatch[1]) : 1,
      percent: Math.min(Math.max(percent, 0), 100), // 限制在 0-100 之间
    };
  }

  /**
   * 解析持续时间
   * 从 FFmpeg 输出中提取视频/音频的总时长
   * 格式: Duration: 00:05:30.25, start: 0.000000, bitrate: 1234 kb/s
   */
  parseDuration(output: string): number | null {
    const match = output.match(/Duration:\s*(\d+):(\d+):([\d.]+)/);
    if (!match) return null;

    const hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const seconds = parseFloat(match[3]);

    const duration = hours * 3600 + minutes * 60 + seconds;

    // 自动设置总时长
    if (duration > 0) {
      this.totalDuration = duration;
    }

    return duration;
  }

  /**
   * 解析错误信息
   * 提取 FFmpeg 输出中的错误信息
   */
  parseError(output: string): string | null {
    // 检查常见的错误标识
    if (
      output.includes('Error') ||
      output.includes('Invalid') ||
      output.includes('failed') ||
      output.includes('could not')
    ) {
      // 提取错误行
      const lines = output.split('\n');
      for (const line of lines) {
        if (
          line.includes('Error') ||
          line.includes('Invalid') ||
          line.includes('failed') ||
          line.includes('could not')
        ) {
          return line.trim();
        }
      }
      return output.trim();
    }
    return null;
  }

  /**
   * 解析输入文件信息
   * 提取输入文件的元数据（编解码器、分辨率等）
   */
  parseInputInfo(output: string): Record<string, string> | null {
    const info: Record<string, string> = {};

    // 提取视频流信息
    const videoMatch = output.match(
      /Stream #\d+:\d+.*Video:\s*(\w+).*,\s*(\d+x\d+)/,
    );
    if (videoMatch) {
      info.videoCodec = videoMatch[1];
      info.resolution = videoMatch[2];
    }

    // 提取音频流信息
    const audioMatch = output.match(/Stream #\d+:\d+.*Audio:\s*(\w+)/);
    if (audioMatch) {
      info.audioCodec = audioMatch[1];
    }

    // 提取帧率
    const fpsMatch = output.match(/([\d.]+)\s*fps/);
    if (fpsMatch) {
      info.fps = fpsMatch[1];
    }

    return Object.keys(info).length > 0 ? info : null;
  }

  /**
   * 重置解析器状态
   */
  reset() {
    this.totalDuration = 0;
  }

  /**
   * 格式化时间（秒）为可读格式
   */
  static formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  }

  /**
   * 格式化文件大小
   */
  static formatSize(kb: number): string {
    if (kb < 1024) return `${kb} KB`;
    if (kb < 1024 * 1024) return `${(kb / 1024).toFixed(2)} MB`;
    return `${(kb / 1024 / 1024).toFixed(2)} GB`;
  }
}
