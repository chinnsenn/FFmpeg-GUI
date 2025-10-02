import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileVideo, FolderOpen } from 'lucide-react';
import { cn } from '@renderer/lib/utils';
import { Button } from '@renderer/components/ui/button';
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

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
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
      console.error('选择文件失败:', error);
    }
  };

  return (
    <div
      {...getRootProps()}
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors',
        isDragActive && 'border-primary bg-primary/5',
        isDragReject && 'border-destructive bg-destructive/5',
        !isDragActive && !isDragReject && 'border-border',
        className,
      )}
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center gap-4">
        {isDragActive ? (
          <>
            <Upload className="h-12 w-12 text-primary animate-bounce" />
            <p className="text-lg font-medium text-primary">释放以上传文件</p>
          </>
        ) : (
          <>
            <FileVideo className="h-12 w-12 text-muted-foreground" />
            <div className="text-center">
              <p className="text-lg font-medium">拖拽文件到这里上传</p>
              <p className="text-sm text-muted-foreground mt-1">
                或使用下方按钮选择文件 {multiple && '(可选择多个)'}
              </p>
            </div>
            <Button
              onClick={handleSelectFromDialog}
              variant="outline"
              className="gap-2"
              type="button"
            >
              <FolderOpen className="h-4 w-4" />
              选择文件
            </Button>
            <div className="text-xs text-muted-foreground mt-2">
              <p>支持的格式：视频 (MP4, AVI, MKV, MOV 等)</p>
              <p>最大文件大小：2GB</p>
            </div>
          </>
        )}
      </div>

      {isDragReject && (
        <p className="mt-4 text-sm text-destructive">
          不支持的文件类型或文件过大
        </p>
      )}
    </div>
  );
}
