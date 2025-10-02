import type {
  ConvertOptions,
  CompressOptions,
  BuildResult,
} from '@shared/types';
import { existsSync } from 'fs';
import { resolve } from 'path';

/**
 * FFmpeg 命令构建器
 * 负责根据不同的转换选项生成正确的 FFmpeg 命令参数
 */
export class FFmpegCommandBuilder {
  /**
   * 验证输入文件
   */
  private validateInput(input: string): string | null {
    if (!input) {
      return '输入文件路径不能为空';
    }

    const resolvedPath = resolve(input);
    if (!existsSync(resolvedPath)) {
      return `输入文件不存在: ${resolvedPath}`;
    }

    return null;
  }

  /**
   * 验证输出文件
   */
  private validateOutput(output: string): string | null {
    if (!output) {
      return '输出文件路径不能为空';
    }

    return null;
  }

  /**
   * 构建格式转换命令
   */
  buildConvertCommand(options: ConvertOptions): BuildResult {
    // 验证输入输出
    const inputError = this.validateInput(options.input);
    if (inputError) {
      return { success: false, error: inputError };
    }

    const outputError = this.validateOutput(options.output);
    if (outputError) {
      return { success: false, error: outputError };
    }

    const args: string[] = [];

    // 覆盖输出文件（如果存在）
    if (options.overwrite) {
      args.push('-y');
    }

    // 输入文件
    args.push('-i', resolve(options.input));

    // 视频编解码器
    if (options.videoCodec) {
      args.push('-c:v', options.videoCodec);
    }

    // 音频编解码器
    if (options.audioCodec) {
      args.push('-c:a', options.audioCodec);
    }

    // 视频比特率
    if (options.videoBitrate) {
      args.push('-b:v', options.videoBitrate);
    }

    // 音频比特率
    if (options.audioBitrate) {
      args.push('-b:a', options.audioBitrate);
    }

    // 帧率
    if (options.fps) {
      args.push('-r', options.fps.toString());
    }

    // 分辨率
    if (options.resolution) {
      args.push('-s', options.resolution);
    }

    // 质量预设
    if (options.quality) {
      args.push('-preset', options.quality);
    }

    // 输出文件
    args.push(resolve(options.output));

    return {
      success: true,
      command: args,
    };
  }

  /**
   * 构建视频压缩命令
   */
  buildCompressCommand(options: CompressOptions): BuildResult {
    // 验证输入输出
    const inputError = this.validateInput(options.input);
    if (inputError) {
      return { success: false, error: inputError };
    }

    const outputError = this.validateOutput(options.output);
    if (outputError) {
      return { success: false, error: outputError };
    }

    const args: string[] = [];

    // 覆盖输出文件
    if (options.overwrite) {
      args.push('-y');
    }

    // 输入文件
    args.push('-i', resolve(options.input));

    // 视频编解码器（默认使用 libx264）
    const videoCodec = options.videoCodec || 'libx264';
    args.push('-c:v', videoCodec);

    // CRF（恒定质量因子）优先
    if (options.crf !== undefined) {
      // CRF: 0-51, 18-28 是合理范围，23 是默认值
      const crf = Math.max(0, Math.min(51, options.crf));
      args.push('-crf', crf.toString());
    } else if (options.targetSize) {
      // 如果指定了目标大小，计算比特率
      // 这是一个简化的计算，实际应该考虑音频比特率和视频时长
      // targetSize (MB) * 8 * 1024 / duration (s) = bitrate (kbps)
      // 这里我们只设置一个估算值，实际使用时需要先获取视频时长
      const estimatedBitrate = Math.floor((options.targetSize * 8 * 1024) / 60); // 假设60秒
      args.push('-b:v', `${estimatedBitrate}k`);
    }

    // 质量预设
    if (options.preset) {
      args.push('-preset', options.preset);
    }

    // 音频编解码器
    if (options.audioCodec) {
      args.push('-c:a', options.audioCodec);
    } else {
      // 默认复制音频流
      args.push('-c:a', 'copy');
    }

    // 分辨率
    if (options.resolution) {
      args.push('-s', options.resolution);
    }

    // 输出文件
    args.push(resolve(options.output));

    return {
      success: true,
      command: args,
    };
  }

