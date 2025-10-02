# Task-05: FFmpeg 检测和下载功能

**任务ID**：Task-05
**所属阶段**：阶段二 - FFmpeg 集成
**难度**：⭐⭐⭐ 困难
**预估时间**：3天
**优先级**：P0
**依赖任务**：Task-03

---

## 任务目标

实现 FFmpeg 的自动检测、下载和配置功能,支持多平台和多架构。

---

## 详细需求

### 1. FFmpeg 检测
- [ ] 检测系统环境变量中的 FFmpeg
- [ ] 检测应用本地 FFmpeg
- [ ] 验证 FFmpeg 版本(≥ 4.4)
- [ ] 检测 FFprobe 可用性

### 2. FFmpeg 下载
- [ ] 根据平台和架构确定下载 URL
- [ ] 实现多源下载(GitHub Release/CDN镜像)
- [ ] 显示下载进度
- [ ] 支持断点续传
- [ ] 下载完成后自动解压

### 3. FFmpeg 配置
- [ ] 将 FFmpeg 二进制文件复制到应用目录
- [ ] 设置执行权限(macOS/Linux)
- [ ] 保存 FFmpeg 路径到配置
- [ ] 提供手动配置路径选项

### 4. UI 界面
- [ ] 创建 FFmpeg 设置页面
- [ ] 显示当前 FFmpeg 状态和版本
- [ ] 显示下载进度对话框
- [ ] 提供重新下载和手动配置选项

---

## 技术方案

### 1. FFmpeg 下载源配置

```typescript
// src/shared/constants.ts
export const FFMPEG_DOWNLOAD_SOURCES = {
  'win32-x64': {
    github: 'https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl.zip',
    mirror: 'https://cdn.example.com/ffmpeg/win64/ffmpeg.zip',
  },
  'win32-arm64': {
    github: 'https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-winarm64-gpl.zip',
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
    github: 'https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-linux64-gpl.tar.xz',
    mirror: 'https://cdn.example.com/ffmpeg/linux64/ffmpeg.tar.xz',
  },
} as const;

export const MIN_FFMPEG_VERSION = '4.4';
```

### 2. FFmpeg 检测器

```typescript
// src/main/ffmpeg/detector.ts
import { exec } from 'child_process';
import { promisify } from 'util';
import { existsSync } from 'fs';
import { join } from 'path';
import { app } from 'electron';

const execAsync = promisify(exec);

export interface FFmpegInfo {
  isInstalled: boolean;
  path?: string;
  version?: string;
  isVersionValid?: boolean;
}

export class FFmpegDetector {
  private appFFmpegPath: string;

  constructor() {
    this.appFFmpegPath = join(
      app.getPath('userData'),
      'ffmpeg',
      process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg'
    );
  }

  async detect(): Promise<FFmpegInfo> {
    // 1. 检查应用本地 FFmpeg
    if (existsSync(this.appFFmpegPath)) {
      const version = await this.getVersion(this.appFFmpegPath);
      if (version) {
        return {
          isInstalled: true,
          path: this.appFFmpegPath,
          version,
          isVersionValid: this.isVersionValid(version),
        };
      }
    }

    // 2. 检查系统环境变量
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
    const match = output.match(/ffmpeg version (\\d+\\.\\d+(?:\\.\\d+)?)/);
    return match ? match[1] : 'unknown';
  }

  private isVersionValid(version: string): boolean {
    const [major, minor] = version.split('.').map(Number);
    const [minMajor, minMinor] = MIN_FFMPEG_VERSION.split('.').map(Number);

    return major > minMajor || (major === minMajor && minor >= minMinor);
  }

  getAppFFmpegPath(): string {
    return this.appFFmpegPath;
  }
}
```

### 3. FFmpeg 下载器

