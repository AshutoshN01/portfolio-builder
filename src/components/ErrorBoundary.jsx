import { Component } from 'react';
import { FiRefreshCw, FiHome } from 'react-icons/fi';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Standard telemetry logging hook (e.g. Sentry)
    console.error('ErrorBoundary caught a runtime crash:', error, errorInfo);
    
    // Inject Sentry tracking if initialized on runtime
    if (window.Sentry) {
      window.Sentry.captureException(error, { extra: errorInfo });
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background text-white flex flex-col items-center justify-center p-6 text-center select-none font-body">
          {/* Accent glow behind title */}
          <div className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-accent-glow rounded-full blur-[100px] pointer-events-none z-0" />

          <div className="relative z-10 flex flex-col gap-6 max-w-lg">
            <span className="font-mono text-overline text-accent-text uppercase tracking-widest">
              System Interrupted
            </span>
            <h1 className="font-display text-display-md font-bold tracking-tight text-white leading-tight">
              An unexpected render anomaly occurred
            </h1>
            <p className="text-body-sm text-text-muted leading-relaxed">
              The application engine encountered an unhandled exception. Your local UI session has been halted to prevent data corruption.
            </p>

            {/* Error Message Stack */}
            {this.state.error && (
              <div className="p-4 bg-[#0d0d0d] border border-border rounded-md text-left font-mono text-[11px] text-error overflow-auto max-h-32 leading-relaxed">
                <span className="font-bold uppercase tracking-wider block mb-1 text-[9px] text-text-dim">Error Log:</span>
                {this.state.error.toString()}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
              <button
                onClick={this.handleReload}
                className="px-5 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-md text-body-sm font-semibold transition-all duration-fast flex items-center gap-2 hover:shadow-accent"
              >
                <FiRefreshCw className="animate-spin-slow" /> Reload Session
              </button>
              <button
                onClick={this.handleGoHome}
                className="px-5 py-2.5 border border-border hover:border-border-hover text-text-secondary hover:text-white rounded-md text-body-sm font-semibold transition-all duration-fast flex items-center gap-2"
              >
                <FiHome /> Back to Safety
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
