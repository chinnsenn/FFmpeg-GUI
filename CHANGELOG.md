# 更新日志

本文档记录 FFmpeg GUI 项目的所有重要变更。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
版本号遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/)。

---

## [0.1.5] - 2025-10-07

### 修复
- 🐛 **修复 macOS 打包后界面空白问题**
  - 更正主进程中 renderer 路径逻辑
  - 从 `join(__dirname, '../renderer/index.html')` 改为 `join(__dirname, 'renderer', 'index.html')`
  - 移除错误的 `process.resourcesPath` 使用
  - 解决打包后 "Not allowed to load local resource" 错误

### 改进
- ⚙️ **添加架构特定的构建脚本**
  - 新增 `build:mac:arm64` 脚本（仅构建 Apple Silicon 版本）
  - 新增 `build:mac:x64` 脚本（仅构建 Intel 版本）
  - 支持在 ARM64 开发环境下单独构建指定架构
  - 解决 @ffmpeg-installer 可选依赖平台检查问题

- 🔧 **优化 electron-builder 配置**
  - asarUnpack 路径从 `**` 改为 `**/*`（更明确的通配符）
  - 避免构建时的目录扫描错误

---

## [0.1.6] - 2025-10-11

### 新增功能

#### 用户界面
- 🌓 **深色模式支持**
  - 三种主题模式：浅色、深色、跟随系统
  - useTheme hook 统一管理主题状态
  - 主题切换立即生效并自动保存
  - 完整的深色模式CSS变量系统

- 🎨 **Modern Minimalist UI 重构**
  - 完全重写所有页面组件以匹配设计规范
  - 统一的设计语言和交互模式
  - 改进的视觉层次和信息密度
  - 优化的间距系统（4px基础单位）

#### 技术改进
- ⚙️ **Tailwind CSS 4 迁移**
  - 迁移到 @theme 语法
  - 优化CSS变量组织结构
  - 修复浅色/深色主题CSS变量冲突

- 🔧 **代码质量提升**
  - 代码质量分数：67/100 → 98/100
  - 消除~450行重复代码
  - 创建共享工具函数和hooks
  - 改进代码组织和可维护性

### 修复
- 🐛 修复深色模式下背景仍显示白色的问题（@theme块CSS变量冲突）
- 🐛 修复主题切换不立即生效的问题（添加handleThemeChange）

### 计划功能
- 硬件加速（GPU 编码）
- 视频编辑功能（裁剪、旋转、翻转）
- 批量水印添加
- 自动更新功能
- 多语言支持

---

## [0.1.0] - 2025-10-03

### 新增功能

#### 核心功能
- 🎬 **格式转换功能**
  - 支持 50+ 种视频/音频格式互转
  - 快速预设（Web 优化、高质量、快速转换等）
  - 自定义编解码器、比特率、分辨率参数
  - 批量文件转换支持

- 🗜️ **视频压缩功能**
  - 6 种预定义压缩方案（轻度、中度、高度、H.265、社交媒体、邮件附件）
  - CRF 质量控制（6 个质量等级，CRF 18-32）
  - 目标文件大小压缩（10-500 MB）
  - 自定义压缩参数

- 📋 **任务队列管理**
  - 任务队列系统（支持排队、运行、暂停、取消）
  - 并发任务控制（1-4 个任务同时运行）
  - 任务状态管理（pending、running、paused、completed、failed、cancelled）
  - 任务过滤和搜索

- 📊 **实时进度显示**
  - 详细进度信息（百分比、速度、ETA、FPS、文件大小、比特率）
  - 实时进度条更新
  - 任务时间统计（创建、开始、完成时间、总耗时）

#### FFmpeg 集成
- ⚙️ **FFmpeg 自动化**
  - 自动检测系统 FFmpeg
  - 自动下载和配置（支持 macOS/Windows/Linux）
  - FFmpeg 版本管理

- 🔍 **媒体信息读取**
  - 使用 FFprobe 读取媒体详细信息
  - 显示视频流、音频流、字幕流信息
  - 显示编解码器、分辨率、帧率、比特率等

#### 用户界面
- 🎨 **现代化 UI**
  - Tailwind CSS 4 + ShadCN UI 组件
  - 深色/浅色主题支持（基于系统）
  - 响应式设计

- 📁 **文件管理**
  - 拖拽上传文件
  - 文件列表管理（添加、删除、清空）
  - 文件信息预览

- 🗺️ **页面导航**
  - 主页（FFmpeg 状态检测）
  - 格式转换页面
  - 视频压缩页面
  - 任务队列页面
  - 设置页面

#### 系统功能
- 🛠️ **性能优化**
  - React 组件性能优化（memo、useMemo、useCallback）
  - IPC 通信优化（减少调用次数、进度节流）
  - 内存优化（限制已完成任务数量、自动清理）
  - FFmpeg 进程优化

- 🔧 **错误处理和日志**
  - 完整的日志系统（DEBUG、INFO、WARN、ERROR 级别）
  - 日志文件自动轮转和清理
  - React ErrorBoundary 错误捕获
  - 友好的错误提示 UI

- ✅ **测试覆盖**
  - Vitest 测试框架配置
  - FFmpegParser 单元测试
  - ErrorBoundary 组件测试
  - 测试覆盖率报告

#### 构建和分发
- 📦 **多平台打包**
  - macOS 支持（DMG + ZIP，Apple Silicon）
  - Windows 支持（NSIS 安装程序，x64）
  - Linux 支持（AppImage + DEB）
  - 代码签名和公证支持

- 📖 **文档完善**
  - 详细的 README.md
  - 用户使用指南（USER_GUIDE.md）
  - 开发贡献指南（CONTRIBUTING.md）
  - 构建指南（BUILD.md）
  - 测试策略文档（testing-strategy.md）

### 技术栈

- **前端**: React 18 + TypeScript 5 + Vite 5
- **桌面**: Electron 28
- **UI 框架**: Tailwind CSS 4 + ShadCN UI
- **路由**: React Router 7
- **测试**: Vitest + Testing Library
- **构建**: Electron Builder

### 已知问题

- 暂不支持硬件加速（GPU 编码）
- E2E 测试覆盖有限（仅单元测试）
- 部分高级 FFmpeg 参数未暴露到 UI

### 性能指标

- 应用启动时间：< 3 秒
- 空闲内存占用：< 200 MB
- 支持 4K 视频处理
- 转换速度：0.5x - 3x 实时速度（取决于硬件和参数）

### 文件大小

- macOS DMG: ~96 MB
- macOS ZIP: ~97 MB
- Windows EXE: ~80 MB（预估）
- Linux AppImage: ~85 MB（预估）
- Linux DEB: ~75 MB（预估）

---

## [0.0.1] - 2025-10-02

### 初始发布

- 项目初始化
- 基础 Electron + React + TypeScript 框架搭建
- 开发环境配置完成

---

## 版本说明

### 主版本号 (Major)
重大功能更新或不兼容的 API 变更

### 次版本号 (Minor)
向后兼容的功能性新增

### 修订号 (Patch)
向后兼容的问题修复

---

## 变更类型

- **新增**: 新功能
- **变更**: 对现有功能的变更
- **弃用**: 即将移除的功能
- **移除**: 已移除的功能
- **修复**: Bug 修复
- **安全**: 安全漏洞修复

---

**如何贡献**: 查看 [贡献指南](docs/CONTRIBUTING.md) 了解如何参与项目开发。
