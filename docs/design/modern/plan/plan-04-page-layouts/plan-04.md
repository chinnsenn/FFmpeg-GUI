# Plan-04: Page Layouts（页面布局）

## 阶段概述

重构应用的所有页面,使用新的设计系统和重构后的组件,确保整体视觉一致性和用户体验。

## 目标

1. 重构 Layout（Sidebar、Header、Footer）
2. 重构 Dashboard 页面（统计卡片 + 快速操作 + 最近任务）
3. 重构 Convert 页面（文件上传 + 配置 + 操作按钮）
4. 重构 Compress 页面（文件上传 + 压缩配置）
5. 重构 Queue 页面（任务列表 + 筛选器 + 批量操作）
6. 重构 Settings 页面（配置表单 + 主题切换）

## 参考文档

- `docs/design/modern/demo/dashboard.html` - 首页布局和组件
- `docs/design/modern/demo/convert.html` - 转换页面布局
- `docs/design/modern/demo/compress.html` - 压缩页面布局
- `docs/design/modern/demo/queue.html` - 队列页面布局
- `docs/design/modern/demo/settings.html` - 设置页面布局
- `docs/design/modern/guide/pages-layout.md` - 页面布局规范

## 任务清单

| 任务 | 描述 | 预计时间 | 优先级 |
|------|------|----------|--------|
| Task 01 | 重构 Layout（Sidebar/Header/Footer） | 3-4 小时 | P0 |
| Task 02 | 重构 Dashboard 页面 | 3-4 小时 | P0 |
| Task 03 | 重构 Convert 页面 | 3-4 小时 | P0 |
| Task 04 | 重构 Compress 页面 | 2-3 小时 | P0 |
| Task 05 | 重构 Queue 页面 | 3-4 小时 | P0 |
| Task 06 | 重构 Settings 页面 | 2-3 小时 | P1 |

**总计预估时间**：16-22 小时（2-3 个工作日）

## 验收标准

### 1. Layout 组件

- [ ] Sidebar 固定宽度（240px）
- [ ] Sidebar 导航项高亮（active 状态）
- [ ] Sidebar 图标 + 文本布局
- [ ] Header 固定高度（64px）
- [ ] Header 包含页面标题和操作区
- [ ] 主内容区使用正确的内边距（24px）
- [ ] 响应式支持（移动端 Sidebar 可折叠）
- [ ] 与 HTML Demo 100% 一致

### 2. Dashboard 页面

- [ ] 4 个统计卡片（总任务、运行中、已完成、失败）
- [ ] 快速操作按钮（转换、压缩）
- [ ] 最近任务列表（最多 5 条）
- [ ] 空状态提示（无任务时）
- [ ] 卡片 hover 效果
- [ ] 数据实时更新

### 3. Convert 页面

- [ ] 3 列布局（文件上传 | 配置 | 预览）
- [ ] FileUploader 组件集成
- [ ] FileList 组件集成
- [ ] ConvertConfig 组件集成
- [ ] 开始转换按钮（底部固定）
- [ ] 表单验证
- [ ] 批量转换支持

### 4. Compress 页面

- [ ] 2 列布局（文件 + 配置 | 预览）
- [ ] FileUploader 组件集成
- [ ] CompressConfig 组件集成
- [ ] 实时预估显示
- [ ] 开始压缩按钮
- [ ] 表单验证

### 5. Queue 页面

- [ ] 队列状态栏（总任务、进行中、待处理）
- [ ] 筛选器（全部、进行中、已完成、失败）
- [ ] 任务列表（使用 TaskCard）
- [ ] 批量操作（全部暂停、全部取消）
- [ ] 空状态提示
- [ ] 虚拟滚动（如果任务很多）

### 6. Settings 页面

- [ ] FFmpeg 配置区
- [ ] 主题选择（浅色/深色/系统）
- [ ] 任务设置（并发数、输出目录）
- [ ] 文件设置（保留原文件、覆盖检测）
- [ ] 保存按钮
- [ ] 表单验证
- [ ] 实时主题切换预览

## 测试步骤

### 1. 视觉回归测试

对比 HTML Demo 和实际页面,确保 100% 一致。

### 2. 响应式测试

```tsx
// 测试不同屏幕尺寸
describe('Layout responsive', () => {
  it('should show sidebar on desktop', () => {
    window.innerWidth = 1024;
    render(<Layout />);
    expect(screen.getByTestId('sidebar')).toBeVisible();
  });

  it('should hide sidebar on mobile', () => {
    window.innerWidth = 375;
    render(<Layout />);
    expect(screen.getByTestId('sidebar')).not.toBeVisible();
  });
});
```

### 3. 集成测试

```tsx
describe('Convert page', () => {
  it('should handle complete workflow', async () => {
    render(<ConvertPage />);

    // 上传文件
    const file = new File(['content'], 'test.mp4', { type: 'video/mp4' });
    // ... 上传逻辑

    // 配置转换选项
    fireEvent.change(screen.getByLabelText('输出格式'), { target: { value: 'webm' } });

    // 点击开始转换
    fireEvent.click(screen.getByText('开始转换'));

    // 验证任务创建
    await waitFor(() => {
      expect(screen.getByText('任务已创建')).toBeInTheDocument();
    });
  });
});
```

## 输出产物

### 1. 布局组件

```
src/renderer/src/components/layout/
├── Layout.tsx                 # 主布局
├── Sidebar.tsx                # 侧边栏
├── Header.tsx                 # 顶部栏
└── Footer.tsx                 # 底部栏（可选）
```

### 2. 页面组件

```
src/renderer/src/pages/
├── Dashboard.tsx              # 首页
├── Convert.tsx                # 转换页面
├── Compress.tsx               # 压缩页面
├── Queue.tsx                  # 队列页面
└── Settings.tsx               # 设置页面
```

### 3. 路由配置

```typescript
// src/renderer/src/router/index.tsx
export const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'convert', element: <Convert /> },
      { path: 'compress', element: <Compress /> },
      { path: 'queue', element: <Queue /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
]);
```

## 依赖

- Plan-02 完成（核心组件）
- Plan-03 完成（业务组件）

## 注意事项

### 1. 布局一致性

所有页面应使用相同的布局结构:

```tsx
<Layout>
  <Header />
  <div className="flex">
    <Sidebar />
    <main className="flex-1 p-6">
      {/* 页面内容 */}
    </main>
  </div>
</Layout>
```

### 2. 页面状态管理

使用 Context 或 Zustand 管理全局状态:

```tsx
// src/renderer/src/store/useTaskStore.ts
export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
  })),
}));
```

### 3. 路由和导航

确保 React Router 使用 HashRouter (Electron 要求):

```tsx
import { createHashRouter } from 'react-router-dom';
```

## 下一步

完成 Plan-04 后,进入 **Plan-05: Animations**（动画与交互）,完善所有动画效果。

---

**创建时间**：2025-10-04
**预计完成时间**：2025-10-11
**依赖**：Plan-02、Plan-03 完成
**负责人**：fullstack-engineer
