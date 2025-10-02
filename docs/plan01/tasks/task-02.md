# Task-02: UI框架和组件库集成

**任务ID**：Task-02
**所属阶段**：阶段一 - 基础框架
**难度**：⭐⭐ 中等
**预估时间**：2天
**优先级**：P0
**依赖任务**：Task-01

---

## 任务目标

集成 ShadCN UI 和 Tailwind CSS，搭建应用的基础 UI 框架和布局系统。

---

## 详细需求

### 1. Tailwind CSS 集成
- [ ] 安装 Tailwind CSS 相关依赖
- [ ] 创建 `tailwind.config.js` 配置文件
- [ ] 创建 `postcss.config.js` 配置文件
- [ ] 配置全局样式文件 `src/renderer/src/index.css`
- [ ] 配置深色模式支持

### 2. ShadCN UI 集成
- [ ] 初始化 ShadCN UI
- [ ] 配置 `components.json`
- [ ] 创建 `src/renderer/src/components/ui` 目录
- [ ] 安装基础 UI 组件（Button, Card, Input, Select, Progress 等）
- [ ] 配置主题颜色和样式变量

### 3. 基础布局组件
- [ ] 创建 Layout 组件（应用主布局）
- [ ] 创建 Sidebar 组件（侧边栏导航）
- [ ] 创建 Header 组件（顶部标题栏）
- [ ] 创建 Footer 组件（底部命令预览和任务状态栏）

### 4. 图标系统
- [ ] 安装 Lucide React 图标库
- [ ] 创建图标封装组件
- [ ] 配置常用图标

### 5. 动画系统（可选）
- [ ] 安装 Framer Motion
- [ ] 配置页面切换动画
- [ ] 配置组件过渡动画

---

## 技术方案

### 1. 安装依赖

```bash
# Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# ShadCN UI 依赖
npm install class-variance-authority clsx tailwind-merge
npm install @radix-ui/react-slot
npm install lucide-react

# 动画库（可选）
npm install framer-motion

# ShadCN UI 初始化
npx shadcn-ui@latest init
```

### 2. Tailwind 配置

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/renderer/index.html',
    './src/renderer/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        // ... 更多颜色配置
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
```

### 3. 全局样式

```css
/* src/renderer/src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    /* ... 更多 CSS 变量 */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... 深色模式变量 */
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif;
  }
}
```

### 4. 布局组件实现

#### Layout 组件
```typescript
// src/renderer/src/components/Layout/Layout.tsx
import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* 侧边栏 */}
      <Sidebar />

      {/* 主内容区 */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* 顶部栏 */}
        <Header />

        {/* 主工作区 */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>

        {/* 底部栏 */}
        <Footer />
      </div>
    </div>
  );
}
```

#### Sidebar 组件
```typescript
// src/renderer/src/components/Layout/Sidebar.tsx
import React from 'react';
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
import { cn } from '@/lib/utils';

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
  const [activeItem, setActiveItem] = React.useState('/');

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
```

#### Header 组件
```typescript
// src/renderer/src/components/Layout/Header.tsx
import React from 'react';
import { Moon, Sun, Minimize2, Maximize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  const [isDark, setIsDark] = React.useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="flex h-14 items-center justify-between border-b px-6">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-medium text-muted-foreground">
          视频格式转换
        </h2>
      </div>

      <div className="flex items-center gap-2">
        {/* 主题切换 */}
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        {/* 窗口控制按钮（稍后集成） */}
        <Button variant="ghost" size="icon">
          <Minimize2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Maximize2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
```

#### Footer 组件
```typescript
// src/renderer/src/components/Layout/Footer.tsx
import React from 'react';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Footer() {
  return (
    <footer className="border-t">
      {/* 命令预览区 */}
      <div className="flex items-center gap-2 border-b bg-muted/30 px-4 py-2">
        <span className="text-xs font-medium">FFmpeg 命令:</span>
        <code className="flex-1 text-xs font-mono text-muted-foreground">
          ffmpeg -i input.mp4 -c:v libx264 output.avi
        </code>
        <Button variant="ghost" size="sm">
          <Copy className="h-3 w-3" />
        </Button>
      </div>

      {/* 任务状态栏 */}
      <div className="h-24 overflow-y-auto p-4">
        <div className="text-sm text-muted-foreground">
          任务队列 (0)
        </div>
      </div>
    </footer>
  );
}
```

### 5. 工具函数

```typescript
// src/renderer/src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 6. 安装基础 ShadCN UI 组件

```bash
# 安装常用组件
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add select
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add toast
```

---

## 验收标准

### 功能验收
- [ ] Tailwind CSS 样式正常工作
- [ ] ShadCN UI 组件能正常使用
- [ ] 应用布局正确显示（侧边栏、主区域、底部栏）
- [ ] 侧边栏导航按钮能切换激活状态
- [ ] 深色模式切换正常工作
- [ ] 响应式布局适配不同窗口大小

### 视觉验收
- [ ] 界面美观，符合设计规范
- [ ] 间距和对齐统一
- [ ] 颜色主题一致
- [ ] 图标大小和样式统一
- [ ] 深色模式下所有元素可见

### 代码质量验收
- [ ] 组件结构清晰，可复用性高
- [ ] TypeScript 类型定义完整
- [ ] 无 Lint 错误
- [ ] 组件命名规范

---

## 测试用例

### TC-01: Tailwind CSS 测试
**步骤**：
1. 在组件中使用 Tailwind 类名
2. 检查样式是否正确应用

**预期结果**：
- Tailwind 样式正常工作
- 响应式类名生效

### TC-02: 深色模式测试
**步骤**：
1. 点击主题切换按钮
2. 观察界面变化

**预期结果**：
- 界面从浅色切换到深色
- 所有元素颜色正确更新
- 文字可读性良好

### TC-03: 布局响应式测试
**步骤**：
1. 调整窗口大小（从 1920x1080 到 1024x768）
2. 观察布局变化

**预期结果**：
- 布局自适应窗口大小
- 内容不溢出或重叠
- 滚动条正常工作

### TC-04: ShadCN UI 组件测试
**步骤**：
1. 使用 Button 组件的不同变体
2. 使用 Card、Input 等组件

**预期结果**：
- 组件样式正确
- 交互行为正常
- 无障碍属性正确

---

## 注意事项

1. **样式优先级**：Tailwind 的 @layer 指令确保正确的样式优先级
2. **CSS 变量**：使用 CSS 变量便于主题定制
3. **深色模式**：确保所有自定义组件都支持深色模式
4. **性能**：避免过度使用复杂的 Tailwind 类名组合
5. **可访问性**：遵循 WCAG 2.1 AA 标准

---

## 参考资料

- [ShadCN UI 官方文档](https://ui.shadcn.com/)
- [Tailwind CSS 官方文档](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [Radix UI](https://www.radix-ui.com/)

---

## 完成检查清单

- [ ] Tailwind CSS 集成完成
- [ ] ShadCN UI 集成完成
- [ ] 基础 UI 组件安装完成
- [ ] Layout 组件创建完成
- [ ] Sidebar 组件创建完成
- [ ] Header 组件创建完成
- [ ] Footer 组件创建完成
- [ ] 深色模式配置完成
- [ ] 所有验收标准通过
- [ ] 代码已提交到 Git

---

**任务状态**：待开始
**创建日期**：2025-10-02
**最后更新**：2025-10-02
