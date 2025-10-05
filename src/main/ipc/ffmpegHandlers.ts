import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '@shared/constants';
import { FFmpegDetector } from '../ffmpeg/detector';
import { FFprobe } from '../ffmpeg/ffprobe';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';

let ffprobeInstance: FFprobe | null = null;

/**
 * 获取或创建 FFprobe 实例
 */
async function getFFprobe(): Promise<FFprobe> {
  if (!ffprobeInstance) {
    // 优先使用内置的 ffprobe
    let ffprobePath = ffprobeInstaller.path as string;

    // 处理 ASAR 打包路径
    if (ffprobePath && ffprobePath.includes('app.asar')) {
      ffprobePath = ffprobePath.replace('app.asar', 'app.asar.unpacked');
    }

    if (!ffprobePath) {
      // 回退：尝试从 ffmpeg 路径推断
      const detector = new FFmpegDetector();
      const info = await detector.detect();

      if (!info.isInstalled || !info.path) {
        throw new Error('FFmpeg 未安装或未找到');
      }

      // ffprobe 通常和 ffmpeg 在同一目录
      ffprobePath = info.path.replace('ffmpeg', 'ffprobe');
    }

    ffprobeInstance = new FFprobe(ffprobePath);
  }

  return ffprobeInstance;
}

export function registerFFmpegHandlers() {
  const detector = new FFmpegDetector();

  // 检测 FFmpeg
  ipcMain.handle(IPC_CHANNELS.FFMPEG_DETECT, async () => {
    return await detector.detect();
  });

  // 获取媒体文件信息
  ipcMain.handle(IPC_CHANNELS.FFPROBE_GET_MEDIA_INFO, async (_event, filePath: string) => {
    try {
      const ffprobe = await getFFprobe();
      return await ffprobe.getFileInfo(filePath);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`获取文件信息失败: ${error.message}`);
      }
      throw error;
    }
  });
}
