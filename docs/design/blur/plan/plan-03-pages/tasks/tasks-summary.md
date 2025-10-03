# Phase 3 Tasks: 页面重构任务清单

## Task 01: 重构 Home 页面

**工时**: 2h | **依赖**: Phase 2

### 重构要点
1. **Hero Section**: 大玻璃面板，包含标题、描述、CTA 按钮
2. **功能卡片网格**: 3-4 列，使用 `FeatureCard` 组件
3. **统计卡片**: 3 列，显示任务统计（总数、成功率等）

### 组件结构
- 使用 `GlassCard` 作为基础
- 功能卡片支持 hover 提升效果
- 点击跳转到对应功能页面

---

## Task 02: 重构 Convert 页面

**工时**: 3h | **依赖**: Phase 2

### 重构要点
1. **左栏**: 文件选择（Dropzone）+ 文件列表 + 媒体信息预览
2. **右栏**: 格式选择 + 编码配置 + 预设选择 + 操作按钮
3. **双栏布局**: flex 或 grid，间距 24px

### 关键改动
- FileUploader 组件玻璃化（保持拖放功能）
- ConvertConfig 组件使用玻璃输入框
- 操作按钮使用 `GlassButton`

---

## Task 03: 重构 Compress 页面

**工时**: 3h | **依赖**: Phase 2

### 重构要点
1. **左栏**: 文件选择 + 原始文件信息
2. **右栏**: 压缩模式选择 + 参数配置 + 压缩预估
3. **预估面板**: 显示压缩后大小、节省空间百分比

### 关键改动
- CompressConfig 组件玻璃化
- 压缩预估使用 `StatCard` 或 `GlassCard`

---

## Task 04: 重构 Queue 页面

**工时**: 3h | **依赖**: Phase 2

### 重构要点
1. **筛选标签**: All / Running / Pending / Completed / Failed
2. **任务卡片列表**: 使用 `TaskCard` 组件（Phase 4 重构）
3. **Empty State**: 无任务时的友好提示

### 关键改动
- 筛选标签使用玻璃按钮组
- 任务卡片根据状态显示不同的玻璃颜色（蓝/绿/红/黄）
- 添加 staggered animation（列表项逐个淡入）

---

## Task 05: 重构 Settings 页面

**工时**: 2h | **依赖**: Phase 2

### 重构要点
1. **分组配置**: FFmpeg 路径、性能、输出、外观
2. **表单输入**: 使用 `GlassInput` 组件
3. **保存/重置按钮**: 使用 `GlassButton`

### 关键改动
- 表单容器使用 `GlassCard`
- 每个配置分组一个卡片
- 输入框 focus 状态清晰可见

---

## Task 06: 创建页面专用组件

**工时**: 2h | **依赖**: Task 01

### 组件列表
1. **Hero.tsx**: Home 页面英雄区，大玻璃面板 + 渐变文字
2. **FeatureCard.tsx**: 功能卡片，图标 + 标题 + 描述 + 链接
3. **StatCard.tsx**: 统计卡片，数字 + 标签 + 趋势指示器

### 组件特性
- 基于 `GlassCard` 扩展
- 支持 hover 动画
- 完全类型安全

---

## Task 07: 验证所有页面功能

**工时**: 1h | **依赖**: Task 01-06

### 验证清单
- [x] Home: 功能卡片跳转正确
- [x] Convert: 文件选择 → 配置 → 提交任务 流程完整
- [x] Compress: 文件选择 → 压缩模式 → 提交任务 流程完整
- [x] Queue: 任务列表显示、筛选、状态更新正常
- [x] Settings: 配置修改和保存正常
- [x] 所有页面玻璃效果正确显示
- [x] 交互动画流畅
- [x] TypeScript 类型检查通过
- [x] 单元测试通过（如有）