```typescript
// src/main/ffmpeg/downloader.ts
import { app, BrowserWindow } from 'electron';
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

  async download(
    onProgress?: (progress: DownloadProgress) => void
  ): Promise<void> {
    // 创建目录
    if (!fs.existsSync(this.ffmpegDir)) {
      fs.mkdirSync(this.ffmpegDir, { recursive: true });
    }
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }

    // 获取下载 URL
    const platformKey = `${process.platform}-${process.arch}` as keyof typeof FFMPEG_DOWNLOAD_SOURCES;
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
      fs.chmodSync(ffmpegBin, 0o755);
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
          return this.downloadFile(redirectUrl, onProgress)
            .then(resolve)
            .catch(reject);
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
          fs.unlinkSync(filePath);
          reject(error);
        });
      });

      request.on('error', reject);
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
      this.moveBinary('ffmpeg.exe', 'ffmpeg');
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
```

### 4. IPC 处理器

```typescript
// src/main/ipc/ffmpeg.ts
import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '@shared/constants';
import { FFmpegDetector } from '../ffmpeg/detector';
import { FFmpegDownloader } from '../ffmpeg/downloader';

export function registerFFmpegHandlers(ipcMain: IpcMain) {
  const detector = new FFmpegDetector();
  const downloader = new FFmpegDownloader();

  // 检测 FFmpeg
  ipcMain.handle(IPC_CHANNELS.FFMPEG_DETECT, async () => {
    return await detector.detect();
  });

  // 下载 FFmpeg
  ipcMain.handle(IPC_CHANNELS.FFMPEG_DOWNLOAD, async (event) => {
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
}
```

### 5. UI 组件

```typescript
// src/renderer/src/components/FFmpegSetup/FFmpegSetup.tsx
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, XCircle, Download, Loader2 } from 'lucide-react';

export function FFmpegSetup() {
  const [ffmpegInfo, setFFmpegInfo] = useState<any>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadSpeed, setDownloadSpeed] = useState(0);

  useEffect(() => {
    checkFFmpeg();

    const unsubscribe = window.electronAPI.on(
      'ffmpeg:downloadProgress',
      (progress: any) => {
        setDownloadProgress(progress.percent);
        setDownloadSpeed(progress.speed);
      }
    );

    return unsubscribe;
  }, []);

  const checkFFmpeg = async () => {
    const info = await window.electronAPI.ffmpeg.detect();
    setFFmpegInfo(info);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await window.electronAPI.ffmpeg.download();
      await checkFFmpeg();
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  const formatSpeed = (bytesPerSecond: number) => {
    const mbps = bytesPerSecond / 1024 / 1024;
    return `${mbps.toFixed(2)} MB/s`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>FFmpeg 配置</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 状态显示 */}
        {ffmpegInfo && (
          <Alert>
            <div className="flex items-center gap-2">
              {ffmpegInfo.isInstalled ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <AlertDescription>
                {ffmpegInfo.isInstalled
                  ? `FFmpeg 已安装 (版本: ${ffmpegInfo.version})`
                  : 'FFmpeg 未安装'}
              </AlertDescription>
            </div>
          </Alert>
        )}

        {/* 下载进度 */}
        {isDownloading && (
          <div className="space-y-2">
            <Progress value={downloadProgress} />
            <p className="text-sm text-muted-foreground">
              下载中... {downloadProgress.toFixed(1)}% ({formatSpeed(downloadSpeed)})
            </p>
          </div>
        )}

        {/* 下载按钮 */}
        {!ffmpegInfo?.isInstalled && (
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full"
          >
            {isDownloading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                下载中...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                下载 FFmpeg
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
```

---

## 验收标准

- [ ] 能正确检测系统和本地 FFmpeg
- [ ] 能从多个源下载 FFmpeg
- [ ] 下载进度实时显示
- [ ] 下载完成后自动配置
- [ ] 支持 Windows/macOS/Linux
- [ ] 错误处理完善

---

## 测试用例

### TC-01: FFmpeg 检测测试
**步骤**: 启动应用,查看 FFmpeg 状态
**预期**: 正确显示是否已安装

### TC-02: FFmpeg 下载测试
**步骤**: 点击下载按钮
**预期**: 下载进度正常显示,下载完成后能使用

---

## 完成检查清单

- [ ] FFmpeg 检测器实现
- [ ] FFmpeg 下载器实现
- [ ] IPC 处理器实现
- [ ] UI 组件实现
- [ ] 多平台测试通过
- [ ] 代码已提交

---

**任务状态**：待开始
**创建日期**：2025-10-02
**最后更新**：2025-10-02
