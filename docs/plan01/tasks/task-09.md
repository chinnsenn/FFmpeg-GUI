# Task-09: 文件上传和拖拽功能

**任务ID**：Task-09 | **阶段**：阶段三 | **难度**：⭐⭐ | **时间**：2天 | **依赖**：Task-04

## 任务目标
实现文件拖拽上传功能,支持批量导入。

## 详细需求
- [ ] 集成 react-dropzone
- [ ] 创建文件上传组件
- [ ] 支持拖拽和点击选择
- [ ] 批量文件处理
- [ ] 文件类型过滤

## 核心代码
```typescript
import { useDropzone } from 'react-dropzone';

export function FileUploader() {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'video/*': ['.mp4', '.avi', '.mkv', '.mov'],
    },
    multiple: true,
    onDrop: handleDrop,
  });

  return (
    <div {...getRootProps()} className="border-2 border-dashed p-8">
      <input {...getInputProps()} />
      <p>拖拽文件到这里或点击上传</p>
    </div>
  );
}
```

## 验收标准
- [ ] 拖拽上传正常工作
- [ ] 支持多文件选择
- [ ] 文件类型过滤有效

**任务状态**：待开始
