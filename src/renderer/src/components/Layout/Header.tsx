import { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@renderer/components/ui/button';

export function Header() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="flex h-14 items-center justify-between border-b px-6">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-medium text-muted-foreground">
          视频格式转换
        </h2>
      </div>

      <div className="flex items-center gap-2">
        {/* 主题切换 */}
        <Button variant="icon" size="md" onClick={toggleTheme}>
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  );
}
