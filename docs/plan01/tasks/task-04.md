# Task-04: 路由系统和页面框架

**任务ID**：Task-04
**所属阶段**：阶段一 - 基础框架
**难度**：⭐⭐ 中等
**预估时间**：1天
**优先级**：P0
**依赖任务**：Task-02

---

## 任务目标

搭建应用的路由系统，创建各个功能页面的框架结构，实现页面导航功能。

---

## 详细需求

### 1. React Router 集成
- [ ] 安装 `react-router-dom`
- [ ] 配置路由系统
- [ ] 创建路由配置文件
- [ ] 集成到 Layout 组件

### 2. 页面组件创建
- [ ] 创建主页（Home）
- [ ] 创建格式转换页（Convert）
- [ ] 创建视频编辑页（Edit）
- [ ] 创建视频压缩页（Compress）
- [ ] 创建字幕功能页（Subtitle）
- [ ] 创建水印功能页（Watermark）
- [ ] 创建任务队列页（Queue）
- [ ] 创建设置页（Settings）

### 3. 导航集成
- [ ] 更新 Sidebar 组件支持路由导航
- [ ] 实现路由激活状态
- [ ] 添加页面过渡动画（可选）

### 4. 页面布局
- [ ] 创建统一的页面容器组件
- [ ] 定义页面标题和面包屑
- [ ] 创建页面加载状态组件

---

## 技术方案

### 1. 安装依赖

```bash
npm install react-router-dom
npm install -D @types/react-router-dom
```

### 2. 路由配置

```typescript
// src/renderer/src/router/index.tsx
import React from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { Layout } from '@/components/Layout/Layout';
import { Home } from '@/pages/Home';
import { Convert } from '@/pages/Convert';
import { Edit } from '@/pages/Edit';
import { Compress } from '@/pages/Compress';
import { Subtitle } from '@/pages/Subtitle';
import { Watermark } from '@/pages/Watermark';
import { Queue } from '@/pages/Queue';
import { Settings } from '@/pages/Settings';

const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'convert',
        element: <Convert />,
      },
      {
        path: 'edit',
        element: <Edit />,
      },
      {
        path: 'compress',
        element: <Compress />,
      },
      {
        path: 'subtitle',
        element: <Subtitle />,
      },
      {
        path: 'watermark',
        element: <Watermark />,
      },
      {
        path: 'queue',
        element: <Queue />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
```

### 3. 更新 App.tsx

```typescript
// src/renderer/src/App.tsx
import React from 'react';
import { Router } from './router';
import './index.css';

function App() {
  return <Router />;
}

export default App;
```

### 4. 更新 Layout 组件

```typescript
// src/renderer/src/components/Layout/Layout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';

export function Layout() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6">
          {/* Outlet 用于渲染子路由 */}
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}
```

### 5. 更新 Sidebar 组件支持路由

```typescript
// src/renderer/src/components/Layout/Sidebar.tsx
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
```

### 6. 创建页面容器组件

```typescript
// src/renderer/src/components/PageContainer/PageContainer.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({
  title,
  description,
  children,
  className,
}: PageContainerProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* 页面标题 */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      {/* 页面内容 */}
      <div>{children}</div>
    </div>
  );
}
```

### 7. 创建各个页面组件

```typescript
// src/renderer/src/pages/Home.tsx
import React from 'react';
import { PageContainer } from '@/components/PageContainer/PageContainer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Scissors, Archive, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Home() {
  const features = [
    {
      icon: RefreshCw,
      title: '格式转换',
      description: '支持 50+ 种视频/音频格式互转',
      path: '/convert',
    },
    {
      icon: Scissors,
      title: '视频编辑',
      description: '剪辑、裁剪、旋转、翻转等功能',
      path: '/edit',
    },
    {
      icon: Archive,
      title: '视频压缩',
      description: '智能压缩，保持高质量',
      path: '/compress',
    },
    {
      icon: Zap,
      title: '批量处理',
      description: '任务队列，高效处理',
      path: '/queue',
    },
  ];

  return (
    <PageContainer
      title="欢迎使用 FFmpeg GUI"
      description="一款强大、易用的视频处理工具"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link key={feature.path} to={feature.path}>
              <Card className="cursor-pointer transition-all hover:shadow-lg">
                <CardHeader>
                  <Icon className="h-8 w-8 text-primary" />
                  <CardTitle className="mt-2">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </PageContainer>
  );
}
```

```typescript
// src/renderer/src/pages/Convert.tsx
import React from 'react';
import { PageContainer } from '@/components/PageContainer/PageContainer';

export function Convert() {
  return (
    <PageContainer
      title="格式转换"
      description="支持多种视频和音频格式互转"
    >
      <div className="flex h-96 items-center justify-center rounded-lg border-2 border-dashed">
        <p className="text-muted-foreground">格式转换功能开发中...</p>
      </div>
    </PageContainer>
  );
}
```

```typescript
// src/renderer/src/pages/Edit.tsx
import React from 'react';
import { PageContainer } from '@/components/PageContainer/PageContainer';

export function Edit() {
  return (
    <PageContainer
      title="视频编辑"
      description="剪辑、裁剪、旋转、翻转等编辑功能"
    >
      <div className="flex h-96 items-center justify-center rounded-lg border-2 border-dashed">
        <p className="text-muted-foreground">视频编辑功能开发中...</p>
      </div>
    </PageContainer>
  );
}
```

