# Task-01: 项目初始化和开发环境配置

**任务ID**：Task-01
**所属阶段**：阶段一 - 基础框架
**难度**：⭐ 简单
**预估时间**：1天
**优先级**：P0
**依赖任务**：无

---

## 任务目标

搭建 Electron + React + Vite + TypeScript 的开发环境，完成项目初始化和基础配置。

---

## 详细需求

### 1. 项目初始化
- [ ] 创建项目目录结构（参考 requirement.md 3.3 节）
- [ ] 初始化 Git 仓库
- [ ] 配置 `.gitignore` 文件
- [ ] 创建 `package.json` 并配置依赖

### 2. 核心依赖安装

#### 核心框架
```json
{
  "dependencies": {
    "electron": "^28.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/node": "^20.0.0",
    "vite": "^5.0.0",
    "typescript": "^5.3.0",
    "electron-builder": "^24.0.0",
    "vite-plugin-electron": "^0.28.0",
    "vite-plugin-electron-renderer": "^0.14.0"
  }
}
```

### 3. TypeScript 配置
- [ ] 创建 `tsconfig.json`（Main 进程）
- [ ] 创建 `tsconfig.node.json`（Renderer 进程）
- [ ] 配置路径别名（@main, @renderer, @shared）

### 4. Vite 配置
- [ ] 创建 `vite.config.ts`
- [ ] 配置 Electron 插件
- [ ] 配置开发服务器
- [ ] 配置构建输出目录

### 5. Electron 配置
- [ ] 创建 Main 进程入口文件 `src/main/index.ts`
- [ ] 创建 Renderer 进程入口文件 `src/renderer/src/main.tsx`
- [ ] 创建 Preload 脚本 `src/renderer/preload.ts`
- [ ] 配置窗口创建和生命周期管理

### 6. 开发工具配置
- [ ] 配置 ESLint（`.eslintrc.cjs`）
- [ ] 配置 Prettier（`.prettierrc`）
- [ ] 创建 `.editorconfig`
- [ ] 配置 VSCode 推荐设置（`.vscode/settings.json`）

### 7. 脚本配置
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext .ts,.tsx",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\""
  }
}
```

---

## 技术方案

### 项目目录结构
```
FFmpeg-GUI/
├── src/
│   ├── main/                    # Main 进程
│   │   └── index.ts             # 主进程入口
│   ├── renderer/                # Renderer 进程
│   │   ├── src/
│   │   │   ├── main.tsx         # React 入口
│   │   │   └── App.tsx          # 根组件
│   │   ├── index.html           # HTML 模板
│   │   └── preload.ts           # Preload 脚本
│   └── shared/                  # 共享代码
│       └── types.ts
├── resources/                   # 应用资源
│   └── icons/
├── docs/
│   └── plan01/
├── .gitignore
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── .eslintrc.cjs
├── .prettierrc
└── README.md
```

### Vite 配置示例
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    electron([
      {
        entry: 'src/main/index.ts',
      },
      {
        entry: 'src/renderer/preload.ts',
        onstart(options) {
          options.reload();
        },
      },
    ]),
    renderer(),
  ],
  resolve: {
    alias: {
      '@main': resolve(__dirname, 'src/main'),
      '@renderer': resolve(__dirname, 'src/renderer/src'),
      '@shared': resolve(__dirname, 'src/shared'),
    },
  },
});
```

### Main 进程入口示例
```typescript
// src/main/index.ts
import { app, BrowserWindow } from 'electron';
import { join } from 'path';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: join(__dirname, '../renderer/preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
```

### React 入口示例
```typescript
// src/renderer/src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

```typescript
// src/renderer/src/App.tsx
import React from 'react';

function App() {
  return (
    <div className="app">
      <h1>FFmpeg GUI</h1>
      <p>开发环境配置成功！</p>
    </div>
  );
}

export default App;
```

---

## 验收标准

### 功能验收
- [ ] 执行 `npm install` 成功安装所有依赖
- [ ] 执行 `npm run dev` 能启动开发服务器
- [ ] Electron 窗口正常打开
- [ ] 能看到 "FFmpeg GUI" 和 "开发环境配置成功！" 文字
- [ ] 热更新功能正常（修改代码后自动刷新）
- [ ] 控制台没有错误信息

### 代码质量验收
- [ ] 执行 `npm run lint` 无错误
- [ ] 执行 `npm run format` 能格式化代码
- [ ] TypeScript 类型检查通过（`tsc --noEmit`）

### 跨平台验收
- [ ] 能在 Windows 上运行
- [ ] 能在 macOS 上运行
- [ ] 能在 Linux 上运行

---

## 测试用例

### TC-01: 项目初始化测试
**步骤**：
1. 克隆项目
2. 执行 `npm install`
3. 执行 `npm run dev`

**预期结果**：
- 依赖安装成功，无错误
- 开发服务器启动成功
- Electron 窗口打开

### TC-02: 热更新测试
**步骤**：
1. 启动开发服务器
2. 修改 `App.tsx` 中的文字
3. 保存文件

**预期结果**：
- 页面自动刷新
- 显示修改后的内容

### TC-03: 代码质量检查
**步骤**：
1. 执行 `npm run lint`
2. 执行 `npm run format`
3. 执行 `tsc --noEmit`

**预期结果**：
- Lint 检查通过
- 代码格式化成功
- TypeScript 类型检查通过

---

## 注意事项

1. **Node.js 版本要求**：≥ 18.x LTS
2. **包管理器**：推荐使用 npm 或 pnpm
3. **开发工具**：推荐使用 VSCode
4. **Git 提交规范**：使用 Conventional Commits

---

## 参考资料

- [Electron 官方文档](https://www.electronjs.org/docs)
- [Vite 官方文档](https://vitejs.dev/)
- [vite-plugin-electron](https://github.com/electron-vite/vite-plugin-electron)
- [React 官方文档](https://react.dev/)

---

## 完成检查清单

- [ ] 项目目录结构创建完成
- [ ] 所有依赖安装成功
- [ ] TypeScript 配置完成
- [ ] Vite 配置完成
- [ ] Electron 能正常启动
- [ ] 开发工具配置完成
- [ ] 所有验收标准通过
- [ ] 代码已提交到 Git

---

**任务状态**：待开始
**创建日期**：2025-10-02
**最后更新**：2025-10-02
