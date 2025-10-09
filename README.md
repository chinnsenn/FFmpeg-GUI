# FFmpeg GUI

<div align="center">

![FFmpeg GUI](https://img.shields.io/badge/FFmpeg-GUI-blue)
![Version](https://img.shields.io/badge/version-0.1.5-green)
![License](https://img.shields.io/badge/license-MIT-orange)
![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey)

A powerful and user-friendly FFmpeg GUI application

[中文说明](README_cn.md) • [Features](#features) • [Installation](#installation) • [Usage](#usage) • [Development](#development) • [Contributing](#contributing)

</div>

---

## Features

### 🎬 Format Conversion
- Support for 50+ video/audio format conversions
- Quick presets (Web optimized, High quality, Fast conversion, etc.)
- Custom codecs, bitrates, resolutions
- Batch conversion support

### 🗜️ Video Compression
- Multiple compression presets (Light, Medium, Heavy compression)
- CRF quality control (6 quality levels)
- Target file size compression
- H.265/HEVC efficient compression

### 📋 Task Management
- Task queue system
- Real-time progress display (speed, ETA, FPS, bitrate)
- Pause/resume/cancel tasks
- Batch processing management

### 🔧 Other Features
- FFmpeg automatic detection and download
- File drag-and-drop upload
- Media information preview
- Dark/light theme toggle (system-aware)
- Detailed error messages
- Comprehensive logging system

---

## Installation

Download the latest version for your platform:

### [📥 Download from GitHub Releases](https://github.com/chinnsenn/FFmpeg-GUI/releases/latest)

**Available platforms:**
- **macOS**: DMG and ZIP packages (Apple Silicon & Intel)
- **Windows**: EXE installer (x64 & ARM64)
- **Linux**: AppImage and .deb packages

> 💡 **macOS users**: If you encounter security warnings, you may need to remove the quarantine attribute:
> ```bash
> sudo xattr -r -d com.apple.quarantine /Applications/FFmpeg\ GUI.app
> ```

---

## Usage

### Quick Start

#### 1. First Launch
The app will automatically detect FFmpeg. If not installed, it will prompt to download (automatically downloaded to app data directory).

#### 2. Format Conversion
1. Click the "Convert" tab
2. Drag & drop or select files to convert
3. Choose output format
4. (Optional) Adjust encoding parameters or select presets
5. Click "Start Conversion"

#### 3. Video Compression
1. Click the "Compress" tab
2. Upload video file
3. Select compression mode:
   - **Quick Presets**: Choose predefined schemes
   - **CRF Quality**: Select quality level
   - **Target Size**: Set target file size
   - **Custom**: Manual parameter configuration
4. Click "Start Compression"

#### 4. View Task Queue
1. Click the "Queue" tab
2. View all task statuses
3. Manage tasks (pause, resume, cancel)
4. View real-time progress information

### Documentation
- [User Guide](docs/USER_GUIDE.md) - Complete feature documentation

---

## Tech Stack

- **Framework**: Electron 38 + React 19 + TypeScript 5
- **Build Tool**: Vite 7
- **UI Framework**: Tailwind CSS 4 + ShadCN UI
- **Router**: React Router 7
- **Testing**: Vitest + Testing Library
- **Packaging**: Electron Builder

---

## Development

### Prerequisites

- Node.js >= 18.x LTS
- npm >= 8.x
- Git

### Install Dependencies

```bash
git clone https://github.com/chinnsenn/FFmpeg-GUI.git
cd FFmpeg-GUI
npm install
```

### Development Mode

```bash
# Start development server with hot reload
npm run dev
```

### Build

```bash
# Type checking
npm run type-check

# Run tests
npm test

# Build app (with installers)
npm run build

# Build directory only (quick test)
npm run build:dir
```

### Project Structure

```
FFmpeg-GUI/
├── src/
│   ├── main/              # Electron main process
│   │   ├── ffmpeg/        # FFmpeg related functions
│   │   ├── ipc/           # IPC handlers
│   │   └── utils/         # Utility functions
│   ├── renderer/          # React renderer process
│   │   └── src/
│   │       ├── components/  # React components
│   │       ├── pages/       # Page components
│   │       ├── router/      # Routing configuration
│   │       └── lib/         # Utility libraries
│   └── shared/            # Shared code and types
│       ├── constants.ts   # Constant definitions
│       ├── types.ts       # TypeScript types
│       └── format-presets.ts  # Format presets
├── build/                 # Build resources
├── docs/                  # Documentation
├── release/               # Build output
└── dist-electron/         # Compiled output
```

### Testing

```bash
# Run all tests
npm test

# Test coverage
npm run test:coverage

# Test UI
npm run test:ui
```

### Related Documentation
- [Contributing Guide](docs/CONTRIBUTING.md) - Code contribution guidelines
- [Build Guide](docs/BUILD.md) - Multi-platform build instructions

---

## Contributing

Contributions are welcome! Please check the [Contributing Guide](docs/CONTRIBUTING.md) for information on how to participate in the project.

### Development Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Create a Pull Request

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: New feature
fix: Bug fix
docs: Documentation update
style: Code formatting (no functional changes)
refactor: Refactoring
test: Testing related
chore: Build/tool related
```

---

## Roadmap

- [x] Basic framework setup
- [x] FFmpeg integration
- [x] Format conversion functionality
- [x] Video compression functionality
- [x] Task queue management
- [x] Real-time progress display
- [x] Performance optimization
- [x] Error handling and logging
- [x] Unit testing
- [x] Multi-platform packaging
- [x] Modern Minimalist UI refactor
- [x] Dark mode support
- [ ] Release v1.0.0

**Current Progress**: 21/22 tasks completed (95%)

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

---

## Acknowledgements

- [FFmpeg](https://ffmpeg.org/) - Powerful multimedia processing tool
- [Electron](https://www.electronjs.org/) - Cross-platform desktop app framework
- [React](https://react.dev/) - User interface library
- [ShadCN UI](https://ui.shadcn.com/) - Beautiful UI components

---

## Contact

- Issues: [GitHub Issues](https://github.com/chinnsenn/FFmpeg-GUI/issues)
- Discussions: [GitHub Discussions](https://github.com/chinnsenn/FFmpeg-GUI/discussions)

---

<div align="center">

</div>