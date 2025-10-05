import { NavLink } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import {
  Home,
  RefreshCw,
  Archive,
  List,
  Settings,
  Sun,
  Moon,
  Monitor,
  Check,
} from 'lucide-react';
import { cn } from '@renderer/lib/utils';
import { useTheme } from '@renderer/hooks/useTheme';
import { toast } from 'sonner';
import { logger } from '@renderer/utils/logger';

const menuItems = [
  { icon: Home, label: '首页', path: '/' },
  { icon: RefreshCw, label: '转换', path: '/convert' },
  { icon: Archive, label: '压缩', path: '/compress' },
  { icon: List, label: '队列', path: '/queue' },
  { icon: Settings, label: '设置', path: '/settings' },
];

const themeOptions = [
  { value: 'light' as const, label: '浅色', icon: Sun },
  { value: 'dark' as const, label: '深色', icon: Moon },
  { value: 'system' as const, label: '跟随系统', icon: Monitor },
];

export function Sidebar() {
  const { theme, setTheme } = useTheme();
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setIsThemeMenuOpen(false);
      }
    };

    if (isThemeMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isThemeMenuOpen]);

  const handleThemeChange = async (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    setIsThemeMenuOpen(false);

    try {
      await window.electronAPI.setConfig({ theme: newTheme });
      logger.info('Sidebar', '主题已切换', { theme: newTheme });
    } catch (error) {
      logger.errorFromCatch('Sidebar', '保存主题失败', error);
      toast.error('保存主题设置失败');
    }
  };

  const currentThemeOption = themeOptions.find((opt) => opt.value === theme) || themeOptions[2];
  const CurrentIcon = currentThemeOption.icon;

  return (
    <aside className="flex h-screen w-60 flex-col bg-background-secondary border-r border-border-light p-4">
      {/* Logo */}
      <div className="h-16 flex items-center px-4 mb-6">
        <h1 className="text-lg font-bold text-text-primary">FFmpeg GUI</h1>
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 h-10 px-4 rounded-lg text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-600/10 text-primary-600'
                    : 'text-text-secondary hover:bg-background-tertiary hover:text-text-primary'
                )
              }
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* 主题切换器 */}
      <div className="relative" ref={themeMenuRef}>
        <button
          onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
          className="w-full h-12 flex items-center justify-between px-4 rounded-lg hover:bg-background-tertiary transition-all duration-150 group"
          title={`当前主题: ${currentThemeOption.label}`}
        >
          <div className="flex items-center gap-3">
            <CurrentIcon className="w-5 h-5 text-text-secondary" />
            <span className="text-sm text-text-secondary">主题</span>
          </div>
          <svg
            className={cn(
              'w-4 h-4 text-text-secondary transition-transform duration-200',
              isThemeMenuOpen && 'rotate-180'
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* 下拉菜单 */}
        {isThemeMenuOpen && (
          <div className="absolute bottom-full left-0 right-0 mb-2 p-1.5 bg-surface-raised border border-border-light rounded-lg shadow-lg">
            {themeOptions.map((option) => {
              const OptionIcon = option.icon;
              const isSelected = theme === option.value;

              return (
                <button
                  key={option.value}
                  onClick={() => handleThemeChange(option.value)}
                  className={cn(
                    'w-full flex items-center justify-between h-10 px-3 rounded-md text-sm transition-all',
                    isSelected
                      ? 'bg-primary-50 dark:bg-primary-600/20 text-primary-600 font-medium'
                      : 'text-text-primary hover:bg-background-tertiary'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <OptionIcon className="w-4 h-4" />
                    <span>{option.label}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
