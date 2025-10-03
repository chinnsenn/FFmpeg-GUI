# Phase 4 Tasks: 业务组件重构任务清单

## Task 01: 重构 TaskCard 组件

**工时**: 3h | **依赖**: Phase 3

### 重构要点
1. **基础**: 使用 `GlassCard` + 状态变体（running/completed/failed/paused）
2. **进度条**: `GlassProgressBar` + shimmer 动画
3. **实时数据**: 速度、FPS、ETA、文件大小等信息
4. **操作按钮**: 取消、暂停/恢复、重试（根据状态显示）

### 状态颜色映射
```tsx
const stateStyles = {
  running: 'border-primary shadow-[0_0_20px_rgba(59,130,246,0.3)]',
  completed: 'border-success',
  failed: 'border-error',
  paused: 'border-warning',
};
```

---

## Task 02: 重构 FileList 组件

**工时**: 1.5h | **依赖**: Phase 3

### 重构要点
1. **列表容器**: 使用 `GlassCard`
2. **列表项**: 每个文件一行，包含图标、文件名、大小、删除按钮
3. **Empty State**: 无文件时的友好提示

---

## Task 03: 重构 FileUploader 组件

**工时**: 2h | **依赖**: Phase 3

### 重构要点
1. **拖放区域**: 大玻璃面板，虚线边框
2. **Drag Over 状态**: 边框高亮 + 背景亮度增加
3. **功能测试**: 确保拖放和点击选择都正常

### 关键实现
```tsx
<div
  {...getRootProps()}
  className={cn(
    'glass-surface-tertiary rounded-xl border-2 border-dashed',
    'border-glass-border-primary hover:border-primary',
    'transition-all duration-200',
    isDragActive && 'border-primary bg-glass-white-15'
  )}
>
  <input {...getInputProps()} />
  <div className="text-center py-12">
    <UploadIcon className="mx-auto h-12 w-12 text-text-secondary" />
    <p className="mt-4 text-text-primary">拖放文件到这里</p>
    <p className="text-sm text-text-tertiary">或点击选择文件</p>
  </div>
</div>
```

---

## Task 04: 重构 MediaInfo 组件

**工时**: 1.5h | **依赖**: Phase 3

### 重构要点
1. **信息面板**: 使用 `GlassCard`
2. **信息项**: 图标 + 标签 + 值（编码、分辨率、比特率、时长等）
3. **布局**: 2 列网格或单列堆叠

---

## Task 05: 重构 ConvertConfig 组件

**工时**: 2h | **依赖**: Phase 3

### 重构要点
1. **配置容器**: `GlassCard`
2. **表单输入**: `GlassInput` 和玻璃风格的 Select
3. **预设按钮**: `GlassButton` 小尺寸按钮组
4. **分组**: 输出格式、视频配置、音频配置

### 表单验证
- Focus 状态清晰（蓝色边框）
- Error 状态明显（红色边框 + 错误提示）

---

## Task 06: 重构 CompressConfig 组件

**工时**: 2h | **依赖**: Phase 3

### 重构要点
1. **压缩模式选择**: 单选按钮组（质量优先/大小优先/自定义）
2. **参数配置**: CRF 滑块、Preset 下拉、目标大小输入
3. **预估面板**: 显示压缩后大小、节省空间百分比

### 预估面板设计
```tsx
<GlassCard className="bg-glass-white-10">
  <h4>压缩预估</h4>
  <div className="grid grid-cols-3 gap-4">
    <StatCard label="原始大小" value="256 MB" />
    <StatCard label="压缩后" value="128 MB" />
    <StatCard label="节省空间" value="50%" trend="down" />
  </div>
</GlassCard>
```

---

## Task 07: 重构 FFmpegSetup 组件

**工时**: 1.5h | **依赖**: Phase 3

### 重构要点
1. **设置向导**: 使用 `GlassCard` 作为容器
2. **步骤指示器**: 玻璃风格的 Stepper
3. **路径选择**: `GlassInput` + 文件选择按钮
4. **下载进度**: `GlassProgressBar`

---

## Task 08: 验证所有组件功能

**工时**: 1.5h | **依赖**: Task 01-07

### 验证清单
- [x] TaskCard: 状态变化正确，进度更新流畅
- [x] FileList: 文件列表显示和删除功能正常
- [x] FileUploader: 拖放和点击选择正常
- [x] MediaInfo: 媒体信息正确显示
- [x] ConvertConfig: 所有配置项可用，表单验证正常
- [x] CompressConfig: 压缩模式选择和预估正常
- [x] FFmpegSetup: 初次设置流程完整
- [x] 所有组件玻璃效果正确
- [x] 交互动画流畅
- [x] TypeScript 类型检查通过
- [x] 性能测试通过（无明显卡顿）
