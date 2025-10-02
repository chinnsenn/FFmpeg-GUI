// IPC 通信数据类型定义

/**
 * 系统信息接口
 */
export interface SystemInfo {
  platform: NodeJS.Platform;
  arch: string;
  version: string;
  appVersion: string;
}

/**
 * 文件信息接口
 */
export interface FileInfo {
  name: string;
  path: string;
  size: number;
  ext: string;
  duration?: number;
  width?: number;
  height?: number;
  codec?: string;
}

/**
 * 应用配置接口
 */
export interface AppConfig {
  ffmpegPath?: string;
  outputPath?: string;
  theme: 'light' | 'dark' | 'system';
  language: 'zh-CN' | 'en-US';
  maxConcurrentTasks: number;
}

/**
 * 任务状态
 */
export type TaskStatus = 'pending' | 'running' | 'paused' | 'completed' | 'failed' | 'cancelled';

/**
 * 任务接口
 */
export interface Task {
  id: string;
  command: string[];
  status: TaskStatus;
  progress: number;
  error?: string;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  priority?: number;
}

/**
 * 任务管理器状态
 */
export interface TaskManagerStatus {
  queued: number;
  running: number;
  completed: number;
  maxConcurrent: number;
}

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
 * 视频编解码器
 */
export type VideoCodec = 'libx264' | 'libx265' | 'copy' | 'vp9' | 'av1';

/**
 * 音频编解码器
 */
export type AudioCodec = 'aac' | 'mp3' | 'copy' | 'opus' | 'vorbis';

/**
 * 视频质量预设
 */
export type VideoQuality = 'ultrafast' | 'superfast' | 'veryfast' | 'faster' | 'fast' | 'medium' | 'slow' | 'slower' | 'veryslow';

/**
 * 格式转换选项
 */
export interface ConvertOptions {
  input: string;
  output: string;
  videoCodec?: VideoCodec;
  audioCodec?: AudioCodec;
  videoBitrate?: string;
  audioBitrate?: string;
  fps?: number;
  resolution?: string;
  quality?: VideoQuality;
  overwrite?: boolean;
}

/**
 * 视频压缩选项
 */
export interface CompressOptions {
  input: string;
  output: string;
  targetSize?: number; // MB
  crf?: number; // 0-51, lower is better quality
  preset?: VideoQuality;
  videoCodec?: VideoCodec;
  audioCodec?: AudioCodec;
  resolution?: string;
  overwrite?: boolean;
}

/**
 * 命令构建结果
 */
export interface BuildResult {
  success: boolean;
  command?: string[];
  error?: string;
}

/**
 * 视频流信息
 */
export interface VideoStreamInfo {
  codec: string;
  codecLongName: string;
  width: number;
  height: number;
  frameRate: string;
  bitrate?: string;
  duration?: number;
}

/**
 * 音频流信息
 */
export interface AudioStreamInfo {
  codec: string;
  codecLongName: string;
  sampleRate?: string;
  channels?: number;
  channelLayout?: string;
  bitrate?: string;
  duration?: number;
}

/**
 * 媒体文件元信息
 */
export interface MediaFileInfo {
  filename: string;
  format: string;
  formatLongName: string;
  duration: number;
  size: number;
  bitrate: number;
  videoStreams: VideoStreamInfo[];
  audioStreams: AudioStreamInfo[];
  subtitleCount: number;
  tags?: {
    [key: string]: string;
  };
}
