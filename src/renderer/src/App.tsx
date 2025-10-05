import { Router } from './router';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { Toaster } from '@renderer/components/ui/toast';
import { useTheme } from '@renderer/hooks/useTheme';
import './index.css';

function App() {
  // 初始化主题系统
  useTheme();

  return (
    <ErrorBoundary>
      <Router />
      <Toaster />
    </ErrorBoundary>
  );
}

export default App;
