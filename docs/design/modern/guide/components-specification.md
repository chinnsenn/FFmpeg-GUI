# FFmpeg GUI 组件规范

本文档详细定义了 FFmpeg GUI 应用中所有关键组件的视觉规范、交互状态和实现细节。

---

## 目录

1. [TaskCard - 任务卡片](#1-taskcard---任务卡片)
2. [FileList - 文件列表](#2-filelist---文件列表)
3. [MediaInfo - 媒体信息显示](#3-mediainfo---媒体信息显示)
4. [ProgressBar - 进度条](#4-progressbar---进度条)
5. [Button - 按钮](#5-button---按钮)
6. [Input - 输入框](#6-input---输入框)
7. [Select - 下拉菜单](#7-select---下拉菜单)
8. [Slider - 滑块](#8-slider---滑块)
9. [Radio - 单选按钮](#9-radio---单选按钮)
10. [Checkbox - 复选框](#10-checkbox---复选框)
11. [Sidebar - 侧边栏导航](#11-sidebar---侧边栏导航)
12. [Modal - 模态框](#12-modal---模态框)
13. [Toast - 通知提示](#13-toast---通知提示)
14. [FileUploader - 文件上传器](#14-fileuploader---文件上传器)

---

## 1. TaskCard - 任务卡片

### 概述

TaskCard 是显示单个任务状态和进度的核心组件。它支持多种状态（pending、running、paused、completed、failed、cancelled），并实时显示进度信息。

### 尺寸规范

- **宽度：**100%（父容器宽度）
- **最小高度：**120px
- **内边距：**`--space-6`（24px）
- **圆角：**`--radius-lg`（12px）
- **边框宽度：**2px

### 状态样式

#### 1.1 Pending（等待中）

```css
背景色（浅色）: --background-secondary (#F9FAFB)
背景色（深色）: --background-secondary (#1A1F29)
边框: 1px solid --border-light
阴影: none
```

**视觉特征：**
- 图标：Clock（⏰），灰色
- 状态文字：14px，font-medium，`--text-secondary`
- 整体低对比度，表示非活跃状态

#### 1.2 Running（运行中）⭐

```css
背景色（浅色）: --surface-raised (#FFFFFF)
背景色（深色）: --surface-raised (#242933)
边框: 2px solid --primary-500 (#3B82F6)
阴影: Level 2 (Elevated)
```

**视觉特征：**
- 图标：Loader2（旋转动画），蓝色
- 状态文字：14px，font-medium，`--primary-600`
- 边框有微妙的脉冲动画（opacity: 0.8 → 1.0，2s循环）
- 进度百分比：16px，font-semibold，`--primary-600`
- 进度条：高度 8px，带光晕动画

**进度信息行：**
- 字体大小：12px
- 颜色：`--text-secondary`
- 布局：Flex，space-between
- 显示：速度 (1.8x) | ETA (5分32秒) | FPS (54)

#### 1.3 Paused（已暂停）

```css
背景色: --warning-50 (浅色) / --background-secondary (深色)
边框: 1px solid --warning-500
阴影: Level 1
```

**视觉特征：**
- 图标：Pause，黄色
- 状态文字：14px，font-medium，`--warning-600`
- 保留进度条，但静止不动（无动画）

#### 1.4 Completed（已完成）✅

```css
背景色: --success-50 (浅色) / --background-secondary (深色)
边框: 1px solid --success-500
阴影: Level 1
```

**视觉特征：**
- 图标：CheckCircle2，绿色，带 scale-in 动画（0.8 → 1.0，300ms）
- 状态文字：14px，font-medium，`--success-600`
- 完成信息："用时: 8分12秒"，12px，`--success-600`
- 整体有轻微的成功感庆祝动画（完成瞬间）

#### 1.5 Failed（失败）❌

```css
背景色: --error-50 (浅色) / --background-secondary (深色)
边框: 1px solid --error-500
阴影: Level 1
```

**视觉特征：**
- 图标：XCircle，红色，带抖动动画（失败瞬间）
- 状态文字：14px，font-medium，`--error-600`
- 错误消息：12px，`--error-600`，可展开查看完整错误日志

#### 1.6 Cancelled（已取消）

```css
背景色: --background-secondary
边框: 1px solid --border-light
阴影: none
```

**视觉特征：**
- 图标：X，灰色
- 状态文字：14px，font-medium，`--text-secondary`
- 整体低对比度

### 内容结构

```
┌─────────────────────────────────────────────────────────┐
│ [图标] 运行中 - 45%                    [⏸️] [×]         │
│                                                         │
│ 输入: video.mp4                                         │
│ 输出: video.webm                                        │
│                                                         │
│ ████████████░░░░░░░░░░░░░░░░░  45%                     │
│                                                         │
│ 速度: 1.8x  |  ETA: 5分32秒  |  FPS: 54                │
└─────────────────────────────────────────────────────────┘
```

### 交互元素

**操作按钮：**
- 位置：右上角
- 尺寸：32px × 32px（图标按钮）
- 圆角：`--radius-md`（8px）
- 图标尺寸：16px
- 间距：`--space-2`（8px）

**按钮变体：**
- **暂停（Pause）：**运行中任务显示
- **恢复（Play）：**暂停任务显示
- **取消（X）：**运行中、暂停、等待中任务显示
- **重试（RotateCcw）：**失败任务显示

### 代码实现

```tsx
import { Task, TaskStatus } from '@shared/types';
import { Button } from '../ui/button';
import { Play, Pause, X, RotateCcw, CheckCircle2, XCircle, Clock, Loader2 } from 'lucide-react';
import { cn } from '@renderer/lib/utils';

interface TaskCardProps {
  task: Task;
  onPause?: (taskId: string) => void;
  onResume?: (taskId: string) => void;
  onCancel?: (taskId: string) => void;
  onRetry?: (taskId: string) => void;
}

export function TaskCard({ task, onPause, onResume, onCancel, onRetry }: TaskCardProps) {
  const getStatusStyles = (status: TaskStatus) => {
    const styles = {
      pending: "bg-background-secondary border-border-light",
      running: "bg-surface-raised border-primary-500 border-2 shadow-md",
      paused: "bg-warning-50 dark:bg-background-secondary border-warning-500",
      completed: "bg-success-50 dark:bg-background-secondary border-success-500",
      failed: "bg-error-50 dark:bg-background-secondary border-error-500",
      cancelled: "bg-background-secondary border-border-light"
    };
    return styles[status] || styles.pending;
  };

  const getStatusIcon = (status: TaskStatus) => {
    const icons = {
      pending: <Clock className="w-5 h-5 text-gray-500" />,
      running: <Loader2 className="w-5 h-5 text-primary-600 animate-spin" />,
      paused: <Pause className="w-5 h-5 text-warning-600" />,
      completed: <CheckCircle2 className="w-5 h-5 text-success-600 animate-scale-in" />,
      failed: <XCircle className="w-5 h-5 text-error-600 animate-shake" />,
      cancelled: <X className="w-5 h-5 text-gray-500" />
    };
    return icons[status];
  };

  const getStatusLabel = (status: TaskStatus) => {
    const labels = {
      pending: '等待中',
      running: '运行中',
      paused: '已暂停',
      completed: '已完成',
      failed: '失败',
      cancelled: '已取消'
    };
    return labels[status];
  };

  return (
    <div className={cn(
      "w-full min-h-30 p-6 rounded-lg border transition-all duration-300",
      getStatusStyles(task.status)
    )}>
      {/* 顶部：状态和操作按钮 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          {getStatusIcon(task.status)}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {getStatusLabel(task.status)}
              </span>
              {task.status === 'running' && task.progress !== undefined && (
                <span className="text-base font-semibold text-primary-600">
                  {task.progress.toFixed(0)}%
                </span>
              )}
            </div>
            <div className="mt-1 space-y-0.5 text-xs text-text-secondary">
              <div>输入: {task.inputFile}</div>
              <div>输出: {task.outputFile}</div>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2">
          {task.status === 'running' && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onPause?.(task.id)}
                className="w-8 h-8"
              >
                <Pause className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onCancel?.(task.id)}
                className="w-8 h-8 hover:text-error-600"
              >
                <X className="w-4 h-4" />
              </Button>
            </>
          )}
          {task.status === 'paused' && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onResume?.(task.id)}
                className="w-8 h-8"
              >
                <Play className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onCancel?.(task.id)}
                className="w-8 h-8 hover:text-error-600"
              >
                <X className="w-4 h-4" />
              </Button>
            </>
          )}
          {task.status === 'pending' && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onCancel?.(task.id)}
              className="w-8 h-8 hover:text-error-600"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          {task.status === 'failed' && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRetry?.(task.id)}
              className="w-8 h-8 hover:text-primary-600"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* 运行中：进度条和详细信息 */}
      {task.status === 'running' && task.progress !== undefined && (
        <div className="space-y-3">
          <ProgressBar percent={task.progress} animated />

          {task.progressInfo && (
            <div className="flex justify-between text-xs text-text-secondary">
              <span>速度: {task.progressInfo.speed}x</span>
              <span>ETA: {calculateETA(task)}</span>
              <span>FPS: {task.progressInfo.fps}</span>
            </div>
          )}
        </div>
      )}

      {/* 已完成：完成信息 */}
      {task.status === 'completed' && task.completedAt && task.startedAt && (
        <div className="text-sm text-success-600">
          用时: {calculateDuration(task.startedAt, task.completedAt)}
        </div>
      )}

      {/* 失败：错误消息 */}
      {task.status === 'failed' && task.error && (
        <div className="text-sm text-error-600">
          {task.error}
        </div>
      )}
    </div>
  );
}
```

---

## 2. FileList - 文件列表

### 概述

FileList 显示用户选择的文件列表，支持展开/折叠以查看详细媒体信息。

### 尺寸规范

- **列表项高度（折叠）：**72px
- **列表项高度（展开）：**自适应（最小 200px）
- **列表项内边距：**`--space-4`（16px）
- **列表项圆角：**`--radius-md`（8px）
- **列表项间距：**`--space-2`（8px）
- **最大高度（滚动）：**500px

### 折叠状态

```
┌─────────────────────────────────────────────┐
│ [🎬] video.mp4                    [▸] [×]   │
│      256.5 MB                               │
└─────────────────────────────────────────────┘
```

**样式规范：**
```css
背景色: --surface-raised
边框: 1px solid --border-light
阴影: Level 1
过渡: all 150ms ease
```

**悬停状态：**
```css
背景色: --background-tertiary
阴影: Level 2
光标: pointer
```

**内容布局：**
- **文件图标：**
  - 尺寸：20px × 20px
  - 颜色：`--primary-600`（FileVideo 或 Music）
  - 左对齐

- **文件名：**
  - 字体大小：14px
  - 字重：500（medium）
  - 颜色：`--text-primary`
  - 允许省略（truncate）

- **文件大小：**
  - 字体大小：12px
  - 颜色：`--text-tertiary`
  - 位于文件名下方

- **展开按钮：**
  - 尺寸：32px × 32px
  - 图标：ChevronRight / ChevronDown
  - 图标尺寸：16px
  - 旋转动画：200ms ease

- **删除按钮：**
  - 尺寸：32px × 32px
  - 图标：X
  - 图标尺寸：16px
  - 悬停颜色：`--error-600`

### 展开状态

展开时显示 MediaInfo 组件（见下一节）。

**展开动画：**
- 高度：auto（使用 max-height 过渡）
- 持续时间：300ms
- 缓动函数：ease-in-out
- 内容淡入：opacity 0 → 1

### 代码实现

```tsx
import { useState } from 'react';
import { X, FileVideo, Music, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@renderer/components/ui/button';
import { MediaInfo } from '@renderer/components/MediaInfo/MediaInfo';
import { formatFileSize } from '@renderer/lib/formatters';
import { cn } from '@renderer/lib/utils';

interface FileListProps {
  files: FileListItem[];
  onRemove: (id: string) => void;
}

export function FileList({ files, onRemove }: FileListProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('video/')) {
      return <FileVideo className="w-5 h-5 text-primary-600" />;
    } else if (file.type.startsWith('audio/')) {
      return <Music className="w-5 h-5 text-primary-600" />;
    }
    return <FileVideo className="w-5 h-5 text-text-tertiary" />;
  };

  if (files.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2 max-h-[500px] overflow-y-auto">
      <h3 className="text-sm font-medium text-text-secondary mb-3">
        已选择文件 ({files.length})
      </h3>

      {files.map(item => {
        const isExpanded = expandedIds.has(item.id);
        const hasMediaInfo = !!item.mediaInfo;

        return (
          <div
            key={item.id}
            className={cn(
              "rounded-lg border border-border-light bg-surface-raised shadow-sm overflow-hidden",
              "transition-all duration-150",
              "hover:bg-background-tertiary hover:shadow-md"
            )}
          >
            {/* 文件基本信息行 */}
            <div className="flex items-center gap-3 p-4">
              {getFileIcon(item.file)}

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {item.file.name}
                </p>
                <p className="text-xs text-text-tertiary">
                  {formatFileSize(item.file.size)}
                </p>
              </div>

              <div className="flex items-center gap-1">
                {hasMediaInfo && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleExpand(item.id)}
                    className="w-8 h-8 shrink-0"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 transition-transform" />
                    ) : (
                      <ChevronRight className="w-4 h-4 transition-transform" />
                    )}
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemove(item.id)}
                  className="w-8 h-8 shrink-0 hover:text-error-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* 展开：媒体信息 */}
            {isExpanded && hasMediaInfo && (
              <div className="px-4 pb-4 pt-0 animate-in slide-in-from-top-2 duration-300">
                <div className="pt-3 border-t border-border-light">
                  <MediaInfo info={item.mediaInfo} />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
```

---

## 3. MediaInfo - 媒体信息显示

### 概述

MediaInfo 组件以结构化方式显示视频/音频文件的详细元数据。

### 信息项布局

```
┌─────────────────────────────────────────┐
│ 📊 媒体信息                              │
│                                         │
│ 分辨率      1920 × 1080                 │
│ 时长        10:24                       │
│ 帧率        30 fps                      │
│ 视频编解码器 H.264 (AVC)                │
│ 视频码率    8.5 Mbps                    │
│ 音频编解码器 AAC                         │
│ 音频码率    192 kbps                    │
│ 声道        立体声 (2.0)                │
│ 采样率      48000 Hz                    │
└─────────────────────────────────────────┘
```

### 样式规范

**容器：**
```css
内边距: --space-4 (16px)
圆角: --radius-md (8px)
背景色: --background-secondary
边框: 1px solid --border-light
```

**标题：**
```css
字体大小: 14px
字重: 600 (semibold)
颜色: --text-primary
底部间距: --space-3 (12px)
图标: Info, 16px, --text-secondary
```

**信息项（单行）：**
```css
布局: Grid 2列 (1fr 2fr)
高度: 28px
列间距: --space-4 (16px)
行间距: --space-2 (8px)
```

**标签（左列）：**
```css
字体大小: 13px
颜色: --text-secondary
字重: 400
```

**值（右列）：**
```css
字体大小: 13px
颜色: --text-primary
字重: 500
字体: Monospace (JetBrains Mono) - 对于技术值
```

### 值格式化

- **分辨率：**`1920 × 1080` (使用 × 符号)
- **时长：**`10:24` (分:秒) 或 `1:23:45` (时:分:秒)
- **帧率：**`30 fps`
- **码率：**`8.5 Mbps` 或 `192 kbps`
- **采样率：**`48000 Hz` 或 `48 kHz`
- **声道：**`立体声 (2.0)` 或 `5.1 环绕声`

### 代码实现

```tsx
import { Info } from 'lucide-react';
import { MediaFileInfo } from '@shared/types';
import { formatBitrate, formatDuration } from '@renderer/lib/formatters';

interface MediaInfoProps {
  info: MediaFileInfo;
}

export function MediaInfo({ info }: MediaInfoProps) {
  const items: Array<{ label: string; value: string }> = [];

  // 视频信息
  if (info.videoCodec) {
    if (info.width && info.height) {
      items.push({
        label: '分辨率',
        value: `${info.width} × ${info.height}`
      });
    }
    if (info.duration) {
      items.push({
        label: '时长',
        value: formatDuration(info.duration)
      });
    }
    if (info.fps) {
      items.push({
        label: '帧率',
        value: `${info.fps} fps`
      });
    }
    items.push({
      label: '视频编解码器',
      value: info.videoCodec
    });
    if (info.videoBitrate) {
      items.push({
        label: '视频码率',
        value: formatBitrate(info.videoBitrate)
      });
    }
  }

  // 音频信息
  if (info.audioCodec) {
    items.push({
      label: '音频编解码器',
      value: info.audioCodec
    });
    if (info.audioBitrate) {
      items.push({
        label: '音频码率',
        value: formatBitrate(info.audioBitrate)
      });
    }
    if (info.audioChannels) {
      const channelLabel = info.audioChannels === 2 ? '立体声 (2.0)' :
                          info.audioChannels === 6 ? '5.1 环绕声' :
                          `${info.audioChannels} 声道`;
      items.push({
        label: '声道',
        value: channelLabel
      });
    }
    if (info.sampleRate) {
      items.push({
        label: '采样率',
        value: info.sampleRate >= 1000
          ? `${(info.sampleRate / 1000).toFixed(0)} kHz`
          : `${info.sampleRate} Hz`
      });
    }
  }

  return (
    <div className="p-4 rounded-lg bg-background-secondary border border-border-light">
      <div className="flex items-center gap-2 mb-3">
        <Info className="w-4 h-4 text-text-secondary" />
        <h4 className="text-sm font-semibold text-text-primary">媒体信息</h4>
      </div>

      <div className="grid grid-cols-[1fr_2fr] gap-x-4 gap-y-2">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <div className="text-xs text-text-secondary">{item.label}</div>
            <div className="text-xs text-text-primary font-medium font-mono">
              {item.value}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
```

---

## 4. ProgressBar - 进度条

### 概述

ProgressBar 显示任务执行进度，支持确定性进度（0-100%）和不确定性进度（无限循环）。

### 尺寸规范

- **高度：**8px
- **宽度：**100%
- **圆角：**`--radius-full`（9999px）

### 确定性进度条

```
████████████░░░░░░░░░░░░░░░░░  45%
```

**轨道（Track）：**
```css
高度: 8px
宽度: 100%
圆角: --radius-full
背景色（浅色）: hsl(220, 15%, 90%) // --border-light
背景色（深色）: hsl(220, 14%, 22%)
溢出: hidden
```

**填充（Fill）：**
```css
高度: 100%
宽度: {percent}%
圆角: --radius-full
背景: linear-gradient(90deg, --primary-500, --primary-600)
过渡: width 300ms ease-out
```

**光晕效果（Shimmer）：**
```css
位置: absolute
宽度: 100%
高度: 100%
背景: linear-gradient(
  90deg,
  transparent 0%,
  rgba(255, 255, 255, 0.2) 50%,
  transparent 100%
)
动画: shimmer 2s infinite
```

```css
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
```

### 不确定性进度条

用于无法获取进度信息的任务。

```css
背景: linear-gradient(
  90deg,
  transparent 0%,
  --primary-500 50%,
  transparent 100%
)
背景大小: 200% 100%
动画: indeterminate 1.5s ease-in-out infinite
```

```css
@keyframes indeterminate {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
```

### 代码实现

```tsx
import { cn } from '@renderer/lib/utils';

interface ProgressBarProps {
  percent: number;
  animated?: boolean;
  indeterminate?: boolean;
  className?: string;
}

export function ProgressBar({
  percent,
  animated = false,
  indeterminate = false,
  className
}: ProgressBarProps) {
  if (indeterminate) {
    return (
      <div className={cn(
        "relative w-full h-2 bg-border-light dark:bg-gray-700 rounded-full overflow-hidden",
        className
      )}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-500 to-transparent bg-[length:200%_100%] animate-indeterminate" />
      </div>
    );
  }

  return (
    <div className={cn(
      "relative w-full h-2 bg-border-light dark:bg-gray-700 rounded-full overflow-hidden",
      className
    )}>
      <div
        className={cn(
          "absolute inset-y-0 left-0 rounded-full transition-all duration-300 ease-out",
          "bg-gradient-to-r from-primary-500 to-primary-600"
        )}
        style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
      >
        {animated && (
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
            style={{
              backgroundSize: '200% 100%'
            }}
          />
        )}
      </div>
    </div>
  );
}
```

**Tailwind 配置（动画）：**

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        indeterminate: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' }
        }
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
        indeterminate: 'indeterminate 1.5s ease-in-out infinite'
      }
    }
  }
}
```

---

## 5. Button - 按钮

### 变体（Variants）

#### 5.1 Primary（主要按钮）

**默认状态：**
```css
高度: 40px (medium) | 48px (large)
内边距: --space-3 --space-6 (12px 24px)
圆角: --radius-md (8px)
背景: --primary-600 (#2563EB)
颜色: white
字体大小: 14px (medium) | 16px (large)
字重: 600 (semibold)
阴影: Level 1
过渡: all 150ms ease
```

**悬停状态：**
```css
背景: --primary-700
阴影: Level 2
变换: translateY(-1px)
```

**激活状态：**
```css
背景: --primary-700
阴影: Level 1
变换: translateY(0) scale(0.98)
```

**禁用状态：**
```css
背景: --text-disabled
颜色: white
透明度: 0.6
光标: not-allowed
阴影: none
```

#### 5.2 Secondary（次要按钮）

**默认状态：**
```css
背景: --background-tertiary
边框: 1px solid --border-medium
颜色: --text-primary
```

**悬停状态：**
```css
背景: --border-light
边框: 1px solid --border-dark
```

#### 5.3 Ghost（幽灵按钮）

**默认状态：**
```css
背景: transparent
颜色: --text-secondary
```

**悬停状态：**
```css
背景: --background-tertiary
颜色: --text-primary
```

#### 5.4 Icon（图标按钮）

**默认状态：**
```css
宽度: 32px (small) | 40px (medium)
高度: 32px (small) | 40px (medium)
内边距: 0
圆角: --radius-md (8px)
背景: transparent
```

**悬停状态：**
```css
背景: --background-tertiary
```

#### 5.5 Destructive（危险按钮）

**默认状态：**
```css
背景: --error-600
颜色: white
```

**悬停状态：**
```css
背景: --error-700
```

### 尺寸（Sizes）

```tsx
size?: 'small' | 'medium' | 'large'

small:  h-8 px-3 text-xs    (32px高, 12px文字)
medium: h-10 px-6 text-sm   (40px高, 14px文字) - 默认
large:  h-12 px-8 text-base (48px高, 16px文字)
```

### 代码实现

```tsx
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@renderer/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary:
          "bg-primary-600 text-white shadow-sm hover:bg-primary-700 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-98",
        secondary:
          "bg-background-tertiary text-text-primary border border-border-medium hover:bg-border-light hover:border-border-dark",
        ghost:
          "bg-transparent text-text-secondary hover:bg-background-tertiary hover:text-text-primary",
        destructive:
          "bg-error-600 text-white shadow-sm hover:bg-error-700 hover:shadow-md",
        icon:
          "bg-transparent hover:bg-background-tertiary"
      },
      size: {
        small: "h-8 px-3 text-xs",
        medium: "h-10 px-6 text-sm",
        large: "h-12 px-8 text-base",
        icon: "h-10 w-10 p-0"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "medium"
    }
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
```

---

## 6. Input - 输入框

### 尺寸规范

- **高度：**40px (medium)
- **内边距：**`--space-2 --space-3`（8px 12px）
- **圆角：**`--radius-md`（8px）
- **边框宽度：**1px
- **字体大小：**14px

### 状态样式

**默认状态：**
```css
背景: --surface-base (white / dark surface)
边框: 1px solid --border-medium
颜色: --text-primary
过渡: border-color 150ms ease
```

**悬停状态：**
```css
边框: 1px solid --border-dark
```

**聚焦状态：**
```css
边框: 2px solid --primary-500
外阴影: 0 0 0 3px rgba(primary-500, 0.2)
```

**禁用状态：**
```css
背景: --background-secondary
颜色: --text-disabled
光标: not-allowed
```

**错误状态：**
```css
边框: 2px solid --error-500
外阴影: 0 0 0 3px rgba(error-500, 0.1)
```

### 占位符（Placeholder）

```css
颜色: --text-tertiary
字体样式: italic (可选)
```

### 代码实现

```tsx
import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@renderer/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        className={cn(
          "h-10 w-full rounded-lg px-3 py-2 text-sm",
          "bg-surface-base text-text-primary",
          "border border-border-medium",
          "transition-all duration-150",
          "placeholder:text-text-tertiary placeholder:italic",
          "hover:border-border-dark",
          "focus:outline-none focus:border-2 focus:border-primary-500 focus:ring-3 focus:ring-primary-500/20",
          "disabled:bg-background-secondary disabled:text-text-disabled disabled:cursor-not-allowed",
          error && "border-2 border-error-500 focus:border-error-500 focus:ring-error-500/20",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
```

---

## 7. Select - 下拉菜单

### 尺寸规范

- **高度：**40px
- **内边距：**`--space-2 --space-3`（8px 12px右，8px左）
- **圆角：**`--radius-md`（8px）
- **边框宽度：**1px
- **字体大小：**14px

### 下拉图标

- **图标：**ChevronDown
- **尺寸：**16px
- **颜色：**`--text-secondary`
- **位置：**右侧，距边缘 12px

### 下拉面板（Dropdown）

**容器：**
```css
最大高度: 300px
内边距: --space-1 (4px)
圆角: --radius-md (8px)
背景: --surface-raised
边框: 1px solid --border-light
阴影: Level 3 (Floating)
溢出: auto
```

**选项（Option）：**
```css
高度: 36px
内边距: --space-2 --space-3 (8px 12px)
圆角: --radius-sm (4px)
字体大小: 14px
颜色: --text-primary
过渡: all 100ms ease
```

**选项悬停状态：**
```css
背景: --background-tertiary
颜色: --text-primary
```

**选项选中状态：**
```css
背景: --primary-50 (浅色) / --primary-500 10% (深色)
颜色: --primary-700
字重: 600
右侧图标: CheckCircle (16px)
```

### 代码实现

使用 Radix UI 的 Select 组件：

```tsx
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@renderer/lib/utils';

export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;

export const SelectTrigger = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-lg px-3 py-2 text-sm",
      "bg-surface-base text-text-primary",
      "border border-border-medium",
      "hover:border-border-dark",
      "focus:outline-none focus:border-2 focus:border-primary-500 focus:ring-3 focus:ring-primary-500/20",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 text-text-secondary" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));

export const SelectContent = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-lg",
        "bg-surface-raised border border-border-light shadow-lg",
        "animate-in fade-in-80",
        className
      )}
      {...props}
    >
      <SelectPrimitive.Viewport className="p-1">
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));

export const SelectItem = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex h-9 cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm outline-none",
      "text-text-primary",
      "hover:bg-background-tertiary",
      "focus:bg-background-tertiary",
      "data-[state=checked]:bg-primary-50 dark:data-[state=checked]:bg-primary-500/10",
      "data-[state=checked]:text-primary-700 data-[state=checked]:font-semibold",
      className
    )}
    {...props}
  >
    <span className="flex-1">{children}</span>
    <SelectPrimitive.ItemIndicator>
      <Check className="h-4 w-4" />
    </SelectPrimitive.ItemIndicator>
  </SelectPrimitive.Item>
));
```

---

## 8. Slider - 滑块

### 尺寸规范

- **轨道高度：**6px
- **轨道宽度：**100%
- **手柄尺寸：**20px × 20px
- **手柄边框：**3px solid white
- **圆角：**轨道 `--radius-full`，手柄 50%

### 样式规范

**轨道（Track）：**
```css
高度: 6px
宽度: 100%
圆角: --radius-full
背景: --border-light
```

**填充（Range）：**
```css
高度: 6px
背景: linear-gradient(90deg, --primary-500, --primary-600)
圆角: --radius-full (左侧)
```

**手柄（Thumb）：**
```css
宽度: 20px
高度: 20px
圆角: 50%
背景: --primary-600
边框: 3px solid white
阴影: Level 2
光标: grab
过渡: transform 150ms ease
```

**手柄悬停状态：**
```css
变换: scale(1.2)
阴影: Level 3
光标: grab
```

**手柄拖动状态：**
```css
光标: grabbing
```

### 刻度标签

**位置：**轨道下方
**顶部间距：**`--space-2`（8px）
**字体大小：**11px
**颜色：**`--text-tertiary`

### 代码实现

使用 Radix UI 的 Slider 组件：

```tsx
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@renderer/lib/utils';

export const Slider = forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-border-light">
      <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-primary-500 to-primary-600" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-3 border-white bg-primary-600 shadow-md transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 active:cursor-grabbing disabled:pointer-events-none disabled:opacity-50 cursor-grab" />
  </SliderPrimitive.Root>
));

Slider.displayName = SliderPrimitive.Root.displayName;
```

---

## 9. Radio - 单选按钮

### 尺寸规范

- **外圆尺寸：**20px × 20px
- **内圆尺寸：**10px × 10px
- **边框宽度：**2px
- **标签间距：**`--space-3`（12px）

### 样式规范

**外圆（未选中）：**
```css
宽度: 20px
高度: 20px
圆角: 50%
边框: 2px solid --border-medium
背景: --surface-base
过渡: all 150ms ease
```

**外圆（选中）：**
```css
边框: 2px solid --primary-600
背景: --surface-base
```

**内圆（选中）：**
```css
宽度: 10px
高度: 10px
圆角: 50%
背景: --primary-600
位置: 居中
缩放动画: scale(0) → scale(1), 150ms ease-out
```

**标签：**
```css
字体大小: 14px
颜色: --text-primary
光标: pointer
```

### 代码实现

使用 Radix UI 的 RadioGroup 组件：

```tsx
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Circle } from 'lucide-react';
import { cn } from '@renderer/lib/utils';

