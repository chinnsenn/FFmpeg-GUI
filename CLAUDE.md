# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FFmpeg GUI is an Electron-based desktop application providing a user-friendly interface for FFmpeg operations. The app supports video format conversion, compression, and batch task management with real-time progress tracking.

**Tech Stack:**
- Electron 28 + React 18 + TypeScript 5
- Vite 5 (build tool)
- Tailwind CSS 4 + ShadCN UI components
- React Router 7 (HashRouter for Electron)
- Vitest + Testing Library

## Development Commands

```bash
# Development
npm run dev                    # Start dev server with hot reload (opens Electron window)
npm run type-check            # TypeScript type checking (no compilation)

# Testing
npm test                      # Run tests in watch mode
npm run test:ui               # Run tests with UI
npm run test:coverage         # Generate coverage report

# Building
npm run build:renderer        # Build React renderer process only
npm run build:main            # Build Electron main process only
npm run build:dir             # Quick build (directory output, no installer)
npm run build                 # Full build with installers (macOS/Windows/Linux)
npm run build:mac:arm64       # Build macOS app for Apple Silicon only
npm run build:mac:x64         # Build macOS app for Intel only

# Code Quality
npm run lint                  # ESLint check
npm run format                # Prettier format
```

## Architecture

### Process Architecture

**Electron Multi-Process Model:**
- **Main Process** (`src/main/`): Node.js backend, manages windows, FFmpeg processes, file system
- **Renderer Process** (`src/renderer/`): React frontend, isolated from Node.js
- **Preload Script** (`src/renderer/preload.ts`): Secure bridge exposing `window.electronAPI`

**IPC Communication Pattern:**
```typescript
// Renderer → Main: invoke/handle pattern
const result = await window.electronAPI.task.add(command);

// Main → Renderer: event pattern
window.electronAPI.on('task:progress', (data) => { });
```

### Main Process Structure

**FFmpeg Management** (`src/main/ffmpeg/`):
- `detector.ts`: Auto-detect system FFmpeg or use bundled binary
- `downloader.ts`: Download FFmpeg on first run (platform-specific)
- `manager.ts`: Task queue with concurrency control (default: 2 concurrent)
- `parser.ts`: Parse FFmpeg stderr for progress (frame, fps, bitrate, speed)
- `command-builder.ts`: Build FFmpeg commands from high-level options
- `ffprobe.ts`: Extract media file metadata

**IPC Handlers** (`src/main/ipc/`):
- `taskHandlers.ts`: Task queue operations (add/cancel/pause/resume)
- `ffmpegHandlers.ts`: FFmpeg detection, download, media info
- `fileHandlers.ts`: File selection dialogs, file info
- `configHandlers.ts`: Persistent app configuration
- `systemHandlers.ts`: System info, paths
- `logHandlers.ts`: Log management

**Key Classes:**
- `FFmpegManager`: Manages task queue, spawns child processes, emits events
- `FFmpegParser`: Parses real-time progress from FFmpeg stderr output
- `TaskManager`: Coordinates task lifecycle and status

### Renderer Process Structure

