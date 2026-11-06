import React from 'react';
import { ShieldAlert, RefreshCw, Home, ChevronDown } from 'lucide-react';

/**
 * Enterprise Graceful Error Boundary
 * Prevents white-screen crashes and maintains application stability
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught an unhandled exception:', error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  componentDidUpdate(prevProps) {
    // Reset error state if resetKey or activeTab changes
    if (
      this.props.resetKey !== undefined &&
      prevProps.resetKey !== this.props.resetKey &&
      this.state.hasError
    ) {
      this.handleReset();
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false
    });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return typeof this.props.fallback === 'function'
          ? this.props.fallback({
              error: this.state.error,
              resetErrorBoundary: this.handleReset
            })
          : this.props.fallback;
      }

      const isFullPage = this.props.fullPage;

      return (
        <div
          className={`${
            isFullPage
              ? 'min-h-[70vh] flex items-center justify-center p-4'
              : 'my-6 p-6 sm:p-8'
          } apple-gloss-tile rounded-[32px] text-center max-w-xl mx-auto space-y-5 animate-apple-enter relative overflow-hidden`}
        >
          {/* Ambient Glow */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="w-14 h-14 rounded-2xl liquid-pill flex items-center justify-center text-rose-500 mx-auto shadow-sm">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-bold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
              {this.props.title || 'Component Recovery Required'}
            </h2>
            <p className="text-xs sm:text-sm text-[#86868b] dark:text-[#a1a1a6] max-w-md mx-auto leading-relaxed">
              {this.props.description ||
                'PlacementIQ encountered an unexpected interface exception in this section. Your data and system sessions remain secure.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={this.handleReset}
              className="apple-btn-primary px-5 py-2.5 text-xs font-semibold cursor-pointer inline-flex items-center gap-2 shadow-md"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Rendering</span>
            </button>

            {isFullPage && (
              <button
                onClick={() => {
                  window.location.href = '/dashboard';
                }}
                className="apple-btn-secondary px-5 py-2.5 text-xs font-semibold cursor-pointer inline-flex items-center gap-2"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Return to Dashboard</span>
              </button>
            )}
          </div>

          {/* Technical Diagnostics (Collapsible) */}
          {this.state.error && (
            <div className="pt-4 text-left border-t border-black/[0.06] dark:border-white/[0.08]">
              <button
                onClick={() =>
                  this.setState((prev) => ({ showDetails: !prev.showDetails }))
                }
                className="text-[11px] font-mono text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] flex items-center gap-1.5 mx-auto cursor-pointer"
              >
                <span>Diagnostics Info</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    this.state.showDetails ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {this.state.showDetails && (
                <div className="mt-3 p-3.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 font-mono text-[10px] text-rose-600 dark:text-rose-400 overflow-x-auto max-h-40 leading-relaxed whitespace-pre-wrap">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
