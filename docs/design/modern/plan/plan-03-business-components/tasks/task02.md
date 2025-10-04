# Task 02: 重构 FileUploader 组件

## 任务目标

创建功能完整的文件上传组件,支持点击选择和拖放上传,具有 3 种视觉状态反馈。

## 参考文档

- `docs/design/modern/demo/component-filelist.html` - FileUploader 完整实现
- `docs/design/modern/demo/convert.html` - 在转换页面中的应用

## 实施步骤

### 步骤 1: 创建基础组件

```tsx
// src/renderer/src/components/business/FileUploader.tsx
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { cn } from '@renderer/lib/utils';

export interface FileUploaderProps {
  onUpload: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // bytes
}

export function FileUploader({
  onUpload,
  accept = 'video/*,audio/*',
  multiple = true,
  maxSize = 5 * 1024 * 1024 * 1024, // 5GB
}: FileUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onUpload(acceptedFiles);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.mkv', '.webm'],
      'audio/*': ['.mp3', '.wav', '.aac', '.flac', '.m4a'],
    },
    multiple,
    maxSize,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        // 基础样式
        'flex flex-col items-center justify-center p-12 rounded-lg border-2 border-dashed transition-all duration-200 cursor-pointer',
        // 默认状态
        'border-border-medium bg-background-secondary hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-600/10',
        // 拖放中状态
        isDragActive && !isDragReject && 'border-primary-500 bg-primary-50 dark:bg-primary-600/10 scale-[1.02]',
        // 拒绝状态
        isDragReject && 'border-error-500 bg-error-50 dark:bg-error-600/10'
      )}
    >
      <input {...getInputProps()} />

      <Upload
        className={cn(
          'h-12 w-12 mb-4 transition-colors',
          isDragActive && !isDragReject ? 'text-primary-500' : 'text-text-tertiary',
          isDragReject && 'text-error-500'
        )}
      />

      <p className="text-base font-medium text-text-primary mb-1">
        {isDragActive
          ? isDragReject
            ? '不支持的文件类型'
            : '释放以上传文件'
          : '拖放文件到此处'}
      </p>

      <p className="text-sm text-text-secondary">
        或点击选择文件 • 支持视频和音频文件
      </p>
    </div>
  );
}
```

### 步骤 2: 创建测试

```tsx
// src/renderer/src/components/business/__tests__/FileUploader.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FileUploader } from '../FileUploader';

describe('FileUploader', () => {
  it('should call onUpload when files are selected', () => {
    const handleUpload = vi.fn();
    render(<FileUploader onUpload={handleUpload} />);

    const input = screen.getByRole('presentation').querySelector('input[type="file"]');
    const file = new File(['content'], 'test.mp4', { type: 'video/mp4' });

    fireEvent.change(input!, { target: { files: [file] } });

    expect(handleUpload).toHaveBeenCalledWith([file]);
  });

  it('should handle drag and drop', () => {
    const handleUpload = vi.fn();
    render(<FileUploader onUpload={handleUpload} />);

    const dropzone = screen.getByText(/拖放文件到此处/);
    const file = new File(['content'], 'test.mp4', { type: 'video/mp4' });

    fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });

    expect(handleUpload).toHaveBeenCalledWith([file]);
  });
});
```

## 验收标准

- [ ] 3 种状态视觉正确（默认、拖放中、hover）
- [ ] 支持点击选择和拖放
- [ ] 文件类型过滤正确
- [ ] 与 HTML Demo 100% 一致

## 预计时间

3-4 小时

---

**优先级**: P0
**依赖**: Plan-02 完成
