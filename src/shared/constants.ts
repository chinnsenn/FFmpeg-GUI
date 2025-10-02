// IPC 通道常量定义
export const IPC_CHANNELS = {
  // 系统相关
  SYSTEM_GET_INFO: 'system:getInfo',
  SYSTEM_GET_PATH: 'system:getPath',

  // 文件相关
  FILE_SELECT: 'file:select',
  FILE_SELECT_MULTIPLE: 'file:selectMultiple',
  FILE_GET_INFO: 'file:getInfo',
  FILE_OPEN_FOLDER: 'file:openFolder',

  // 配置相关
  CONFIG_GET: 'config:get',
  CONFIG_SET: 'config:set',

  // FFmpeg 相关
  FFMPEG_DETECT: 'ffmpeg:detect',
  FFMPEG_DOWNLOAD: 'ffmpeg:download',
  FFMPEG_DOWNLOAD_PROGRESS: 'ffmpeg:downloadProgress',

  // FFprobe 相关
  FFPROBE_GET_MEDIA_INFO: 'ffprobe:getMediaInfo',

  // 任务管理相关
  TASK_ADD: 'task:add',
  TASK_ADD_CONVERT: 'task:addConvert',
  TASK_ADD_COMPRESS: 'task:addCompress',
  TASK_CANCEL: 'task:cancel',
  TASK_PAUSE: 'task:pause',
  TASK_RESUME: 'task:resume',
  TASK_GET: 'task:get',
  TASK_GET_ALL: 'task:getAll',
  TASK_GET_QUEUED: 'task:getQueued',
  TASK_GET_RUNNING: 'task:getRunning',
  TASK_GET_COMPLETED: 'task:getCompleted',
  TASK_CLEAR_COMPLETED: 'task:clearCompleted',
  TASK_SET_MAX_CONCURRENT: 'task:setMaxConcurrent',
  TASK_GET_STATUS: 'task:getStatus',

  // 任务事件通知
  TASK_ADDED: 'task:added',
  TASK_STARTED: 'task:started',
  TASK_PROGRESS: 'task:progress',
  TASK_OUTPUT: 'task:output',
  TASK_COMPLETED: 'task:completed',
  TASK_FAILED: 'task:failed',
  TASK_CANCELLED: 'task:cancelled',

  // 日志相关
  LOG_GET_DIR: 'log:get-dir',
  LOG_GET_FILE: 'log:get-file',
  LOG_READ: 'log:read',
  LOG_CLEAR: 'log:clear',
} as const;

// FFmpeg 下载源配置
export const FFMPEG_DOWNLOAD_SOURCES = {
  'win32-x64': {
    github:
      'https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl.zip',
    mirror: 'https://cdn.example.com/ffmpeg/win64/ffmpeg.zip',
  },
  'win32-arm64': {
    github:
      'https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-winarm64-gpl.zip',
    mirror: 'https://cdn.example.com/ffmpeg/winarm64/ffmpeg.zip',
  },
  'darwin-x64': {
    github: 'https://evermeet.cx/ffmpeg/getrelease/zip',
    mirror: 'https://cdn.example.com/ffmpeg/macos-intel/ffmpeg.zip',
  },
  'darwin-arm64': {
    github: 'https://evermeet.cx/ffmpeg/getrelease/arm64/zip',
    mirror: 'https://cdn.example.com/ffmpeg/macos-arm/ffmpeg.zip',
  },
  'linux-x64': {
    github:
      'https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-linux64-gpl.tar.xz',
    mirror: 'https://cdn.example.com/ffmpeg/linux64/ffmpeg.tar.xz',
  },
} as const;

export const MIN_FFMPEG_VERSION = '4.4';

