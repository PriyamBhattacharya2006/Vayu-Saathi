import {createRoot} from 'react-dom/client';
import {registerSW} from 'virtual:pwa-register';
import App from './App.tsx';
import {ErrorBoundary} from './components/ErrorBoundary.tsx';
import './index.css';

try {
  registerSW({
    immediate: true,
    onRegisterError(err) {
      console.warn('Service worker registration skipped:', err);
    },
  });
} catch (err) {
  console.warn('Service worker unavailable:', err);
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
