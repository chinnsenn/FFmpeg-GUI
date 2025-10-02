# FFmpeg GUI

A powerful and user-friendly FFmpeg GUI application built with Electron, React, TypeScript, and Vite.

## Features

- 🎬 Video format conversion (50+ formats supported)
- 🗜️ Video compression with multiple presets
- ✂️ Video editing (trim, crop, rotate, flip)
- 🔊 Audio extraction and processing
- 📝 Subtitle support (hard/soft subtitles)
- 💧 Watermark functionality
- 🔗 Video merging
- 📦 Batch processing
- 🚀 Real-time progress tracking
- 🌐 Cross-platform (Windows, macOS, Linux)

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Desktop**: Electron 28
- **Build Tool**: Vite 5
- **UI**: ShadCN UI + Tailwind CSS (coming soon)
- **State Management**: Zustand (coming soon)

## Development

### Prerequisites

- Node.js >= 18.x LTS
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Format code
npm run format

# Type checking
npm run type-check
```

## Project Structure

```
FFmpeg-GUI/
├── src/
│   ├── main/              # Electron main process
│   ├── renderer/          # React renderer process
│   └── shared/            # Shared code and types
├── resources/             # Application resources
├── docs/                  # Documentation
└── dist-electron/         # Build output
```

## Development Roadmap

See [Development Roadmap](docs/plan01/plan-development-roadmap.md) for detailed development plan.

**Current Status**: Phase 1 - Task 01 (Project Initialization) ✅

## License

MIT

## Author

FFmpeg GUI Team
