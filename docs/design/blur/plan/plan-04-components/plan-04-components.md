# Phase 4: Components - 业务组件重构

## 概述

**阶段目标**: 将所有业务组件（TaskCard、FileList、MediaInfo、Config 组件等）重构为玻璃风格，确保应用级别的视觉一致性。

**预计工期**: 4-5 天

**优先级**: P1

## 范围

### 包含内容
- ✅ TaskCard 组件重构（任务卡片，支持实时进度）
- ✅ FileList 组件重构（文件列表显示）
- ✅ FileUploader 组件重构（拖放上传区域）
- ✅ MediaInfo 组件重构（媒体信息展示）
- ✅ ConvertConfig 组件重构（转换配置表单）
- ✅ CompressConfig 组件重构（压缩配置表单）
- ✅ FFmpegSetup 组件重构（FFmpeg 设置向导）

### 不包含内容
- ❌ 性能优化和无障碍审计（Phase 5）
- ❌ 文档编写（Phase 5）

## 关键产出物

### 重构组件
1. `src/renderer/src/components/TaskCard/TaskCard.tsx`
2. `src/renderer/src/components/FileList/FileList.tsx`
3. `src/renderer/src/components/FileUploader/FileUploader.tsx`
4. `src/renderer/src/components/MediaInfo/MediaInfo.tsx`
5. `src/renderer/src/components/ConvertConfig/ConvertConfig.tsx`
6. `src/renderer/src/components/CompressConfig/CompressConfig.tsx`
7. `src/renderer/src/components/FFmpegSetup/FFmpegSetup.tsx`

## 技术决策

### TaskCard 组件设计
- **基础**: `GlassCard` + 状态变体
- **状态颜色**:
  - Running: 蓝色边框 + 蓝色光晕
  - Completed: 绿色边框
  - Failed: 红色边框
  - Paused: 琥珀色边框
- **进度条**: 使用 `GlassProgressBar` + shimmer 动画
- **实时数据**: 速度、ETA、FPS 等信息突出显示

### FileUploader 组件设计
- **拖放区域**: 大玻璃面板，虚线边框
- **Drag Over 状态**: 边框高亮 + 背景亮度增加
- **图标**: 上传图标 + 提示文字
- **功能**: 保持原有的 react-dropzone 功能

### Config 组件设计
- **表单容器**: `GlassCard`
- **输入框**: `GlassInput`
- **下拉选择**: 玻璃风格的 Select（基于 shadcn/ui）
- **预设按钮**: `GlassButton` 小尺寸

## 任务分解

1. **[Task 01](./tasks/task-01.md)**: 重构 TaskCard 组件
2. **[Task 02](./tasks/task-02.md)**: 重构 FileList 组件
3. **[Task 03](./tasks/task-03.md)**: 重构 FileUploader 组件
4. **[Task 04](./tasks/task-04.md)**: 重构 MediaInfo 组件
5. **[Task 05](./tasks/task-05.md)**: 重构 ConvertConfig 组件
6. **[Task 06](./tasks/task-06.md)**: 重构 CompressConfig 组件
7. **[Task 07](./tasks/task-07.md)**: 重构 FFmpegSetup 组件
8. **[Task 08](./tasks/task-08.md)**: 验证所有组件功能和交互

## 时间估算

| 任务 | 预计工时 | 依赖 |
|------|---------|------|
| Task 01 | 3h | Phase 3 |
| Task 02 | 1.5h | Phase 3 |
| Task 03 | 2h | Phase 3 |
| Task 04 | 1.5h | Phase 3 |
| Task 05 | 2h | Phase 3 |
| Task 06 | 2h | Phase 3 |
| Task 07 | 1.5h | Phase 3 |
| Task 08 | 1.5h | Task 01-07 |
| **总计** | **15h (约 2 天)** | |

## 风险和挑战

### 组件交互风险
1. **FileUploader 拖放功能**: 玻璃效果可能影响拖放事件
   - 缓解: 保持事件处理逻辑不变，只修改视觉层
   - 测试: 多次测试拖放和点击选择
