import { useState } from 'react';
import { FileUploader } from '@renderer/components/FileUploader/FileUploader';
import { FileList } from '@renderer/components/FileList/FileList';
import { ConvertConfig } from '@renderer/components/ConvertConfig/ConvertConfig';
import { useFileManager } from '@renderer/hooks/useFileManager';
import { toast } from 'sonner';
import type { ConvertOptions } from '@shared/types';

export function Convert() {
  const {
    selectedFiles,
    selectedFile,
    handleFilesSelected,
    handleFilesFromDialog,
    handleRemoveFile,
  } = useFileManager();
  const [converting, setConverting] = useState(false);

  const handleConvert = async (options: Partial<ConvertOptions>) => {
    if (!options.input || !options.output) {
      console.error('缺少输入或输出路径');
      return;
    }

    setConverting(true);

    try {
      // 调用 IPC 添加转换任务
      const taskId = await window.electronAPI.task.addConvert(options as ConvertOptions);
      console.log(`转换任务已添加: ${taskId}`);

      // 显示成功提示
      toast.success('转换任务已添加', {
        description: `任务 ID: ${taskId}\n可前往任务队列查看进度。`,
      });
    } catch (error) {
      console.error('添加转换任务失败:', error);
      toast.error('添加转换任务失败', {
        description: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1
          className="text-4xl font-bold tracking-tight text-text-primary mb-2"
          style={{ letterSpacing: '-0.02em' }}
        >
          格式转换
        </h1>
        <p className="text-sm text-text-secondary">支持多种视频和音频格式互转</p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：文件上传和列表 */}
        <div className="space-y-6">
          <FileUploader
            onFilesSelected={handleFilesSelected}
            onFilesFromDialog={handleFilesFromDialog}
          />
          <FileList files={selectedFiles} onRemove={handleRemoveFile} />
        </div>

        {/* 右侧：转换配置 */}
        <div>
          <ConvertConfig
            inputFile={selectedFile ? { name: selectedFile.file.name, path: selectedFile.file.path } : undefined}
            onConvert={handleConvert}
            disabled={converting}
          />
        </div>
      </div>
    </div>
  );
}
