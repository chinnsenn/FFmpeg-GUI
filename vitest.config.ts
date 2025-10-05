import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/__tests__/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/dist/**',
        '**/dist-electron/**',
        'src/main/index.ts',
        'src/renderer/src/main.tsx',
        'src/renderer/preload.ts',
        // Exclude UI components (focus on business logic)
        'src/renderer/src/components/**',
        'src/renderer/src/pages/**',
        'src/renderer/src/router/**',
        'src/renderer/src/App.tsx',
        // Exclude FFmpeg manager (complex child process management)
        'src/main/ffmpeg/manager.ts',
        // Exclude IPC handlers (tested via integration)
        'src/main/ipc/**',
        // Exclude system-specific files
        'src/main/downloader.ts',
        // Exclude shared constants, types, and presets (mostly static data)
        'src/shared/constants.ts',
        'src/shared/types.ts',
        'src/shared/format-presets.ts',
        // Exclude main process logger
        'src/main/utils/logger.ts',
        // Exclude preload logger
        'src/renderer/src/utils/logger.ts',
      ],
      thresholds: {
        lines: 30,
        functions: 30,
        branches: 30,
        statements: 30,
      },
    },
  },
});
