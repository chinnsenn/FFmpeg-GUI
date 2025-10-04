import { useState } from 'react';
import { Zap, Sparkles, Scale, Smartphone, Globe } from 'lucide-react';
import type { CompressOptions } from '@shared/types';
import { Card } from '../ui/card';
import { Slider } from '../ui/slider';
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

// 6个压缩预设（匹配 demo HTML）
const COMPRESS_PRESETS = [
  {
    id: 'extreme',
    icon: Zap,
    label: '极致压缩',
    crf: 28,
    preset: 'medium' as const,
  },
  {
    id: 'high-quality',
    icon: Sparkles,
    label: '高质量',
    crf: 20,
    preset: 'slow' as const,
  },
  {
    id: 'balanced',
    icon: Scale,
    label: '平衡',
    crf: 23,
    preset: 'medium' as const,
  },
  {
    id: 'fast',
    icon: Zap,
    label: '快速',
    crf: 25,
    preset: 'veryfast' as const,
  },
  {
    id: 'mobile',
    icon: Smartphone,
    label: '移动端',
    crf: 26,
    preset: 'medium' as const,
  },
  {
    id: 'web',
    icon: Globe,
    label: 'Web优化',
    crf: 24,
    preset: 'medium' as const,
  },
];

export function CompressConfig({
  inputFile,
  fileName,
  onCompress,
  disabled = false,
}: CompressConfigProps) {
  // 压缩模式：'crf' 或 'size'
  const [mode, setMode] = useState<'crf' | 'size'>('crf');

  // 选中的预设
  const [selectedPreset, setSelectedPreset] = useState<string>('balanced');

  // CRF 值（18-32）
  const [crf, setCrf] = useState<number>(23);

  // 目标文件大小（MB）
  const [targetSize, setTargetSize] = useState<number>(100);

  // 原始文件大小（用于预估计算，假设为 1200 MB）
  const originalSize = 1200;

  // 当选择预设时，更新 CRF 值
  const handlePresetClick = (presetId: string) => {
    setSelectedPreset(presetId);
    const preset = COMPRESS_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setCrf(preset.crf);
    }
  };

  // 计算预估大小和压缩比
  const getEstimate = () => {
    if (mode === 'size') {
      const ratio = ((originalSize - targetSize) / originalSize) * 100;
      return {
        size: targetSize,
        ratio: Math.round(ratio),
      };
    }

    // CRF 模式：根据 CRF 值估算压缩比
    const compressionRatios: Record<number, number> = {
      18: 0.15, 19: 0.20, 20: 0.25, 21: 0.30, 22: 0.35,
      23: 0.38, 24: 0.42, 25: 0.46, 26: 0.50, 27: 0.55,
      28: 0.60, 29: 0.65, 30: 0.70, 31: 0.75, 32: 0.80,
    };

    const ratio = compressionRatios[crf] || 0.38;
    const compressedSize = Math.round(originalSize * (1 - ratio));
    const compressionPercent = Math.round(ratio * 100);

    return {
      size: compressedSize,
      ratio: compressionPercent,
    };
  };

  const estimate = getEstimate();

  const handleCompress = () => {
    if (!inputFile || !fileName) return;

    const preset = COMPRESS_PRESETS.find(p => p.id === selectedPreset);

    const options: Omit<CompressOptions, 'input' | 'output'> = {
      videoCodec: 'libx264',
      audioCodec: 'aac',
      preset: preset?.preset || 'medium',
      overwrite: true,
    };

    if (mode === 'crf') {
      options.crf = crf;
    } else {
      options.targetSize = targetSize;
    }

    onCompress(options);
  };

  const canCompress = inputFile && fileName;

  return (
    <Card className="p-6 bg-surface-raised border border-border-light rounded-lg shadow-sm">
      {/* 1. 压缩模式 */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-text-primary mb-2">
          压缩模式
        </label>
        <div className="space-y-3">
          {/* CRF 质量控制 */}
          <div
            onClick={() => setMode('crf')}
            className={cn(
              'flex items-center gap-3 h-12 px-4 rounded-lg border-2 cursor-pointer transition-all',
              mode === 'crf'
                ? 'border-primary-600 bg-primary-50 dark:bg-primary-600/20'
                : 'border-border-light hover:border-border-dark'
            )}
          >
            <div
              className={cn(
                'w-5 h-5 border-2 rounded-full flex-shrink-0 relative transition-all',
                mode === 'crf' ? 'border-primary-600' : 'border-border-medium'
              )}
            >
              {mode === 'crf' && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-primary-600" />
              )}
            </div>
            <span className="text-sm text-text-primary">CRF 质量控制</span>
          </div>

          {/* 目标文件大小 */}
          <div
            onClick={() => setMode('size')}
            className={cn(
              'flex items-center gap-3 h-12 px-4 rounded-lg border-2 cursor-pointer transition-all',
              mode === 'size'
                ? 'border-primary-600 bg-primary-50 dark:bg-primary-600/20'
                : 'border-border-light hover:border-border-dark'
            )}
          >
            <div
              className={cn(
                'w-5 h-5 border-2 rounded-full flex-shrink-0 relative transition-all',
                mode === 'size' ? 'border-primary-600' : 'border-border-medium'
              )}
            >
              {mode === 'size' && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-primary-600" />
              )}
            </div>
            <span className="text-sm text-text-primary">目标文件大小</span>
          </div>
        </div>
      </div>

      {/* 2. 压缩预设 - 图标按钮网格（3x2） */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-text-primary mb-2">
          压缩预设
        </label>
        <div className="grid grid-cols-3 gap-3 mt-5">
          {COMPRESS_PRESETS.map((preset) => {
            const Icon = preset.icon;
            return (
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
                <Icon
                  className={cn(
                    'w-6 h-6',
                    selectedPreset === preset.id
                      ? 'text-primary-700 dark:text-primary-400'
                      : 'text-text-secondary'
                  )}
                />
                <div
                  className={cn(
                    'text-xs font-medium',
                    selectedPreset === preset.id
                      ? 'text-primary-700 dark:text-primary-400'
                      : 'text-text-secondary'
                  )}
                >
                  {preset.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. CRF 滑块 (仅在 CRF 模式下显示) */}
      {mode === 'crf' && (
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-text-primary">CRF 质量</span>
            <span className="text-base font-semibold text-primary-600">{crf}</span>
          </div>

          <Slider
            value={[crf]}
            onValueChange={(values) => setCrf(values[0])}
            min={18}
            max={32}
            step={1}
            className="mb-2"
            disabled={disabled}
          />

          <div className="flex justify-between px-1">
            <div className="text-center">
              <div className="text-[11px] text-text-tertiary">18</div>
              <div className="text-[11px] text-text-tertiary">(高质量)</div>
            </div>
            <div className="text-center">
              <div className="text-[11px] text-text-tertiary">23</div>
              <div className="text-[11px] text-text-tertiary">(推荐)</div>
            </div>
            <div className="text-center">
              <div className="text-[11px] text-text-tertiary">32</div>
              <div className="text-[11px] text-text-tertiary">(高压缩)</div>
            </div>
          </div>
        </div>
      )}

      {/* 3b. 目标大小滑块 (仅在 size 模式下显示) */}
      {mode === 'size' && (
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-text-primary">目标文件大小</span>
            <span className="text-base font-semibold text-primary-600">{targetSize} MB</span>
          </div>

          <Slider
            value={[targetSize]}
            onValueChange={(values) => setTargetSize(values[0])}
            min={10}
            max={500}
            step={10}
            className="mb-2"
            disabled={disabled}
          />

          <div className="flex justify-between px-1">
            <div className="text-[11px] text-text-tertiary">10 MB</div>
            <div className="text-[11px] text-text-tertiary">500 MB</div>
          </div>
        </div>
      )}

      {/* 4. 预估卡片 */}
      <div className="p-4 rounded-lg bg-background-secondary border border-border-light mb-5">
        <div className="flex items-center justify-between h-8 mb-2">
          <span className="text-sm text-text-secondary">预计大小</span>
          <span className="text-base font-semibold text-primary-600">
            ~{estimate.size} MB
          </span>
        </div>
        <div className="flex items-center justify-between h-8">
          <span className="text-sm text-text-secondary">压缩比</span>
          <span className="text-base font-semibold text-success-600">
            {estimate.ratio}%
          </span>
        </div>
      </div>

      {/* 5. 开始压缩按钮 */}
      <button
        onClick={handleCompress}
        disabled={disabled || !canCompress}
        className="w-full h-12 bg-primary-600 text-white rounded-lg text-base font-semibold shadow-sm hover:bg-primary-700 hover:shadow-md hover:-translate-y-px transition-all active:translate-y-0 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {!inputFile ? '请先选择文件' : '开始压缩'}
      </button>
    </Card>
  );
}
