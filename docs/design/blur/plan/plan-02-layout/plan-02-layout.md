# Phase 2: Layout - 布局组件重构

## 概述

**阶段目标**: 将应用的核心布局组件（Sidebar、Header、Footer）重构为玻璃风格，建立整体应用框架。

**预计工期**: 2-3 天

**优先级**: P0

## 范围

### 包含内容
- ✅ 重构 Sidebar 为玻璃侧边栏（240px 宽）
- ✅ 重构 Header 为玻璃顶栏（64px 高）
- ✅ 重构 Footer 为玻璃底栏（48px 高）
- ✅ 实现导航菜单项的玻璃效果和 Active 状态
- ✅ 添加页面过渡动画
- ✅ 优化布局响应式（虽然主要针对桌面端）

### 不包含内容
- ❌ 页面内容区域的重构（Phase 3）
- ❌ 具体业务组件的重构（Phase 4）

## 关键产出物

### 1. 玻璃布局组件
- `src/renderer/src/components/Layout/Sidebar.tsx` - 重构
- `src/renderer/src/components/Layout/Header.tsx` - 重构
- `src/renderer/src/components/Layout/Footer.tsx` - 重构
- `src/renderer/src/components/Layout/Layout.tsx` - 更新

### 2. 导航组件
- `src/renderer/src/components/Navigation/NavItem.tsx` - 新建
- `src/renderer/src/components/Navigation/NavGroup.tsx` - 新建（可选）

### 3. 页面过渡
- `src/renderer/src/components/PageTransition/PageTransition.tsx` - 新建

## 技术决策

### Sidebar 设计
- 固定宽度 240px，左侧显示
- 背景：`glass-surface-primary`（12% 白色，12px 模糊）
- 右侧边框：1px 白色 12% 透明度
- 阴影：`0 2px 16px rgba(0,0,0,0.12)`
- 导航项：玻璃按钮，Active 状态有蓝色光晕

### Header 设计
- 固定高度 64px，顶部显示
- 背景：`glass-surface-primary`
- 底部边框：1px 白色 8% 透明度
- Sticky 定位

### Footer 设计
- 固定高度 48px，底部显示
- 背景：`glass-white-8`（8% 白色，10px 模糊）
- 顶部边框：1px 白色 8% 透明度
- 显示任务统计信息

## 任务分解

详见 `tasks/` 目录：

1. **[Task 01](./tasks/task-01.md)**: 重构 Sidebar 为玻璃侧边栏
2. **[Task 02](./tasks/task-02.md)**: 重构 Header 为玻璃顶栏
3. **[Task 03](./tasks/task-03.md)**: 重构 Footer 为玻璃底栏
4. **[Task 04](./tasks/task-04.md)**: 实现 NavItem 导航项组件
5. **[Task 05](./tasks/task-05.md)**: 添加页面过渡动画
6. **[Task 06](./tasks/task-06.md)**: 验证布局一致性和响应式

## 时间估算

| 任务 | 预计工时 | 依赖 |
|------|---------|------|
| Task 01 | 2h | Phase 1 |
| Task 02 | 1.5h | Phase 1 |
| Task 03 | 1h | Phase 1 |
| Task 04 | 1.5h | Task 01 |
| Task 05 | 1.5h | Task 01-03 |
| Task 06 | 0.5h | Task 01-05 |
| **总计** | **8h (约 1 天)** | |

## 风险和挑战

### 技术风险
1. **布局错位**: 玻璃效果可能导致层级混乱
   - 缓解：严格使用 z-index 系统
2. **滚动性能**: 固定的 backdrop-filter 可能影响滚动流畅度
   - 缓解：使用 GPU 加速 + will-change

## 成功标准

- [x] Sidebar、Header、Footer 全部重构为玻璃风格
- [x] 导航项 Active 状态正确显示
- [x] 页面切换有流畅的过渡动画
- [x] 布局在不同窗口大小下正常显示
- [x] 所有功能保持正常（路由跳转、事件响应）
- [x] 性能不下降（60fps）

## 参考文档

- [设计文档 - Component Patterns](../../component-patterns.md)
- [设计文档 - Page Layouts](../../page-layouts.md)
- [Phase 1 - Foundation](../plan-01-foundation/plan-01-foundation.md)
