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
