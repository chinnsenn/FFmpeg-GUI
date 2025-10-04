import { useLocation } from 'react-router-dom';

const pageTitles: Record<string, string> = {
  '/': '首页',
  '/convert': '视频转换',
  '/compress': '视频压缩',
  '/queue': '任务队列',
  '/settings': '设置',
};

export function Header() {
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] || 'FFmpeg GUI';

  return (
    <header className="flex h-16 items-center justify-between border-b border-border-light bg-background-primary px-8">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold text-text-primary">
          {pageTitle}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {/* 可以在这里添加其他操作按钮 */}
      </div>
    </header>
  );
}
