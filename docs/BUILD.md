# 构建指南

本文档说明如何在不同平台上构建 FFmpeg GUI 应用。

## 目录

- [本地构建](#本地构建)
- [跨平台构建](#跨平台构建)
- [CI/CD 自动构建](#cicd-自动构建)
- [构建产物](#构建产物)
- [故障排除](#故障排除)

---

## 本地构建

### 前置要求

- Node.js >= 16
- npm >= 8
- Git

### 构建步骤

1. **安装依赖**
   ```bash
   npm install
   ```

2. **开发模式运行**
   ```bash
   npm run dev
   ```

3. **类型检查**
   ```bash
   npm run type-check
   ```

4. **构建应用**
   ```bash
   # 完整构建（生成安装包）
   npm run build

   # 仅构建目录（快速测试，不生成安装包）
   npm run build:dir
   ```

### 平台特定构建

#### macOS

**支持的格式**：DMG、ZIP

```bash
npm run build
```

**输出文件**：
- `release/{version}/FFmpeg GUI-{version}-mac-arm64.dmg`
- `release/{version}/FFmpeg GUI-{version}-mac-arm64.zip`

**要求**：
- macOS 10.13+
- 可选：Apple Developer ID（用于签名和公证）

**签名和公证**：

如需签名和公证（推荐用于分发），需要：
1. Apple Developer ID 证书
2. 配置 `package.json` 中的公证选项：
   ```json
   {
     "build": {
       "mac": {
         "identity": "Developer ID Application: Your Name (TEAM_ID)",
         "hardenedRuntime": true,
         "gatekeeperAssess": false,
         "entitlements": "build/entitlements.mac.plist",
         "entitlementsInherit": "build/entitlements.mac.plist"
       },
       "afterSign": "scripts/notarize.js"
     }
   }
   ```

#### Windows

**支持的格式**：NSIS 安装程序

```bash
npm run build
```

**输出文件**：
- `release/{version}/FFmpeg GUI-{version}-win-x64.exe`

**要求**：
- Windows 7+（构建机器）
- 可选：代码签名证书

**代码签名**：

如需签名（推荐用于分发），需要：
1. Windows 代码签名证书
2. 配置环境变量：
   ```bash
   set CSC_LINK=path/to/certificate.pfx
   set CSC_KEY_PASSWORD=your-password
   ```

#### Linux

**支持的格式**：AppImage、DEB

```bash
npm run build
```

**输出文件**：
- `release/{version}/FFmpeg GUI-{version}-linux-x64.AppImage`
- `release/{version}/FFmpeg GUI-{version}-linux-amd64.deb`

**要求**：
- Linux (Ubuntu 18.04+ 推荐)
- 依赖：`fuse`, `libfuse2` (用于测试 AppImage)

---

## 跨平台构建

electron-builder 支持跨平台构建，但有一些限制：

### 从 macOS 构建

✅ **可以构建**：
- macOS (DMG, ZIP)
- Windows (NSIS) - 需要 Wine
- Linux (AppImage, DEB)

```bash
# 构建 Windows 版本（需要安装 Wine）
npm run build -- --win

# 构建 Linux 版本
npm run build -- --linux

# 构建所有平台
npm run build -- --mac --win --linux
```

**安装 Wine（用于 Windows 构建）**：
```bash
brew install --cask wine-stable
```

### 从 Windows 构建

✅ **可以构建**：
- Windows (NSIS)

⚠️ **不推荐构建**：
- macOS (需要 macOS 系统)
- Linux (可能有兼容性问题)

### 从 Linux 构建

✅ **可以构建**：
- Linux (AppImage, DEB)
- Windows (NSIS) - 需要 Wine

⚠️ **不推荐构建**：
- macOS (需要 macOS 系统)

### 推荐的跨平台构建策略

**方案 1：GitHub Actions（推荐）**

使用 GitHub Actions 在各自的原生系统上构建：

```yaml
# .github/workflows/build.yml
name: Build

on:
  push:
    tags:
      - 'v*'

jobs:
  build-macos:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run build
      - uses: actions/upload-artifact@v3
        with:
          name: macos-build
          path: release/**/*.{dmg,zip}

  build-windows:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run build
      - uses: actions/upload-artifact@v3
        with:
          name: windows-build
          path: release/**/*.exe

  build-linux:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run build
      - uses: actions/upload-artifact@v3
        with:
          name: linux-build
          path: release/**/*.{AppImage,deb}
```

**方案 2：Docker（适合 Linux）**

使用 Docker 容器构建 Linux 版本：

```bash
docker run --rm -v $(pwd):/project electronuserland/builder:wine \
  /bin/bash -c "cd /project && npm install && npm run build"
```

---

## CI/CD 自动构建

### GitHub Actions 完整示例

创建 `.github/workflows/release.yml`：

```yaml
name: Release

on:
  push:
    tags:
      - 'v*.*.*'

jobs:
  release:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [macos-latest, windows-latest, ubuntu-latest]

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build application
        run: npm run build

      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: ${{ matrix.os }}-build
          path: release/**/*

      - name: Create GitHub Release
        if: startsWith(github.ref, 'refs/tags/')
        uses: softprops/action-gh-release@v1
        with:
          files: release/**/*
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## 构建产物

### 文件结构

```
release/
└── {version}/
    ├── FFmpeg GUI-{version}-mac-arm64.dmg          # macOS DMG 安装包
    ├── FFmpeg GUI-{version}-mac-arm64.zip          # macOS ZIP 压缩包
    ├── FFmpeg GUI-{version}-win-x64.exe            # Windows 安装程序
    ├── FFmpeg GUI-{version}-linux-x64.AppImage     # Linux AppImage
    ├── FFmpeg GUI-{version}-linux-amd64.deb        # Debian/Ubuntu 包
    └── *.blockmap                                  # 增量更新文件
```

### 文件大小

| 平台 | 格式 | 预期大小 |
|------|------|----------|
| macOS | DMG | ~96 MB |
| macOS | ZIP | ~97 MB |
| Windows | EXE | ~80 MB |
| Linux | AppImage | ~85 MB |
| Linux | DEB | ~75 MB |

### 验证构建产物

**验证文件完整性**：
```bash
# macOS
file release/{version}/*.dmg
unzip -l release/{version}/*.zip

# Windows
sigcheck.exe release/{version}/*.exe

# Linux
file release/{version}/*.AppImage
dpkg-deb -I release/{version}/*.deb
```

**测试安装**：
```bash
# macOS - 挂载 DMG
open release/{version}/*.dmg

# Windows - 运行安装程序
start release/{version}/*.exe

# Linux - 运行 AppImage
chmod +x release/{version}/*.AppImage
./release/{version}/*.AppImage
```

---

## 故障排除

### 常见问题

#### 1. "Application icon is not set"

**问题**：构建时提示未设置应用图标

**解决**：
```bash
# 将图标文件添加到 build/ 目录
cp icon.png build/icon.png
```

参考 `build/README.md` 了解图标要求。

#### 2. macOS 签名失败

**问题**：`No identity found for signing`

**解决**：
1. 检查是否安装了 Apple Developer ID 证书
2. 使用 `security find-identity -v -p codesigning` 查看证书
3. 临时禁用签名（仅用于测试）：
   ```bash
   export CSC_IDENTITY_AUTO_DISCOVERY=false
   npm run build
   ```

#### 3. Windows 构建失败（在 macOS 上）

**问题**：缺少 Wine

**解决**：
```bash
brew install --cask wine-stable
```

#### 4. Linux 构建缺少依赖

**问题**：`fuse: device not found`

**解决**：
```bash
# Ubuntu/Debian
sudo apt-get install fuse libfuse2

# Fedora/RHEL
sudo yum install fuse fuse-libs
```

#### 5. 构建超时或内存不足

**问题**：构建过程中崩溃

**解决**：
```bash
# 增加 Node.js 内存限制
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

#### 6. TypeScript 编译错误

**问题**：`src/**/*.d.ts` 文件导致冲突

**解决**：
```bash
# 清理旧的编译产物
find src -name "*.js" -delete
find src -name "*.d.ts" ! -name "global.d.ts" -delete
npm run build
```

---

## 最佳实践

1. **版本管理**
   - 使用语义化版本（Semantic Versioning）
   - 在 `package.json` 中更新版本号
   - 创建 Git 标签：`git tag v1.0.0`

2. **构建前检查**
   ```bash
   npm run lint          # 代码检查
   npm run type-check    # 类型检查
   npm test              # 运行测试
   ```

3. **清理构建产物**
   ```bash
   rm -rf release dist dist-electron node_modules
   npm install
   npm run build
   ```

4. **使用 CI/CD**
   - 在原生系统上构建（更稳定）
   - 自动化测试和构建流程
   - 自动创建 GitHub Release

5. **测试安装包**
   - 在干净的系统上测试安装
   - 验证应用功能完整
   - 检查权限和签名

---

## 相关文档

- [Electron Builder 文档](https://www.electron.build/)
- [代码签名指南](https://www.electron.build/code-signing)
- [项目开发指南](./CONTRIBUTING.md)
- [用户使用指南](./USER_GUIDE.md)

---

**最后更新**：2025-10-03