  /**
   * 构建提取音频命令
   */
  buildExtractAudioCommand(input: string, output: string, audioCodec: string = 'mp3'): BuildResult {
    const inputError = this.validateInput(input);
    if (inputError) {
      return { success: false, error: inputError };
    }

    const outputError = this.validateOutput(output);
    if (outputError) {
      return { success: false, error: outputError };
    }

    const args: string[] = [
      '-y',
      '-i', resolve(input),
      '-vn', // 不包含视频
      '-acodec', audioCodec,
      resolve(output),
    ];

    return {
      success: true,
      command: args,
    };
  }

  /**
   * 构建裁剪视频命令
   */
  buildTrimCommand(
    input: string,
    output: string,
    startTime: string,
    duration?: string,
    endTime?: string,
  ): BuildResult {
    const inputError = this.validateInput(input);
    if (inputError) {
      return { success: false, error: inputError };
    }

    const outputError = this.validateOutput(output);
    if (outputError) {
      return { success: false, error: outputError };
    }

    const args: string[] = ['-y'];

    // 开始时间
    if (startTime) {
      args.push('-ss', startTime);
    }

    // 输入文件
    args.push('-i', resolve(input));

    // 持续时间或结束时间
    if (duration) {
      args.push('-t', duration);
    } else if (endTime) {
      args.push('-to', endTime);
    }

    // 复制编解码器（快速裁剪）
    args.push('-c', 'copy');

    // 输出文件
    args.push(resolve(output));

    return {
      success: true,
      command: args,
    };
  }

  /**
   * 构建合并视频命令
   */
  buildMergeCommand(inputs: string[], output: string): BuildResult {
    if (!inputs || inputs.length === 0) {
      return { success: false, error: '输入文件列表不能为空' };
    }

    for (const input of inputs) {
      const error = this.validateInput(input);
      if (error) {
        return { success: false, error };
      }
    }

    const outputError = this.validateOutput(output);
    if (outputError) {
      return { success: false, error: outputError };
    }

    // 使用 concat 协议合并视频
    const args: string[] = ['-y'];

    // 添加所有输入文件
    for (const input of inputs) {
      args.push('-i', resolve(input));
    }

    // 使用 concat filter
    const filterComplex = inputs.map((_, i) => `[${i}:v][${i}:a]`).join('') +
      `concat=n=${inputs.length}:v=1:a=1[outv][outa]`;

    args.push(
      '-filter_complex', filterComplex,
      '-map', '[outv]',
      '-map', '[outa]',
      resolve(output),
    );

    return {
      success: true,
      command: args,
    };
  }

  /**
   * 构建添加水印命令
   */
  buildWatermarkCommand(
    videoInput: string,
    watermarkInput: string,
    output: string,
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' = 'top-right',
    padding: number = 10,
  ): BuildResult {
    const videoError = this.validateInput(videoInput);
    if (videoError) {
      return { success: false, error: videoError };
    }

    const watermarkError = this.validateInput(watermarkInput);
    if (watermarkError) {
      return { success: false, error: watermarkError };
    }

    const outputError = this.validateOutput(output);
    if (outputError) {
      return { success: false, error: outputError };
    }

    // 计算水印位置
    let overlayPosition: string;
    switch (position) {
      case 'top-left':
        overlayPosition = `${padding}:${padding}`;
        break;
      case 'top-right':
        overlayPosition = `main_w-overlay_w-${padding}:${padding}`;
        break;
      case 'bottom-left':
        overlayPosition = `${padding}:main_h-overlay_h-${padding}`;
        break;
      case 'bottom-right':
        overlayPosition = `main_w-overlay_w-${padding}:main_h-overlay_h-${padding}`;
        break;
    }

    const args: string[] = [
      '-y',
      '-i', resolve(videoInput),
      '-i', resolve(watermarkInput),
      '-filter_complex', `overlay=${overlayPosition}`,
      resolve(output),
    ];

    return {
      success: true,
      command: args,
    };
  }
}
