# Plan-03: Business Components（业务组件）

## 阶段概述

重构应用特定的复杂业务组件，这些组件组合了核心 UI 组件并包含业务逻辑，是构建应用页面的核心部分。

## 目标

1. 重构 TaskCard 组件（6 种状态 + 状态动画）
2. 重构 FileUploader 组件（拖放 + 3 种拖放状态）
3. 重构 FileList 组件（展开/折叠 + MediaInfo）
4. 重构 MediaInfo 组件（网格布局 + 丰富信息展示）
5. 重构 ConvertConfig 组件（表单布局 + 预设系统）
6. 重构 CompressConfig 组件（CRF 滑块 + 实时估算）

## 参考文档

- `docs/design/modern/demo/component-taskcard.html` - 任务卡片 6 种状态
- `docs/design/modern/demo/component-filelist.html` - 文件列表和上传
- `docs/design/modern/demo/component-mediainfo.html` - 媒体信息展示
- `docs/design/modern/demo/convert.html` - 转换配置表单
- `docs/design/modern/demo/compress.html` - 压缩配置表单
- `docs/design/modern/guide/components-specification.md` - 业务组件规范
- `docs/design/modern/guide/interaction-patterns.md` - 交互模式

## 任务清单

| 任务 | 描述 | 预计时间 | 优先级 |
|------|------|----------|--------|
| Task 01 | 重构 TaskCard 组件（6 状态 + 动画） | 3-4 小时 | P0 |
| Task 02 | 重构 FileUploader 组件（拖放 3 状态） | 3-4 小时 | P0 |
| Task 03 | 重构 FileList 组件（展开/折叠） | 2-3 小时 | P0 |
| Task 04 | 重构 MediaInfo 组件（网格布局） | 2-3 小时 | P1 |
| Task 05 | 重构 ConvertConfig 组件（表单布局） | 3-4 小时 | P0 |
| Task 06 | 重构 CompressConfig 组件（CRF 滑块） | 3-4 小时 | P0 |

**总计预估时间**：16-22 小时（2-3 个工作日）

## 验收标准

### 1. TaskCard 组件

- [ ] 6 种状态完整实现（pending、running、paused、completed、failed、cancelled）
- [ ] 每种状态有独特的视觉标识（颜色、图标、边框）
- [ ] 状态动画流畅
  - Running: 旋转加载器 + shimmer 进度条
  - Completed: scale-in 动画（200ms）
  - Failed: shake 动画（400ms）
  - Cancelled: fade-out 动画
- [ ] 操作按钮根据状态显示（暂停/恢复/取消/重试/删除）
- [ ] 显示实时进度信息（百分比、速度、ETA、FPS）
- [ ] 支持长文件名截断（tooltip 显示完整路径）
- [ ] 与 HTML Demo 100% 一致

### 2. FileUploader 组件

- [ ] 3 种拖放状态视觉正确
  - 默认状态：虚线边框 + 上传图标
  - hover 状态：边框高亮
  - 拖放中状态：背景高亮 + 边框实线
- [ ] 支持点击选择文件
- [ ] 支持拖放上传
- [ ] 支持多文件选择
- [ ] 支持文件类型过滤（视频文件）
- [ ] 上传后触发回调
- [ ] 显示友好的提示文本
- [ ] 无障碍支持（键盘可访问）

### 3. FileList 组件

- [ ] 文件列表展示（文件名、大小、时长、格式）
- [ ] 展开/折叠功能（查看详细 MediaInfo）
- [ ] 展开动画流畅（高度过渡，300ms）
- [ ] 删除按钮（带确认）
- [ ] 空状态提示
- [ ] 支持大量文件（虚拟滚动，可选）
- [ ] 与 FileUploader 集成

### 4. MediaInfo 组件

- [ ] 网格布局（2 列或 3 列）
- [ ] 显示完整媒体信息
  - 视频：编码器、分辨率、帧率、比特率
  - 音频：编码器、采样率、声道、比特率
  - 其他：时长、文件大小、格式
