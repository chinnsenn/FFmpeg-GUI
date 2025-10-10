import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileVideo, FolderOpen } from 'lucide-react';
import { cn } from '@renderer/lib/utils';
import { Button } from '@renderer/components/ui/button';
import { logger } from '@renderer/utils/logger';
import type { FileInfo } from '@shared/types';

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  onFilesFromDialog?: (files: FileInfo[]) => void;
  accept?: Record<string, string[]>;
  multiple?: boolean;
  maxSize?: number;
  className?: string;
}

export function FileUploader({
  onFilesSelected,
  onFilesFromDialog,
  accept = {
    'video/*': ['.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.webm'],
    'audio/*': ['.mp3', '.wav', '.aac', '.flac', '.m4a', '.ogg'],
  },
  multiple = true,
  maxSize = 1024 * 1024 * 1024 * 10, // 10GB
  className,
}: FileUploaderProps) {
  /**
   * 自定义文件获取函数
   * 解决 Electron macOS 上 webUtils.getPathForFile 的已知问题
   * 必须在 drop 事件期间同步调用 getPathForFile，而不是在 onDrop 回调中
   */
  const getFilesFromEvent = useCallback(
    async (
      event:
        | React.DragEvent<HTMLElement>
        | React.ChangeEvent<HTMLInputElement>
        | DragEvent
        | Event
        | FileSystemFileHandle[]
    ) => {
      // 如果是 FileSystemFileHandle 数组，直接返回空（暂不支持）
      if (Array.isArray(event)) {
        return [];
      }

      // 从事件中获取文件列表
      let fileList: FileList | null = null;

      if ('dataTransfer' in event && event.dataTransfer) {
        // DragEvent (拖放)
        fileList = event.dataTransfer.files;
      } else if ('target' in event && event.target) {
        // ChangeEvent (input file)
        const target = event.target as HTMLInputElement;
        if (target.files) {
          fileList = target.files;
        }
      }

      if (!fileList) {
        return [];
      }

      const files: File[] = [];

      // 遍历文件列表，为每个文件附加真实路径
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];

        try {
          // 使用 webUtils.getPathForFile 获取真实路径
          // 必须在事件处理期间同步调用，否则 File 对象会失去与文件系统的连接
          const filePath = window.electronAPI.getPathForFile(file);

          // 将路径附加到 File 对象（通过 defineProperty 使其可枚举）
          Object.defineProperty(file, 'path', {
            value: filePath,
            writable: false,
            enumerable: true,
          });
        } catch (error) {
          logger.errorFromCatch('FileUploader', `获取文件 ${file.name} 的路径失败`, error);
          // 即使失败也添加文件，useFileManager 会处理没有路径的情况
        }

        files.push(file);
      }

      return files;
    },
    []
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFilesSelected(acceptedFiles);
      }
    },
    [onFilesSelected],
  );

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept,
    multiple,
    maxSize,
    noClick: true, // 禁用点击打开，我们使用自己的按钮
    getFilesFromEvent, // 使用自定义文件获取函数
  });

  const handleSelectFromDialog = async () => {
    try {
      const filters = [
        { name: 'Video Files', extensions: ['mp4', 'avi', 'mkv', 'mov', 'flv', 'wmv', 'webm'] },
        { name: 'Audio Files', extensions: ['mp3', 'wav', 'aac', 'flac', 'm4a', 'ogg'] },
        { name: 'All Files', extensions: ['*'] },
      ];

      const fileInfos = await window.electronAPI.selectFiles(filters);

      if (fileInfos.length > 0 && onFilesFromDialog) {
        onFilesFromDialog(fileInfos);
      }
    } catch (error) {
      logger.errorFromCatch('FileUploader', '选择文件失败', error);
    }
  };

  return (
    <div
      {...getRootProps()}
      className={cn(
        'flex min-h-[200px] flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all duration-200',
        // 默认状态
        !isDragActive && !isDragReject && 'border-border-light bg-background-secondary hover:border-border-medium hover:bg-background-tertiary',
        // 拖放激活状态 (文件悬停在区域上但未验证)
        isDragActive && !isDragAccept && !isDragReject && 'border-primary-500 bg-primary-50',
        // 拖放接受状态 (文件类型正确)
        isDragAccept && 'scale-[1.02] border-solid border-primary-600 bg-primary-100 shadow-md',
        // 拖放拒绝状态 (文件类型错误或过大)
        isDragReject && 'border-error-500 bg-error-50',
        className,
      )}
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center gap-4">
        {/* 拖放激活状态 */}
        {isDragActive && !isDragReject && (
          <>
            <Upload className="h-12 w-12 text-primary-600 animate-bounce" />
            <p className="text-base font-medium text-primary-700">释放以上传文件</p>
          </>
        )}

        {/* 拖放拒绝状态 */}
        {isDragReject && (
          <>
            <Upload className="h-12 w-12 text-error-600" />
            <div className="text-center">
              <p className="text-base font-medium text-error-700">不支持的文件类型或文件过大</p>
              <p className="mt-1 text-sm text-error-600">
                请上传视频或音频文件（最大 10GB）
              </p>
            </div>
          </>
        )}

        {/* 默认状态 */}
        {!isDragActive && (
          <>
            <FileVideo className="h-12 w-12 text-text-tertiary" />
            <div className="text-center">
              <p className="text-base font-medium text-text-primary">拖拽文件到这里上传</p>
              <p className="mt-1 text-sm text-text-secondary">
                或使用下方按钮选择文件 {multiple && '(可选择多个)'}
              </p>
            </div>
            <Button
              onClick={handleSelectFromDialog}
              variant="secondary"
              leftIcon={<FolderOpen className="h-4 w-4" />}
              type="button"
              className="mt-2"
            >
              选择文件
            </Button>
            <div className="mt-6 space-y-1 text-center text-xs text-text-tertiary">
              <p>支持的格式：视频 (MP4, AVI, MKV, MOV 等) / 音频 (MP3, WAV, AAC 等)</p>
              <p>最大文件大小：10GB</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
