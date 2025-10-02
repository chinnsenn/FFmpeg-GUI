# Task-03: IPC通信架构搭建

**任务ID**：Task-03
**所属阶段**：阶段一 - 基础框架
**难度**：⭐⭐ 中等
**预估时间**：2天
**优先级**：P0
**依赖任务**：Task-01

---

## 任务目标

搭建 Electron 主进程（Main Process）和渲染进程（Renderer Process）之间的安全通信架构，实现 IPC（Inter-Process Communication）机制。

---

## 详细需求

### 1. Preload 脚本配置
- [ ] 创建安全的 Preload 脚本
- [ ] 使用 `contextBridge` 暴露安全的 API
- [ ] 定义 TypeScript 类型声明
- [ ] 配置 CSP（Content Security Policy）

### 2. IPC 通道设计
- [ ] 设计 IPC 通道命名规范
- [ ] 创建 IPC 事件常量定义
- [ ] 实现双向通信机制（invoke/on）
- [ ] 实现单向通信机制（send）

### 3. Main Process IPC 处理器
- [ ] 创建 IPC 处理器目录结构
- [ ] 实现系统相关 IPC（文件对话框、系统信息）
- [ ] 实现配置相关 IPC（读取/保存配置）
- [ ] 实现文件相关 IPC（文件信息读取）

### 4. Renderer Process API 封装
- [ ] 创建类型安全的 API 接口
- [ ] 封装 IPC 调用方法
- [ ] 创建 React Hooks 封装
- [ ] 实现错误处理机制

### 5. 通信测试工具
- [ ] 创建 IPC 通信测试页面
- [ ] 实现测试用例
- [ ] 添加日志记录功能

---

## 技术方案

### 1. IPC 通道命名规范

```typescript
// src/shared/constants.ts
export const IPC_CHANNELS = {
  // 系统相关
  SYSTEM_GET_INFO: 'system:getInfo',
  SYSTEM_GET_PATH: 'system:getPath',

  // 文件相关
  FILE_SELECT: 'file:select',
  FILE_GET_INFO: 'file:getInfo',
  FILE_OPEN_FOLDER: 'file:openFolder',

  // 配置相关
  CONFIG_GET: 'config:get',
  CONFIG_SET: 'config:set',

  // FFmpeg 相关（后续任务实现）
  FFMPEG_CONVERT: 'ffmpeg:convert',
  FFMPEG_CANCEL: 'ffmpeg:cancel',
  FFMPEG_PROGRESS: 'ffmpeg:progress',
} as const;
```

### 2. 类型定义

```typescript
// src/shared/types.ts
export interface SystemInfo {
  platform: NodeJS.Platform;
  arch: string;
  version: string;
  appVersion: string;
}

export interface FileInfo {
  name: string;
  path: string;
  size: number;
  ext: string;
  duration?: number;
  width?: number;
  height?: number;
  codec?: string;
}

export interface AppConfig {
  ffmpegPath?: string;
  outputPath?: string;
  theme: 'light' | 'dark' | 'system';
  language: 'zh-CN' | 'en-US';
  maxConcurrentTasks: number;
}
```

### 3. Preload 脚本实现