- [ ] 使用 monospace 字体显示技术数据
- [ ] 标签和值对齐
- [ ] 支持纯音频文件（不显示视频信息）
- [ ] 数据格式化（formatBitrate、formatDuration）

### 5. ConvertConfig 组件

- [ ] 输出格式选择（Select）
- [ ] 快速预设按钮（高质量、平衡、快速、自定义）
- [ ] 高级设置折叠面板
  - 视频编码器选择
  - 分辨率选择
  - 帧率选择
  - 视频比特率输入
  - 音频编码器选择
  - 音频比特率选择
- [ ] 表单验证
- [ ] 预设选择后自动填充配置
- [ ] 与现有 ConvertOptions 类型兼容

### 6. CompressConfig 组件

- [ ] 压缩模式选择（Radio）
  - CRF 模式（质量优先）
  - 目标大小模式
  - 比特率模式
- [ ] CRF 滑块（0-51，推荐 23）
- [ ] 实时显示估算值
  - 预估文件大小
  - 预估比特率
  - 质量等级（低/中/高）
- [ ] 预设按钮（节省空间、平衡、高质量）
- [ ] 编码速度预设（ultrafast、fast、medium、slow）
- [ ] 表单验证
- [ ] 与现有 CompressOptions 类型兼容

## 测试步骤

### 1. 视觉回归测试

创建测试页面展示所有组件的所有状态：

```tsx
// src/renderer/src/pages/__tests__/BusinessComponentsShowcase.tsx
export function BusinessComponentsShowcase() {
  return (
    <div className="p-8 space-y-8">
      <section>
        <h2 className="text-h2 mb-4">TaskCard - All States</h2>
        <div className="space-y-4">
          <TaskCard task={{ status: 'pending', ... }} />
          <TaskCard task={{ status: 'running', ... }} />
          <TaskCard task={{ status: 'paused', ... }} />
          <TaskCard task={{ status: 'completed', ... }} />
          <TaskCard task={{ status: 'failed', ... }} />
          <TaskCard task={{ status: 'cancelled', ... }} />
        </div>
      </section>

      {/* 其他组件 */}
    </div>
  );
}
```

### 2. 交互测试

```tsx
describe('FileUploader', () => {
  it('should handle drag and drop', async () => {
    const handleUpload = vi.fn();
    render(<FileUploader onUpload={handleUpload} />);

    const file = new File(['content'], 'test.mp4', { type: 'video/mp4' });
    const dropZone = screen.getByTestId('file-uploader');

    fireEvent.drop(dropZone, {
      dataTransfer: { files: [file] },
    });

    await waitFor(() => {
      expect(handleUpload).toHaveBeenCalledWith([file]);
    });
  });
});
```

### 3. 集成测试

测试组件间的交互：

```tsx
describe('FileUploader + FileList integration', () => {
  it('should add files to list after upload', async () => {
    render(
      <>
        <FileUploader onUpload={(files) => addFiles(files)} />
        <FileList files={files} onRemove={removeFile} />
      </>
    );

    // 上传文件
    const file = new File(['content'], 'test.mp4', { type: 'video/mp4' });
    // ... 上传逻辑

    // 验证文件出现在列表中
    await waitFor(() => {
      expect(screen.getByText('test.mp4')).toBeInTheDocument();
    });
  });
});
```

### 4. 深色主题测试

所有业务组件在深色模式下应保持正确的对比度和视觉效果。

## 输出产物

### 1. 组件文件

```
src/renderer/src/components/business/
├── TaskCard.tsx               # 任务卡片
├── FileUploader.tsx           # 文件上传器
├── FileList.tsx               # 文件列表
├── MediaInfo.tsx              # 媒体信息
├── ConvertConfig.tsx          # 转换配置
└── CompressConfig.tsx         # 压缩配置
```

### 2. 测试文件

