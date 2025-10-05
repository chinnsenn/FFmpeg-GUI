/**
 * Renderer 进程测试环境设置
 */
import '@testing-library/jest-dom/vitest';
import { vi, afterEach, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Mock window.electronAPI
const mockElectronAPI = {
  // Task APIs
  task: {
    add: vi.fn().mockResolvedValue('task-123'),
    getAll: vi.fn().mockResolvedValue([]),
    cancel: vi.fn().mockResolvedValue(true),
    pause: vi.fn().mockResolvedValue(true),
    resume: vi.fn().mockResolvedValue(true),
  },

  // FFmpeg APIs
  ffmpeg: {
    detect: vi.fn().mockResolvedValue({ isInstalled: true, path: '/usr/bin/ffmpeg', version: '6.0' }),
    download: vi.fn().mockResolvedValue(true),
    getMediaInfo: vi.fn().mockResolvedValue({
      filename: 'test.mp4',
      format: 'mp4',
      formatLongName: 'MP4 (MPEG-4 Part 14)',
      duration: 125.5,
      size: 41943040,
      bitrate: 2500000,
      videoStreams: [{
        index: 0,
        codec: 'h264',
        codecLongName: 'H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10',
        width: 1920,
        height: 1080,
        fps: 30,
        bitrate: 2500000,
      }],
      audioStreams: [{
        index: 1,
        codec: 'aac',
        codecLongName: 'AAC (Advanced Audio Coding)',
        sampleRate: 48000,
        channels: 2,
        bitrate: 128000,
      }],
      subtitleCount: 0,
    }),
  },

  // File APIs
  file: {
    selectFiles: vi.fn().mockResolvedValue([{ path: '/mock/video.mp4', name: 'video.mp4' }]),
    selectFolder: vi.fn().mockResolvedValue('/mock/output'),
    getFileInfo: vi.fn().mockResolvedValue({ size: 1024 }),
  },

  // Config APIs
  config: {
    get: vi.fn().mockResolvedValue({}),
    set: vi.fn().mockResolvedValue(true),
  },

  // System APIs
  system: {
    getInfo: vi.fn().mockResolvedValue({ platform: 'darwin', arch: 'arm64' }),
  },

  // Event listener
  on: vi.fn((_channel: string, _callback: (...args: unknown[]) => void) => {
    return vi.fn(); // Return unsubscribe function
  }),
};

// 设置全局 window.electronAPI
global.window = {
  ...global.window,
  electronAPI: mockElectronAPI,
} as Window & typeof globalThis & { electronAPI: typeof mockElectronAPI };

// 每个测试后清理 DOM
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// 每个测试前重置 mock
beforeEach(() => {
  vi.clearAllMocks();
});

// Mock matchMedia for theme tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