export const RadioGroup = forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-3", className)}
      {...props}
      ref={ref}
    />
  );
});

export const RadioGroupItem = forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-5 w-5 rounded-full border-2 border-border-medium bg-surface-base",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:border-primary-600",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-primary-600 text-primary-600 animate-scale-in" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
```

---

## 10. Checkbox - 复选框

### 尺寸规范

- **尺寸：**18px × 18px
- **圆角：**`--radius-sm`（4px）
- **边框宽度：**2px
- **勾选图标：**12px

### 样式规范

**未选中：**
```css
宽度: 18px
高度: 18px
圆角: --radius-sm (4px)
边框: 2px solid --border-medium
背景: --surface-base
过渡: all 150ms ease
```

**选中：**
```css
边框: 2px solid --primary-600
背景: --primary-600
图标: Check (白色, 12px)
缩放动画: scale(0.8) → scale(1), 150ms ease-out
```

**半选中（Indeterminate）：**
```css
背景: --primary-600
图标: Minus (白色, 12px)
```

### 代码实现

使用 Radix UI 的 Checkbox 组件：

```tsx
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check, Minus } from 'lucide-react';
import { cn } from '@renderer/lib/utils';

export const Checkbox = forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4.5 w-4.5 shrink-0 rounded-sm border-2 border-border-medium bg-surface-base",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600",
      "data-[state=indeterminate]:bg-primary-600 data-[state=indeterminate]:border-primary-600",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-white animate-scale-in")}
    >
      {props.checked === 'indeterminate' ? (
        <Minus className="h-3 w-3" />
      ) : (
        <Check className="h-3 w-3" />
      )}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));

