import { Info, Film, Music } from 'lucide-react';
import { formatDuration, formatFileSize, formatBitrate } from '@renderer/lib/formatters';
import type { MediaFileInfo } from '@shared/types';

interface MediaInfoProps {
  info: MediaFileInfo;
}

export function MediaInfo({ info }: MediaInfoProps) {
  return (
    <div className="space-y-4">
      {/* 标题 */}
      <div className="flex items-center gap-2 mb-3">
        <Info className="h-4 w-4 text-text-secondary" />
        <h4 className="text-sm font-semibold text-text-primary">媒体信息</h4>
      </div>

      {/* 基本信息网格 */}
      <div className="grid grid-cols-[1fr_2fr] gap-x-4 gap-y-2 text-sm">
        <div className="text-text-secondary">分辨率</div>
        <div className="font-mono font-medium text-text-primary">
          {info.videoStreams[0]?.width && info.videoStreams[0]?.height
            ? `${info.videoStreams[0].width} × ${info.videoStreams[0].height}`
            : 'N/A'}
        </div>

        <div className="text-text-secondary">时长</div>
        <div className="font-mono font-medium text-text-primary">{formatDuration(info.duration)}</div>

        <div className="text-text-secondary">帧率</div>
        <div className="font-mono font-medium text-text-primary">
          {info.videoStreams[0]?.frameRate ? `${info.videoStreams[0].frameRate} fps` : 'N/A'}
        </div>

        {/* 视频编解码器 */}
        {info.videoStreams.length > 0 && (
          <>
            <div className="text-text-secondary">视频编解码器</div>
            <div className="font-mono font-medium text-text-primary">
              {info.videoStreams[0].codec}
              <span className="ml-2 text-xs text-text-tertiary">
                ({info.videoStreams[0].codecLongName})
              </span>
            </div>
          </>
        )}

        {/* 视频码率 */}
        {info.videoStreams[0]?.bitrate && (
          <>
            <div className="text-text-secondary">视频码率</div>
            <div className="font-mono font-medium text-text-primary">
              {formatBitrate(parseInt(info.videoStreams[0].bitrate))}
            </div>
          </>
        )}

        {/* 音频编解码器 */}
        {info.audioStreams.length > 0 && (
          <>
            <div className="text-text-secondary">音频编解码器</div>
            <div className="font-mono font-medium text-text-primary">
              {info.audioStreams[0].codec}
              <span className="ml-2 text-xs text-text-tertiary">
                ({info.audioStreams[0].codecLongName})
              </span>
            </div>
          </>
        )}

        {/* 音频码率 */}
        {info.audioStreams[0]?.bitrate && (
          <>
            <div className="text-text-secondary">音频码率</div>
            <div className="font-mono font-medium text-text-primary">
              {formatBitrate(parseInt(info.audioStreams[0].bitrate))}
            </div>
          </>
        )}

        {/* 声道 */}
        {info.audioStreams[0]?.channels && (
          <>
            <div className="text-text-secondary">声道</div>
            <div className="font-mono font-medium text-text-primary">
              {info.audioStreams[0].channels === 2 ? '立体声 (2.0)' : `${info.audioStreams[0].channels} 声道`}
            </div>
          </>
        )}

        {/* 采样率 */}
        {info.audioStreams[0]?.sampleRate && (
          <>
            <div className="text-text-secondary">采样率</div>
            <div className="font-mono font-medium text-text-primary">
              {parseInt(info.audioStreams[0].sampleRate) / 1000} kHz
            </div>
          </>
        )}

        <div className="text-text-secondary">格式</div>
        <div className="font-mono font-medium text-text-primary">{info.format}</div>

        <div className="text-text-secondary">文件大小</div>
        <div className="font-mono font-medium text-text-primary">{formatFileSize(info.size)}</div>

        <div className="text-text-secondary">总比特率</div>
        <div className="font-mono font-medium text-text-primary">{formatBitrate(info.bitrate)}</div>

        {/* 字幕信息 */}
        {info.subtitleCount > 0 && (
          <>
            <div className="text-text-secondary">字幕轨道</div>
            <div className="font-mono font-medium text-text-primary">{info.subtitleCount} 个</div>
          </>
        )}
      </div>
    </div>
  );
}
