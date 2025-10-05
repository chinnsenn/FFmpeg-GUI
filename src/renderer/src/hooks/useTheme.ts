import { useEffect, useState, useCallback } from 'react';
import type { AppConfig } from '@shared/types';

export type Theme = 'light' | 'dark' | 'system';

/**
 * 主题管理 Hook
 *
 * 功能：
 * 1. 从配置加载主题设置
 * 2. 监听系统主题变化（当设置为 system 时）
 * 3. 应用主题到 DOM (document.documentElement)
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('system');
  const [isDark, setIsDark] = useState(false);

  // 检测系统主题
  const getSystemTheme = (): boolean => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  // 应用主题到 DOM
  const applyTheme = useCallback((newTheme: Theme) => {
    let shouldBeDark = false;

    if (newTheme === 'dark') {
      shouldBeDark = true;
    } else if (newTheme === 'light') {
      shouldBeDark = false;
    } else {
      // system
      shouldBeDark = getSystemTheme();
    }

    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    setIsDark(shouldBeDark);
  }, []);

  // 设置主题
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
  };

  // 初始化：从配置加载主题
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const config: AppConfig = await window.electronAPI.getConfig();
        const savedTheme = config.theme || 'system';
        setThemeState(savedTheme);
        applyTheme(savedTheme);
      } catch (error) {
        console.error('Failed to load theme:', error);
        // 默认使用 system 主题
        applyTheme('system');
      }
    };

    loadTheme();
  }, [applyTheme]);

  // 监听系统主题变化（仅当设置为 system 时）
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDark(e.matches);
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme]);

  return {
    theme,
    setTheme,
    isDark,
  };
}
