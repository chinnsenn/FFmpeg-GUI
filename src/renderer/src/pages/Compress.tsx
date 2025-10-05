import { useState } from 'react';
import { toast } from 'sonner';
import { FileUploader } from '@renderer/components/FileUploader/FileUploader';
import { FileList } from '@renderer/components/FileList/FileList';
import { CompressConfig } from '@renderer/components/CompressConfig/CompressConfig';
import { useFileManager } from '@renderer/hooks/useFileManager';
import { logger } from '@renderer/utils/logger';
import type { CompressOptions } from '@shared/types';

export function Compress() {
  const {
    selectedFiles,
    selectedFile,
    handleFilesSelected,
    handleFilesFromDialog,
    handleRemoveFile,
  } = useFileManager();
  const [compressing, setCompressing] = useState(false);

  const handleCompress = async (options: Omit<CompressOptions, 'input' | 'output'>) => {
    if (!selectedFile) {
      logger.warn('Compress', '没有选中的文件');
      toast.error('请先选择要压缩的文件');
      return;
    }

    const inputPath = selectedFile.file.path;
    if (!inputPath) {
      logger.error('Compress', '文件路径不存在', { file: selectedFile.file.name });
      toast.error('文件路径不存在');
      return;
    }

    // 生成输出路径：在原文件名后添加 _compressed
    const fileName = selectedFile.file.name;
    const lastDotIndex = fileName.lastIndexOf('.');
    const nameWithoutExt = lastDotIndex > 0 ? fileName.substring(0, lastDotIndex) : fileName;
    const ext = lastDotIndex > 0 ? fileName.substring(lastDotIndex) : '';

    // 获取文件所在目录
    const lastSlashIndex = inputPath.lastIndexOf('/');
    const dirPath = lastSlashIndex > 0 ? inputPath.substring(0, lastSlashIndex) : '';

    const outputPath = `${dirPath}/${nameWithoutExt}_compressed${ext}`;

    const compressOptions: CompressOptions = {
      input: inputPath,
      output: outputPath,
      ...options,
    };

    setCompressing(true);

    try {
      // 调用 IPC 添加压缩任务
      const taskId = await window.electronAPI.task.addCompress(compressOptions);
      logger.info('Compress', '压缩任务已添加', { taskId, options: compressOptions });

      // 显示成功提示
      toast.success('压缩任务已添加', {
        description: `任务 ID: ${taskId}\n可前往任务队列查看进度。`,
      });
    } catch (error) {
      logger.errorFromCatch('Compress', '添加压缩任务失败', error);
      toast.error('添加压缩任务失败', {
        description: error instanceof Error ? error.message : '未知错误',
      });
    } finally {
      setCompressing(false);
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
          视频压缩
        </h1>
        <p className="text-sm text-text-secondary">智能压缩，平衡质量与文件大小</p>
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

        {/* 右侧：压缩配置 */}
        <div>
          <CompressConfig
            inputFile={selectedFile?.file.path}
            fileName={selectedFile?.file.name}
            onCompress={handleCompress}
            disabled={compressing}
          />
        </div>
      </div>
    </div>
  );
}
