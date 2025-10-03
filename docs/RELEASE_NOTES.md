# 发布说明 - v0.1.0

## 🎉 首个正式版本发布！

FFmpeg GUI v0.1.0 是一个功能完整的 FFmpeg 图形界面应用，提供简单易用的视频格式转换和压缩功能。

---

## ✨ 主要功能

### 🎬 格式转换
- ✅ 支持 50+ 种视频/音频格式互转
- ✅ 快速预设（Web 优化、高质量、快速转换等）
- ✅ 自定义编解码器、比特率、分辨率
- ✅ 批量文件转换

### 🗜️ 视频压缩
- ✅ 6 种预定义压缩方案
- ✅ CRF 质量控制（18-32）
- ✅ 目标文件大小压缩（10-500 MB）
- ✅ H.265/HEVC 高效压缩

### 📋 任务管理
- ✅ 智能任务队列系统
- ✅ 实时进度显示（速度、ETA、FPS、比特率）
- ✅ 任务暂停/恢复/取消
- ✅ 并发任务控制（1-4 个）

### 🔧 其他特性
- ✅ FFmpeg 自动检测和下载
- ✅ 文件拖拽上传
- ✅ 媒体信息查看
- ✅ 完整的错误处理和日志
- ✅ 跨平台支持（macOS/Windows/Linux）

---

## 📦 下载

### macOS (Apple Silicon)
- [FFmpeg-GUI-0.1.0-mac-arm64.dmg](https://github.com/your-repo/FFmpeg-GUI/releases/download/v0.1.0/FFmpeg-GUI-0.1.0-mac-arm64.dmg) (96 MB)
- [FFmpeg-GUI-0.1.0-mac-arm64.zip](https://github.com/your-repo/FFmpeg-GUI/releases/download/v0.1.0/FFmpeg-GUI-0.1.0-mac-arm64.zip) (97 MB)

### Windows
- [FFmpeg-GUI-0.1.0-win-x64.exe](https://github.com/your-repo/FFmpeg-GUI/releases/download/v0.1.0/FFmpeg-GUI-0.1.0-win-x64.exe) (~80 MB)

### Linux
- [FFmpeg-GUI-0.1.0-linux-x64.AppImage](https://github.com/your-repo/FFmpeg-GUI/releases/download/v0.1.0/FFmpeg-GUI-0.1.0-linux-x64.AppImage) (~85 MB)
- [FFmpeg-GUI-0.1.0-linux-amd64.deb](https://github.com/your-repo/FFmpeg-GUI/releases/download/v0.1.0/FFmpeg-GUI-0.1.0-linux-amd64.deb) (~75 MB)

---

## 📋 系统要求

- **macOS**: 10.13 或更高版本
- **Windows**: Windows 7 或更高版本
- **Linux**: Ubuntu 18.04+ 或其他现代发行版
- **内存**: 最低 4GB RAM（推荐 8GB+）
- **磁盘**: 至少 500MB 可用空间

---

## 🚀 快速开始

### macOS
1. 下载 DMG 文件
2. 打开 DMG，将应用拖入 Applications 文件夹
3. 首次打开时右键点击 -> "打开"（绕过 Gatekeeper）

### Windows
1. 下载 EXE 安装程序
2. 运行安装程序，选择安装位置
3. 完成安装后启动应用

### Linux
```bash
# AppImage
chmod +x FFmpeg-GUI-0.1.0-linux-x64.AppImage
./FFmpeg-GUI-0.1.0-linux-x64.AppImage

# DEB
sudo dpkg -i FFmpeg-GUI-0.1.0-linux-amd64.deb
```

---

## 📖 文档

- [用户使用指南](https://github.com/your-repo/FFmpeg-GUI/blob/main/docs/USER_GUIDE.md)
- [构建指南](https://github.com/your-repo/FFmpeg-GUI/blob/main/docs/BUILD.md)
- [贡献指南](https://github.com/your-repo/FFmpeg-GUI/blob/main/docs/CONTRIBUTING.md)
- [更新日志](https://github.com/your-repo/FFmpeg-GUI/blob/main/CHANGELOG.md)

---

## ⚙️ 技术栈

- Electron 28
- React 18
- TypeScript 5
- Vite 5
- Tailwind CSS 4
- ShadCN UI

---

## 🐛 已知问题

- 暂不支持硬件加速（GPU 编码）
- E2E 测试覆盖有限
- 部分高级 FFmpeg 参数未暴露到 UI

这些问题将在后续版本中解决。

---

## 📊 性能指标

- 应用启动时间：< 3 秒
- 空闲内存占用：< 200 MB
- 支持 4K 视频处理
- 转换速度：0.5x - 3x 实时速度

---

## 🙏 致谢

感谢以下开源项目：

- [FFmpeg](https://ffmpeg.org/)
- [Electron](https://www.electronjs.org/)
- [React](https://react.dev/)
- [ShadCN UI](https://ui.shadcn.com/)

以及所有贡献者和测试者的支持！

---

## 📝 完整更新日志

查看 [CHANGELOG.md](https://github.com/your-repo/FFmpeg-GUI/blob/main/CHANGELOG.md) 了解详细变更。

---

## 🔗 相关链接

- 🌐 [项目主页](https://github.com/your-repo/FFmpeg-GUI)
- 📚 [文档](https://github.com/your-repo/FFmpeg-GUI/tree/main/docs)
- 🐛 [问题反馈](https://github.com/your-repo/FFmpeg-GUI/issues)
- 💬 [讨论区](https://github.com/your-repo/FFmpeg-GUI/discussions)

---

## ⚠️ 重要提示

- 首次使用会自动下载 FFmpeg（约 60-80 MB）
- 转换大文件时请确保有足够的磁盘空间
- macOS 用户首次打开需要右键 -> "打开"

---

**祝您使用愉快！如有问题欢迎反馈。** 🎬✨
