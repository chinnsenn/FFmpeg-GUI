import { Router } from './router';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import './index.css';

function App() {
  return (
    <ErrorBoundary>
      <Router />
    </ErrorBoundary>
  );
}

export default App;
