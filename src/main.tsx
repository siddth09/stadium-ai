/**
 * @fileoverview Application entry point.
 * Wraps the app with ErrorBoundary and AppProvider.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { AppProvider } from '@/context/AppContext';
import App from '@/App';
import '@/index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found. Ensure index.html contains <div id="root"></div>.');
}

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <AppProvider>
        <App />
      </AppProvider>
    </ErrorBoundary>
  </StrictMode>,
);
