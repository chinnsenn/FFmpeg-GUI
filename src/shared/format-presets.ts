import type { VideoCodec, AudioCodec, VideoQuality } from './types';

/**
 * 支持的输出格式
 */
export const OUTPUT_FORMATS = [
  // 视频格式
  { value: 'mp4', label: 'MP4', type: 'video' },
  { value: 'avi', label: 'AVI', type: 'video' },
  { value: 'mkv', label: 'MKV', type: 'video' },
  { value: 'mov', label: 'MOV', type: 'video' },
  { value: 'webm', label: 'WebM', type: 'video' },
  { value: 'flv', label: 'FLV', type: 'video' },
  { value: 'wmv', label: 'WMV', type: 'video' },
  { value: 'mpg', label: 'MPG', type: 'video' },
  { value: 'mpeg', label: 'MPEG', type: 'video' },
  { value: '3gp', label: '3GP', type: 'video' },
  { value: 'ogv', label: 'OGV', type: 'video' },
  { value: 'ts', label: 'TS', type: 'video' },
  { value: 'm4v', label: 'M4V', type: 'video' },

  // 音频格式
  { value: 'mp3', label: 'MP3', type: 'audio' },
  { value: 'aac', label: 'AAC', type: 'audio' },
  { value: 'flac', label: 'FLAC', type: 'audio' },
  { value: 'wav', label: 'WAV', type: 'audio' },
  { value: 'ogg', label: 'OGG', type: 'audio' },
  { value: 'm4a', label: 'M4A', type: 'audio' },
  { value: 'wma', label: 'WMA', type: 'audio' },
  { value: 'opus', label: 'Opus', type: 'audio' },
  { value: 'alac', label: 'ALAC', type: 'audio' },
] as const;

/**
 * 视频编解码器选项
 */
export const VIDEO_CODECS: { value: VideoCodec; label: string; description: string }[] = [
  { value: 'libx264', label: 'H.264 (x264)', description: '广泛兼容,质量好' },
  { value: 'libx265', label: 'H.265 (x265)', description: '更高压缩率,较新' },
  { value: 'vp9', label: 'VP9', description: 'WebM专用,开源' },
  { value: 'av1', label: 'AV1', description: '最新标准,高效' },
  { value: 'copy', label: '复制流', description: '不重新编码,快速' },
];

/**
 * 音频编解码器选项
 */
export const AUDIO_CODECS: { value: AudioCodec; label: string; description: string }[] = [
  { value: 'aac', label: 'AAC', description: '高质量,广泛支持' },
  { value: 'mp3', label: 'MP3', description: '通用格式' },
  { value: 'opus', label: 'Opus', description: '高效,低延迟' },
  { value: 'vorbis', label: 'Vorbis', description: '开源,高质量' },
  { value: 'copy', label: '复制流', description: '不重新编码' },
];

/**
 * 质量预设选项
 */
export const QUALITY_PRESETS: { value: VideoQuality; label: string; description: string }[] = [
  { value: 'ultrafast', label: '极速', description: '最快,质量最低' },
  { value: 'superfast', label: '超快', description: '很快,质量较低' },
  { value: 'veryfast', label: '非常快', description: '快速,质量一般' },
  { value: 'faster', label: '较快', description: '稍快,质量较好' },
  { value: 'fast', label: '快速', description: '快,质量好' },
  { value: 'medium', label: '中等', description: '平衡速度和质量' },
  { value: 'slow', label: '慢速', description: '慢,质量很好' },
  { value: 'slower', label: '较慢', description: '很慢,质量更好' },
  { value: 'veryslow', label: '非常慢', description: '最慢,质量最好' },
];

/**
 * 常见分辨率选项
 */
export const RESOLUTIONS = [
  { value: '', label: '原始分辨率' },
  { value: '3840x2160', label: '4K (3840x2160)' },
  { value: '2560x1440', label: '2K (2560x1440)' },
  { value: '1920x1080', label: '1080p (1920x1080)' },
  { value: '1280x720', label: '720p (1280x720)' },
  { value: '854x480', label: '480p (854x480)' },
  { value: '640x360', label: '360p (640x360)' },
] as const;

/**
 * 常见帧率选项
 */
