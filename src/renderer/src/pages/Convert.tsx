import { useState } from 'react';
import { PageContainer } from '@renderer/components/PageContainer/PageContainer';
import { FileUploader } from '@renderer/components/FileUploader/FileUploader';
import { FileList } from '@renderer/components/FileList/FileList';
import { ConvertConfig } from '@renderer/components/ConvertConfig/ConvertConfig';
import type { MediaFileInfo, ConvertOptions, FileInfo } from '@shared/types';

interface FileListItem {
  file: File | FileInfo;
  id: string;
  mediaInfo?: MediaFileInfo;
}

export function Convert() {
  const [selectedFiles, setSelectedFiles] = useState<FileListItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileListItem | null>(null);
  const [converting, setConverting] = useState(false);

  const handleFilesSelected = async (files: File[]) => {
    const newFiles: FileListItem[] = files.map((file) => ({
      file,
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      mediaInfo: undefined,
    }));

    // 先添加文件到列表
    setSelectedFiles((prev) => [...prev, ...newFiles]);

    // 如果没有选中的文件，自动选中第一个新文件
    if (!selectedFile && newFiles.length > 0) {
      setSelectedFile(newFiles[0]);
    }

    // 异步获取媒体信息
    for (const fileItem of newFiles) {
      try {
        // 检查文件是否有 path 属性（Electron 环境下拖拽的文件会有）
        if (!fileItem.file.path) {
          console.warn(`文件 ${fileItem.file.name} 没有 path 属性，跳过获取媒体信息`);
          continue;
        }

        const mediaInfo = await window.electronAPI.ffmpeg.getMediaInfo(fileItem.file.path);

        // 更新文件的媒体信息
        setSelectedFiles((prev) =>
          prev.map((item) =>
            item.id === fileItem.id ? { ...item, mediaInfo } : item
          )
        );

        // 如果这是当前选中的文件，也更新选中文件的媒体信息
        setSelectedFile((current) =>
          current?.id === fileItem.id ? { ...current, mediaInfo } : current
        );
      } catch (error) {
        console.error(`获取文件 ${fileItem.file.name} 的媒体信息失败:`, error);
        // 即使失败也不影响文件列表显示
      }
    }
  };

  const handleFilesFromDialog = async (fileInfos: FileInfo[]) => {
    const newFiles: FileListItem[] = fileInfos.map((fileInfo) => ({
      file: fileInfo,
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      mediaInfo: undefined,
    }));

    // 先添加文件到列表
    setSelectedFiles((prev) => [...prev, ...newFiles]);

    // 如果没有选中的文件，自动选中第一个新文件
    if (!selectedFile && newFiles.length > 0) {
      setSelectedFile(newFiles[0]);
    }

    // 异步获取媒体信息
    for (const fileItem of newFiles) {
      try {
        // FileInfo 总是有 path 属性
        const filePath = (fileItem.file as FileInfo).path;
        const mediaInfo = await window.electronAPI.ffmpeg.getMediaInfo(filePath);

        // 更新文件的媒体信息
        setSelectedFiles((prev) =>
          prev.map((item) =>
            item.id === fileItem.id ? { ...item, mediaInfo } : item
          )
        );

        // 如果这是当前选中的文件，也更新选中文件的媒体信息
        setSelectedFile((current) =>
          current?.id === fileItem.id ? { ...current, mediaInfo } : current
        );
      } catch (error) {
        console.error(`获取文件 ${fileItem.file.name} 的媒体信息失败:`, error);
        // 即使失败也不影响文件列表显示
      }
    }
  };

  const handleRemoveFile = (id: string) => {
    setSelectedFiles((prev) => prev.filter((item) => item.id !== id));

    // 如果删除的是当前选中的文件，清除选中状态
    if (selectedFile?.id === id) {
      setSelectedFile(null);
    }
  };

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

      // 这里可以显示一个成功提示或跳转到任务队列页面
      alert(`转换任务已添加！任务 ID: ${taskId}\n\n可前往任务队列查看进度。`);
    } catch (error) {
      console.error('添加转换任务失败:', error);
      alert(`添加转换任务失败: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setConverting(false);
    }
  };

  return (
    <PageContainer
      title="格式转换"
      description="支持多种视频和音频格式互转"
    >
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
    </PageContainer>
  );
}
