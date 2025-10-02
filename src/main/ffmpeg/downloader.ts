import { app } from 'electron';
import * as https from 'https';
import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import * as unzipper from 'unzipper';
import * as tar from 'tar';
import { FFMPEG_DOWNLOAD_SOURCES } from '@shared/constants';

export interface DownloadProgress {
  percent: number;
  downloaded: number;
  total: number;
  speed: number; // bytes/s
}

export class FFmpegDownloader {
  private ffmpegDir: string;
  private tempDir: string;

  constructor() {
    this.ffmpegDir = path.join(app.getPath('userData'), 'ffmpeg');
    this.tempDir = path.join(app.getPath('temp'), 'ffmpeg-download');
  }

  async download(onProgress?: (progress: DownloadProgress) => void): Promise<void> {
    // 创建目录
    if (!fs.existsSync(this.ffmpegDir)) {
      fs.mkdirSync(this.ffmpegDir, { recursive: true });
    }
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }

    // 获取下载 URL
    const platformKey =
      `${process.platform}-${process.arch}` as keyof typeof FFMPEG_DOWNLOAD_SOURCES;
    const sources = FFMPEG_DOWNLOAD_SOURCES[platformKey];

    if (!sources) {
      throw new Error(`Unsupported platform: ${platformKey}`);
    }

    // 尝试从多个源下载
    let downloaded = false;
    const urls = [sources.github, sources.mirror];

    for (const url of urls) {
      try {
        await this.downloadFile(url, onProgress);
        downloaded = true;
        break;
      } catch (error) {
        console.error(`Download from ${url} failed:`, error);
      }
    }

    if (!downloaded) {
      throw new Error('Failed to download FFmpeg from all sources');
    }

    // 解压文件
    await this.extract();

    // 设置执行权限（Unix系统）
    if (process.platform !== 'win32') {
      const ffmpegBin = path.join(this.ffmpegDir, 'ffmpeg');
      if (fs.existsSync(ffmpegBin)) {
        fs.chmodSync(ffmpegBin, 0o755);
      }
    }
  }

  private downloadFile(
    url: string,
    onProgress?: (progress: DownloadProgress) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const fileName = url.includes('.zip') ? 'ffmpeg.zip' : 'ffmpeg.tar.xz';
      const filePath = path.join(this.tempDir, fileName);
      const file = fs.createWriteStream(filePath);

      const protocol = url.startsWith('https') ? https : http;

      const request = protocol.get(url, (response) => {
        if (response.statusCode === 302 || response.statusCode === 301) {
          // 处理重定向
          const redirectUrl = response.headers.location!;
          file.close();
          fs.unlinkSync(filePath);
          return this.downloadFile(redirectUrl, onProgress).then(resolve).catch(reject);
        }

        const total = parseInt(response.headers['content-length'] || '0', 10);
        let downloaded = 0;
        let lastTime = Date.now();
        let lastDownloaded = 0;

        response.on('data', (chunk: Buffer) => {
          downloaded += chunk.length;
          const now = Date.now();
          const timeDiff = (now - lastTime) / 1000; // 秒

          if (timeDiff >= 0.5) {
            const speed = (downloaded - lastDownloaded) / timeDiff;
            const percent = total > 0 ? (downloaded / total) * 100 : 0;

            onProgress?.({
              percent,
              downloaded,
              total,
              speed,
            });

            lastTime = now;
            lastDownloaded = downloaded;
          }
        });

        response.pipe(file);

        file.on('finish', () => {
          file.close();
          resolve();
        });

        file.on('error', (error) => {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
          reject(error);
        });
      });

      request.on('error', (error) => {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        reject(error);
      });

      request.setTimeout(60000, () => {
        request.destroy();
        reject(new Error('Download timeout'));
      });
    });
  }

  private async extract(): Promise<void> {
    const zipPath = path.join(this.tempDir, 'ffmpeg.zip');
    const tarPath = path.join(this.tempDir, 'ffmpeg.tar.xz');

    if (fs.existsSync(zipPath)) {
      // 解压 ZIP
      await fs
        .createReadStream(zipPath)
        .pipe(unzipper.Extract({ path: this.tempDir }))
        .promise();

      // 查找 ffmpeg 二进制文件并移动
      const searchName = process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg';
      this.moveBinary(searchName, searchName);
    } else if (fs.existsSync(tarPath)) {
      // 解压 TAR.XZ
      await tar.extract({
        file: tarPath,
        cwd: this.tempDir,
      });

      this.moveBinary('ffmpeg', 'ffmpeg');
    }

    // 清理临时文件
    this.cleanup();
  }

  private moveBinary(searchName: string, targetName: string): void {
    // 递归查找二进制文件
    const findBinary = (dir: string): string | null => {
      if (!fs.existsSync(dir)) return null;

      const items = fs.readdirSync(dir);

      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          const found = findBinary(fullPath);
          if (found) return found;
        } else if (item === searchName) {
          return fullPath;
        }
      }

      return null;
    };

    const binaryPath = findBinary(this.tempDir);
    if (!binaryPath) {
      throw new Error(`FFmpeg binary not found in extracted files`);
    }

    const targetPath = path.join(this.ffmpegDir, targetName);
    fs.copyFileSync(binaryPath, targetPath);
  }

  private cleanup(): void {
    if (fs.existsSync(this.tempDir)) {
      fs.rmSync(this.tempDir, { recursive: true, force: true });
    }
  }
}