export const FRAME_RATES = [
  { value: 0, label: '原始帧率' },
  { value: 24, label: '24 fps (电影)' },
  { value: 25, label: '25 fps (PAL)' },
  { value: 30, label: '30 fps (标准)' },
  { value: 50, label: '50 fps (流畅)' },
  { value: 60, label: '60 fps (高流畅)' },
  { value: 120, label: '120 fps (超高)' },
] as const;

/**
 * 视频比特率预设
 */
export const VIDEO_BITRATES = [
  { value: '', label: '自动' },
  { value: '500k', label: '500 Kbps (低)' },
  { value: '1M', label: '1 Mbps (中低)' },
  { value: '2M', label: '2 Mbps (中)' },
  { value: '4M', label: '4 Mbps (中高)' },
  { value: '8M', label: '8 Mbps (高)' },
  { value: '16M', label: '16 Mbps (超高)' },
] as const;

/**
 * 音频比特率预设
 */
export const AUDIO_BITRATES = [
  { value: '', label: '自动' },
  { value: '64k', label: '64 Kbps' },
  { value: '96k', label: '96 Kbps' },
  { value: '128k', label: '128 Kbps' },
  { value: '192k', label: '192 Kbps' },
  { value: '256k', label: '256 Kbps' },
  { value: '320k', label: '320 Kbps' },
] as const;

/**
 * 快速转换预设
 */
export interface ConversionPreset {
  name: string;
  description: string;
  format: string;
  videoCodec?: VideoCodec;
  audioCodec?: AudioCodec;
  quality?: VideoQuality;
  videoBitrate?: string;
  audioBitrate?: string;
  resolution?: string;
  fps?: number;
}

export const CONVERSION_PRESETS: ConversionPreset[] = [
  {
    name: '高质量 MP4',
    description: '适合存档和分享',
    format: 'mp4',
    videoCodec: 'libx264',
    audioCodec: 'aac',
    quality: 'slow',
    videoBitrate: '8M',
    audioBitrate: '192k',
  },
  {
    name: '小文件 MP4',
    description: '节省空间,适合移动设备',
    format: 'mp4',
    videoCodec: 'libx265',
    audioCodec: 'aac',
    quality: 'medium',
    videoBitrate: '2M',
    audioBitrate: '128k',
    resolution: '1280x720',
  },
  {
    name: 'Web 视频 (WebM)',
    description: '适合网页播放',
    format: 'webm',
    videoCodec: 'vp9',
    audioCodec: 'opus',
    quality: 'medium',
    videoBitrate: '4M',
    audioBitrate: '128k',
  },
  {
    name: '快速转换',
    description: '最快速度,质量一般',
    format: 'mp4',
    videoCodec: 'libx264',
    audioCodec: 'aac',
    quality: 'ultrafast',
    videoBitrate: '4M',
    audioBitrate: '128k',
  },
  {
    name: '仅提取音频',
    description: '提取为 MP3 音频',
    format: 'mp3',
    audioCodec: 'mp3',
    audioBitrate: '192k',
  },
  {
    name: '无损音频 (FLAC)',
    description: '无损压缩音频',
    format: 'flac',
    audioCodec: 'copy',
  },
  {
    name: '1080p 高质量',
    description: 'Full HD 高质量视频',
    format: 'mp4',
    videoCodec: 'libx264',
    audioCodec: 'aac',
    quality: 'slow',
    videoBitrate: '8M',
    audioBitrate: '192k',
    resolution: '1920x1080',
  },
  {
    name: '720p 标准',
    description: 'HD 标准质量视频',
    format: 'mp4',
    videoCodec: 'libx264',
    audioCodec: 'aac',
    quality: 'medium',
    videoBitrate: '4M',
    audioBitrate: '128k',
    resolution: '1280x720',
  },
];

/**
 * 压缩预设接口
 */
export interface CompressionPreset {
  name: string;
  description: string;
  videoCodec?: VideoCodec;
  audioCodec?: AudioCodec;
  preset?: VideoQuality;
  crf?: number;
  targetSize?: number; // MB
  resolution?: string;
}

/**
 * 快速压缩预设
 */
