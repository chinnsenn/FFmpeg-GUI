import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card } from '@renderer/components/ui/card';
import { Settings as SettingsIcon, Sliders, Folder, CheckCircle } from 'lucide-react';
import { logger } from '@renderer/utils/logger';
import type { AppConfig } from '@shared/types';

export function Settings() {
  // FFmpeg 配置
  const [ffmpegPath, setFfmpegPath] = useState('/usr/local/bin/ffmpeg');
  const [ffprobePath, setFfprobePath] = useState('/usr/local/bin/ffprobe');
  const [ffmpegVersion, setFfmpegVersion] = useState('6.0');
  const [ffprobeVersion, _setFfprobeVersion] = useState('6.0'); // TODO: Implement FFprobe detection
  const [ffmpegDetected, setFfmpegDetected] = useState(true);
  const [ffprobeDetected, _setFfprobeDetected] = useState(true); // TODO: Implement FFprobe detection

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
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const config = await window.electronAPI.getConfig();

      // 从配置中加载设置（主题已由 useTheme hook 处理）
      if (config.ffmpegPath) setFfmpegPath(config.ffmpegPath);
      if (config.ffprobePath) setFfprobePath(config.ffprobePath);
      if (config.outputPath) setOutputDir(config.outputPath);
      if (config.maxConcurrentTasks) setMaxConcurrent(config.maxConcurrentTasks);
      if (config.autoStartNext !== undefined) setAutoStart(config.autoStartNext);
      if (config.enableNotifications !== undefined) setNotification(config.enableNotifications);
      if (config.keepOriginalFile !== undefined) setKeepOriginal(config.keepOriginalFile);
      if (config.autoRenameOnConflict !== undefined) setAutoRename(config.autoRenameOnConflict);

      logger.info('Settings', '配置加载成功', { config });
    } catch (error) {
      logger.errorFromCatch('Settings', '加载配置失败', error);
    }
  };

  const detectFFmpeg = async () => {
    try {
      const info = await window.electronAPI.ffmpeg.detect();
      if (info.isInstalled) {
        setFfmpegPath(info.path || '/usr/local/bin/ffmpeg');
        setFfmpegVersion(info.version || '6.0');
        setFfmpegDetected(true);
        logger.info('Settings', 'FFmpeg 检测成功', { path: info.path, version: info.version });
      } else {
        setFfmpegDetected(false);
        logger.warn('Settings', 'FFmpeg 未安装');
      }
    } catch (error) {
      logger.errorFromCatch('Settings', 'FFmpeg 检测失败', error);
      setFfmpegDetected(false);
      toast.error('FFmpeg 检测失败', {
        description: error instanceof Error ? error.message : '未知错误',
      });
    }
  };

  const handleBrowseFFmpeg = async () => {
    try {
      const path = await window.electronAPI.selectFile([
        { name: 'Executable Files', extensions: ['exe', ''] },
        { name: 'All Files', extensions: ['*'] },
      ]);

      if (path) {
        setFfmpegPath(path);
        logger.info('Settings', 'FFmpeg 路径已选择', { path });
        toast.success('FFmpeg 路径已更新', {
          description: '请点击"重新检测"验证 FFmpeg 是否有效',
        });
      }
    } catch (error) {
      logger.errorFromCatch('Settings', '选择 FFmpeg 文件失败', error);
      toast.error('选择文件失败', {
        description: error instanceof Error ? error.message : '未知错误',
      });
    }
  };

  const handleBrowseFFprobe = async () => {
    try {
      const path = await window.electronAPI.selectFile([
        { name: 'Executable Files', extensions: ['exe', ''] },
        { name: 'All Files', extensions: ['*'] },
      ]);

      if (path) {
        setFfprobePath(path);
        logger.info('Settings', 'FFprobe 路径已选择', { path });
        toast.success('FFprobe 路径已更新', {
          description: '请点击"重新检测"验证 FFprobe 是否有效',
        });
      }
    } catch (error) {
      logger.errorFromCatch('Settings', '选择 FFprobe 文件失败', error);
      toast.error('选择文件失败', {
        description: error instanceof Error ? error.message : '未知错误',
      });
    }
  };

  const handleBrowseOutputDir = async () => {
    try {
      const dir = await window.electronAPI.selectDirectory();

      if (dir) {
        setOutputDir(dir);
        logger.info('Settings', '输出目录已选择', { dir });
        toast.success('输出目录已更新');
      }
    } catch (error) {
      logger.errorFromCatch('Settings', '选择目录失败', error);
      toast.error('选择目录失败', {
        description: error instanceof Error ? error.message : '未知错误',
      });
    }
  };

  const handleRedetect = async () => {
    toast.info('正在重新检测 FFmpeg...');
    await detectFFmpeg();
    toast.success('检测完成');
  };

  const handleSave = async () => {
    try {
      const settings: Partial<AppConfig> = {
        ffmpegPath,
        ffprobePath,
        outputPath: outputDir,
        maxConcurrentTasks: maxConcurrent,
        autoStartNext: autoStart,
        enableNotifications: notification,
        keepOriginalFile: keepOriginal,
        autoRenameOnConflict: autoRename,
      };

      await window.electronAPI.setConfig(settings);

      // 同时更新运行时的最大并发数
      await window.electronAPI.task.setMaxConcurrent(maxConcurrent);

      logger.info('Settings', '设置已保存', { settings });
      toast.success('设置已保存', {
        description: '您的偏好设置已成功保存',
      });
    } catch (error) {
      logger.errorFromCatch('Settings', '保存设置失败', error);
      toast.error('保存设置失败', {
        description: error instanceof Error ? error.message : '未知错误',
      });
    }
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
              <label htmlFor="ffmpeg-path" className="text-sm font-medium text-text-primary">
                FFmpeg 路径
              </label>
              <div className="flex gap-2">
                <input
                  id="ffmpeg-path"
                  type="text"
                  value={ffmpegPath}
                  onChange={(e) => setFfmpegPath(e.target.value)}
                  className="flex-1 h-10 px-3 py-2 rounded-lg border border-border-medium bg-surface-base text-text-primary text-[13px] font-mono transition-all hover:border-border-dark focus:outline-none focus:border-2 focus:border-primary-500 focus:px-[11px] focus:py-[7px]"
                  readOnly
                  aria-readonly="true"
                />
                <button
                  onClick={handleBrowseFFmpeg}
                  className="w-20 h-10 px-3 border border-border-medium rounded-lg bg-background-tertiary text-text-primary text-sm font-medium transition-all hover:bg-border-light hover:border-border-dark"
                  aria-label="浏览并选择 FFmpeg 可执行文件"
                >
                  浏览
                </button>
              </div>
              {ffmpegDetected && (
                <div className="flex items-center gap-2 text-[13px] text-success-600 mt-2">
                  <CheckCircle className="w-4 h-4" aria-hidden="true" />
                  <span>FFmpeg 已检测到 (版本: {ffmpegVersion})</span>
                </div>
              )}
            </div>

            {/* FFprobe 路径 */}
            <div className="space-y-2">
              <label htmlFor="ffprobe-path" className="text-sm font-medium text-text-primary">
                FFprobe 路径
              </label>
              <div className="flex gap-2">
                <input
                  id="ffprobe-path"
                  type="text"
                  value={ffprobePath}
                  onChange={(e) => setFfprobePath(e.target.value)}
                  className="flex-1 h-10 px-3 py-2 rounded-lg border border-border-medium bg-surface-base text-text-primary text-[13px] font-mono transition-all hover:border-border-dark focus:outline-none focus:border-2 focus:border-primary-500 focus:px-[11px] focus:py-[7px]"
                  readOnly
                  aria-readonly="true"
                />
                <button
                  onClick={handleBrowseFFprobe}
                  className="w-20 h-10 px-3 border border-border-medium rounded-lg bg-background-tertiary text-text-primary text-sm font-medium transition-all hover:bg-border-light hover:border-border-dark"
                  aria-label="浏览并选择 FFprobe 可执行文件"
                >
                  浏览
                </button>
              </div>
              {ffprobeDetected && (
                <div className="flex items-center gap-2 text-[13px] text-success-600 mt-2">
                  <CheckCircle className="w-4 h-4" aria-hidden="true" />
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

        {/* 2. 任务设置 */}
        <Card className="p-6 bg-surface-raised border border-border-light rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <Sliders className="w-5 h-5 text-text-secondary" />
            <h2 className="text-lg font-semibold text-text-primary">任务设置</h2>
          </div>

          <div className="space-y-5">
            {/* 最大并发任务数 */}
            <div className="space-y-2">
              <label htmlFor="max-concurrent" className="text-sm font-medium text-text-primary">
                最大并发任务数
              </label>
              <select
                id="max-concurrent"
                value={maxConcurrent}
                onChange={(e) => setMaxConcurrent(Number(e.target.value))}
                className="w-full h-10 px-3 py-2 rounded-lg border border-border-medium bg-surface-base text-text-primary text-sm transition-all hover:border-border-dark focus:outline-none focus:border-2 focus:border-primary-500 focus:px-[11px] focus:py-[7px]"
                aria-label="设置最大并发任务数"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
              </select>
            </div>

            {/* 复选框 */}
            <label htmlFor="auto-start-checkbox" className="flex items-center h-10 gap-3 cursor-pointer">
              <input
                id="auto-start-checkbox"
                type="checkbox"
                checked={autoStart}
                onChange={(e) => setAutoStart(e.target.checked)}
                className="w-[18px] h-[18px] border-2 border-border-medium rounded bg-surface-base cursor-pointer transition-all hover:border-border-dark checked:bg-primary-600 checked:border-primary-600 appearance-none relative flex-shrink-0 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                style={{
                  backgroundImage: autoStart ? "url(\"data:svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='white' d='M13.485 3.431a.75.75 0 011.06 1.06l-8 8a.75.75 0 01-1.06 0l-3.5-3.5a.75.75 0 111.06-1.06L6 10.939l7.485-7.508z'/%3E%3C/svg%3E\")" : 'none',
                  backgroundSize: '100% 100%',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
                aria-checked={autoStart}
              />
              <span className="text-sm text-text-primary">任务完成后自动开始下一个</span>
            </label>

            <label htmlFor="notification-checkbox" className="flex items-center h-10 gap-3 cursor-pointer">
              <input
                id="notification-checkbox"
                type="checkbox"
                checked={notification}
                onChange={(e) => setNotification(e.target.checked)}
                className="w-[18px] h-[18px] border-2 border-border-medium rounded bg-surface-base cursor-pointer transition-all hover:border-border-dark checked:bg-primary-600 checked:border-primary-600 appearance-none relative flex-shrink-0 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                style={{
                  backgroundImage: notification ? "url(\"data:svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='white' d='M13.485 3.431a.75.75 0 011.06 1.06l-8 8a.75.75 0 01-1.06 0l-3.5-3.5a.75.75 0 111.06-1.06L6 10.939l7.485-7.508z'/%3E%3C/svg%3E\")" : 'none',
                  backgroundSize: '100% 100%',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
                aria-checked={notification}
              />
              <span className="text-sm text-text-primary">任务完成后发送系统通知</span>
            </label>
          </div>
        </Card>

        {/* 3. 文件设置 */}
        <Card className="p-6 bg-surface-raised border border-border-light rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <Folder className="w-5 h-5 text-text-secondary" />
            <h2 className="text-lg font-semibold text-text-primary">文件设置</h2>
          </div>

          <div className="space-y-5">
            {/* 默认输出目录 */}
            <div className="space-y-2">
              <label htmlFor="output-dir" className="text-sm font-medium text-text-primary">
                默认输出目录
              </label>
              <div className="flex gap-2">
                <input
                  id="output-dir"
                  type="text"
                  value={outputDir}
                  onChange={(e) => setOutputDir(e.target.value)}
                  className="flex-1 h-10 px-3 py-2 rounded-lg border border-border-medium bg-surface-base text-text-primary text-[13px] font-mono transition-all hover:border-border-dark focus:outline-none focus:border-2 focus:border-primary-500 focus:px-[11px] focus:py-[7px]"
                  readOnly
                  aria-readonly="true"
                />
                <button
                  onClick={handleBrowseOutputDir}
                  className="w-20 h-10 px-3 border border-border-medium rounded-lg bg-background-tertiary text-text-primary text-sm font-medium transition-all hover:bg-border-light hover:border-border-dark"
                  aria-label="浏览并选择默认输出目录"
                >
                  浏览
                </button>
              </div>
            </div>

            {/* 复选框 */}
            <label htmlFor="keep-original-checkbox" className="flex items-center h-10 gap-3 cursor-pointer">
              <input
                id="keep-original-checkbox"
                type="checkbox"
                checked={keepOriginal}
                onChange={(e) => setKeepOriginal(e.target.checked)}
                className="w-[18px] h-[18px] border-2 border-border-medium rounded bg-surface-base cursor-pointer transition-all hover:border-border-dark checked:bg-primary-600 checked:border-primary-600 appearance-none relative flex-shrink-0 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                style={{
                  backgroundImage: keepOriginal ? "url(\"data:svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='white' d='M13.485 3.431a.75.75 0 011.06 1.06l-8 8a.75.75 0 01-1.06 0l-3.5-3.5a.75.75 0 111.06-1.06L6 10.939l7.485-7.508z'/%3E%3C/svg%3E\")" : 'none',
                  backgroundSize: '100% 100%',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
                aria-checked={keepOriginal}
              />
              <span className="text-sm text-text-primary">转换后保留原文件</span>
            </label>

            <label htmlFor="auto-rename-checkbox" className="flex items-center h-10 gap-3 cursor-pointer">
              <input
                id="auto-rename-checkbox"
                type="checkbox"
                checked={autoRename}
                onChange={(e) => setAutoRename(e.target.checked)}
                className="w-[18px] h-[18px] border-2 border-border-medium rounded bg-surface-base cursor-pointer transition-all hover:border-border-dark checked:bg-primary-600 checked:border-primary-600 appearance-none relative flex-shrink-0 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                style={{
                  backgroundImage: autoRename ? "url(\"data:svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='white' d='M13.485 3.431a.75.75 0 011.06 1.06l-8 8a.75.75 0 01-1.06 0l-3.5-3.5a.75.75 0 111.06-1.06L6 10.939l7.485-7.508z'/%3E%3C/svg%3E\")" : 'none',
                  backgroundSize: '100% 100%',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
                aria-checked={autoRename}
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
