/* v8 ignore file */
import { defineWorkspace } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineWorkspace([
  // Main process tests
  {
    test: {
      name: 'main',
      environment: 'node',
      include: ['src/__tests__/unit/main/**/*.test.ts'],
      setupFiles: ['./src/__tests__/setup/main.setup.ts'],
      globals: true,
      coverage: {
        enabled: true,
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        all: false,  // Only report actually covered files
        include: [
          'src/main/**/*.js',
          'src/shared/**/*.js',
        ],
        exclude: [
          'node_modules/',
          'src/__tests__/',
          '**/*.d.ts',
          '**/*.config.*',
          '**/dist/**',
          '**/dist-electron/**',
          'src/main/index.js',
          // Exclude simple modules
          '**/logger.js',
          '**/constants.js',
          '**/types.js',
          // Exclude IPC handlers with minimal logic
          '**/logHandlers.js',
          '**/systemHandlers.js',
          // Exclude FFmpeg manager (complex child process, tested via integration)
          '**/manager.js',
        ],
        thresholds: {
          lines: 70,
          functions: 70,
          branches: 70,
          statements: 70,
        },
      },
    },
    resolve: {
      alias: {
        '@main': resolve(__dirname, './src/main'),
        '@shared': resolve(__dirname, './src/shared'),
      },
    },
  },
  // Renderer process tests
  {
    plugins: [react()],
    test: {
      name: 'renderer',
      environment: 'happy-dom',
      include: ['src/__tests__/unit/renderer/**/*.test.{ts,tsx}'],
      setupFiles: ['./src/__tests__/setup/renderer.setup.ts'],
      globals: true,
      coverage: {
        enabled: true,
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        all: false,  // Only report actually covered files
        include: [
          'src/renderer/src/**/*.{ts,tsx}',
        ],
        exclude: [
          'node_modules/',
          'src/__tests__/',
          '**/*.d.ts',
          '**/*.config.*',
          '**/dist/**',
          '**/dist-electron/**',
          'src/renderer/src/main.tsx',
          'src/renderer/preload.ts',
          // Exclude simple modules
          '**/format-presets.ts',
          '**/constants.ts',
          '**/types.ts',
          // Exclude UI components (focus on business logic)
          'src/renderer/src/components/**',
          'src/renderer/src/pages/**',
          'src/renderer/src/router/**',
          'src/renderer/src/App.tsx',
        ],
        thresholds: {
          lines: 70,
          functions: 70,
          branches: 70,
          statements: 70,
        },
      },
    },
    resolve: {
      alias: {
        '@renderer': resolve(__dirname, './src/renderer/src'),
        '@shared': resolve(__dirname, './src/shared'),
      },
    },
  },
]);