Checkbox.displayName = CheckboxPrimitive.Root.displayName;
```

---

## 11. Sidebar - 侧边栏导航

已在页面布局规范中详细描述。这里补充导航项的详细规范。

### NavLink 组件

```tsx
import { NavLink as RouterNavLink } from 'react-router-dom';
import { cn } from '@renderer/lib/utils';

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export function NavLink({ to, icon, children }: NavLinkProps) {
  return (
    <RouterNavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 h-10 px-4 rounded-lg",
          "text-sm font-medium text-text-secondary",
          "transition-all duration-150",
          "hover:text-text-primary hover:bg-background-tertiary",
          isActive && [
            "text-primary-600 bg-primary-50 dark:bg-primary-500/10",
            "font-semibold border-l-3 border-primary-500 pl-[13px]"
          ]
        )
      }
    >
      <span className="w-5 h-5 shrink-0">{icon}</span>
      <span>{children}</span>
    </RouterNavLink>
  );
}
```

---

## 12. Modal - 模态框

### 尺寸规范

- **最大宽度：**600px (medium) | 800px (large)
- **内边距：**`--space-8`（32px）
- **圆角：**`--radius-xl`（16px）
- **阴影：**Level 3 (Floating)

### 遮罩层（Overlay）

```css
背景: rgba(0, 0, 0, 0.5) // 浅色主题
背景: rgba(0, 0, 0, 0.7) // 深色主题
模糊: backdrop-blur-sm (4px)
动画: fade-in 200ms ease
```

### 模态框容器

```css
最大宽度: 600px (默认)
最大高度: 90vh
内边距: --space-8 (32px)
圆角: --radius-xl (16px)
背景: --surface-raised
边框: 1px solid --border-light
阴影: Level 3
动画: scale-in + fade-in, 200ms ease-out
溢出-y: auto
```

### 标题区域

```css
字体大小: 24px (H2)
字重: 600
颜色: --text-primary
底部间距: --space-6 (24px)
```

### 关闭按钮

```css
位置: 绝对定位，右上角
偏移: top: 24px, right: 24px
尺寸: 32px × 32px
图标: X, 16px
```

### 代码实现

使用 Radix UI 的 Dialog 组件：

```tsx
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@renderer/lib/utils';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;

