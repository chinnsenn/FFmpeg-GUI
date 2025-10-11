import { Router } from './router';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { Toaster } from '@renderer/components/ui/toast';
import { useTheme } from '@renderer/hooks/useTheme';
import { CompressFileManagerProvider } from '@renderer/contexts/CompressFileManagerContext';
import { ConvertFileManagerProvider } from '@renderer/contexts/ConvertFileManagerContext';
import './index.css';

function App() {
  // 初始化主题系统
  useTheme();

  return (
    <ErrorBoundary>
      <CompressFileManagerProvider>
        <ConvertFileManagerProvider>
          <Router />
          <Toaster />
        </ConvertFileManagerProvider>
      </CompressFileManagerProvider>
    </ErrorBoundary>
  );
}

export default App;