```typescript
// src/renderer/preload.ts
import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '@shared/constants';
import type { SystemInfo, FileInfo, AppConfig } from '@shared/types';

// 定义暴露给渲染进程的 API
const electronAPI = {
  // 系统相关
  system: {
    getInfo: (): Promise<SystemInfo> =>
      ipcRenderer.invoke(IPC_CHANNELS.SYSTEM_GET_INFO),

    getPath: (name: 'home' | 'appData' | 'temp'): Promise<string> =>
      ipcRenderer.invoke(IPC_CHANNELS.SYSTEM_GET_PATH, name),
  },

  // 文件相关
  file: {
    select: (options?: {
      multiple?: boolean;
      filters?: { name: string; extensions: string[] }[];
    }): Promise<string[] | null> =>
      ipcRenderer.invoke(IPC_CHANNELS.FILE_SELECT, options),

    getInfo: (filePath: string): Promise<FileInfo> =>
      ipcRenderer.invoke(IPC_CHANNELS.FILE_GET_INFO, filePath),

    openFolder: (folderPath: string): Promise<void> =>
      ipcRenderer.invoke(IPC_CHANNELS.FILE_OPEN_FOLDER, folderPath),
  },

  // 配置相关
  config: {
    get: (): Promise<AppConfig> =>
      ipcRenderer.invoke(IPC_CHANNELS.CONFIG_GET),

    set: (config: Partial<AppConfig>): Promise<void> =>
      ipcRenderer.invoke(IPC_CHANNELS.CONFIG_SET, config),
  },

  // 事件监听
  on: (
    channel: string,
    callback: (...args: any[]) => void
  ): (() => void) => {
    const subscription = (_event: any, ...args: any[]) => callback(...args);
    ipcRenderer.on(channel, subscription);

    // 返回取消订阅函数
    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },
};

// 暴露 API 到渲染进程
contextBridge.exposeInMainWorld('electronAPI', electronAPI);

// 类型声明（用于 TypeScript）
export type ElectronAPI = typeof electronAPI;
```

### 4. 全局类型声明

```typescript
// src/renderer/src/global.d.ts
import type { ElectronAPI } from '../preload';

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
```

### 5. Main Process IPC 处理器

```typescript
// src/main/ipc/index.ts
import { ipcMain } from 'electron';
import { registerSystemHandlers } from './system';
import { registerFileHandlers } from './file';
import { registerConfigHandlers } from './config';

export function registerIpcHandlers() {
  registerSystemHandlers(ipcMain);
  registerFileHandlers(ipcMain);
  registerConfigHandlers(ipcMain);
}
```

```typescript
// src/main/ipc/system.ts
import { IpcMain, app } from 'electron';
import { IPC_CHANNELS } from '@shared/constants';
import type { SystemInfo } from '@shared/types';
import * as os from 'os';

export function registerSystemHandlers(ipcMain: IpcMain) {
  // 获取系统信息
  ipcMain.handle(IPC_CHANNELS.SYSTEM_GET_INFO, async (): Promise<SystemInfo> => {
    return {
      platform: process.platform,
      arch: process.arch,
      version: os.release(),
      appVersion: app.getVersion(),
    };
  });

  // 获取系统路径
  ipcMain.handle(
    IPC_CHANNELS.SYSTEM_GET_PATH,
    async (_event, name: Parameters<typeof app.getPath>[0]): Promise<string> => {
      return app.getPath(name);
    }
  );
}
```

```typescript
// src/main/ipc/file.ts
import { IpcMain, dialog, shell } from 'electron';
import { IPC_CHANNELS } from '@shared/constants';
import type { FileInfo } from '@shared/types';
import * as fs from 'fs/promises';
import * as path from 'path';

export function registerFileHandlers(ipcMain: IpcMain) {
  // 选择文件
  ipcMain.handle(
    IPC_CHANNELS.FILE_SELECT,
    async (_event, options?: any): Promise<string[] | null> => {
      const result = await dialog.showOpenDialog({
        properties: options?.multiple
          ? ['openFile', 'multiSelections']
          : ['openFile'],
        filters: options?.filters || [
          {
            name: 'Video Files',
            extensions: ['mp4', 'avi', 'mkv', 'mov', 'flv', 'wmv'],
          },
          { name: 'All Files', extensions: ['*'] },
        ],
      });

      return result.canceled ? null : result.filePaths;
    }
  );

  // 获取文件信息
  ipcMain.handle(
    IPC_CHANNELS.FILE_GET_INFO,
    async (_event, filePath: string): Promise<FileInfo> => {
      const stats = await fs.stat(filePath);
      const ext = path.extname(filePath);
      const name = path.basename(filePath);

      return {
        name,
        path: filePath,
        size: stats.size,
        ext,
        // duration, width, height, codec 等信息后续通过 FFprobe 获取
      };
    }
  );

  // 打开文件夹
  ipcMain.handle(
    IPC_CHANNELS.FILE_OPEN_FOLDER,
    async (_event, folderPath: string): Promise<void> => {
      await shell.openPath(folderPath);
    }
  );
}
```

