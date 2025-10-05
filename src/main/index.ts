import { app, BrowserWindow } from 'electron';
import { join } from 'path';
import { registerAllIpcHandlers } from './ipc';
import { logger, LogLevel } from './utils/logger';

// 设置日志级别（开发模式使用 DEBUG，生产模式使用 INFO）
if (process.env.NODE_ENV === 'development' || process.env.VITE_DEV_SERVER_URL) {
  logger.setLogLevel(LogLevel.DEBUG);
} else {
  logger.setLogLevel(LogLevel.INFO);
}

logger.info('App', 'Application starting...', {
  version: app.getVersion(),
  platform: process.platform,
  arch: process.arch,
  nodeVersion: process.versions.node,
  electronVersion: process.versions.electron,
});

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  logger.info('Window', 'Creating main window...');
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    show: false,
  });

  // Show window when ready to prevent flickering
  mainWindow.once('ready-to-show', () => {
    logger.info('Window', 'Main window ready to show');
    mainWindow?.show();
  });

  // 错误处理
  // Note: 'crashed' event was removed in Electron 38
  // Use 'render-process-gone' instead for crash handling
  mainWindow.webContents.on('render-process-gone', (_event, details) => {
    logger.error('Window', 'Renderer process gone', { reason: details.reason, exitCode: details.exitCode });
  });

  mainWindow.webContents.on('unresponsive', () => {
    logger.warn('Window', 'Renderer process became unresponsive');
  });

  mainWindow.webContents.on('responsive', () => {
    logger.info('Window', 'Renderer process became responsive again');
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    logger.debug('Window', 'Loading dev server', { url: process.env.VITE_DEV_SERVER_URL });
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    const indexPath = join(__dirname, '../renderer/index.html');
    logger.debug('Window', 'Loading HTML file', { path: indexPath });
    mainWindow.loadFile(indexPath);
  }

  mainWindow.on('closed', () => {
    logger.info('Window', 'Main window closed');
    mainWindow = null;
  });
}

// 全局错误处理
process.on('uncaughtException', (error) => {
  logger.error('Process', 'Uncaught exception', error);
});

process.on('unhandledRejection', (reason) => {
  logger.error('Process', 'Unhandled rejection', reason);
});

app.whenReady().then(() => {
  logger.info('App', 'App is ready, registering IPC handlers...');
  try {
    registerAllIpcHandlers();
    logger.info('App', 'IPC handlers registered successfully');
  } catch (error) {
    logger.error('App', 'Failed to register IPC handlers', error);
  }
  createWindow();
});

app.on('window-all-closed', () => {
  logger.info('App', 'All windows closed');
  if (process.platform !== 'darwin') {
    logger.info('App', 'Quitting application...');
    app.quit();
  }
});

app.on('activate', () => {
  logger.info('App', 'App activated');
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('quit', () => {
  logger.info('App', 'Application quit');
});
