import { useState } from 'react';
import {
  Home,
  RefreshCw,
  Scissors,
  Archive,
  Type,
  Target,
  List,
  Settings,
} from 'lucide-react';
import { cn } from '@renderer/lib/utils';

const menuItems = [
  { icon: Home, label: '主页', path: '/' },
  { icon: RefreshCw, label: '转换', path: '/convert' },
  { icon: Scissors, label: '编辑', path: '/edit' },
  { icon: Archive, label: '压缩', path: '/compress' },
  { icon: Type, label: '字幕', path: '/subtitle' },
  { icon: Target, label: '水印', path: '/watermark' },
  { icon: List, label: '队列', path: '/queue' },
  { icon: Settings, label: '设置', path: '/settings' },
];

export function Sidebar() {
  const [activeItem, setActiveItem] = useState('/');

  return (
    <aside className="flex w-64 flex-col border-r bg-muted/40">
      {/* Logo */}
      <div className="flex h-14 items-center border-b px-4">
        <h1 className="text-lg font-bold">FFmpeg GUI</h1>
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.path;

          return (
            <button
              key={item.path}
              onClick={() => setActiveItem(item.path)}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
