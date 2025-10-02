import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { IPC_CHANNELS } from '@shared/constants';
import { FFmpegDetector } from '../ffmpeg/detector';
import { FFmpegDownloader } from '../ffmpeg/downloader';
import { FFprobe } from '../ffmpeg/ffprobe';

let ffprobeInstance: FFprobe | null = null;

/**
 * 获取或创建 FFprobe 实例
 */
async function getFFprobe(): Promise<FFprobe> {
  if (!ffprobeInstance) {
    const detector = new FFmpegDetector();
    const info = await detector.detect();

    if (!info.isInstalled || !info.path) {
      throw new Error('FFmpeg 未安装或未找到');
    }

    // ffprobe 通常和 ffmpeg 在同一目录
    const ffprobePath = info.path.replace('ffmpeg', 'ffprobe');
    ffprobeInstance = new FFprobe(ffprobePath);
  }

  return ffprobeInstance;
}

export function registerFFmpegHandlers() {
  const detector = new FFmpegDetector();
  const downloader = new FFmpegDownloader();

  // 检测 FFmpeg
  ipcMain.handle(IPC_CHANNELS.FFMPEG_DETECT, async () => {
    return await detector.detect();
  });

  // 下载 FFmpeg
  ipcMain.handle(IPC_CHANNELS.FFMPEG_DOWNLOAD, async (event: IpcMainInvokeEvent) => {
    return new Promise((resolve, reject) => {
      downloader
        .download((progress) => {
          // 发送进度到渲染进程
          event.sender.send(IPC_CHANNELS.FFMPEG_DOWNLOAD_PROGRESS, progress);
        })
        .then(resolve)
        .catch(reject);
    });
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
