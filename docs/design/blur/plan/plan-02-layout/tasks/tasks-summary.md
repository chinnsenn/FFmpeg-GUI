# Phase 2 Tasks: 布局组件重构任务清单

## Task 01: 重构 Sidebar 为玻璃侧边栏

**工时**: 2h | **依赖**: Phase 1

### 重构内容
- 应用 `glass-surface-primary` 样式
- 添加右侧边框和阴影
- 导航项使用 `NavItem` 组件
- 添加 hover 和 active 状态动画

### 关键代码
```tsx
<aside className="glass-surface-primary w-60 flex flex-col border-r border-glass-border-primary shadow-glass-md">
  <div className="p-6">
    <h1 className="text-xl font-semibold text-text-primary">FFmpeg GUI</h1>
  </div>
  <nav className="flex-1 px-3 py-4 space-y-1">
    <NavItem to="/" icon={Home} label="首页" />
    <NavItem to="/convert" icon={RefreshCw} label="格式转换" />
    {/* ... */}
  </nav>
</aside>
```

---

## Task 02: 重构 Header 为玻璃顶栏

**工时**: 1.5h | **依赖**: Phase 1

### 重构内容
- 应用 `glass-surface-primary` 样式
- 高度 64px，sticky 定位
- 添加底部边框
- 右侧添加操作按钮（设置、最小化、关闭等）

---

## Task 03: 重构 Footer 为玻璃底栏

**工时**: 1h | **依赖**: Phase 1

### 重构内容
- 应用 `glass-white-8` + `blur-medium` 样式
- 高度 48px
- 显示任务统计（运行中、已完成、失败）
- 添加顶部边框

---

## Task 04: 实现 NavItem 导航项组件

**工时**: 1.5h | **依赖**: Task 01

### 功能
- 支持图标 + 文本
- Active 状态：蓝色光晕效果
- Hover 状态：轻微提升和增强光晕
- 路由集成（React Router）

### 组件接口
```tsx
interface NavItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  badge?: number; // 可选徽章（如任务数量）
}
```

---

## Task 05: 添加页面过渡动画

**工时**: 1.5h | **依赖**: Task 01-03

### 实现
- 创建 `PageTransition` 组件包裹 Outlet
- 淡入淡出 + 轻微位移（fade + slide）
- 使用 Framer Motion 或 CSS Transitions
- 过渡时长 300ms

---

## Task 06: 验证布局一致性和响应式

**工时**: 0.5h | **依赖**: Task 01-05

### 验证项
- [x] 不同窗口大小下布局正常
- [x] 最小窗口 1024x768 可用
- [x] Sidebar 不遮挡主内容
- [x] 所有路由跳转正常
- [x] 动画流畅 (60fps)
- [x] 玻璃效果正确显示
