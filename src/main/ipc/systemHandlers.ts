import { ipcMain, app } from 'electron';
import { IPC_CHANNELS } from '../../shared/constants';
import type { SystemInfo } from '../../shared/types';

/**
 * ����s� IPC h
 */
export function registerSystemHandlers() {
  // �����o
  ipcMain.handle(IPC_CHANNELS.SYSTEM_GET_INFO, async (): Promise<SystemInfo> => {
    return {
      platform: process.platform,
      arch: process.arch,
      version: process.version,
      appVersion: app.getVersion(),
    };
  });

  // �����
  ipcMain.handle(
    IPC_CHANNELS.SYSTEM_GET_PATH,
    async (
      _event,
      name: 'home' | 'appData' | 'userData' | 'downloads' | 'documents'
    ): Promise<string> => {
      return app.getPath(name);
    }
  );
}