```typescript
// src/main/ipc/config.ts
import { IpcMain, app } from 'electron';
import { IPC_CHANNELS } from '@shared/constants';
import type { AppConfig } from '@shared/types';
import * as fs from 'fs/promises';
import * as path from 'path';

const CONFIG_FILE = path.join(app.getPath('userData'), 'config.json');

// 默认配置
const DEFAULT_CONFIG: AppConfig = {
  theme: 'system',
  language: 'zh-CN',
  maxConcurrentTasks: 2,
  outputPath: app.getPath('videos'),
};

export function registerConfigHandlers(ipcMain: IpcMain) {
  // 获取配置
  ipcMain.handle(IPC_CHANNELS.CONFIG_GET, async (): Promise<AppConfig> => {
    try {
      const data = await fs.readFile(CONFIG_FILE, 'utf-8');
      return { ...DEFAULT_CONFIG, ...JSON.parse(data) };
    } catch {
      return DEFAULT_CONFIG;
    }
  });

  // 保存配置
  ipcMain.handle(
    IPC_CHANNELS.CONFIG_SET,
    async (_event, config: Partial<AppConfig>): Promise<void> => {
      const currentConfig = await ipcMain.handleOnce(
        IPC_CHANNELS.CONFIG_GET,
        async () => DEFAULT_CONFIG
      );
      const newConfig = { ...currentConfig, ...config };
      await fs.writeFile(CONFIG_FILE, JSON.stringify(newConfig, null, 2));
    }
  );
}
```

### 6. 在 Main Process 中注册 IPC 处理器

```typescript
// src/main/index.ts (更新)
import { app, BrowserWindow } from 'electron';
import { join } from 'path';
import { registerIpcHandlers } from './ipc';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  // ... 窗口创建代码
}

app.whenReady().then(() => {
  // 注册 IPC 处理器
  registerIpcHandlers();

  createWindow();
});

// ... 其他代码
```

### 7. Renderer Process React Hooks 封装

```typescript
// src/renderer/src/hooks/useElectronAPI.ts
import { useEffect, useState } from 'react';
import type { SystemInfo, AppConfig } from '@shared/types';

export function useSystemInfo() {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);

  useEffect(() => {
    window.electronAPI.system.getInfo().then(setSystemInfo);
  }, []);

  return systemInfo;
}

export function useAppConfig() {
  const [config, setConfig] = useState<AppConfig | null>(null);

  useEffect(() => {
    window.electronAPI.config.get().then(setConfig);
  }, []);

  const updateConfig = async (newConfig: Partial<AppConfig>) => {
    await window.electronAPI.config.set(newConfig);
    const updated = await window.electronAPI.config.get();
    setConfig(updated);
  };

  return { config, updateConfig };
}

export function useFileSelect() {
  const selectFile = async (options?: {
    multiple?: boolean;
    filters?: { name: string; extensions: string[] }[];
  }) => {
    return await window.electronAPI.file.select(options);
  };

  return { selectFile };
}
```

### 8. 测试页面

