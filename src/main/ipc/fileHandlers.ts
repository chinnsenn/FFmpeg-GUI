import { ipcMain, dialog, shell } from 'electron';
import { stat } from 'fs/promises';
import { extname, basename } from 'path';
import { IPC_CHANNELS } from '../../shared/constants';
import type { FileInfo } from '../../shared/types';

/**
 * 文件相关 IPC 处理器
 */
export function registerFileHandlers() {
  // 选择文件（单个）
  ipcMain.handle(
    IPC_CHANNELS.FILE_SELECT,
    async (
      _event,
      filters?: { name: string; extensions: string[] }[]
    ): Promise<string | null> => {
      const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: filters || [
          { name: 'Video Files', extensions: ['mp4', 'avi', 'mkv', 'mov', 'flv', 'wmv'] },
          { name: 'All Files', extensions: ['*'] },
        ],
      });

      if (result.canceled || result.filePaths.length === 0) {
        return null;
      }

      return result.filePaths[0];
    }
  );

  // 选择文件（多个）
  ipcMain.handle(
    IPC_CHANNELS.FILE_SELECT_MULTIPLE,
    async (
      _event,
      filters?: { name: string; extensions: string[] }[]
    ): Promise<FileInfo[]> => {
      const result = await dialog.showOpenDialog({
        properties: ['openFile', 'multiSelections'],
        filters: filters || [
          { name: 'Video Files', extensions: ['mp4', 'avi', 'mkv', 'mov', 'flv', 'wmv', 'webm'] },
          { name: 'Audio Files', extensions: ['mp3', 'wav', 'aac', 'flac', 'm4a', 'ogg'] },
          { name: 'All Files', extensions: ['*'] },
        ],
      });

      if (result.canceled || result.filePaths.length === 0) {
        return [];
      }

      // 获取每个文件的信息
      const fileInfos: FileInfo[] = [];
      for (const filePath of result.filePaths) {
        const stats = await stat(filePath);
        const ext = extname(filePath);
        const name = basename(filePath);

        fileInfos.push({
          name,
          path: filePath,
          size: stats.size,
          ext,
        });
      }

      return fileInfos;
    }
  );

  // 选择目录
  ipcMain.handle(
    IPC_CHANNELS.FILE_SELECT_DIRECTORY,
    async (): Promise<string | null> => {
      const result = await dialog.showOpenDialog({
        properties: ['openDirectory', 'createDirectory'],
      });

      if (result.canceled || result.filePaths.length === 0) {
        return null;
      }

      return result.filePaths[0];
    }
  );

  // 获取文件信息
  ipcMain.handle(
    IPC_CHANNELS.FILE_GET_INFO,
    async (_event, filePath: string): Promise<FileInfo> => {
      const stats = await stat(filePath);
      const ext = extname(filePath);
      const name = basename(filePath);

      return {
        name,
        path: filePath,
        size: stats.size,
        ext,
      };
    }
  );

  // 打开文件夹
  ipcMain.handle(
    IPC_CHANNELS.FILE_OPEN_FOLDER,
    async (_event, folderPath: string): Promise<void> => {
      await shell.openPath(folderPath);
    }
  );
}
