import { ipcMain, app } from 'electron';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { IPC_CHANNELS } from '../../shared/constants';
import type { AppConfig } from '../../shared/types';

// Default configuration
const DEFAULT_CONFIG: AppConfig = {
  theme: 'system',
  language: 'zh-CN',
  maxConcurrentTasks: 3,
};

// Get configuration file path
const getConfigPath = () => {
  const userDataPath = app.getPath('userData');
  return join(userDataPath, 'config.json');
};

/**
 * Read configuration file
 */
async function readConfig(): Promise<AppConfig> {
  try {
    const configPath = getConfigPath();
    const data = await readFile(configPath, 'utf-8');
    const config = JSON.parse(data);
    return { ...DEFAULT_CONFIG, ...config };
  } catch (error) {
    // Configuration file does not exist or parse failed, return default configuration
    return DEFAULT_CONFIG;
  }
}

/**
 * Write configuration file
 */
async function writeConfig(config: AppConfig): Promise<void> {
  const configPath = getConfigPath();
  const userDataPath = app.getPath('userData');

  // Ensure userData directory exists
  await mkdir(userDataPath, { recursive: true });

  await writeFile(configPath, JSON.stringify(config, null, 2), 'utf-8');
}

/**
 * Register configuration-related IPC handlers
 */
export function registerConfigHandlers() {
  // Get configuration
  ipcMain.handle(IPC_CHANNELS.CONFIG_GET, async (): Promise<AppConfig> => {
    return await readConfig();
  });

  // Set configuration
  ipcMain.handle(
    IPC_CHANNELS.CONFIG_SET,
    async (_event, config: Partial<AppConfig>): Promise<void> => {
      const currentConfig = await readConfig();
      const newConfig = { ...currentConfig, ...config };
      await writeConfig(newConfig);
    }
  );
}
