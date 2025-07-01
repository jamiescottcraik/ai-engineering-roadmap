'use client';

import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error boundary component for the brAInwav roadmap platform
 * Catches JavaScript errors anywhere in the child component tree and displays a fallback UI
 * Follows the brAInwav design system with Electric Blue and Bright Orange colors
 */
export class RoadmapErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details for debugging
    // eslint-disable-next-line no-console
    console.error('Roadmap Error Boundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to error tracking service (e.g., Sentry, LogRocket)
      this.reportError(error, errorInfo);
    }
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    // Error reporting implementation
    // Could integrate with services like Sentry, LogRocket, etc.
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // eslint-disable-next-line no-console
    console.error('Error report:', errorReport);

    // Example: Send to monitoring service
    // await fetch('/api/errors', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(errorReport),
    // });
  };

  private handleRefresh = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error fallback UI with brAInwav styling
      return (
        <div className="from-charcoal-black via-charcoal-black/95 to-electric-blue/20 flex min-h-screen items-center justify-center bg-gradient-to-br p-6">
          <div className="glass-card w-full max-w-md p-8 text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full border border-red-500/30 bg-red-500/20 p-3">
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
            </div>

            <h1 className="mb-4 text-2xl font-bold text-white">Oops! Something went wrong</h1>

            <p className="mb-6 leading-relaxed text-white/70">
              We encountered an unexpected error while loading the AI Engineering Roadmap.
              Don&apos;t worry - your progress is saved and we&apos;re working to fix this.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="text-bright-orange mb-2 cursor-pointer text-sm">
                  Error Details (Development)
                </summary>
                <div className="bg-charcoal-black/80 max-h-40 overflow-auto rounded-lg p-4 font-mono text-xs text-white/60">
                  <div className="mb-2">
                    <strong className="text-red-400">Error:</strong> {this.state.error.message}
                  </div>
                  {this.state.error.stack && (
                    <div>
                      <strong className="text-red-400">Stack:</strong>
                      <pre className="whitespace-pre-wrap">{this.state.error.stack}</pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={this.handleRetry}
                className="glass-button flex flex-1 items-center justify-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>

              <button
                onClick={this.handleRefresh}
                className="glass-button-secondary flex flex-1 items-center justify-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh Page
              </button>

              <button
                onClick={this.handleGoHome}
                className="glass-button-secondary flex flex-1 items-center justify-center gap-2"
              >
                <Home className="h-4 w-4" />
                Go Home
              </button>
            </div>

            <div className="mt-6 border-t border-white/10 pt-6">
              <p className="text-xs text-white/50">
                If this problem persists, please contact support or check our status page.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Higher-order component to wrap components with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode,
) {
  const WrappedComponent = (props: P) => (
    <RoadmapErrorBoundary fallback={fallback}>
      <Component {...props} />
    </RoadmapErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

/**
 * Async error boundary for handling promise rejections
 */
export const AsyncErrorBoundary: React.FC<{
  children: ReactNode;
  onError?: (error: Error) => void;
}> = ({ children, onError }) => {
  React.useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // eslint-disable-next-line no-console
      console.error('Unhandled promise rejection:', event.reason);
      if (onError) {
        onError(new Error(event.reason));
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [onError]);

  return <RoadmapErrorBoundary>{children}</RoadmapErrorBoundary>;
};
