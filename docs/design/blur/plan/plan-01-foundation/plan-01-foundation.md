# Phase 1: Foundation - 基础设施搭建

## 概述

**阶段目标**: 建立 Glassmorphism 设计系统的技术基础，包括配置 Tailwind CSS 扩展、安装 glasscn-ui 库、创建 CSS 自定义属性、构建基础玻璃组件库。

**预计工期**: 3-4 天

**优先级**: P0（最高优先级，后续阶段的基础）

## 范围

### 包含内容
- ✅ 安装和配置 glasscn-ui 库
- ✅ 扩展 Tailwind CSS 配置（添加玻璃效果相关的 utilities）
- ✅ 创建 CSS 自定义属性（design tokens）
- ✅ 构建基础玻璃组件（GlassCard、GlassButton、GlassInput、GlassProgressBar）
- ✅ 创建背景渐变系统
- ✅ 设置动画系统基础

### 不包含内容
- ❌ 实际页面或布局组件的重构
- ❌ 业务逻辑修改
- ❌ 路由改动

## 关键产出物

### 1. Tailwind 配置扩展
- `tailwind.config.ts` 或 `app.config.ts`（Tailwind v4）
- 自定义 backdrop-blur 级别
- 玻璃背景颜色 tokens
- 自定义阴影和边框

### 2. CSS Design Tokens
- `src/renderer/src/styles/design-tokens.css`
- 颜色变量
- 模糊效果变量
- 间距、圆角、阴影变量
- 动画时长和 easing 曲线

### 3. 基础玻璃组件
- `src/renderer/src/components/ui/glass/glass-card.tsx`
- `src/renderer/src/components/ui/glass/glass-button.tsx`
- `src/renderer/src/components/ui/glass/glass-input.tsx`
- `src/renderer/src/components/ui/glass/glass-progress.tsx`
- `src/renderer/src/components/ui/glass/glass-badge.tsx`

### 4. 背景渐变组件
- `src/renderer/src/components/Background/GlassBackground.tsx`

### 5. 工具函数
- `src/renderer/src/lib/glass-utils.ts` - 玻璃效果相关的工具函数

## 技术决策

### Tailwind CSS v4 配置策略
- 使用 `@import` 语法在 CSS 文件中配置（Tailwind v4 新方式）
- 自定义 utilities 使用 `@utility` 指令
- 设计 tokens 使用 CSS 自定义属性

### glasscn-ui 集成方式
- 使用 `shadcn@canary` CLI 安装 glasscn-ui 组件
- 组件存放在 `src/renderer/src/components/ui/glass/` 目录
- 与现有 shadcn/ui 组件并存，逐步替换

### 组件架构
- 采用复合组件模式（Compound Component Pattern）
- 支持 variants 变体（primary、secondary、tertiary 等）
- 支持 states 状态变体（running、completed、failed、paused）
- 完全类型安全（TypeScript）

## 依赖关系

### 前置依赖
- ✅ 当前项目已安装 Tailwind CSS v4
- ✅ 当前项目已安装 shadcn/ui 基础设施
- ✅ React 18 + TypeScript 环境就绪

### 后续依赖
- Phase 2 依赖本阶段的 GlassCard、GlassButton 等基础组件
- Phase 3 依赖本阶段的 Design Tokens
- Phase 4 依赖本阶段的所有基础设施

## 风险和挑战

### 技术风险
1. **Tailwind v4 配置兼容性**
   - 风险: Tailwind v4 配置方式与 v3 有较大差异
   - 缓解: 参考 Tailwind v4 官方文档，使用 `@import` + CSS 变量方式

2. **glasscn-ui 库稳定性**
   - 风险: glasscn-ui 是相对较新的库，可能存在 bug
   - 缓解: 先安装少量组件测试，必要时手动实现玻璃效果

3. **backdrop-filter 性能问题**
   - 风险: 大量使用 backdrop-filter 可能导致性能下降
   - 缓解: 遵循设计文档中的性能优化策略（限制模糊范围、GPU 加速）

### 其他风险
1. **破坏现有功能**
   - 风险: 修改全局样式可能影响现有组件
   - 缓解: 使用独立的 glass 命名空间，不影响现有组件

## 成功标准

### 必须满足
- [x] glasscn-ui 库成功安装并能使用
- [x] Tailwind 配置包含所有设计文档中定义的 glass utilities
- [x] CSS Design Tokens 文件创建完成，包含所有颜色、模糊、动画变量
- [x] 至少 5 个基础玻璃组件实现完成（Card、Button、Input、Progress、Badge）
- [x] GlassBackground 组件实现完成，能显示设计文档中的深蓝色渐变
- [x] 所有组件通过 TypeScript 类型检查
- [x] 至少创建一个使用新组件的示例页面（Demo Page）

### 希望达到
- [x] 创建 Storybook 或独立的 Component Gallery 页面
- [x] 编写组件使用文档
- [x] 性能测试通过（60fps 动画）

### 验收测试
- [x] `npm run type-check` 通过
- [x] `npm run dev` 成功启动，Demo 页面正常显示
- [x] 玻璃组件在深色背景下显示正确的透明度和模糊效果
- [x] 组件 hover、focus 状态正常工作

## 任务分解

详见 `tasks/` 目录下的任务文档：

1. **[Task 01](./tasks/task-01.md)**: 安装 glasscn-ui 库
2. **[Task 02](./tasks/task-02.md)**: 配置 Tailwind CSS 玻璃效果 utilities
3. **[Task 03](./tasks/task-03.md)**: 创建 CSS Design Tokens
4. **[Task 04](./tasks/task-04.md)**: 实现 GlassBackground 背景组件
5. **[Task 05](./tasks/task-05.md)**: 实现 GlassCard 组件
6. **[Task 06](./tasks/task-06.md)**: 实现 GlassButton 组件
7. **[Task 07](./tasks/task-07.md)**: 实现 GlassInput 和 GlassProgressBar 组件
8. **[Task 08](./tasks/task-08.md)**: 创建 Component Demo 页面

## 时间估算

| 任务 | 预计工时 | 依赖 |
|------|---------|------|
| Task 01 | 0.5h | 无 |
| Task 02 | 1h | Task 01 |
| Task 03 | 1h | 无 |
| Task 04 | 1.5h | Task 02, Task 03 |
| Task 05 | 2h | Task 02, Task 03 |
| Task 06 | 1.5h | Task 02, Task 03 |
| Task 07 | 2h | Task 02, Task 03 |
| Task 08 | 1.5h | Task 04-07 |
| **总计** | **11h (约 1.5 天)** | |

*预留 1.5-2 天 buffer 用于调试和优化*

## 参考文档

- [设计规范总览](../SUMMARY.md)
- [Design Tokens](../design-tokens.md)
- [Component Patterns](../component-patterns.md)
- [Implementation Guide](../implementation-guide.md)
- [glasscn-ui 官网](https://www.glasscn.dev/)
- [Tailwind CSS v4 文档](https://tailwindcss.com/docs)
