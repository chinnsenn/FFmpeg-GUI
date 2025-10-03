export function Footer() {
  return (
    <footer className="border-t">
      {/* 命令预览区 */}
      <div className="flex items-center gap-2 border-b bg-muted/30 px-4 py-2">
        <span className="text-xs font-medium">FFmpeg 命令:</span>
        <code className="flex-1 text-xs font-mono text-muted-foreground">
          暂无任务命令
        </code>
      </div>

      {/* 任务状态栏 */}
      <div className="h-24 overflow-y-auto p-4">
        <div className="text-sm text-muted-foreground">任务队列 (0)</div>
      </div>
    </footer>
  );
}
