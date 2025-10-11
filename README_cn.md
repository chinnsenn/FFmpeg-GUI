# FFmpeg GUI

<div align="center">

![FFmpeg GUI](https://img.shields.io/badge/FFmpeg-GUI-blue)
![Version](https://img.shields.io/badge/version-0.1.6-green)
![License](https://img.shields.io/badge/license-MIT-orange)
![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey)

一个功能强大且用户友好的 FFmpeg 图形界面应用程序

[English README](README.md) • [功能特性](#功能特性) • [安装](#安装) • [使用指南](#使用指南) • [开发](#开发) • [贡献](#贡献)

</div>

---

## 功能特性

### 🎬 格式转换
- 支持 50+ 种视频/音频格式转换
- 快速预设（Web 优化、高质量、快速转换等）
- 自定义编解码器、比特率、分辨率
- 批量转换支持

### 🗜️ 视频压缩
- 多种压缩预设（轻度、中度、重度压缩）
- CRF 质量控制（6 个质量等级）
- 目标文件大小压缩
- H.265/HEVC 高效压缩

### 📋 任务管理
- 任务队列系统
- 实时进度显示（速度、预计完成时间、FPS、比特率）
- 暂停/恢复/取消任务
- 批量处理管理

### 🔧 其他功能
- FFmpeg 自动检测和下载
- 文件拖拽上传
- 媒体信息预览
- 深色/浅色主题切换（跟随系统）
- 详细的错误消息
- 完整的日志系统

---

## 安装

下载适合您平台的最新版本：

### [📥 从 GitHub Releases 下载](https://github.com/chinnsenn/FFmpeg-GUI/releases/latest)

**可用平台：**
- **macOS**: DMG 和 ZIP 安装包（Apple Silicon 和 Intel）
- **Windows**: EXE 安装程序（x64 和 ARM64）
- **Linux**: AppImage 和 .deb 软件包

> 💡 **macOS 用户提示**：如果遇到安全警告，您可能需要移除隔离属性：
> ```bash
> sudo xattr -r -d com.apple.quarantine /Applications/FFmpeg\ GUI.app
> ```

---

## 使用指南

### 快速开始

#### 1. 首次启动
应用程序将自动检测 FFmpeg。如果未安装，将提示下载（自动下载到应用程序数据目录）。

#### 2. 格式转换
1. 点击"转换"标签页
2. 拖放或选择要转换的文件
3. 选择输出格式
4. （可选）调整编码参数或选择预设
5. 点击"开始转换"

#### 3. 视频压缩
1. 点击"压缩"标签页
2. 上传视频文件
3. 选择压缩模式：
   - **快速预设**: 选择预定义方案
   - **CRF 质量**: 选择质量等级
   - **目标大小**: 设置目标文件大小
   - **自定义**: 手动配置参数
4. 点击"开始压缩"

#### 4. 查看任务队列
1. 点击"队列"标签页
2. 查看所有任务状态
3. 管理任务（暂停、恢复、取消）
4. 查看实时进度信息

### 文档
- [用户指南](docs/USER_GUIDE.md) - 完整功能文档

---

## 技术栈

- **框架**: Electron 38 + React 19 + TypeScript 5
- **构建工具**: Vite 7
- **UI 框架**: Tailwind CSS 4 + ShadCN UI
- **路由**: React Router 7
- **测试**: Vitest + Testing Library
- **打包**: Electron Builder

---

## 开发

### 先决条件

- Node.js >= 18.x LTS
- npm >= 8.x
- Git

### 安装依赖

```bash
git clone https://github.com/chinnsenn/FFmpeg-GUI.git
cd FFmpeg-GUI
npm install
```

### 开发模式

```bash
# 启动开发服务器（支持热重载）
npm run dev
```

### 构建

```bash
# 类型检查
npm run type-check

# 运行测试
npm test

# 构建应用程序（包含安装包）
npm run build

# 仅构建目录（快速测试）
npm run build:dir
```

### 项目结构

```
FFmpeg-GUI/
├── src/
│   ├── main/              # Electron 主进程
│   │   ├── ffmpeg/        # FFmpeg 相关功能
│   │   ├── ipc/           # IPC 处理器
│   │   └── utils/         # 实用工具
│   ├── renderer/          # React 渲染进程
│   │   └── src/
│   │       ├── components/  # React 组件
│   │       ├── pages/       # 页面组件
│   │       ├── router/      # 路由配置
│   │       └── lib/         # 实用工具库
│   └── shared/            # 共享代码和类型
│       ├── constants.ts   # 常量定义
│       ├── types.ts       # TypeScript 类型
│       └── format-presets.ts  # 格式预设
├── build/                 # 构建资源
├── docs/                  # 文档
├── release/               # 构建输出
└── dist-electron/         # 编译输出
```

### 测试

```bash
# 运行所有测试
npm test

# 测试覆盖率
npm run test:coverage

# 测试 UI
npm run test:ui
```

### 相关文档
- [贡献指南](docs/CONTRIBUTING.md) - 代码贡献指南
- [构建指南](docs/BUILD.md) - 多平台构建说明

---

## 贡献

欢迎贡献！请查看 [贡献指南](docs/CONTRIBUTING.md) 了解如何参与项目。

### 开发流程

1. Fork 仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### 提交规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: 新功能
fix: 修复错误
docs: 文档更新
style: 代码格式（不影响功能）
refactor: 重构
test: 测试相关
chore: 构建/工具相关
```

---

## 路线图

- [x] 基础框架搭建
- [x] FFmpeg 集成
- [x] 格式转换功能
- [x] 视频压缩功能
- [x] 任务队列管理
- [x] 实时进度显示
- [x] 性能优化
- [x] 错误处理和日志
- [x] 单元测试
- [x] 多平台打包
- [x] 现代简约 UI 重构
- [x] 深色模式支持
- [ ] 发布 v1.0.0

**当前进度**: 21/22 任务完成 (95%)

---

## 许可证

本项目采用 MIT 许可证 - 请查看 [LICENSE](LICENSE) 文件了解详情

---

## 致谢

- [FFmpeg](https://ffmpeg.org/) - 强大的多媒体处理工具
- [Electron](https://www.electronjs.org/) - 跨平台桌面应用框架
- [React](https://react.dev/) - 用户界面库
- [ShadCN UI](https://ui.shadcn.com/) - 美观的 UI 组件

---

## 联系方式

- Issues: [GitHub Issues](https://github.com/chinnsenn/FFmpeg-GUI/issues)
- Discussions: [GitHub Discussions](https://github.com/chinnsenn/FFmpeg-GUI/discussions)

---

<div align="center">

</div>