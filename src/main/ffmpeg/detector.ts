import { exec } from 'child_process';
import { promisify } from 'util';
import { existsSync } from 'fs';
import { MIN_FFMPEG_VERSION } from '@shared/constants';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';

const execAsync = promisify(exec);

export interface FFmpegInfo {
  isInstalled: boolean;
  path?: string;
  version?: string;
  isVersionValid?: boolean;
}

export class FFmpegDetector {
  async detect(): Promise<FFmpegInfo> {
    // 1. 优先使用内置的 FFmpeg（@ffmpeg-installer/ffmpeg）
    try {
      let bundledPath = ffmpegInstaller.path as string;

      // 处理 ASAR 打包路径（将 app.asar 替换为 app.asar.unpacked）
      if (bundledPath && bundledPath.includes('app.asar')) {
        bundledPath = bundledPath.replace('app.asar', 'app.asar.unpacked');
      }

      if (bundledPath && existsSync(bundledPath)) {
        const version = await this.getVersion(bundledPath);
        if (version) {
          return {
            isInstalled: true,
            path: bundledPath,
            version,
            isVersionValid: this.isVersionValid(version),
          };
        }
      }
    } catch (error) {
      console.warn('Failed to load bundled FFmpeg:', error);
    }

    // 2. 回退到系统环境变量的 FFmpeg
    try {
      const { stdout } = await execAsync('ffmpeg -version');
      const version = this.parseVersion(stdout);

      return {
        isInstalled: true,
        path: 'ffmpeg', // 使用全局命令
        version,
        isVersionValid: this.isVersionValid(version),
      };
    } catch {
      return { isInstalled: false };
    }
  }

  private async getVersion(ffmpegPath: string): Promise<string | undefined> {
    try {
      const { stdout } = await execAsync(`"${ffmpegPath}" -version`);
      return this.parseVersion(stdout);
    } catch {
      return undefined;
    }
  }

  private parseVersion(output: string): string {
    const match = output.match(/ffmpeg version (\d+\.\d+(?:\.\d+)?)/);
    return match ? match[1] : 'unknown';
  }

  private isVersionValid(version: string): boolean {
    if (version === 'unknown') return false;

    const versionParts = version.split('.').map(Number);
    const minParts = MIN_FFMPEG_VERSION.split('.').map(Number);

    // 比较主版本号和次版本号
    if (versionParts[0] > minParts[0]) return true;
    if (versionParts[0] < minParts[0]) return false;

    // 主版本号相同，比较次版本号
    return versionParts[1] >= minParts[1];
  }
}
