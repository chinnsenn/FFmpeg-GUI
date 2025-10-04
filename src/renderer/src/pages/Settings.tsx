import { useState, useEffect } from 'react';
import { Card } from '@renderer/components/ui/card';
import { Settings as SettingsIcon, Palette, Sliders, Folder, CheckCircle } from 'lucide-react';
import { cn } from '@renderer/lib/utils';
import { toast } from 'sonner';

export function Settings() {
  // FFmpeg 配置
  const [ffmpegPath, setFfmpegPath] = useState('/usr/local/bin/ffmpeg');
  const [ffprobePath, setFfprobePath] = useState('/usr/local/bin/ffprobe');
  const [ffmpegVersion, setFfmpegVersion] = useState('6.0');
  const [ffprobeVersion, setFfprobeVersion] = useState('6.0');
  const [ffmpegDetected, setFfmpegDetected] = useState(true);
  const [ffprobeDetected, setFfprobeDetected] = useState(true);

  // 外观设置
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  // 任务设置
  const [maxConcurrent, setMaxConcurrent] = useState(2);
  const [autoStart, setAutoStart] = useState(true);
  const [notification, setNotification] = useState(false);

  // 文件设置
  const [outputDir, setOutputDir] = useState('~/Videos/FFmpeg-Output');
  const [keepOriginal, setKeepOriginal] = useState(true);
  const [autoRename, setAutoRename] = useState(false);

  // 检测 FFmpeg
  useEffect(() => {
    detectFFmpeg();
  }, []);

  const detectFFmpeg = async () => {
    try {
      const info = await window.electronAPI.ffmpeg.detect();
      if (info.isInstalled) {
        setFfmpegPath(info.path || '/usr/local/bin/ffmpeg');
        setFfmpegVersion(info.version || '6.0');
        setFfmpegDetected(true);
      }
    } catch (error) {
      console.error('FFmpeg 检测失败:', error);
    }
  };

  const handleBrowseFFmpeg = async () => {
    // TODO: 实现文件选择对话框
    toast.info('文件选择功能待实现');
  };

  const handleBrowseFFprobe = async () => {
    // TODO: 实现文件选择对话框
    toast.info('文件选择功能待实现');
  };

  const handleBrowseOutputDir = async () => {
    // TODO: 实现目录选择对话框
    toast.info('目录选择功能待实现');
  };

  const handleRedetect = async () => {
    toast.info('正在重新检测 FFmpeg...');
    await detectFFmpeg();
    toast.success('检测完成');
  };

  const handleSave = () => {
    const settings = {
      theme,
      maxConcurrent,
      autoStart,
      notification,
      outputDir,
      keepOriginal,
      autoRename,
    };
    console.log('保存设置:', settings);
    toast.success('设置已保存');
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1
          className="text-4xl font-bold tracking-tight text-text-primary mb-2"
          style={{ letterSpacing: '-0.02em' }}
        >
          设置
        </h1>
        <p className="text-sm text-text-secondary">配置 FFmpeg 和应用偏好</p>
      </div>

      {/* Settings Container */}
      <div className="max-w-[800px] mx-auto space-y-6">
        {/* 1. FFmpeg 配置 */}
        <Card className="p-6 bg-surface-raised border border-border-light rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <SettingsIcon className="w-5 h-5 text-text-secondary" />
            <h2 className="text-lg font-semibold text-text-primary">FFmpeg 配置</h2>
          </div>

          <div className="space-y-5">
            {/* FFmpeg 路径 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">FFmpeg 路径</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={ffmpegPath}
                  onChange={(e) => setFfmpegPath(e.target.value)}
                  className="flex-1 h-10 px-3 py-2 rounded-lg border border-border-medium bg-surface-base text-text-primary text-[13px] font-mono transition-all hover:border-border-dark focus:outline-none focus:border-2 focus:border-primary-500 focus:px-[11px] focus:py-[7px]"
                  readOnly
                />
                <button
                  onClick={handleBrowseFFmpeg}
                  className="w-20 h-10 px-3 border border-border-medium rounded-lg bg-background-tertiary text-text-primary text-sm font-medium transition-all hover:bg-border-light hover:border-border-dark"
                >
                  浏览
                </button>
              </div>
              {ffmpegDetected && (
                <div className="flex items-center gap-2 text-[13px] text-success-600 mt-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>FFmpeg 已检测到 (版本: {ffmpegVersion})</span>
                </div>
              )}
            </div>

            {/* FFprobe 路径 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">FFprobe 路径</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={ffprobePath}
                  onChange={(e) => setFfprobePath(e.target.value)}
                  className="flex-1 h-10 px-3 py-2 rounded-lg border border-border-medium bg-surface-base text-text-primary text-[13px] font-mono transition-all hover:border-border-dark focus:outline-none focus:border-2 focus:border-primary-500 focus:px-[11px] focus:py-[7px]"
                  readOnly
                />
                <button
                  onClick={handleBrowseFFprobe}
                  className="w-20 h-10 px-3 border border-border-medium rounded-lg bg-background-tertiary text-text-primary text-sm font-medium transition-all hover:bg-border-light hover:border-border-dark"
                >
                  浏览
                </button>
              </div>
              {ffprobeDetected && (
                <div className="flex items-center gap-2 text-[13px] text-success-600 mt-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>FFprobe 已检测到 (版本: {ffprobeVersion})</span>
                </div>
              )}
            </div>

            {/* 重新检测 */}
            <div>
              <button
                onClick={handleRedetect}
                className="h-10 px-6 border border-border-medium rounded-lg bg-background-tertiary text-text-primary text-sm font-medium transition-all hover:bg-border-light hover:border-border-dark"
              >
                重新检测
              </button>
            </div>
          </div>
        </Card>

        {/* 2. 外观 */}
        <Card className="p-6 bg-surface-raised border border-border-light rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <Palette className="w-5 h-5 text-text-secondary" />
            <h2 className="text-lg font-semibold text-text-primary">外观</h2>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">主题</label>
              <div className="flex gap-4">
                {/* 浅色 */}
                <div
                  onClick={() => setTheme('light')}
                  className={cn(
                    'flex-1 flex items-center justify-center h-12 px-4 rounded-lg border-2 cursor-pointer transition-all',
                    theme === 'light'
                      ? 'border-primary-600 bg-primary-50 dark:bg-primary-600/20'
                      : 'border-border-light hover:border-border-dark'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span className={cn('text-sm', theme === 'light' ? 'font-semibold' : '')}>浅色</span>
                  </div>
                </div>

                {/* 深色 */}
                <div
                  onClick={() => setTheme('dark')}
                  className={cn(
                    'flex-1 flex items-center justify-center h-12 px-4 rounded-lg border-2 cursor-pointer transition-all',
                    theme === 'dark'
                      ? 'border-primary-600 bg-primary-50 dark:bg-primary-600/20'
                      : 'border-border-light hover:border-border-dark'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                    <span className={cn('text-sm', theme === 'dark' ? 'font-semibold' : '')}>深色</span>
                  </div>
                </div>

                {/* 跟随系统 */}
                <div
                  onClick={() => setTheme('system')}
                  className={cn(
                    'flex-1 flex items-center justify-center h-12 px-4 rounded-lg border-2 cursor-pointer transition-all',
                    theme === 'system'
                      ? 'border-primary-600 bg-primary-50 dark:bg-primary-600/20'
                      : 'border-border-light hover:border-border-dark'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className={cn('text-sm', theme === 'system' ? 'font-semibold' : '')}>跟随系统</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 3. 任务设置 */}
        <Card className="p-6 bg-surface-raised border border-border-light rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <Sliders className="w-5 h-5 text-text-secondary" />
            <h2 className="text-lg font-semibold text-text-primary">任务设置</h2>
          </div>

          <div className="space-y-5">
            {/* 最大并发任务数 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">最大并发任务数</label>
              <select
                value={maxConcurrent}
                onChange={(e) => setMaxConcurrent(Number(e.target.value))}
                className="w-full h-10 px-3 py-2 rounded-lg border border-border-medium bg-surface-base text-text-primary text-sm transition-all hover:border-border-dark focus:outline-none focus:border-2 focus:border-primary-500 focus:px-[11px] focus:py-[7px]"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
              </select>
            </div>

            {/* 复选框 */}
            <label className="flex items-center h-10 gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={autoStart}
                onChange={(e) => setAutoStart(e.target.checked)}
                className="w-[18px] h-[18px] border-2 border-border-medium rounded bg-surface-base cursor-pointer transition-all hover:border-border-dark checked:bg-primary-600 checked:border-primary-600 appearance-none relative flex-shrink-0"
                style={{
                  backgroundImage: autoStart ? "url(\"data:svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='white' d='M13.485 3.431a.75.75 0 011.06 1.06l-8 8a.75.75 0 01-1.06 0l-3.5-3.5a.75.75 0 111.06-1.06L6 10.939l7.485-7.508z'/%3E%3C/svg%3E\")" : 'none',
                  backgroundSize: '100% 100%',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              />
              <span className="text-sm text-text-primary">任务完成后自动开始下一个</span>
            </label>

            <label className="flex items-center h-10 gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notification}
                onChange={(e) => setNotification(e.target.checked)}
                className="w-[18px] h-[18px] border-2 border-border-medium rounded bg-surface-base cursor-pointer transition-all hover:border-border-dark checked:bg-primary-600 checked:border-primary-600 appearance-none relative flex-shrink-0"
                style={{
                  backgroundImage: notification ? "url(\"data:svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='white' d='M13.485 3.431a.75.75 0 011.06 1.06l-8 8a.75.75 0 01-1.06 0l-3.5-3.5a.75.75 0 111.06-1.06L6 10.939l7.485-7.508z'/%3E%3C/svg%3E\")" : 'none',
                  backgroundSize: '100% 100%',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              />
              <span className="text-sm text-text-primary">任务完成后发送系统通知</span>
            </label>
          </div>
        </Card>

        {/* 4. 文件设置 */}
        <Card className="p-6 bg-surface-raised border border-border-light rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <Folder className="w-5 h-5 text-text-secondary" />
            <h2 className="text-lg font-semibold text-text-primary">文件设置</h2>
          </div>

          <div className="space-y-5">
            {/* 默认输出目录 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">默认输出目录</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={outputDir}
                  onChange={(e) => setOutputDir(e.target.value)}
                  className="flex-1 h-10 px-3 py-2 rounded-lg border border-border-medium bg-surface-base text-text-primary text-[13px] font-mono transition-all hover:border-border-dark focus:outline-none focus:border-2 focus:border-primary-500 focus:px-[11px] focus:py-[7px]"
                  readOnly
                />
                <button
                  onClick={handleBrowseOutputDir}
                  className="w-20 h-10 px-3 border border-border-medium rounded-lg bg-background-tertiary text-text-primary text-sm font-medium transition-all hover:bg-border-light hover:border-border-dark"
                >
                  浏览
                </button>
              </div>
            </div>

            {/* 复选框 */}
            <label className="flex items-center h-10 gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={keepOriginal}
                onChange={(e) => setKeepOriginal(e.target.checked)}
                className="w-[18px] h-[18px] border-2 border-border-medium rounded bg-surface-base cursor-pointer transition-all hover:border-border-dark checked:bg-primary-600 checked:border-primary-600 appearance-none relative flex-shrink-0"
                style={{
                  backgroundImage: keepOriginal ? "url(\"data:svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='white' d='M13.485 3.431a.75.75 0 011.06 1.06l-8 8a.75.75 0 01-1.06 0l-3.5-3.5a.75.75 0 111.06-1.06L6 10.939l7.485-7.508z'/%3E%3C/svg%3E\")" : 'none',
                  backgroundSize: '100% 100%',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              />
              <span className="text-sm text-text-primary">转换后保留原文件</span>
            </label>

            <label className="flex items-center h-10 gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={autoRename}
                onChange={(e) => setAutoRename(e.target.checked)}
                className="w-[18px] h-[18px] border-2 border-border-medium rounded bg-surface-base cursor-pointer transition-all hover:border-border-dark checked:bg-primary-600 checked:border-primary-600 appearance-none relative flex-shrink-0"
                style={{
                  backgroundImage: autoRename ? "url(\"data:svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='white' d='M13.485 3.431a.75.75 0 011.06 1.06l-8 8a.75.75 0 01-1.06 0l-3.5-3.5a.75.75 0 111.06-1.06L6 10.939l7.485-7.508z'/%3E%3C/svg%3E\")" : 'none',
                  backgroundSize: '100% 100%',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              />
              <span className="text-sm text-text-primary">文件名冲突时自动重命名</span>
            </label>
          </div>
        </Card>

        {/* 保存按钮 */}
        <button
          onClick={handleSave}
          className="w-[200px] h-12 bg-primary-600 text-white rounded-lg text-base font-semibold shadow-sm hover:bg-primary-700 hover:shadow-md hover:-translate-y-px transition-all active:translate-y-0 active:scale-[0.98] mt-8"
        >
          保存设置
        </button>
      </div>
    </div>
  );
}
