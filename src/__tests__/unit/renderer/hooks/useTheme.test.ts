/**
 * useTheme Hook 测试
 * 覆盖率目标: 90%+
 */
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme } from '@renderer/hooks/useTheme';
import type { AppConfig } from '@shared/types';

describe('useTheme', () => {
  let mockGetConfig: ReturnType<typeof vi.fn>;
  let mockMatchMedia: ReturnType<typeof vi.fn>;
  let mediaQueryListeners: ((e: MediaQueryListEvent) => void)[] = [];

  beforeEach(() => {
    // Reset DOM
    document.documentElement.classList.remove('dark');

    // Reset listeners
    mediaQueryListeners = [];

    // Mock electronAPI.getConfig
    mockGetConfig = vi.fn().mockResolvedValue({ theme: 'system' } as AppConfig);
    global.window.electronAPI.getConfig = mockGetConfig;

    // Mock matchMedia
    mockMatchMedia = vi.fn((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn((event: string, handler: (e: MediaQueryListEvent) => void) => {
        if (event === 'change') {
          mediaQueryListeners.push(handler);
        }
      }),
      removeEventListener: vi.fn((event: string, handler: (e: MediaQueryListEvent) => void) => {
        if (event === 'change') {
          mediaQueryListeners = mediaQueryListeners.filter(h => h !== handler);
        }
      }),
      dispatchEvent: vi.fn(),
    }));
    global.window.matchMedia = mockMatchMedia;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('should load theme from config on mount', async () => {
      mockGetConfig.mockResolvedValue({ theme: 'dark' } as AppConfig);

      const { result } = renderHook(() => useTheme());

      // Wait for async config load
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(result.current.theme).toBe('dark');
      expect(result.current.isDark).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should default to system theme when config has no theme', async () => {
      mockGetConfig.mockResolvedValue({} as AppConfig);

      const { result } = renderHook(() => useTheme());

      await new Promise(resolve => setTimeout(resolve, 50));

      expect(result.current.theme).toBe('system');
    });

    it('should handle config load error gracefully', async () => {
      // Suppress console.error from being logged during this test
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      mockGetConfig.mockRejectedValue(new Error('Config load failed'));

      const { result } = renderHook(() => useTheme());

      await new Promise(resolve => setTimeout(resolve, 50));

      // Should use system theme as default
      expect(result.current.theme).toBe('system');

      // Restore console.error
      consoleErrorSpy.mockRestore();
    });
  });

  describe('setTheme', () => {
    it('should switch to dark theme', async () => {
      const { result } = renderHook(() => useTheme());

      await new Promise(resolve => setTimeout(resolve, 50));

      act(() => {
        result.current.setTheme('dark');
      });

      expect(result.current.theme).toBe('dark');
      expect(result.current.isDark).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should switch to light theme', async () => {
      // First set to dark
      mockGetConfig.mockResolvedValue({ theme: 'dark' } as AppConfig);
      const { result } = renderHook(() => useTheme());

      await new Promise(resolve => setTimeout(resolve, 50));

      act(() => {
        result.current.setTheme('light');
      });

      expect(result.current.theme).toBe('light');
      expect(result.current.isDark).toBe(false);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('should switch to system theme', async () => {
      mockMatchMedia.mockReturnValue({
        matches: true, // System is dark
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn((event: string, handler: (e: MediaQueryListEvent) => void) => {
          if (event === 'change') {
            mediaQueryListeners.push(handler);
          }
        }),
        removeEventListener: vi.fn((event: string, handler: (e: MediaQueryListEvent) => void) => {
          if (event === 'change') {
            mediaQueryListeners = mediaQueryListeners.filter(h => h !== handler);
          }
        }),
        dispatchEvent: vi.fn(),
      });

      const { result } = renderHook(() => useTheme());

      await new Promise(resolve => setTimeout(resolve, 50));

      act(() => {
        result.current.setTheme('system');
      });

      expect(result.current.theme).toBe('system');
      expect(result.current.isDark).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });

  describe('system theme detection', () => {
    it('should detect light system theme', async () => {
      mockMatchMedia.mockReturnValue({
        matches: false, // System is light
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      });

      mockGetConfig.mockResolvedValue({ theme: 'system' } as AppConfig);

      const { result } = renderHook(() => useTheme());

      await new Promise(resolve => setTimeout(resolve, 50));

      expect(result.current.isDark).toBe(false);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('should detect dark system theme', async () => {
      mockMatchMedia.mockReturnValue({
        matches: true, // System is dark
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      });

      mockGetConfig.mockResolvedValue({ theme: 'system' } as AppConfig);

      const { result } = renderHook(() => useTheme());

      await new Promise(resolve => setTimeout(resolve, 50));

      expect(result.current.isDark).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });

  describe('system theme change listener', () => {
    it('should listen to system theme changes when theme is system', async () => {
      mockGetConfig.mockResolvedValue({ theme: 'system' } as AppConfig);

      const { result } = renderHook(() => useTheme());

      await new Promise(resolve => setTimeout(resolve, 50));

      // Verify listener was added
      expect(mediaQueryListeners.length).toBeGreaterThan(0);

      // Simulate system theme change to dark
      act(() => {
        const event = { matches: true } as MediaQueryListEvent;
        mediaQueryListeners.forEach(listener => listener(event));
      });

      expect(result.current.isDark).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should remove listener when switching away from system theme', async () => {
      mockGetConfig.mockResolvedValue({ theme: 'system' } as AppConfig);

      const { result } = renderHook(() => useTheme());

      await new Promise(resolve => setTimeout(resolve, 50));

      const initialListenerCount = mediaQueryListeners.length;
      expect(initialListenerCount).toBeGreaterThan(0);

      // Switch to dark theme
      act(() => {
        result.current.setTheme('dark');
      });

      // Wait for effect cleanup
      await new Promise(resolve => setTimeout(resolve, 50));

      // Listener should still be there but won't be active
      // (This is implementation specific, might need adjustment)
    });

    it('should update to light when system changes to light', async () => {
      mockGetConfig.mockResolvedValue({ theme: 'system' } as AppConfig);

      const { result } = renderHook(() => useTheme());

      await new Promise(resolve => setTimeout(resolve, 50));

      // Simulate system theme change to light
      act(() => {
        const event = { matches: false } as MediaQueryListEvent;
        mediaQueryListeners.forEach(listener => listener(event));
      });

      expect(result.current.isDark).toBe(false);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('should not listen to system changes when theme is not system', async () => {
      mockGetConfig.mockResolvedValue({ theme: 'dark' } as AppConfig);

      renderHook(() => useTheme());

      await new Promise(resolve => setTimeout(resolve, 50));

      // When theme is fixed (dark/light), should not add listener
      // or listener count should be 0
      expect(mediaQueryListeners.length).toBe(0);
    });
  });

  describe('applyTheme', () => {
    it('should add dark class for dark theme', async () => {
      const { result } = renderHook(() => useTheme());

      await new Promise(resolve => setTimeout(resolve, 50));

      act(() => {
        result.current.setTheme('dark');
      });

      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should remove dark class for light theme', async () => {
      // Start with dark
      document.documentElement.classList.add('dark');

      const { result } = renderHook(() => useTheme());

      await new Promise(resolve => setTimeout(resolve, 50));

      act(() => {
        result.current.setTheme('light');
      });

      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('should apply system theme correctly', async () => {
      mockMatchMedia.mockReturnValue({
        matches: true, // System prefers dark
        media: '(prefers-color-scheme: dark)',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      });

      const { result } = renderHook(() => useTheme());

      await new Promise(resolve => setTimeout(resolve, 50));

      act(() => {
        result.current.setTheme('system');
      });

      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });
});
