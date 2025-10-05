import { useEffect, useState } from 'react';
import { Button } from '@renderer/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@renderer/components/ui/card';
import { Progress } from '@renderer/components/ui/progress';
import { Alert, AlertDescription } from '@renderer/components/ui/alert';
import { CheckCircle2, XCircle, Download, Loader2 } from 'lucide-react';
import { logger } from '@renderer/utils/logger';
import type { FFmpegInfo } from '@renderer/global';

export function FFmpegSetup() {
  const [ffmpegInfo, setFFmpegInfo] = useState<FFmpegInfo | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadSpeed, setDownloadSpeed] = useState(0);

  useEffect(() => {
    checkFFmpeg();

    const unsubscribe = window.electronAPI.on('ffmpeg:downloadProgress', (progress: any) => {
      setDownloadProgress(progress.percent);
      setDownloadSpeed(progress.speed);
    });

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
      logger.errorFromCatch('FFmpegSetup', 'FFmpeg 下载失败', error);
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
          <Button onClick={handleDownload} disabled={isDownloading} className="w-full">
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
