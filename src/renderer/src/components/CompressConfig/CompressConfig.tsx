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
import { ChevronDown, ChevronRight } from 'lucide-react';

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
    <div className="space-y-6">
      {/* 压缩模式选择 */}
      <div>
        <label className="block text-sm font-medium mb-2">压缩模式</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setMode('preset')}
            className={`px-4 py-3 rounded-lg border-2 transition-all ${
              mode === 'preset'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="text-left">
              <div className="font-semibold">快速预设</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                选择预定义的压缩方案
              </div>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setMode('crf')}
            className={`px-4 py-3 rounded-lg border-2 transition-all ${
              mode === 'crf'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="text-left">
              <div className="font-semibold">质量优先</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                基于 CRF 质量因子
              </div>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setMode('size')}
            className={`px-4 py-3 rounded-lg border-2 transition-all ${
              mode === 'size'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="text-left">
              <div className="font-semibold">目标大小</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                指定输出文件大小
              </div>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setMode('custom')}
            className={`px-4 py-3 rounded-lg border-2 transition-all ${
              mode === 'custom'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="text-left">
              <div className="font-semibold">自定义</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                手动配置所有参数
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* 快速预设模式 */}
      {mode === 'preset' && (
        <div>
          <label className="block text-sm font-medium mb-2">选择压缩预设</label>
          <div className="grid grid-cols-1 gap-2">
            {COMPRESSION_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => setSelectedPreset(preset)}
                className={`px-4 py-3 rounded-lg border-2 text-left transition-all ${
                  selectedPreset?.name === preset.name
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold">{preset.name}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {preset.description}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {preset.videoCodec && `${preset.videoCodec} · `}
                  {preset.crf !== undefined && `CRF ${preset.crf} · `}
                  {preset.preset && preset.preset}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CRF 质量模式 */}
      {mode === 'crf' && (
        <div>
          <label className="block text-sm font-medium mb-2">
            选择质量等级 (CRF)
            <span className="text-xs text-gray-500 ml-2">较低的值 = 更高的质量</span>
          </label>
          <div className="grid grid-cols-1 gap-2">
            {CRF_LEVELS.map((level) => (
              <button
                key={level.value}
                type="button"
                onClick={() => setCrf(level.value)}
                className={`px-4 py-3 rounded-lg border-2 text-left transition-all ${
                  crf === level.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold">{level.label}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {level.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 目标大小模式 */}
      {mode === 'size' && (
        <div>
          <label className="block text-sm font-medium mb-2">目标文件大小</label>
          <div className="space-y-4">
            <input
              type="range"
              min="10"
              max="500"
              step="10"
              value={targetSize}
              onChange={(e) => setTargetSize(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">10 MB</span>
              <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                {targetSize} MB
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">500 MB</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              注意：实际输出大小可能与目标值略有差异
            </p>
          </div>
        </div>
      )}

      {/* 高级选项 */}
      <div>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
        >
          {showAdvanced ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          高级选项
        </button>

        {showAdvanced && (
          <div className="mt-4 space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            {/* 视频编解码器 */}
            <div>
              <label className="block text-sm font-medium mb-2">视频编解码器</label>
              <select
                value={videoCodec}
                onChange={(e) => setVideoCodec(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {VIDEO_CODECS.slice(0, -1).map((codec) => ( // 排除 "复制流"
                  <option key={codec.value} value={codec.value}>
                    {codec.label} - {codec.description}
                  </option>
                ))}
              </select>
            </div>

            {/* 编码预设 */}
            <div>
              <label className="block text-sm font-medium mb-2">编码速度/质量预设</label>
              <select
                value={preset}
                onChange={(e) => setPreset(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {QUALITY_PRESETS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label} - {p.description}
                  </option>
                ))}
              </select>
            </div>

            {/* 分辨率 */}
            <div>
              <label className="block text-sm font-medium mb-2">输出分辨率</label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {RESOLUTIONS.map((res) => (
                  <option key={res.value} value={res.value}>
                    {res.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 音频编解码器 */}
            <div>
              <label className="block text-sm font-medium mb-2">音频编解码器</label>
              <select
                value={audioCodec}
                onChange={(e) => setAudioCodec(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {AUDIO_CODECS.slice(0, -1).map((codec) => ( // 排除 "复制流"
                  <option key={codec.value} value={codec.value}>
                    {codec.label} - {codec.description}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

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
