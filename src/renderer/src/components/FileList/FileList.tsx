import { useState } from 'react';
import { X, FileVideo, Music, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@renderer/components/ui/button';
import { MediaInfo } from '@renderer/components/MediaInfo/MediaInfo';
import type { MediaFileInfo, FileInfo } from '@shared/types';

interface FileListItem {
  file: File | FileInfo;
  id: string;
  mediaInfo?: MediaFileInfo;
}

interface FileListProps {
  files: FileListItem[];
  onRemove: (id: string) => void;
}

export function FileList({ files, onRemove }: FileListProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (file: File | FileInfo) => {
    // 判断是 File 对象还是 FileInfo
    const isFile = file instanceof File;

    if (isFile) {
      // File 对象有 type 属性
      if (file.type.startsWith('video/')) {
        return <FileVideo className="h-5 w-5 text-primary" />;
      } else if (file.type.startsWith('audio/')) {
        return <Music className="h-5 w-5 text-primary" />;
      }
    } else {
      // FileInfo 对象有 ext 属性，从扩展名判断
      const videoExts = ['.mp4', '.avi', '.mkv', '.mov', '.flv', '.wmv', '.webm'];
      const audioExts = ['.mp3', '.wav', '.aac', '.flac', '.m4a', '.ogg'];

      if (videoExts.includes(file.ext.toLowerCase())) {
        return <FileVideo className="h-5 w-5 text-primary" />;
      } else if (audioExts.includes(file.ext.toLowerCase())) {
        return <Music className="h-5 w-5 text-primary" />;
      }
    }

    return <FileVideo className="h-5 w-5 text-muted-foreground" />;
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
    <div className="space-y-2">
      <h3 className="text-sm font-medium">已选择文件 ({files.length})</h3>
      <div className="space-y-2">
        {files.map((item) => {
          const isExpanded = expandedIds.has(item.id);
          const hasMediaInfo = !!item.mediaInfo;

          return (
            <div
              key={item.id}
              className="rounded-lg border border-border overflow-hidden"
            >
              {/* 文件基本信息行 */}
              <div className="flex items-center gap-3 p-3 transition-colors hover:bg-accent">
                {getFileIcon(item.file)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(item.file.size)}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {hasMediaInfo && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleExpand(item.id)}
                      className="shrink-0"
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(item.id)}
                    className="shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* 可展开的媒体信息区域 */}
              {hasMediaInfo && isExpanded && item.mediaInfo && (
                <div className="border-t border-border p-3 bg-muted/30">
                  <MediaInfo info={item.mediaInfo} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
