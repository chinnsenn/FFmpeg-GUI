import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Card } from '@renderer/components/ui/card';
import { cn } from '@renderer/lib/utils';
import type { ConvertOptions, VideoCodec, AudioCodec } from '@shared/types';
import {
  OUTPUT_FORMATS,
  VIDEO_CODECS,
  AUDIO_CODECS,
  QUICK_PRESETS,
} from '@shared/format-presets';

interface ConvertConfigProps {
  inputFile?: { name: string; path?: string };
  onConvert: (options: Partial<ConvertOptions> & { format?: string }) => void;
  disabled?: boolean;
}

export function ConvertConfig({
  inputFile,
  onConvert,
  disabled = false // Explicit default value
}: ConvertConfigProps) {
  // 基本状态
  const [outputFormat, setOutputFormat] = useState('mp4');
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // 高级选项状态
  const [videoCodec, setVideoCodec] = useState<VideoCodec>('libx264');
  const [audioCodec, setAudioCodec] = useState<AudioCodec>('aac');
  const [videoBitrate, setVideoBitrate] = useState('');
  const [audioBitrate, setAudioBitrate] = useState('');
  const [resolution, setResolution] = useState('');

  // 预设点击处理
  const handlePresetClick = (presetId: string) => {
    setSelectedPreset(presetId);
    const preset = QUICK_PRESETS.find((p: typeof QUICK_PRESETS[number]) => p.id === presetId);
    if (preset) {
      // 应用预设配置
      setVideoCodec(preset.config.videoCodec);
      setAudioCodec(preset.config.audioCodec);
      setVideoBitrate(preset.config.videoBitrate || '');
      setAudioBitrate(preset.config.audioBitrate || '');
      setResolution(preset.config.resolution || '');
    }
  };

  // 转换处理
  const handleConvert = () => {
    // 构建转换选项（不包含 input/output，由父组件处理批量文件）
    const options: Partial<ConvertOptions> & { format?: string } = {
      format: outputFormat,
      videoCodec: videoCodec || undefined,
      audioCodec: audioCodec || undefined,
      videoBitrate: videoBitrate || undefined,
      audioBitrate: audioBitrate || undefined,
      resolution: resolution || undefined,
      overwrite: true,
    };

    onConvert(options);
  };

  return (
    <Card className="p-6 bg-surface-raised border border-border-light rounded-lg shadow-sm">
      {/* 1. 输出格式 */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-text-primary mb-2">
          输出格式
        </label>
        <select
          value={outputFormat}
          onChange={(e) => setOutputFormat(e.target.value)}
          className="w-full h-10 px-3 py-2 rounded-lg border border-border-medium bg-surface-base text-text-primary text-sm transition-all hover:border-border-dark focus:outline-none focus:border-2 focus:border-primary-500 focus:px-[11px] focus:py-[7px] focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={disabled}
        >
          <optgroup label="视频格式">
            {OUTPUT_FORMATS.filter((f: typeof OUTPUT_FORMATS[number]) => f.type === 'video').map((format: typeof OUTPUT_FORMATS[number]) => (
              <option key={format.value} value={format.value}>
                {format.label}
              </option>
            ))}
          </optgroup>
          <optgroup label="音频格式">
            {OUTPUT_FORMATS.filter((f: typeof OUTPUT_FORMATS[number]) => f.type === 'audio').map((format: typeof OUTPUT_FORMATS[number]) => (
              <option key={format.value} value={format.value}>
                {format.label}
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      {/* 2. 快速预设 - 图标按钮网格 */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-text-primary mb-2">
          快速预设
        </label>
        <div className="grid grid-cols-3 gap-3 mt-5">
          {QUICK_PRESETS.map((preset: typeof QUICK_PRESETS[number]) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handlePresetClick(preset.id)}
              disabled={disabled}
              className={cn(
                'h-20 flex flex-col items-center justify-center gap-2',
                'rounded-lg border-2 transition-all cursor-pointer',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                selectedPreset === preset.id
                  ? 'border-primary-600 bg-primary-100 dark:bg-primary-600/20'
                  : 'border-border-light bg-surface-base hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-600/10 hover:shadow-sm'
              )}
            >
              <div className="text-2xl">{preset.icon}</div>
              <div className="text-xs font-medium text-text-secondary">
                {preset.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. 高级设置（可折叠） */}
      <div
        className="flex items-center justify-between h-12 px-4 bg-background-secondary rounded-lg cursor-pointer hover:bg-background-tertiary transition-all mt-5"
        onClick={() => setShowAdvanced(!showAdvanced)}
      >
        <span className="text-sm font-medium text-text-primary">高级设置</span>
        <ChevronDown
          className={cn(
            'w-5 h-5 text-text-tertiary transition-transform duration-200',
            showAdvanced && 'rotate-180'
          )}
        />
      </div>

      <div
        className={cn(
          'overflow-hidden transition-all duration-300',
          showAdvanced ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'
        )}
      >
        <div className="space-y-5">
          {/* 视频编解码器 */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              视频编解码器
            </label>
            <select
              value={videoCodec}
              onChange={(e) => setVideoCodec(e.target.value as VideoCodec)}
              className="w-full h-10 px-3 py-2 rounded-lg border border-border-medium bg-surface-base text-text-primary text-sm transition-all hover:border-border-dark focus:outline-none focus:border-2 focus:border-primary-500 focus:px-[11px] focus:py-[7px] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={disabled}
            >
              {VIDEO_CODECS.map((codec: typeof VIDEO_CODECS[number]) => (
                <option key={codec.value} value={codec.value}>
                  {codec.label}
                </option>
              ))}
            </select>
          </div>

          {/* 音频编解码器 */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              音频编解码器
            </label>
            <select
              value={audioCodec}
              onChange={(e) => setAudioCodec(e.target.value as AudioCodec)}
              className="w-full h-10 px-3 py-2 rounded-lg border border-border-medium bg-surface-base text-text-primary text-sm transition-all hover:border-border-dark focus:outline-none focus:border-2 focus:border-primary-500 focus:px-[11px] focus:py-[7px] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={disabled}
            >
              {AUDIO_CODECS.map((codec: typeof AUDIO_CODECS[number]) => (
                <option key={codec.value} value={codec.value}>
                  {codec.label}
                </option>
              ))}
            </select>
          </div>

          {/* 视频比特率 */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              视频比特率
            </label>
            <select
              value={videoBitrate}
              onChange={(e) => setVideoBitrate(e.target.value)}
              className="w-full h-10 px-3 py-2 rounded-lg border border-border-medium bg-surface-base text-text-primary text-sm transition-all hover:border-border-dark focus:outline-none focus:border-2 focus:border-primary-500 focus:px-[11px] focus:py-[7px] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={disabled}
            >
              <option value="">自动</option>
              <option value="1M">1 Mbps</option>
              <option value="2.5M">2.5 Mbps</option>
              <option value="5M">5 Mbps</option>
              <option value="10M">10 Mbps</option>
            </select>
          </div>

          {/* 分辨率 */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              分辨率
            </label>
            <select
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              className="w-full h-10 px-3 py-2 rounded-lg border border-border-medium bg-surface-base text-text-primary text-sm transition-all hover:border-border-dark focus:outline-none focus:border-2 focus:border-primary-500 focus:px-[11px] focus:py-[7px] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={disabled}
            >
              <option value="">保持原始</option>
              <option value="3840x2160">4K (3840×2160)</option>
              <option value="1920x1080">1080p (1920×1080)</option>
              <option value="1280x720">720p (1280×720)</option>
              <option value="854x480">480p (854×480)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. 开始转换按钮 */}
      <button
        onClick={handleConvert}
        disabled={disabled || !inputFile}
        className="w-full h-12 bg-primary-600 text-white rounded-lg text-base font-semibold shadow-sm hover:bg-primary-700 hover:shadow-md hover:-translate-y-px transition-all active:translate-y-0 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-8"
      >
        开始转换
      </button>

      {!inputFile && (
        <p className="text-xs text-center text-text-tertiary mt-2">
          请先选择要转换的文件
        </p>
      )}
    </Card>
  );
}