```typescript
// src/renderer/src/pages/Compress.tsx
import React from 'react';
import { PageContainer } from '@/components/PageContainer/PageContainer';

export function Compress() {
  return (
    <PageContainer
      title="视频压缩"
      description="智能压缩，平衡质量与文件大小"
    >
      <div className="flex h-96 items-center justify-center rounded-lg border-2 border-dashed">
        <p className="text-muted-foreground">视频压缩功能开发中...</p>
      </div>
    </PageContainer>
  );
}
```

```typescript
// src/renderer/src/pages/Subtitle.tsx
import React from 'react';
import { PageContainer } from '@/components/PageContainer/PageContainer';

export function Subtitle() {
  return (
    <PageContainer
      title="字幕功能"
      description="添加、提取、编辑视频字幕"
    >
      <div className="flex h-96 items-center justify-center rounded-lg border-2 border-dashed">
        <p className="text-muted-foreground">字幕功能开发中...</p>
      </div>
    </PageContainer>
  );
}
```

```typescript
// src/renderer/src/pages/Watermark.tsx
import React from 'react';
import { PageContainer } from '@/components/PageContainer/PageContainer';

export function Watermark() {
  return (
    <PageContainer
      title="水印功能"
      description="添加图片或文字水印"
    >
      <div className="flex h-96 items-center justify-center rounded-lg border-2 border-dashed">
        <p className="text-muted-foreground">水印功能开发中...</p>
      </div>
    </PageContainer>
  );
}
```

```typescript
// src/renderer/src/pages/Queue.tsx
import React from 'react';
import { PageContainer } from '@/components/PageContainer/PageContainer';

export function Queue() {
  return (
    <PageContainer
      title="任务队列"
      description="查看和管理所有处理任务"
    >
      <div className="flex h-96 items-center justify-center rounded-lg border-2 border-dashed">
        <p className="text-muted-foreground">任务队列功能开发中...</p>
      </div>
    </PageContainer>
  );
}
```

```typescript
// src/renderer/src/pages/Settings.tsx
import React from 'react';
import { PageContainer } from '@/components/PageContainer/PageContainer';

export function Settings() {
  return (
    <PageContainer
      title="设置"
      description="配置应用偏好和 FFmpeg 路径"
    >
      <div className="flex h-96 items-center justify-center rounded-lg border-2 border-dashed">
        <p className="text-muted-foreground">设置页面开发中...</p>
      </div>
    </PageContainer>
  );
}
```

### 8. 添加页面过渡动画（可选）

```typescript
// src/renderer/src/components/Layout/Layout.tsx (带动画版本)
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';

export function Layout() {
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        <Footer />
      </div>
    </div>
  );
}
```

---

## 验收标准

### 功能验收
- [ ] 所有页面路由正常工作
- [ ] 侧边栏导航点击能切换页面
- [ ] 路由激活状态正确显示
- [ ] 页面刷新后路由状态保持
- [ ] 浏览器前进/后退按钮正常工作

### 视觉验收
- [ ] 页面切换流畅无闪烁
- [ ] 页面过渡动画自然（如果启用）
- [ ] 页面标题和描述正确显示
- [ ] 布局统一，间距一致

### 代码质量验收
- [ ] 路由配置清晰易维护
- [ ] 页面组件结构规范
- [ ] TypeScript 类型定义完整
- [ ] 无 Lint 错误

---

## 测试用例

### TC-01: 路由导航测试
**步骤**：
1. 启动应用
2. 依次点击侧边栏的各个菜单项
3. 观察页面变化

**预期结果**：
- 每个菜单项都能正确跳转到对应页面
- 激活状态高亮显示正确

### TC-02: 直接访问路由测试
**步骤**：
1. 在浏览器 DevTools 控制台输入 `window.location.hash = '#/convert'`
2. 观察页面变化

**预期结果**：
- 页面正确显示转换页
- 侧边栏激活状态同步更新

### TC-03: 页面刷新测试
**步骤**：
1. 导航到任意非首页页面
2. 刷新页面（F5）
3. 观察页面状态

**预期结果**：
- 刷新后停留在当前页面
- 侧边栏激活状态保持

---

## 注意事项

1. **Hash Router vs Browser Router**：Electron 应用推荐使用 `createHashRouter`
2. **路由懒加载**：大型应用可考虑使用 `React.lazy` 懒加载页面
3. **404 页面**：后续可添加 404 错误页面
4. **面包屑导航**：复杂应用可添加面包屑导航
5. **页面权限**：如需权限控制，可添加路由守卫

---

## 参考资料

- [React Router 官方文档](https://reactrouter.com/)
- [Framer Motion 官方文档](https://www.framer.com/motion/)

---

## 完成检查清单

- [ ] React Router 安装和配置完成
- [ ] 路由配置文件创建完成
- [ ] 所有页面组件创建完成
- [ ] Sidebar 导航集成完成
- [ ] PageContainer 组件创建完成
- [ ] 页面过渡动画实现（可选）
- [ ] 所有验收标准通过
- [ ] 代码已提交到 Git

---

**任务状态**：待开始
**创建日期**：2025-10-02
**最后更新**：2025-10-02
