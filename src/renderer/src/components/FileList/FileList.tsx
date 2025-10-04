import { useState } from 'react';
import { X, FileVideo, Music, ChevronRight } from 'lucide-react';
import { Button } from '@renderer/components/ui/button';
import { Card } from '@renderer/components/ui/card';
import { MediaInfo } from '@renderer/components/MediaInfo/MediaInfo';
import { formatFileSize } from '@renderer/lib/formatters';
import { cn } from '@renderer/lib/utils';
import type { FileListItem } from '@renderer/hooks/useFileManager';
import type { FileInfo } from '@shared/types';

interface FileListProps {
  files: FileListItem[];
  onRemove: (id: string) => void;
}

export function FileList({ files, onRemove }: FileListProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const getFileIcon = (file: File | FileInfo) => {
    // 判断是 File 对象还是 FileInfo
    const isFile = file instanceof File;

    if (isFile) {
      // File 对象有 type 属性
      if (file.type.startsWith('video/')) {
        return <FileVideo className="h-5 w-5 text-primary-600" />;
      } else if (file.type.startsWith('audio/')) {
        return <Music className="h-5 w-5 text-primary-600" />;
      }
    } else {
      // FileInfo 对象有 ext 属性，从扩展名判断
      const videoExts = ['.mp4', '.avi', '.mkv', '.mov', '.flv', '.wmv', '.webm'];
      const audioExts = ['.mp3', '.wav', '.aac', '.flac', '.m4a', '.ogg'];

      if (videoExts.includes(file.ext.toLowerCase())) {
        return <FileVideo className="h-5 w-5 text-primary-600" />;
      } else if (audioExts.includes(file.ext.toLowerCase())) {
        return <Music className="h-5 w-5 text-primary-600" />;
      }
    }

    return <FileVideo className="h-5 w-5 text-text-tertiary" />;
  };

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  if (files.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-text-secondary">
        已选择文件 <span className="text-text-primary">({files.length})</span>
      </h3>
      <div className="space-y-2">
        {files.map((item) => {
          const isExpanded = expandedIds.has(item.id);
          const hasMediaInfo = !!item.mediaInfo;

          return (
            <Card
              key={item.id}
              padding="none"
              className="overflow-hidden transition-all duration-150 hover:shadow-md"
            >
              {/* 文件基本信息行 */}
              <div className="flex items-center gap-3 p-4 transition-colors hover:bg-background-secondary">
                {getFileIcon(item.file)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{item.file.name}</p>
                  <p className="text-xs text-text-tertiary mt-0.5">
                    {formatFileSize(item.file.size)}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {hasMediaInfo && (
                    <Button
                      variant="icon"
                      size="sm"
                      onClick={() => toggleExpand(item.id)}
                      className="shrink-0"
                      title={isExpanded ? '收起详情' : '展开详情'}
                    >
                      <ChevronRight
                        className={cn(
                          'h-4 w-4 transition-transform duration-200',
                          isExpanded && 'rotate-90'
                        )}
                      />
                    </Button>
                  )}
                  <Button
                    variant="icon"
                    size="sm"
                    onClick={() => onRemove(item.id)}
                    className="shrink-0 text-text-tertiary hover:text-error-600"
                    title="删除文件"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* 可展开的媒体信息区域 */}
              {hasMediaInfo && item.mediaInfo && (
                <div
                  className={cn(
                    'transition-all duration-300 ease-in-out overflow-hidden',
                    isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                  )}
                >
                  <div className="border-t border-border-light bg-background-secondary p-4">
                    <MediaInfo info={item.mediaInfo} />
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
