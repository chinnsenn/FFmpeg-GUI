// IPC 通道常量定义
export const IPC_CHANNELS = {
  // 系统相关
  SYSTEM_GET_INFO: 'system:getInfo',
  SYSTEM_GET_PATH: 'system:getPath',

  // 文件相关
  FILE_SELECT: 'file:select',
  FILE_GET_INFO: 'file:getInfo',
  FILE_OPEN_FOLDER: 'file:openFolder',

  // 配置相关
  CONFIG_GET: 'config:get',
  CONFIG_SET: 'config:set',

  // FFmpeg 相关（后续任务实现）
  FFMPEG_CONVERT: 'ffmpeg:convert',
  FFMPEG_CANCEL: 'ffmpeg:cancel',
  FFMPEG_PROGRESS: 'ffmpeg:progress',
} as const;
