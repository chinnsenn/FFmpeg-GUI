import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  RefreshCw,
  Archive,
  List,
  Settings,
} from 'lucide-react';
import { cn } from '@renderer/lib/utils';

const menuItems = [
  { icon: Home, label: '主页', path: '/' },
  { icon: RefreshCw, label: '转换', path: '/convert' },
  { icon: Archive, label: '压缩', path: '/compress' },
  { icon: List, label: '队列', path: '/queue' },
  { icon: Settings, label: '设置', path: '/settings' },
];

export function Sidebar() {
  const location = useLocation();

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
          const isActive =
            item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
