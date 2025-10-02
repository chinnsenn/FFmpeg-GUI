import { Copy } from 'lucide-react';
import { Button } from '@renderer/components/ui/button';

export function Footer() {
  return (
    <footer className="border-t">
      {/* 命令预览区 */}
      <div className="flex items-center gap-2 border-b bg-muted/30 px-4 py-2">
        <span className="text-xs font-medium">FFmpeg 命令:</span>
        <code className="flex-1 text-xs font-mono text-muted-foreground">
          ffmpeg -i input.mp4 -c:v libx264 output.avi
        </code>
        <Button variant="ghost" size="sm">
          <Copy className="h-3 w-3" />
        </Button>
      </div>

      {/* 任务状态栏 */}
      <div className="h-24 overflow-y-auto p-4">
        <div className="text-sm text-muted-foreground">任务队列 (0)</div>
      </div>
    </footer>
  );
}
