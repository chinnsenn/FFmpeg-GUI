import { useState, useEffect } from 'react';
import { Settings2, Zap } from 'lucide-react';
import { Button } from '@renderer/components/ui/button';
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
  useEffect(() => {
    setPreset('');
  }, [outputFormat, videoCodec, audioCodec, quality, videoBitrate, audioBitrate, resolution, fps]);

  const handleConvert = () => {
    if (!inputFile?.path) return;

    // 生成输出文件路径
    const inputPath = inputFile.path;
    const outputPath = inputPath.replace(/\.[^.]+$/, `.${outputFormat}`);

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
    <div className="space-y-6">
      {/* 快速预设 */}
      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
          <Zap className="h-4 w-4" />
          快速预设
        </h3>
        <select
          value={preset}
          onChange={(e) => handlePresetChange(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          disabled={disabled}
        >
          <option value="">自定义配置</option>
          {CONVERSION_PRESETS.map((p) => (
            <option key={p.name} value={p.name}>
              {p.name} - {p.description}
            </option>
          ))}
        </select>
      </div>

      {/* 基本选项 */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">输出格式</label>
          <select
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
      </div>

      {/* 高级选项 */}
      <div className="rounded-lg border border-border bg-card p-4 space-y-4">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between text-sm font-medium"
          type="button"
        >
          <span className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            高级选项
          </span>
          <span className="text-xs text-muted-foreground">
            {showAdvanced ? '收起' : '展开'}
          </span>
        </button>

        {showAdvanced && (
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              {/* 视频编解码器 */}
              <div>
                <label className="text-sm font-medium mb-2 block">视频编解码器</label>
                <select
                  value={videoCodec}
                  onChange={(e) => setVideoCodec(e.target.value as VideoCodec)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  disabled={disabled}
                >
                  {VIDEO_CODECS.map((codec) => (
                    <option key={codec.value} value={codec.value}>
                      {codec.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground mt-1">
                  {VIDEO_CODECS.find(c => c.value === videoCodec)?.description}
                </p>
              </div>

              {/* 音频编解码器 */}
              <div>
                <label className="text-sm font-medium mb-2 block">音频编解码器</label>
                <select
                  value={audioCodec}
                  onChange={(e) => setAudioCodec(e.target.value as AudioCodec)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  disabled={disabled}
                >
                  {AUDIO_CODECS.map((codec) => (
                    <option key={codec.value} value={codec.value}>
                      {codec.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground mt-1">
                  {AUDIO_CODECS.find(c => c.value === audioCodec)?.description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* 质量预设 */}
              <div>
                <label className="text-sm font-medium mb-2 block">编码速度/质量</label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value as VideoQuality)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  disabled={disabled}
                >
                  {QUALITY_PRESETS.map((preset) => (
                    <option key={preset.value} value={preset.value}>
                      {preset.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground mt-1">
                  {QUALITY_PRESETS.find(q => q.value === quality)?.description}
                </p>
              </div>

              {/* 分辨率 */}
              <div>
                <label className="text-sm font-medium mb-2 block">分辨率</label>
                <select
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                <label className="text-sm font-medium mb-2 block">视频比特率</label>
                <select
                  value={videoBitrate}
                  onChange={(e) => setVideoBitrate(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                <label className="text-sm font-medium mb-2 block">音频比特率</label>
                <select
                  value={audioBitrate}
                  onChange={(e) => setAudioBitrate(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
              <label className="text-sm font-medium mb-2 block">帧率</label>
              <select
                value={fps}
                onChange={(e) => setFps(Number(e.target.value))}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
        )}
      </div>

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
        <p className="text-xs text-center text-muted-foreground">
          请先选择要转换的文件
        </p>
      )}
    </div>
  );
}