2. **TaskCard 实时更新**: 频繁的进度更新可能导致重渲染性能问题
   - 缓解: 使用 React.memo 和 useMemo 优化
   - 限流: 进度更新限制为每 100ms 一次

### UI/UX 风险
1. **表单可读性**: 玻璃输入框在某些背景下可能难以识别
   - 缓解: 使用足够的边框对比度（12% 白色边框）
   - Focus 状态: 蓝色边框 + 4px 外发光
2. **任务卡片信息密度**: 实时数据（速度、FPS、ETA）可能过于密集
   - 缓解: 使用图标 + 缩写，合理分组信息

## 成功标准

### 必须满足
- [x] 所有 7 个业务组件完成玻璃风格重构
- [x] 每个组件的核心功能正常（文件上传、任务显示、配置提交等）
- [x] TaskCard 实时进度更新流畅（无闪烁、卡顿）
- [x] FileUploader 拖放功能正常
- [x] 所有表单输入、下拉选择正常工作
- [x] `npm run type-check` 通过
- [x] `npm test` 相关测试通过

### 希望达到
- [x] 组件重渲染性能优化（使用 React.memo）
- [x] 动画流畅（hover、focus、状态切换）
- [x] Empty State 优化（文件列表为空、无任务等）

### 验收测试
- [x] **TaskCard**: 任务状态变化时颜色正确切换，进度条流畅更新
- [x] **FileList**: 显示文件列表，支持删除文件
- [x] **FileUploader**: 拖放文件和点击选择都正常工作
- [x] **MediaInfo**: 正确显示媒体文件信息（编码、分辨率、比特率等）
- [x] **ConvertConfig**: 格式选择、编码配置、预设选择正常
- [x] **CompressConfig**: 压缩模式选择、参数配置正常
- [x] **FFmpegSetup**: 初次设置向导流程完整

## 组件设计细节

### TaskCard 组件结构
```tsx
<GlassCard variant="secondary" state="running" hoverable>
  <div className="flex items-center justify-between">
    <div>
      <h3>input.mp4 → output.mp4</h3>
      <p>格式转换: H.264 → H.265</p>
    </div>
    <button>取消</button>
  </div>

  <GlassProgressBar value={75} showLabel />

  <div className="grid grid-cols-4 gap-4 mt-4">
    <div><Icon /> 速度: 1.5x</div>
    <div><Icon /> FPS: 30</div>
    <div><Icon /> 剩余时间: 2m 30s</div>
    <div><Icon /> 大小: 128 MB</div>
  </div>
</GlassCard>
```

### FileUploader 组件结构
```tsx
<div className="glass-surface-tertiary rounded-xl border-2 border-dashed border-glass-border-primary hover:border-primary transition-colors">
  <input {...dropzone.getInputProps()} />
  <div className="text-center py-12">
    <UploadIcon />
    <p>拖放文件到这里，或点击选择</p>
    <p className="text-sm text-text-tertiary">支持 MP4, AVI, MOV 等格式</p>
  </div>
</div>
```

### ConvertConfig 组件结构
```tsx
<GlassCard>
  <h3>转换配置</h3>

  <div className="space-y-4">
    <div>
      <label>输出格式</label>
      <Select>
        <option>MP4</option>
        <option>AVI</option>
      </Select>
    </div>

    <div>
      <label>视频编码</label>
      <Select>
        <option>H.264</option>
        <option>H.265</option>
      </Select>
    </div>

    <div>
      <label>比特率</label>
      <GlassInput type="number" placeholder="8000" />
    </div>

    <div>
      <label>预设</label>
      <div className="flex gap-2">
        <GlassButton size="sm">高质量</GlassButton>
        <GlassButton size="sm">标准</GlassButton>
        <GlassButton size="sm">快速</GlassButton>
      </div>
    </div>
  </div>
</GlassCard>
```

## 参考文档

- [设计文档 - Component Patterns](../../component-patterns.md)
- [设计文档 - Animation Interactions](../../animation-interactions.md)
- [Phase 1 - Foundation](../plan-01-foundation/plan-01-foundation.md)
- [Phase 3 - Pages](../plan-03-pages/plan-03-pages.md)
