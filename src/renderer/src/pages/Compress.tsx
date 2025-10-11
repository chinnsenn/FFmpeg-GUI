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

  const handleCompress = async (baseOptions: Omit<CompressOptions, 'input' | 'output'>) => {
    // 检查是否有选中的文件
    if (selectedFiles.length === 0) {
      logger.warn('Compress', '没有选中的文件');
      toast.error('请先选择要压缩的文件');
      return;
    }

    setCompressing(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      // 遍历所有选中的文件
      for (const fileItem of selectedFiles) {
        // 检查文件路径
        let inputPath: string | undefined;
        if ('path' in fileItem.file && fileItem.file.path) {
          inputPath = fileItem.file.path;
        } else {
          logger.error('Compress', '文件路径不存在', { file: fileItem.file.name });
          errorCount++;
          continue;
        }

        // 生成输出路径：在原文件名后添加 _compressed
        const fileName = fileItem.file.name;
        const lastDotIndex = fileName.lastIndexOf('.');
        const nameWithoutExt = lastDotIndex > 0 ? fileName.substring(0, lastDotIndex) : fileName;
        const ext = lastDotIndex > 0 ? fileName.substring(lastDotIndex) : '';

        // 获取文件所在目录
        const lastSlashIndex = inputPath.lastIndexOf('/');
        const dirPath = lastSlashIndex > 0 ? inputPath.substring(0, lastSlashIndex) : '';

        const outputPath = `${dirPath}/${nameWithoutExt}_compressed${ext}`;

        // 构建完整的压缩选项
        const compressOptions: CompressOptions = {
          input: inputPath,
          output: outputPath,
          ...baseOptions,
        };

        try {
          // 调用 IPC 添加压缩任务
          const taskId = await window.electronAPI.task.addCompress(compressOptions);
          logger.info('Compress', '压缩任务已添加', { taskId, file: fileName, options: compressOptions });
          successCount++;
        } catch (error) {
          logger.errorFromCatch('Compress', `添加压缩任务失败: ${fileName}`, error);
          errorCount++;
        }
      }

      // 显示批量处理结果
      if (successCount > 0) {
        toast.success(`成功添加 ${successCount} 个压缩任务`, {
          description: errorCount > 0 ? `失败 ${errorCount} 个，可前往任务队列查看进度` : '可前往任务队列查看进度',
        });
      } else {
        toast.error('所有任务添加失败', {
          description: '请检查文件路径和权限',
        });
      }
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
            inputFile={selectedFile?.file.path || undefined}
            fileName={selectedFile?.file.name}
            mediaInfo={selectedFile?.mediaInfo}
            onCompress={handleCompress}
            disabled={compressing}
          />
        </div>
      </div>
    </div>
  );
}
