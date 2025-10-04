import { useState, useEffect } from 'react';
import {
  COMPRESSION_PRESETS,
  CRF_LEVELS,
  VIDEO_CODECS,
  AUDIO_CODECS,
  QUALITY_PRESETS,
  RESOLUTIONS,
  type CompressionPreset,
} from '@shared/format-presets';
import type { CompressOptions } from '@shared/types';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Slider } from '../ui/slider';
import { ChevronRight } from 'lucide-react';
import { cn } from '@renderer/lib/utils';

interface CompressConfigProps {
  /** 输入文件路径 */
  inputFile?: string;
  /** 文件名（用于生成默认输出路径） */
  fileName?: string;
  /** 开始压缩回调 */
  onCompress: (options: Omit<CompressOptions, 'input' | 'output'>) => void;
  /** 是否禁用 */
  disabled?: boolean;
}

export function CompressConfig({
  inputFile,
  fileName,
  onCompress,
  disabled = false,
}: CompressConfigProps) {
  // 压缩模式：preset（预设）、crf（质量）、size（目标大小）、custom（自定义）
  const [mode, setMode] = useState<'preset' | 'crf' | 'size' | 'custom'>('preset');
  const [selectedPreset, setSelectedPreset] = useState<CompressionPreset | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // 压缩选项
  const [videoCodec, setVideoCodec] = useState<string>('libx264');
  const [audioCodec, setAudioCodec] = useState<string>('aac');
  const [preset, setPreset] = useState<string>('medium');
  const [crf, setCrf] = useState<number>(23);
  const [targetSize, setTargetSize] = useState<number>(50); // MB
  const [resolution, setResolution] = useState<string>('');

  // 当选择预设时，自动填充参数
  useEffect(() => {
    if (mode === 'preset' && selectedPreset) {
      if (selectedPreset.videoCodec) setVideoCodec(selectedPreset.videoCodec);
      if (selectedPreset.audioCodec) setAudioCodec(selectedPreset.audioCodec);
      if (selectedPreset.preset) setPreset(selectedPreset.preset);
      if (selectedPreset.crf !== undefined) setCrf(selectedPreset.crf);
      if (selectedPreset.targetSize !== undefined) setTargetSize(selectedPreset.targetSize);
      if (selectedPreset.resolution !== undefined) setResolution(selectedPreset.resolution);
    }
  }, [selectedPreset, mode]);

  const handleCompress = () => {
    if (!inputFile || !fileName) return;

    const options: Omit<CompressOptions, 'input' | 'output'> = {
      videoCodec: videoCodec as any,
      audioCodec: audioCodec as any,
      preset: preset as any,
      overwrite: true,
    };

    // 根据模式设置不同的参数
    if (mode === 'crf' || (mode === 'preset' && selectedPreset?.crf !== undefined)) {
      options.crf = crf;
    } else if (mode === 'size') {
      options.targetSize = targetSize;
    }

    if (resolution) {
      options.resolution = resolution;
    }

    onCompress(options);
  };

  const canCompress = inputFile && fileName;

  return (
    <div className="space-y-4">
      {/* 压缩模式选择 */}
      <Card>
        <label className="block text-sm font-semibold mb-3 text-text-primary">压缩模式</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setMode('preset')}
            className={cn(
              'px-4 py-3 rounded-lg border-2 transition-all text-left',
              mode === 'preset'
                ? 'border-primary-600 bg-primary-50 dark:bg-primary-600/10'
                : 'border-border-light hover:border-border-medium hover:bg-background-secondary'
            )}
          >
            <div className="font-semibold text-text-primary">快速预设</div>
            <div className="text-xs text-text-tertiary mt-1">选择预定义的压缩方案</div>
          </button>
          <button
            type="button"
            onClick={() => setMode('crf')}
            className={cn(
              'px-4 py-3 rounded-lg border-2 transition-all text-left',
              mode === 'crf'
                ? 'border-primary-600 bg-primary-50 dark:bg-primary-600/10'
                : 'border-border-light hover:border-border-medium hover:bg-background-secondary'
            )}
          >
            <div className="font-semibold text-text-primary">质量优先</div>
            <div className="text-xs text-text-tertiary mt-1">基于 CRF 质量因子</div>
          </button>
          <button
            type="button"
            onClick={() => setMode('size')}
            className={cn(
              'px-4 py-3 rounded-lg border-2 transition-all text-left',
              mode === 'size'
                ? 'border-primary-600 bg-primary-50 dark:bg-primary-600/10'
                : 'border-border-light hover:border-border-medium hover:bg-background-secondary'
            )}
          >
            <div className="font-semibold text-text-primary">目标大小</div>
            <div className="text-xs text-text-tertiary mt-1">指定输出文件大小</div>
          </button>
          <button
            type="button"
            onClick={() => setMode('custom')}
            className={cn(
              'px-4 py-3 rounded-lg border-2 transition-all text-left',
              mode === 'custom'
                ? 'border-primary-600 bg-primary-50 dark:bg-primary-600/10'
                : 'border-border-light hover:border-border-medium hover:bg-background-secondary'
            )}
          >
            <div className="font-semibold text-text-primary">自定义</div>
            <div className="text-xs text-text-tertiary mt-1">手动配置所有参数</div>
          </button>
        </div>
      </Card>

      {/* 快速预设模式 */}
      {mode === 'preset' && (
        <Card>
          <label className="block text-sm font-semibold mb-3 text-text-primary">选择压缩预设</label>
          <div className="space-y-2">
            {COMPRESSION_PRESETS.map((preset: typeof COMPRESSION_PRESETS[number]) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => setSelectedPreset(preset)}
                className={cn(
                  'w-full px-4 py-3 rounded-lg border-2 text-left transition-all',
                  selectedPreset?.name === preset.name
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-600/10'
                    : 'border-border-light hover:border-border-medium hover:bg-background-secondary'
                )}
              >
                <div className="font-semibold text-text-primary">{preset.name}</div>
                <div className="text-sm text-text-secondary mt-1">{preset.description}</div>
                <div className="text-xs text-text-tertiary mt-1">
                  {preset.videoCodec && `${preset.videoCodec} · `}
                  {preset.crf !== undefined && `CRF ${preset.crf} · `}
                  {preset.preset && preset.preset}
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* CRF 质量模式 */}
      {mode === 'crf' && (
        <Card>
          <label className="block text-sm font-semibold mb-1 text-text-primary">
            选择质量等级 (CRF)
          </label>
          <p className="text-xs text-text-tertiary mb-3">较低的值 = 更高的质量</p>
          <div className="space-y-2">
            {CRF_LEVELS.map((level: typeof CRF_LEVELS[number]) => (
              <button
                key={level.value}
                type="button"
                onClick={() => setCrf(level.value)}
                className={cn(
                  'w-full px-4 py-3 rounded-lg border-2 text-left transition-all',
                  crf === level.value
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-600/10'
                    : 'border-border-light hover:border-border-medium hover:bg-background-secondary'
                )}
              >
                <div className="font-semibold text-text-primary">{level.label}</div>
                <div className="text-sm text-text-secondary mt-1">{level.description}</div>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* 目标大小模式 */}
      {mode === 'size' && (
        <Card>
          <label className="block text-sm font-semibold mb-4 text-text-primary">目标文件大小</label>
          <div className="space-y-4">
            <Slider
              value={[targetSize]}
              onValueChange={(values) => setTargetSize(values[0])}
              min={10}
              max={500}
              step={10}
            />
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">10 MB</span>
              <span className="text-lg font-semibold text-primary-600">
                {targetSize} MB
              </span>
              <span className="text-sm text-text-secondary">500 MB</span>
            </div>
            <p className="text-sm text-text-tertiary">
              注意：实际输出大小可能与目标值略有差异
            </p>
          </div>
        </Card>
      )}

      {/* 高级选项 */}
      <Card>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between text-sm font-semibold text-text-primary transition-colors hover:text-primary-600"
        >
          <span>高级选项</span>
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
            showAdvanced ? 'max-h-[600px] opacity-100 mt-4' : 'max-h-0 opacity-0'
          )}
        >
          <div className="space-y-4 p-4 bg-background-secondary rounded-lg">
            {/* 视频编解码器 */}
            <div>
              <label className="block text-sm font-medium mb-2 text-text-primary">视频编解码器</label>
              <select
                value={videoCodec}
                onChange={(e) => setVideoCodec(e.target.value)}
                className="w-full rounded-lg border border-border-light bg-background-primary px-3 py-2.5 text-sm text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {VIDEO_CODECS.slice(0, -1).map((codec: typeof VIDEO_CODECS[number]) => (
                  <option key={codec.value} value={codec.value}>
                    {codec.label} - {codec.description}
                  </option>
                ))}
              </select>
            </div>

            {/* 编码预设 */}
            <div>
              <label className="block text-sm font-medium mb-2 text-text-primary">编码速度/质量预设</label>
              <select
                value={preset}
                onChange={(e) => setPreset(e.target.value)}
                className="w-full rounded-lg border border-border-light bg-background-primary px-3 py-2.5 text-sm text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {QUALITY_PRESETS.map((p: typeof QUALITY_PRESETS[number]) => (
                  <option key={p.value} value={p.value}>
                    {p.label} - {p.description}
                  </option>
                ))}
              </select>
            </div>

            {/* 分辨率 */}
            <div>
              <label className="block text-sm font-medium mb-2 text-text-primary">输出分辨率</label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="w-full rounded-lg border border-border-light bg-background-primary px-3 py-2.5 text-sm text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {RESOLUTIONS.map((res: typeof RESOLUTIONS[number]) => (
                  <option key={res.value} value={res.value}>
                    {res.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 音频编解码器 */}
            <div>
              <label className="block text-sm font-medium mb-2 text-text-primary">音频编解码器</label>
              <select
                value={audioCodec}
                onChange={(e) => setAudioCodec(e.target.value)}
                className="w-full rounded-lg border border-border-light bg-background-primary px-3 py-2.5 text-sm text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {AUDIO_CODECS.slice(0, -1).map((codec: typeof AUDIO_CODECS[number]) => (
                  <option key={codec.value} value={codec.value}>
                    {codec.label} - {codec.description}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* 开始压缩按钮 */}
      <Button
        onClick={handleCompress}
        disabled={disabled || !canCompress}
        className="w-full"
        size="lg"
      >
        {!inputFile ? '请先选择文件' : '开始压缩'}
      </Button>
    </div>
  );
}
