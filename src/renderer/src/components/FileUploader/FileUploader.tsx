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
  maxSize = 1024 * 1024 * 1024 * 2, // 2GB
  className,
}: FileUploaderProps) {
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
                请上传视频或音频文件（最大 2GB）
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
              <p>最大文件大小：2GB</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
