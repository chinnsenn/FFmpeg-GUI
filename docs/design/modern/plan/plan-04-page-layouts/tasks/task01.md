# Task 01: 重构 Layout 组件

## 任务目标

创建应用的主布局组件,包括 Sidebar、Header 和主内容区,为所有页面提供统一的布局框架。

## 参考文档

- `docs/design/modern/demo/dashboard.html` - 完整的布局结构
- `docs/design/modern/guide/pages-layout.md` - 布局规范

## 实施步骤

### 步骤 1: 创建 Layout 组件

```tsx
// src/renderer/src/components/layout/Layout.tsx
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function Layout() {
  return (
    <div className="flex h-screen bg-background-primary text-text-primary">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
```

### 步骤 2: 创建 Sidebar 组件

```tsx
// src/renderer/src/components/layout/Sidebar.tsx
import { NavLink } from 'react-router-dom';
import { Home, FileVideo, Package, List, Settings } from 'lucide-react';
import { cn } from '@renderer/lib/utils';

const navItems = [
  { path: '/', label: '首页', icon: Home },
  { path: '/convert', label: '格式转换', icon: FileVideo },
  { path: '/compress', label: '视频压缩', icon: Package },
  { path: '/queue', label: '任务队列', icon: List },
  { path: '/settings', label: '设置', icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="w-60 bg-background-elevated border-r border-border-light flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-border-light">
        <h1 className="text-h3 font-semibold">FFmpeg GUI</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-600 dark:bg-primary-600/10'
                  : 'text-text-secondary hover:bg-background-secondary hover:text-text-primary'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
```

### 步骤 3: 创建 Header 组件

```tsx
// src/renderer/src/components/layout/Header.tsx
import { useLocation } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@renderer/components/ui/Button';
import { useTheme } from '@renderer/hooks/useTheme';

const pageTitles: Record<string, string> = {
  '/': '仪表板',
  '/convert': '格式转换',
  '/compress': '视频压缩',
  '/queue': '任务队列',
  '/settings': '设置',
};

export function Header() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 border-b border-border-light flex items-center justify-between px-6">
      <h2 className="text-h2">{pageTitles[location.pathname] || '首页'}</h2>

      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        aria-label="切换主题"
      >
        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>
    </header>
  );
}
```

## 验收标准

- [ ] Sidebar 固定宽度 240px
- [ ] Header 固定高度 64px
- [ ] 导航项高亮正确
- [ ] 主题切换正常工作
- [ ] 与 HTML Demo 100% 一致

## 预计时间

3-4 小时

---

**优先级**: P0
**依赖**: Plan-02 完成
