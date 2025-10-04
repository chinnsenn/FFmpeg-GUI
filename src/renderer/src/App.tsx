import { Router } from './router';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { Toaster } from '@renderer/components/ui/toast';
import './index.css';

function App() {
  return (
    <ErrorBoundary>
      <Router />
      <Toaster />
    </ErrorBoundary>
  );
}

export default App;
