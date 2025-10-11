import { useState } from 'react';
import { toast } from 'sonner';
import { FileUploader } from '@renderer/components/FileUploader/FileUploader';
import { FileList } from '@renderer/components/FileList/FileList';
import { ConvertConfig } from '@renderer/components/ConvertConfig/ConvertConfig';
import { useFileManager } from '@renderer/hooks/useFileManager';
import { logger } from '@renderer/utils/logger';
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

  const handleConvert = async (baseOptions: Partial<ConvertOptions> & { format?: string }) => {
    // 检查是否有选中的文件
    if (selectedFiles.length === 0) {
      logger.warn('Convert', '没有选中的文件');
      toast.error('请先选择要转换的文件');
      return;
    }

    // 提取输出格式（用于生成文件扩展名）
    const outputFormat = baseOptions.format || 'mp4';

    setConverting(true);
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
          logger.error('Convert', '文件路径不存在', { file: fileItem.file.name });
          errorCount++;
          continue;
        }

        // 生成输出路径：在原文件名后添加 _converted
        const fileName = fileItem.file.name;
        const lastDotIndex = fileName.lastIndexOf('.');
        const nameWithoutExt = lastDotIndex > 0 ? fileName.substring(0, lastDotIndex) : fileName;

        // 获取文件所在目录
        const lastSlashIndex = inputPath.lastIndexOf('/');
        const dirPath = lastSlashIndex > 0 ? inputPath.substring(0, lastSlashIndex) : '';

        const outputPath = `${dirPath}/${nameWithoutExt}_converted.${outputFormat}`;

        // 构建完整的转换选项（不包含 format，因为它从输出扩展名推断）
        const taskOptions: ConvertOptions = {
          input: inputPath,
          output: outputPath,
          videoCodec: baseOptions.videoCodec,
          audioCodec: baseOptions.audioCodec,
          videoBitrate: baseOptions.videoBitrate,
          audioBitrate: baseOptions.audioBitrate,
          resolution: baseOptions.resolution,
          overwrite: true,
        };

        try {
          // 调用 IPC 添加转换任务
          const taskId = await window.electronAPI.task.addConvert(taskOptions);
          logger.info('Convert', '转换任务已添加', { taskId, file: fileName, options: taskOptions });
          successCount++;
        } catch (error) {
          logger.errorFromCatch('Convert', `添加转换任务失败: ${fileName}`, error);
          errorCount++;
        }
      }

      // 显示批量处理结果
      if (successCount > 0) {
        toast.success(`成功添加 ${successCount} 个转换任务`, {
          description: errorCount > 0 ? `失败 ${errorCount} 个，可前往任务队列查看进度` : '可前往任务队列查看进度',
        });
      } else {
        toast.error('所有任务添加失败', {
          description: '请检查文件路径和权限',
        });
      }
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
            inputFile={selectedFile ? { name: selectedFile.file.name, path: selectedFile.file.path || undefined } : undefined}
            onConvert={handleConvert}
            disabled={converting}
          />
        </div>
      </div>
    </div>
  );
}
