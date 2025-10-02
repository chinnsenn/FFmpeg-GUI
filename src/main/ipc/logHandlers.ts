import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '@shared/constants';
import { logger } from '../utils/logger';

/**
 * 注册日志相关的 IPC 处理器
 */
export function registerLogHandlers() {
  // 获取日志目录
  ipcMain.handle(IPC_CHANNELS.LOG_GET_DIR, async () => {
    try {
      return logger.getLogDir();
    } catch (error) {
      logger.error('LogHandler', 'Failed to get log directory', error);
      throw error;
    }
  });

  // 获取当前日志文件路径
  ipcMain.handle(IPC_CHANNELS.LOG_GET_FILE, async () => {
    try {
      return logger.getLogFile();
    } catch (error) {
      logger.error('LogHandler', 'Failed to get log file', error);
      throw error;
    }
  });

  // 读取日志
  ipcMain.handle(IPC_CHANNELS.LOG_READ, async (_event, lines?: number) => {
    try {
      return logger.readLogs(lines);
    } catch (error) {
      logger.error('LogHandler', 'Failed to read logs', error);
      throw error;
    }
  });

  // 清空日志
  ipcMain.handle(IPC_CHANNELS.LOG_CLEAR, async () => {
    try {
      logger.clearLogs();
    } catch (error) {
      logger.error('LogHandler', 'Failed to clear logs', error);
      throw error;
    }
  });
}