export const DialogContent = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 w-full max-w-2xl translate-x-[-50%] translate-y-[-50%]",
        "max-h-[90vh] overflow-y-auto",
        "rounded-xl bg-surface-raised p-8 shadow-lg border border-border-light",
        "animate-in fade-in-90 zoom-in-95 duration-200",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-6 top-6 rounded-md p-2 hover:bg-background-tertiary transition-colors">
        <X className="h-4 w-4" />
        <span className="sr-only">关闭</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));

export const DialogTitle = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-2xl font-semibold text-text-primary mb-6", className)}
    {...props}
  />
));
```

---

## 13. Toast - 通知提示

### 尺寸规范

- **宽度：**360px
- **最小高度：**64px
- **内边距：**`--space-4`（16px）
- **圆角：**`--radius-lg`（12px）
- **阴影：**Level 4 (Overlay)

### 变体

#### Success（成功）

```css
背景: --success-50 (浅色) / --success-900/20 (深色)
边框: 1px solid --success-500
图标颜色: --success-600
```

#### Error（错误）

```css
背景: --error-50 (浅色) / --error-900/20 (深色)
边框: 1px solid --error-500
图标颜色: --error-600
```

#### Info（信息）

```css
背景: --primary-50 (浅色) / --primary-900/20 (深色)
边框: 1px solid --primary-500
图标颜色: --primary-600
```

#### Warning（警告）

```css
背景: --warning-50 (浅色) / --warning-900/20 (深色)
边框: 1px solid --warning-500
图标颜色: --warning-600
```

### 位置

- **默认：**右上角（top-right）
- **偏移：**距顶部 24px，距右侧 24px
- **堆叠间距：**`--space-3`（12px）

### 动画

**进入动画：**
- 从右侧滑入：translateX(100%) → translateX(0)
- 淡入：opacity 0 → 1
- 持续时间：200ms
- 缓动：ease-out

**退出动画：**
- 向右滑出：translateX(0) → translateX(100%)
- 淡出：opacity 1 → 0
- 持续时间：150ms
- 缓动：ease-in

### 自动关闭

- **默认时长：**4000ms (4秒)
- **悬停暂停：**悬停时暂停倒计时
- **进度条：**底部显示剩余时间进度条（可选）

### 代码实现

使用 Sonner（已在项目中使用）：

```tsx
// src/renderer/src/App.tsx
import { Toaster } from 'sonner';

