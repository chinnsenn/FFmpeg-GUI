import { Clock, FileType, Film, Music, Hash } from 'lucide-react';
import { formatDuration, formatFileSize, formatBitrate } from '@renderer/lib/formatters';
import type { MediaFileInfo } from '@shared/types';

interface MediaInfoProps {
  info: MediaFileInfo;
}

export function MediaInfo({ info }: MediaInfoProps) {

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-4">
      {/* 基本信息 */}
      <div>
        <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
          <FileType className="h-4 w-4" />
          基本信息
        </h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">时长:</span>
            <span className="font-medium">{formatDuration(info.duration)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Hash className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">大小:</span>
            <span className="font-medium">{formatFileSize(info.size)}</span>
          </div>
          <div className="flex items-center gap-2">
            <FileType className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">格式:</span>
            <span className="font-medium">{info.format}</span>
          </div>
          <div className="flex items-center gap-2">
            <Hash className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">比特率:</span>
            <span className="font-medium">{formatBitrate(info.bitrate)}</span>
          </div>
        </div>
      </div>

      {/* 视频流信息 */}
      {info.videoStreams.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Film className="h-4 w-4" />
            视频流
          </h3>
          <div className="space-y-3">
            {info.videoStreams.map((stream, index) => (
              <div key={index} className="rounded border border-border/50 p-3 space-y-2">
                <div className="text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">编码:</span>
                    <span className="font-medium">{stream.codec}</span>
                    <span className="text-xs text-muted-foreground">
                      ({stream.codecLongName})
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">分辨率: </span>
                    <span className="font-medium">
                      {stream.width}x{stream.height}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">帧率: </span>
                    <span className="font-medium">{stream.frameRate} fps</span>
                  </div>
                  {stream.bitrate && (
                    <div>
                      <span className="text-muted-foreground">比特率: </span>
                      <span className="font-medium">
                        {formatBitrate(parseInt(stream.bitrate))}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 音频流信息 */}
      {info.audioStreams.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Music className="h-4 w-4" />
            音频流
          </h3>
          <div className="space-y-3">
            {info.audioStreams.map((stream, index) => (
              <div key={index} className="rounded border border-border/50 p-3 space-y-2">
                <div className="text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">编码:</span>
                    <span className="font-medium">{stream.codec}</span>
                    <span className="text-xs text-muted-foreground">
                      ({stream.codecLongName})
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {stream.sampleRate && (
                    <div>
                      <span className="text-muted-foreground">采样率: </span>
                      <span className="font-medium">
                        {parseInt(stream.sampleRate) / 1000} kHz
                      </span>
                    </div>
                  )}
                  {stream.channels && (
                    <div>
                      <span className="text-muted-foreground">声道: </span>
                      <span className="font-medium">{stream.channels}</span>
                    </div>
                  )}
                  {stream.bitrate && (
                    <div>
                      <span className="text-muted-foreground">比特率: </span>
                      <span className="font-medium">
                        {formatBitrate(parseInt(stream.bitrate))}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 字幕信息 */}
      {info.subtitleCount > 0 && (
        <div className="text-sm">
          <span className="text-muted-foreground">字幕轨道: </span>
          <span className="font-medium">{info.subtitleCount} 个</span>
        </div>
      )}
    </div>
  );
}
