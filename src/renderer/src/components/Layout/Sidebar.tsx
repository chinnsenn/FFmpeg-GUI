import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import {
  Home,
  RefreshCw,
  Archive,
  List,
  Settings,
  Sun,
  Moon,
} from 'lucide-react';
import { cn } from '@renderer/lib/utils';

const menuItems = [
  { icon: Home, label: '首页', path: '/' },
  { icon: RefreshCw, label: '转换', path: '/convert' },
  { icon: Archive, label: '压缩', path: '/compress' },
  { icon: List, label: '队列', path: '/queue' },
  { icon: Settings, label: '设置', path: '/settings' },
];

export function Sidebar() {
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle('dark', newIsDark);
  };

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

      {/* 主题切换 */}
      <button
        onClick={toggleTheme}
        className="h-12 flex items-center justify-center rounded-lg hover:bg-background-tertiary transition-all duration-150 hover:scale-105"
        title={isDark ? '切换到浅色模式' : '切换到深色模式'}
      >
        {isDark ? (
          <Sun className="w-6 h-6 text-text-secondary" />
        ) : (
          <Moon className="w-6 h-6 text-text-secondary" />
        )}
      </button>
    </aside>
  );
}
