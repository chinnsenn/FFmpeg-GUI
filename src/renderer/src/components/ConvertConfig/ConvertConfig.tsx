import { useState, useEffect } from 'react';
import { Settings2, Zap, ChevronRight } from 'lucide-react';
import { Button } from '@renderer/components/ui/button';
import { Card } from '@renderer/components/ui/card';
import { cn } from '@renderer/lib/utils';
import type { ConvertOptions, VideoCodec, AudioCodec, VideoQuality } from '@shared/types';
import {
  OUTPUT_FORMATS,
  VIDEO_CODECS,
  AUDIO_CODECS,
  QUALITY_PRESETS,
  RESOLUTIONS,
  FRAME_RATES,
  VIDEO_BITRATES,
  AUDIO_BITRATES,
  CONVERSION_PRESETS,
} from '@shared/format-presets';

interface ConvertConfigProps {
  inputFile?: { name: string; path?: string };
  onConvert: (options: Partial<ConvertOptions>) => void;
  disabled?: boolean;
}

export function ConvertConfig({ inputFile, onConvert, disabled }: ConvertConfigProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // 基本选项
  const [outputFormat, setOutputFormat] = useState('mp4');
  const [preset, setPreset] = useState<string>('');

  // 高级选项
  const [videoCodec, setVideoCodec] = useState<VideoCodec>('libx264');
  const [audioCodec, setAudioCodec] = useState<AudioCodec>('aac');
  const [quality, setQuality] = useState<VideoQuality>('medium');
  const [videoBitrate, setVideoBitrate] = useState('');
  const [audioBitrate, setAudioBitrate] = useState('');
  const [resolution, setResolution] = useState('');
  const [fps, setFps] = useState(0);

  // 当选择预设时更新所有选项
  const handlePresetChange = (presetName: string) => {
    setPreset(presetName);

    if (!presetName) return;

    const selectedPreset = CONVERSION_PRESETS.find(p => p.name === presetName);
    if (selectedPreset) {
      setOutputFormat(selectedPreset.format);
      if (selectedPreset.videoCodec) setVideoCodec(selectedPreset.videoCodec);
      if (selectedPreset.audioCodec) setAudioCodec(selectedPreset.audioCodec);
      if (selectedPreset.quality) setQuality(selectedPreset.quality);
      if (selectedPreset.videoBitrate) setVideoBitrate(selectedPreset.videoBitrate);
      if (selectedPreset.audioBitrate) setAudioBitrate(selectedPreset.audioBitrate);
      if (selectedPreset.resolution) setResolution(selectedPreset.resolution);
      if (selectedPreset.fps) setFps(selectedPreset.fps);
    }
  };

  // 重置预设当用户手动修改选项时
  // 使用 ref 跟踪是否是预设触发的更新
  useEffect(() => {
    // 只有当不是通过预设更新时才清空预设
    // 这里我们假设如果所有值都同时变化，那么是预设触发的
    // 用户手动修改通常只会改变单个值
    if (preset) {
      setPreset('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outputFormat, videoCodec, audioCodec, quality, videoBitrate, audioBitrate, resolution, fps]);

  const handleConvert = () => {
    if (!inputFile?.path) return;

    // 生成输出文件路径
    const inputPath = inputFile.path;

    // 提取文件名和目录
    const lastSlashIndex = inputPath.lastIndexOf('/');
    const dirPath = lastSlashIndex > 0 ? inputPath.substring(0, lastSlashIndex) : '';
    const fileName = lastSlashIndex > 0 ? inputPath.substring(lastSlashIndex + 1) : inputPath;

    // 提取文件名（不含扩展名）和原扩展名
    const lastDotIndex = fileName.lastIndexOf('.');
    const nameWithoutExt = lastDotIndex > 0 ? fileName.substring(0, lastDotIndex) : fileName;
    const originalExt = lastDotIndex > 0 ? fileName.substring(lastDotIndex + 1) : '';

    // 如果输出格式与输入格式相同，添加 _converted 后缀避免覆盖
    let outputPath: string;
    if (originalExt.toLowerCase() === outputFormat.toLowerCase()) {
      outputPath = `${dirPath}/${nameWithoutExt}_converted.${outputFormat}`;
    } else {
      outputPath = `${dirPath}/${nameWithoutExt}.${outputFormat}`;
    }

    const options: Partial<ConvertOptions> = {
      input: inputPath,
      output: outputPath,
      videoCodec: videoCodec || undefined,
      audioCodec: audioCodec || undefined,
      quality: quality || undefined,
      videoBitrate: videoBitrate || undefined,
      audioBitrate: audioBitrate || undefined,
      resolution: resolution || undefined,
      fps: fps || undefined,
      overwrite: true,
    };

    onConvert(options);
  };

  return (
    <div className="space-y-4">
      {/* 快速预设 */}
      <Card>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-text-primary">
          <Zap className="h-4 w-4 text-primary-600" />
          快速预设
        </h3>
        <select
          value={preset}
          onChange={(e) => handlePresetChange(e.target.value)}
          className="w-full rounded-lg border border-border-light bg-background-primary px-3 py-2.5 text-sm text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={disabled}
        >
          <option value="">自定义配置</option>
          {CONVERSION_PRESETS.map((p) => (
            <option key={p.name} value={p.name}>
              {p.name} - {p.description}
            </option>
          ))}
        </select>
      </Card>

      {/* 基本选项 */}
      <Card>
        <div>
          <label className="text-sm font-medium mb-2 block text-text-primary">输出格式</label>
          <select
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
            className="w-full rounded-lg border border-border-light bg-background-primary px-3 py-2.5 text-sm text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={disabled}
          >
            <optgroup label="视频格式">
              {OUTPUT_FORMATS.filter(f => f.type === 'video').map((format) => (
                <option key={format.value} value={format.value}>
                  {format.label}
                </option>
              ))}
            </optgroup>
            <optgroup label="音频格式">
              {OUTPUT_FORMATS.filter(f => f.type === 'audio').map((format) => (
                <option key={format.value} value={format.value}>
                  {format.label}
                </option>
              ))}
            </optgroup>
          </select>
        </div>
      </Card>

      {/* 高级选项 */}
      <Card>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between text-sm font-semibold text-text-primary transition-colors hover:text-primary-600"
          type="button"
        >
          <span className="flex items-center gap-2">
            <Settings2 className="h-4 w-4 text-primary-600" />
            高级选项
          </span>
          <ChevronRight
            className={cn(
              'h-4 w-4 text-text-tertiary transition-transform duration-200',
              showAdvanced && 'rotate-90'
            )}
          />
        </button>

        <div
          className={cn(
            'transition-all duration-300 ease-in-out overflow-hidden',
            showAdvanced ? 'max-h-[1000px] opacity-100 mt-4' : 'max-h-0 opacity-0'
          )}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* 视频编解码器 */}
              <div>
                <label className="text-sm font-medium mb-2 block text-text-primary">视频编解码器</label>
                <select
                  value={videoCodec}
                  onChange={(e) => setVideoCodec(e.target.value as VideoCodec)}
                  className="w-full rounded-lg border border-border-light bg-background-primary px-3 py-2.5 text-sm text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={disabled}
                >
                  {VIDEO_CODECS.map((codec) => (
                    <option key={codec.value} value={codec.value}>
                      {codec.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-text-tertiary mt-1.5">
                  {VIDEO_CODECS.find(c => c.value === videoCodec)?.description}
                </p>
              </div>

              {/* 音频编解码器 */}
              <div>
                <label className="text-sm font-medium mb-2 block text-text-primary">音频编解码器</label>
                <select
                  value={audioCodec}
                  onChange={(e) => setAudioCodec(e.target.value as AudioCodec)}
                  className="w-full rounded-lg border border-border-light bg-background-primary px-3 py-2.5 text-sm text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={disabled}
                >
                  {AUDIO_CODECS.map((codec) => (
                    <option key={codec.value} value={codec.value}>
                      {codec.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-text-tertiary mt-1.5">
                  {AUDIO_CODECS.find(c => c.value === audioCodec)?.description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* 质量预设 */}
              <div>
                <label className="text-sm font-medium mb-2 block text-text-primary">编码速度/质量</label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value as VideoQuality)}
                  className="w-full rounded-lg border border-border-light bg-background-primary px-3 py-2.5 text-sm text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={disabled}
                >
                  {QUALITY_PRESETS.map((preset) => (
                    <option key={preset.value} value={preset.value}>
                      {preset.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-text-tertiary mt-1.5">
                  {QUALITY_PRESETS.find(q => q.value === quality)?.description}
                </p>
              </div>

              {/* 分辨率 */}
              <div>
                <label className="text-sm font-medium mb-2 block text-text-primary">分辨率</label>
                <select
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  className="w-full rounded-lg border border-border-light bg-background-primary px-3 py-2.5 text-sm text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={disabled}
                >
                  {RESOLUTIONS.map((res) => (
                    <option key={res.value} value={res.value}>
                      {res.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* 视频比特率 */}
              <div>
                <label className="text-sm font-medium mb-2 block text-text-primary">视频比特率</label>
                <select
                  value={videoBitrate}
                  onChange={(e) => setVideoBitrate(e.target.value)}
                  className="w-full rounded-lg border border-border-light bg-background-primary px-3 py-2.5 text-sm text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={disabled}
                >
                  {VIDEO_BITRATES.map((bitrate) => (
                    <option key={bitrate.value} value={bitrate.value}>
                      {bitrate.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 音频比特率 */}
              <div>
                <label className="text-sm font-medium mb-2 block text-text-primary">音频比特率</label>
                <select
                  value={audioBitrate}
                  onChange={(e) => setAudioBitrate(e.target.value)}
                  className="w-full rounded-lg border border-border-light bg-background-primary px-3 py-2.5 text-sm text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={disabled}
                >
                  {AUDIO_BITRATES.map((bitrate) => (
                    <option key={bitrate.value} value={bitrate.value}>
                      {bitrate.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 帧率 */}
            <div>
              <label className="text-sm font-medium mb-2 block text-text-primary">帧率</label>
              <select
                value={fps}
                onChange={(e) => setFps(Number(e.target.value))}
                className="w-full rounded-lg border border-border-light bg-background-primary px-3 py-2.5 text-sm text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={disabled}
              >
                {FRAME_RATES.map((rate) => (
                  <option key={rate.value} value={rate.value}>
                    {rate.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* 开始转换按钮 */}
      <Button
        onClick={handleConvert}
        disabled={disabled || !inputFile}
        className="w-full"
        size="lg"
      >
        开始转换
      </Button>

      {!inputFile && (
        <p className="text-xs text-center text-text-tertiary">
          请先选择要转换的文件
        </p>
      )}
    </div>
  );
}
