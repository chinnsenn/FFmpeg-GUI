import { Router } from './router';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { Toaster } from 'sonner';
import './index.css';

function App() {
  return (
    <ErrorBoundary>
      <Router />
      <Toaster position="top-right" richColors />
    </ErrorBoundary>
  );
}

export default App;