function App() {
  return (
    <>
      {/* 应用内容 */}
      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={4000}
      />
    </>
  );
}

// 使用示例
import { toast } from 'sonner';

toast.success('任务完成', {
  description: '视频转换已成功完成'
});

toast.error('转换失败', {
  description: 'FFmpeg 进程意外终止'
});

toast.info('任务已添加', {
  description: '任务已加入队列，等待处理'
});
```

---

## 14. FileUploader - 文件上传器

### 尺寸规范

- **最小高度：**200px
- **内边距：**`--space-8`（32px）
- **圆角：**`--radius-lg`（12px）
- **边框：**2px dashed `--border-medium`

### 状态样式

**默认状态：**
```css
背景: --background-secondary
边框: 2px dashed --border-medium
过渡: all 200ms ease
```

**拖放悬停状态：**
```css
背景: --primary-50 (浅色) / --primary-500 5% (深色)
边框: 2px dashed --primary-500
边框动画: dash-rotate (可选)
```

**拖放激活状态（文件在上方）：**
```css
背景: --primary-100 (浅色) / --primary-500 10% (深色)
边框: 2px solid --primary-600
变换: scale(1.02)
```

### 内容布局

```
┌─────────────────────────────────┐
│                                 │
│            [上传图标]            │
│         (UploadCloud 48px)      │
│                                 │
│        拖放文件到此处            │
│                                 │
│              或                 │
│                                 │
│        [点击选择文件]            │
│                                 │
│    支持的格式: MP4, AVI, MKV... │
│                                 │
└─────────────────────────────────┘
```

**图标：**
- 尺寸：48px
- 颜色：`--text-tertiary`
- 底部间距：`--space-4`（16px）

**主文本：**
- 字体大小：16px
- 字重：500
- 颜色：`--text-primary`

**分隔文本（"或"）：**
- 字体大小：14px
- 颜色：`--text-secondary`
- 上下间距：`--space-3`（12px）

**按钮：**
- 样式：Primary Button
- 尺寸：medium

**支持格式提示：**
- 字体大小：12px
- 颜色：`--text-tertiary`
- 顶部间距：`--space-6`（24px）

### 代码实现

```tsx
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';
import { Button } from '@renderer/components/ui/button';
import { cn } from '@renderer/lib/utils';

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  onFilesFromDialog: () => Promise<void>;
  accept?: Record<string, string[]>;
  multiple?: boolean;
}