export const COMPRESSION_PRESETS: CompressionPreset[] = [
  {
    name: '轻度压缩 (90%)',
    description: '保持高质量,轻微减小文件',
    videoCodec: 'libx264',
    audioCodec: 'aac',
    preset: 'medium',
    crf: 18,
  },
  {
    name: '中度压缩 (70%)',
    description: '平衡质量和大小',
    videoCodec: 'libx264',
    audioCodec: 'aac',
    preset: 'medium',
    crf: 23,
  },
  {
    name: '高度压缩 (50%)',
    description: '明显减小文件,保持可接受质量',
    videoCodec: 'libx264',
    audioCodec: 'aac',
    preset: 'medium',
    crf: 28,
  },
  {
    name: 'H.265 高效压缩',
    description: '使用 H.265 编码器,更高压缩率',
    videoCodec: 'libx265',
    audioCodec: 'aac',
    preset: 'medium',
    crf: 28,
  },
  {
    name: '社交媒体优化',
    description: '适合上传到社交平台',
    videoCodec: 'libx264',
    audioCodec: 'aac',
    preset: 'fast',
    crf: 23,
    resolution: '1280x720',
  },
  {
    name: '邮件附件 (小文件)',
    description: '极小文件,适合邮件发送',
    videoCodec: 'libx264',
    audioCodec: 'aac',
    preset: 'fast',
    crf: 32,
    resolution: '854x480',
  },
];

/**
 * CRF 质量等级说明
 */
export const CRF_LEVELS = [
  { value: 18, label: '最高质量 (CRF 18)', description: '视觉无损,文件较大' },
  { value: 20, label: '极高质量 (CRF 20)', description: '接近无损' },
  { value: 23, label: '高质量 (CRF 23)', description: '推荐值,质量很好' },
  { value: 26, label: '中等质量 (CRF 26)', description: '平衡质量和大小' },
  { value: 28, label: '较低质量 (CRF 28)', description: '文件较小,质量可接受' },
  { value: 32, label: '低质量 (CRF 32)', description: '小文件,质量下降明显' },
] as const;

/**
 * 快速预设配置（6个简化版本）- 用于 UI 显示
 * 对应 demo HTML 中的图标化预设按钮
 */
export const QUICK_PRESETS = [
  {
    id: 'high-quality',
    icon: '⭐',
    label: '高质量',
    config: {
      videoCodec: 'libx264' as VideoCodec,
      audioCodec: 'aac' as AudioCodec,
      quality: 'slow' as VideoQuality,
      videoBitrate: '8M',
      audioBitrate: '192k',
    }
  },
  {
    id: 'medium',
    icon: '⚡',
    label: '中等',
    config: {
      videoCodec: 'libx264' as VideoCodec,
      audioCodec: 'aac' as AudioCodec,
      quality: 'medium' as VideoQuality,
      videoBitrate: '4M',
      audioBitrate: '128k',
    }
  },
  {
    id: 'low-quality',
    icon: '💨',
    label: '低质量',
    config: {
      videoCodec: 'libx264' as VideoCodec,
      audioCodec: 'aac' as AudioCodec,
      quality: 'fast' as VideoQuality,
      videoBitrate: '2M',
      audioBitrate: '96k',
    }
  },
  {
    id: 'fast',
    icon: '🚀',
    label: '快速',
    config: {
      videoCodec: 'libx264' as VideoCodec,
      audioCodec: 'aac' as AudioCodec,
      quality: 'ultrafast' as VideoQuality,
      videoBitrate: '4M',
      audioBitrate: '128k',
    }
  },
  {
    id: 'mobile',
    icon: '📱',
    label: '移动端',
    config: {
      videoCodec: 'libx265' as VideoCodec,
      audioCodec: 'aac' as AudioCodec,
      quality: 'medium' as VideoQuality,
      videoBitrate: '2M',
      audioBitrate: '128k',
      resolution: '1280x720',
    }
  },
  {
    id: 'web',
    icon: '🌐',
    label: 'Web优化',
    config: {
      videoCodec: 'vp9' as VideoCodec,
      audioCodec: 'opus' as AudioCodec,
      quality: 'medium' as VideoQuality,
      videoBitrate: '4M',
      audioBitrate: '128k',
    }
  },
];
