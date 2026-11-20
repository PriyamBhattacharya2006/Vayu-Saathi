import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error?.message || 'Unexpected rendering error',
    };
  }

  componentDidCatch(error: Error): void {
    console.error('CleanAir Companion error boundary caught:', error);
  }

  handleResetAndReload = (): void => {
    try {
      localStorage.removeItem('cleanair_profile_v1');
      localStorage.removeItem('cleanair_last_aqi_v1');
      localStorage.removeItem('cleanair_habits_v1');
      localStorage.removeItem('cleanair_alert_prefs_v1');
    } catch {
      // Ignore storage errors
    }
    window.location.reload();
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
          <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">
              CleanAir Companion could not load this view
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Something went wrong while restoring saved data ({this.state.message}). Resetting
              local app data usually fixes this right away.
            </p>
            <button
              type="button"
              onClick={this.handleResetAndReload}
              className="w-full rounded-xl bg-teal-700 hover:bg-teal-800 text-white py-2.5 text-sm font-semibold transition-colors"
            >
              Reset Saved Data &amp; Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
