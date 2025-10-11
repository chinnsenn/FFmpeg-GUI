import { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';
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
 * ConvertFileManager Context 接口
 */
interface ConvertFileManagerContextType {
  selectedFiles: FileListItem[];
  selectedFile: FileListItem | null;
  setSelectedFile: (file: FileListItem | null) => void;
  handleFilesSelected: (files: File[]) => Promise<void>;
  handleFilesFromDialog: (fileInfos: FileInfo[]) => Promise<void>;
  handleRemoveFile: (id: string) => void;
  clearAllFiles: () => void;
}

const ConvertFileManagerContext = createContext<ConvertFileManagerContextType | undefined>(
  undefined
);

/**
 * ConvertFileManagerProvider
 * 为 Convert 页面提供独立的文件列表管理
 */
export function ConvertFileManagerProvider({ children }: { children: ReactNode }) {
  const [selectedFiles, setSelectedFiles] = useState<FileListItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileListItem | null>(null);

  /**
   * 处理拖拽上传的文件
   */
  const handleFilesSelected = async (files: File[]) => {
    // 获取当前已存在的文件路径集合
    const existingPaths = new Set<string>();
    selectedFiles.forEach((item) => {
      if ('path' in item.file && item.file.path) {
        existingPaths.add(item.file.path);
      }
    });

    // 过滤掉路径已存在的文件
    const filesToAdd: Array<{ file: File; filePath: string }> = [];
    let duplicateCount = 0;

    for (const file of files) {
      let filePath: string;

      // 检查 File 对象是否已经有 path 属性（由 FileUploader 的 getFilesFromEvent 附加）
      if ('path' in file && file.path) {
        filePath = file.path;
      } else {
        // 如果没有 path 属性，尝试使用 getPathForFile（回退方案）
        try {
          filePath = window.electronAPI.getPathForFile(file as File);
        } catch (error) {
          logger.errorFromCatch('ConvertFileManager', `无法获取文件路径: ${file.name}`, error);
          continue;
        }
      }

      // 检查路径是否已存在
      if (existingPaths.has(filePath)) {
        duplicateCount++;
        logger.info('ConvertFileManager', `跳过重复文件: ${file.name} (${filePath})`);
        continue;
      }

      filesToAdd.push({ file, filePath });
      existingPaths.add(filePath); // 添加到集合，防止本批次内重复
    }

    // 记录去重信息
    if (duplicateCount > 0) {
      logger.info('ConvertFileManager', `过滤了 ${duplicateCount} 个重复文件`);
      toast.info('跳过重复文件', {
        description: `已过滤 ${duplicateCount} 个重复的文件`,
      });
    }

    // 如果没有需要添加的文件，直接返回
    if (filesToAdd.length === 0) {
      return;
    }

    // 创建文件列表项
    const newFiles: FileListItem[] = filesToAdd.map(({ file }) => ({
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
    for (let i = 0; i < newFiles.length; i++) {
      const fileItem = newFiles[i];
      const filePath = filesToAdd[i].filePath;

      try {
        logger.info('ConvertFileManager', `获取文件媒体信息: ${filePath}`);
        const mediaInfo = await window.electronAPI.ffmpeg.getMediaInfo(filePath);

        // 更新文件的媒体信息
        setSelectedFiles((prev) =>
          prev.map((item) => (item.id === fileItem.id ? { ...item, mediaInfo } : item))
        );

        // 如果这是当前选中的文件，也更新选中文件的媒体信息
        setSelectedFile((current) =>
          current?.id === fileItem.id ? { ...current, mediaInfo } : current
        );
      } catch (error) {
        logger.errorFromCatch(
          'ConvertFileManager',
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
    // 获取当前已存在的文件路径集合
    const existingPaths = new Set<string>();
    selectedFiles.forEach((item) => {
      if ('path' in item.file && item.file.path) {
        existingPaths.add(item.file.path);
      }
    });

    // 过滤掉路径已存在的文件
    const fileInfosToAdd: FileInfo[] = [];
    let duplicateCount = 0;

    for (const fileInfo of fileInfos) {
      // FileInfo 总是有 path 属性
      const filePath = fileInfo.path;

      // 检查路径是否已存在
      if (existingPaths.has(filePath)) {
        duplicateCount++;
        logger.info('ConvertFileManager', `跳过重复文件: ${fileInfo.name} (${filePath})`);
        continue;
      }

      fileInfosToAdd.push(fileInfo);
      existingPaths.add(filePath); // 添加到集合，防止本批次内重复
    }

    // 记录去重信息
    if (duplicateCount > 0) {
      logger.info('ConvertFileManager', `过滤了 ${duplicateCount} 个重复文件`);
      toast.info('跳过重复文件', {
        description: `已过滤 ${duplicateCount} 个重复的文件`,
      });
    }

    // 如果没有需要添加的文件，直接返回
    if (fileInfosToAdd.length === 0) {
      return;
    }

    // 创建文件列表项
    const newFiles: FileListItem[] = fileInfosToAdd.map((fileInfo) => ({
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
        logger.info('ConvertFileManager', `获取文件媒体信息: ${filePath}`);
        const mediaInfo = await window.electronAPI.ffmpeg.getMediaInfo(filePath);

        // 更新文件的媒体信息
        setSelectedFiles((prev) =>
          prev.map((item) => (item.id === fileItem.id ? { ...item, mediaInfo } : item))
        );

        // 如果这是当前选中的文件，也更新选中文件的媒体信息
        setSelectedFile((current) =>
          current?.id === fileItem.id ? { ...current, mediaInfo } : current
        );
      } catch (error) {
        logger.errorFromCatch(
          'ConvertFileManager',
          `获取文件 ${fileItem.file.name} 的媒体信息失败`,
          error
        );
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

  const value: ConvertFileManagerContextType = {
    selectedFiles,
    selectedFile,
    setSelectedFile,
    handleFilesSelected,
    handleFilesFromDialog,
    handleRemoveFile,
    clearAllFiles,
  };

  return (
    <ConvertFileManagerContext.Provider value={value}>
      {children}
    </ConvertFileManagerContext.Provider>
  );
}

/**
 * useConvertFileManager Hook
 * 在 Convert 页面中使用此 Hook 获取文件管理功能
 */
export function useConvertFileManager() {
  const context = useContext(ConvertFileManagerContext);
  if (context === undefined) {
    throw new Error('useConvertFileManager must be used within ConvertFileManagerProvider');
  }
  return context;
}