```typescript
// src/renderer/src/pages/IPCTest.tsx
import React, { useState } from 'react';
import { useSystemInfo, useAppConfig, useFileSelect } from '@/hooks/useElectronAPI';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function IPCTest() {
  const systemInfo = useSystemInfo();
  const { config, updateConfig } = useAppConfig();
  const { selectFile } = useFileSelect();
  const [selectedFiles, setSelectedFiles] = useState<string[] | null>(null);

  const handleSelectFile = async () => {
    const files = await selectFile({ multiple: true });
    setSelectedFiles(files);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">IPC 通信测试</h1>

      {/* 系统信息 */}
      <Card>
        <CardHeader>
          <CardTitle>系统信息</CardTitle>
        </CardHeader>
        <CardContent>
          {systemInfo ? (
            <pre className="text-sm">
              {JSON.stringify(systemInfo, null, 2)}
            </pre>
          ) : (
            <p>加载中...</p>
          )}
        </CardContent>
      </Card>

      {/* 配置信息 */}
      <Card>
        <CardHeader>
          <CardTitle>应用配置</CardTitle>
        </CardHeader>
        <CardContent>
          {config ? (
            <div className="space-y-2">
              <pre className="text-sm">
                {JSON.stringify(config, null, 2)}
              </pre>
              <Button
                onClick={() =>
                  updateConfig({ maxConcurrentTasks: config.maxConcurrentTasks + 1 })
                }
              >
                增加并发数
              </Button>
            </div>
          ) : (
            <p>加载中...</p>
          )}
        </CardContent>
      </Card>

      {/* 文件选择 */}
      <Card>
        <CardHeader>
          <CardTitle>文件选择</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={handleSelectFile}>选择文件</Button>
          {selectedFiles && (
            <div className="mt-2">
              <p className="font-medium">已选择文件：</p>
              <ul className="list-disc pl-4">
                {selectedFiles.map((file, index) => (
                  <li key={index} className="text-sm">
                    {file}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 验收标准

### 功能验收
- [ ] Preload 脚本正确暴露 API 到渲染进程
- [ ] Main 进程能接收并处理 IPC 请求
- [ ] Renderer 进程能成功调用 IPC API
- [ ] 系统信息获取正常
- [ ] 文件对话框正常工作
- [ ] 配置读写正常

### 安全验收
- [ ] 使用 `contextBridge` 而不是直接暴露 `ipcRenderer`
- [ ] 没有使用 `nodeIntegration: true`
- [ ] `contextIsolation` 设置为 `true`
- [ ] 敏感操作有权限检查

### 代码质量验收
- [ ] TypeScript 类型定义完整
- [ ] IPC 通道命名规范统一
- [ ] 错误处理完善
- [ ] 代码注释清晰

---

## 测试用例

### TC-01: 系统信息获取测试
**步骤**：
1. 启动应用
2. 访问 IPC 测试页面
3. 查看系统信息卡片

**预期结果**：
- 显示正确的平台、架构、版本信息

### TC-02: 文件选择测试
**步骤**：
1. 点击"选择文件"按钮
2. 选择多个文件
3. 确认选择

**预期结果**：
- 文件对话框正常打开
- 选择的文件路径正确显示

### TC-03: 配置读写测试
**步骤**：
1. 查看当前配置
2. 点击"增加并发数"按钮
3. 重启应用
4. 再次查看配置

**预期结果**：
- 配置值正确更新
- 重启后配置保持

---

## 注意事项

1. **安全性**：永远不要直接暴露 Node.js 模块到渲染进程
2. **类型安全**：确保所有 IPC 调用都有正确的类型定义
3. **错误处理**：IPC 调用应该有完善的错误处理
4. **性能**：避免频繁的 IPC 调用，考虑使用缓存
5. **调试**：在开发环境中添加 IPC 日志

---

## 参考资料

- [Electron IPC 官方文档](https://www.electronjs.org/docs/latest/tutorial/ipc)
- [Electron Security](https://www.electronjs.org/docs/latest/tutorial/security)
- [Context Isolation](https://www.electronjs.org/docs/latest/tutorial/context-isolation)

---

## 完成检查清单

- [ ] Preload 脚本创建完成
- [ ] IPC 通道定义完成
- [ ] Main Process 处理器实现完成
- [ ] 类型定义完成
- [ ] React Hooks 封装完成
- [ ] 测试页面创建完成
- [ ] 所有验收标准通过
- [ ] 代码已提交到 Git

---

**任务状态**：待开始
**创建日期**：2025-10-02
**最后更新**：2025-10-02