```
src/renderer/src/components/business/__tests__/
├── TaskCard.test.tsx
├── FileUploader.test.tsx
├── FileList.test.tsx
├── MediaInfo.test.tsx
├── ConvertConfig.test.tsx
└── CompressConfig.test.tsx
```

### 3. 类型定义（如果需要扩展）

```typescript
// src/renderer/src/components/business/types.ts
export interface FileWithMetadata extends File {
  id: string;
  mediaInfo?: MediaFileInfo;
}

export interface TaskCardProps {
  task: Task;
  onPause?: (taskId: string) => void;
  onResume?: (taskId: string) => void;
  onCancel?: (taskId: string) => void;
  onRetry?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
}

// ... 其他类型定义
```

## 依赖安装

```bash
# 核心依赖（已存在）
npm install react react-dom

# 拖放功能
npm install react-dropzone

# 日期/时间工具（如果需要格式化 ETA）
npm install date-fns

# 测试工具（已存在）
npm install -D @testing-library/react @testing-library/user-event
```

## 注意事项

### 1. 组件复用和组合

业务组件应该组合使用核心 UI 组件：

```tsx
// ✅ 好的做法：组合核心组件
function TaskCard({ task }: TaskCardProps) {
  return (
    <Card shadow="sm" hover="lift">
      <CardHeader>
        <CardTitle>{task.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <ProgressBar value={task.progress} shimmer />
      </CardContent>
      <CardFooter>
        <Button onClick={onPause}>暂停</Button>
      </CardFooter>
    </Card>
  );
}

// ❌ 不好的做法：从头实现
function TaskCard({ task }: TaskCardProps) {
  return (
    <div className="p-6 rounded-lg shadow-sm">
      {/* 重新实现所有样式 */}
    </div>
  );
}
```

### 2. 业务逻辑分离

复杂的业务逻辑应该提取到自定义 Hook：

```tsx
// src/renderer/src/hooks/useTaskActions.ts
export function useTaskActions() {
  const pauseTask = useCallback((taskId: string) => {
    window.electronAPI.task.pause(taskId);
  }, []);

  const resumeTask = useCallback((taskId: string) => {
    window.electronAPI.task.resume(taskId);
  }, []);

  // ... 其他操作

  return { pauseTask, resumeTask, /* ... */ };
}

// 在组件中使用
function TaskCard({ task }: TaskCardProps) {
  const { pauseTask, resumeTask } = useTaskActions();

  return (
    <Card>
      {/* ... */}
      <Button onClick={() => pauseTask(task.id)}>暂停</Button>
    </Card>
  );
}
```

### 3. 状态管理

对于复杂的表单组件，使用 React Hook Form：

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const convertSchema = z.object({
  format: z.string(),
  videoCodec: z.string(),
  videoBitrate: z.number().min(100).max(50000),
  // ... 其他字段
});

function ConvertConfig() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(convertSchema),
  });

  const onSubmit = (data) => {
    // 处理表单提交
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* 表单字段 */}
    </form>
  );
}
```

### 4. 性能优化

- **TaskCard**: 使用 `React.memo` 避免不必要的重渲染
- **FileList**: 对于大量文件，考虑使用虚拟滚动（react-window）
- **动画**: 使用 CSS 动画而非 JavaScript 动画

```tsx
export const TaskCard = React.memo(({ task, ...props }: TaskCardProps) => {
  // 组件实现
}, (prevProps, nextProps) => {
  // 自定义比较函数
  return prevProps.task.id === nextProps.task.id &&
         prevProps.task.status === nextProps.task.status &&
         prevProps.task.progress === nextProps.task.progress;
});
```

## 下一步

完成 Plan-03 后，进入 **Plan-04: Page Layouts**（页面布局），开始重构应用的所有页面。

---

**创建时间**：2025-10-04
**预计完成时间**：2025-10-09
**依赖**：Plan-02 完成（核心组件）
**负责人**：fullstack-engineer