export function FileUploader({
  onFilesSelected,
  onFilesFromDialog,
  accept = {
    'video/*': ['.mp4', '.avi', '.mkv', '.mov', '.flv', '.wmv', '.webm'],
    'audio/*': ['.mp3', '.wav', '.aac', '.flac', '.m4a', '.ogg']
  },
  multiple = true
}: FileUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFilesSelected(acceptedFiles);
    }
  }, [onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive, isDragAccept } = useDropzone({
    onDrop,
    accept,
    multiple
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "min-h-[200px] flex flex-col items-center justify-center p-8 rounded-lg",
        "border-2 border-dashed border-border-medium bg-background-secondary",
        "transition-all duration-200 cursor-pointer",
        "hover:border-border-dark",
        isDragActive && "bg-primary-50 dark:bg-primary-500/5 border-primary-500",
        isDragAccept && "bg-primary-100 dark:bg-primary-500/10 border-primary-600 scale-102"
      )}
    >
      <input {...getInputProps()} />

      <UploadCloud className="w-12 h-12 text-text-tertiary mb-4" />

      <p className="text-base font-medium text-text-primary mb-3">
        {isDragActive ? '释放以添加文件' : '拖放文件到此处'}
      </p>

      <p className="text-sm text-text-secondary mb-3">或</p>

      <Button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onFilesFromDialog();
        }}
      >
        点击选择文件
      </Button>

      <p className="text-xs text-text-tertiary mt-6">
        支持的格式: MP4, AVI, MKV, MOV, FLV, WMV, WebM, MP3, WAV, AAC
      </p>
    </div>
  );
}
```

---

## 组件库依赖

本设计系统依赖以下组件库：

1. **Radix UI** - 无样式的可访问组件原语
   - @radix-ui/react-dialog
   - @radix-ui/react-select
   - @radix-ui/react-radio-group
   - @radix-ui/react-checkbox
   - @radix-ui/react-slider

2. **Lucide React** - 图标库

3. **class-variance-authority** - 类型安全的变体系统

4. **Sonner** - Toast 通知库（已在项目中）

5. **react-dropzone** - 文件拖放

---

## 下一步

参考以下文档完成完整设计实施：

- `interaction-patterns.md` - 交互模式和流程
- `animation-motion.md` - 动画和动效指南
- `implementation-guide.md` - 开发实施指南