**Routing** (`src/renderer/src/router/`):
- Uses `createHashRouter` (required for Electron file:// protocol)
- Layout with nested routes: `/`, `/convert`, `/compress`, `/queue`, `/settings`

**Key Pages:**
- `Convert.tsx`: Format conversion with codec/bitrate/resolution controls
- `Compress.tsx`: Video compression with CRF/preset/target size modes
- `Queue.tsx`: Task list with real-time progress display
- `Settings.tsx`: FFmpeg path configuration

**Shared Hooks/Utils:**
- `useFileManager.ts`: Centralized file selection and media info fetching
- `useTheme.ts`: Theme management and dark mode support
- `lib/formatters.ts`: Format bytes, bitrate, duration, time (used across components)

**Component Architecture:**
- `FileList`: Display selected files with media info preview
- `MediaInfo`: Rich media metadata display (codec, bitrate, resolution)
- `TaskCard`: Real-time task progress (speed, ETA, FPS)
- `ConvertConfig`/`CompressConfig`: Form components with presets

### Shared Code

**Types** (`src/shared/types.ts`):
- All TypeScript interfaces shared between main and renderer
- `Task`, `ConvertOptions`, `CompressOptions`, `MediaFileInfo`, etc.

**Constants** (`src/shared/constants.ts`):
- IPC channel names (prevents typos in IPC communication)

**Format Presets** (`src/shared/format-presets.ts`):
- Predefined conversion/compression configurations
- Video/audio codecs, quality presets, resolutions, bitrates

## Path Aliases

TypeScript path aliases are configured in `tsconfig.json` and `tsconfig.node.json`:

```typescript
import { Task } from '@shared/types';           // src/shared/types.ts
import { useFileManager } from '@renderer/hooks/useFileManager';  // src/renderer/src/hooks/
import { FFmpegManager } from '@main/ffmpeg/manager';  // src/main/ffmpeg/
```

## IPC Communication

**Adding New IPC Channels:**
1. Define channel name in `src/shared/constants.ts` (`IPC_CHANNELS`)
2. Add handler in appropriate `src/main/ipc/*Handlers.ts` file
3. Register handler in `src/main/ipc/index.ts` (`registerAllIpcHandlers`)
4. Expose to renderer in `src/renderer/preload.ts` (`electronAPI`)
5. Update TypeScript types in `src/renderer/src/global.d.ts`

**Example:**
```typescript
// constants.ts
TASK_ADD: 'task:add'

// taskHandlers.ts
ipcMain.handle(IPC_CHANNELS.TASK_ADD, async (_event, command, priority) => {
  return await taskManager.addTask(command, priority);
});

// preload.ts
task: {
  add: (command: string[], priority?: number): Promise<string> =>
    ipcRenderer.invoke(IPC_CHANNELS.TASK_ADD, command, priority)
}

// Usage in renderer
const taskId = await window.electronAPI.task.add(['ffmpeg', '-i', 'input.mp4']);
```

## Build Configuration

**Electron Builder** (`package.json` `build` section):
- Output: `release/${version}/`
- macOS: DMG + ZIP (Apple Silicon + Intel)
- Windows: NSIS installer (x64)
- Linux: AppImage + .deb

**Build Artifacts:**
- `dist/`: Renderer build (HTML/CSS/JS)
- `dist-electron/`: Main process build (compiled TypeScript)
- `release/`: Final installers

## FFmpeg Integration

**FFmpeg & FFprobe 已内置** (`@ffmpeg-installer/ffmpeg` + `@ffprobe-installer/ffprobe`):
- 应用已集成静态 FFmpeg 和 FFprobe 二进制文件，无需下载
- 自动适配平台：macOS (Intel/Apple Silicon), Windows (x64), Linux (x64)
- electron-builder 自动解包到 `app.asar.unpacked` 目录

**检测流程（优先级）:**
1. 检查内置 FFmpeg/FFprobe（installer 提供的路径）
2. 处理 ASAR 打包路径（`app.asar` → `app.asar.unpacked`）
3. 回退到系统环境变量的 FFmpeg/FFprobe（备用）

**任务执行流程:**
1. 命令由高层选项构建（ConvertOptions/CompressOptions）
2. 任务添加到队列（支持优先级）
3. FFmpegManager 生成子进程（支持并发控制）
4. 从 stderr 解析进度并通过 IPC 事件发送
5. 任务状态更新：pending → running → completed/failed/cancelled

**Progress Parsing:**
FFmpeg outputs progress to stderr in format:
```
frame=  123 fps= 30 q=28.0 size=    1024kB time=00:00:05.00 bitrate=1500.0kbits/s speed= 1.5x
```
Parser extracts: frame, fps, size, time, bitrate, speed, percent

## Testing

**Test Files:** `src/**/*.test.ts`, `src/**/*.test.tsx`

**Testing Environment:**
- Renderer tests: jsdom (DOM environment)
- Main process tests: node (no DOM)

**Mocking Electron APIs:**
Renderer tests need to mock `window.electronAPI`:
```typescript
global.window.electronAPI = {
  task: { add: vi.fn(), getAll: vi.fn() },
  ffmpeg: { getMediaInfo: vi.fn() }
};
```

## Theme System

**Dark Mode Implementation:**

The app supports three theme modes managed by the `useTheme` hook:
- **light**: Force light theme
- **dark**: Force dark theme
- **system**: Auto-detect system preference

**Key Files:**
- `src/renderer/src/hooks/useTheme.ts`: Theme management hook
- `src/renderer/src/index.css`: CSS variables for light/dark themes
- `src/renderer/src/App.tsx`: Theme initialization
- `src/renderer/src/pages/Settings.tsx`: Theme switcher UI

**How It Works:**
1. `useTheme` hook loads theme from config on app start
2. Applies theme by toggling `dark` class on `document.documentElement`
3. Monitors system theme changes when set to "system" mode
4. Settings page saves theme immediately on change

**CSS Variables:**
- Tailwind v4 `@theme` block defines static colors (primary, success, error, etc.)
- `:root` defines light theme variables (backgrounds, text, borders)
- `.dark` defines dark theme variables (override light values)
- All components use semantic CSS variables like `hsl(var(--background-primary))`

**Important Notes:**
- Do NOT define responsive colors (background, text, border) in `@theme` block
- Only static theme colors (primary, success, warning, error) go in `@theme`
- Responsive colors must be in `@layer base` `:root` and `.dark` selectors

## Code Quality Notes

**Recent Refactoring (see `docs/code-review-report.md`):**
- Eliminated ~450 lines of duplicate code
- Created `useFileManager` hook for file selection logic
- Created `formatters.ts` for shared formatting functions
- Replaced `alert()` with Sonner toast notifications
- Code repetition reduced from ~8% to <1%

**Conventions:**
- Use Sonner `toast` for user notifications (not `alert()`)
- Use `formatters.ts` functions for consistent formatting
- Use `useFileManager` hook for file selection/media info
- Follow Conventional Commits for commit messages
- Path aliases required: always use `@renderer/*`, `@main/*`, `@shared/*`

## Current Status

**Version:** 0.1.6
**Progress:** 21/22 tasks complete (95%)
**Pending:** v1.0.0 release

**Recent Updates:**
- ✅ Modern Minimalist UI refactoring complete
- ✅ Dark mode fully implemented
- ✅ Code quality improved (67→98/100)
- ✅ Tailwind CSS 4 migration complete
- ✅ Fixed macOS packaged app blank screen issue (v0.1.5)
- ✅ Added architecture-specific build scripts (v0.1.5)

**Known Limitations:**
- Path handling uses `/` separator (may need cross-platform improvement)
- FileList type detection uses `instanceof File` (could be more robust in Electron)
