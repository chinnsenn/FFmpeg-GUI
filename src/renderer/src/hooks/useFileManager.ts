import { useState } from 'react';
import { logger } from '@renderer/utils/logger';
import type { MediaFileInfo, FileInfo } from '@shared/types';

/**
 * 文件列表项接口
 */
export interface FileListItem {
  file: File | FileInfo;
  id: string;
  mediaInfo?: MediaFileInfo;
}

/**
 * 文件管理 Hook
 *
 * 提供文件选择、列表管理和媒体信息获取的通用逻辑
 * 用于 Convert 和 Compress 页面
 */
export function useFileManager() {
  const [selectedFiles, setSelectedFiles] = useState<FileListItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileListItem | null>(null);

  /**
   * 处理拖拽上传的文件
   */
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
        let filePath: string;

        // 检查 File 对象是否已经有 path 属性（由 FileUploader 的 getFilesFromEvent 附加）
        if ('path' in fileItem.file && fileItem.file.path) {
          filePath = fileItem.file.path;
          logger.info('useFileManager', `使用预附加的文件路径: ${filePath}`);
        } else {
          // 如果没有 path 属性，尝试使用 getPathForFile（回退方案）
          logger.warn('useFileManager', `文件 ${fileItem.file.name} 没有预附加的 path，尝试调用 getPathForFile`);
          filePath = window.electronAPI.getPathForFile(fileItem.file as File);
        }

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
        logger.errorFromCatch(
          'useFileManager',
          `获取文件 ${fileItem.file.name} 的媒体信息失败`,
          error
        );
        // 即使失败也不影响文件列表显示
      }
    }
  };

  /**
   * 处理文件对话框选择的文件
   */
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
        logger.errorFromCatch('useFileManager', `获取文件 ${fileItem.file.name} 的媒体信息失败`, error);
        // 即使失败也不影响文件列表显示
      }
    }
  };

  /**
   * 移除文件
   */
  const handleRemoveFile = (id: string) => {
    setSelectedFiles((prev) => {
      const updatedFiles = prev.filter((item) => item.id !== id);

      // 如果删除的是当前选中的文件，自动选中第一个文件
      if (selectedFile?.id === id && updatedFiles.length > 0) {
        setSelectedFile(updatedFiles[0]);
      } else if (updatedFiles.length === 0) {
        setSelectedFile(null);
      }

      return updatedFiles;
    });
  };

  /**
   * 清空所有文件
   */
  const clearAllFiles = () => {
    setSelectedFiles([]);
    setSelectedFile(null);
  };

  return {
    selectedFiles,
    selectedFile,
    setSelectedFile,
    handleFilesSelected,
    handleFilesFromDialog,
    handleRemoveFile,
    clearAllFiles,
  };
}
