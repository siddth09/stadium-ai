/**
 * @fileoverview Error Boundary component.
 * Catches rendering errors and displays a user-friendly fallback.
 */

import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  readonly children: ReactNode;
  readonly fallback?: ReactNode;
}

interface State {
  readonly hasError: boolean;
  readonly error: Error | null;
}

/**
 * Error boundary that catches JavaScript errors in child components.
 * Displays a fallback UI and logs errors for debugging.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[StadiumAI] Error caught by boundary:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div
          role="alert"
          aria-live="assertive"
          style={{
            padding: '2rem',
            textAlign: 'center',
            background: 'var(--color-bg-primary, #0a0f2c)',
            color: 'var(--color-text-primary, #f0f0ff)',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
          }}
        >
          <h1>⚠️ Something went wrong</h1>
          <p style={{ color: 'var(--color-text-secondary, #8b8fb0)' }}>
            StadiumAI encountered an unexpected error. Please refresh the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'var(--color-accent-primary, #667eea)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
            aria-label="Refresh the page to recover from the error"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
