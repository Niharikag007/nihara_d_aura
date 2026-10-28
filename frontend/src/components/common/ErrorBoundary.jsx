import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Global ErrorBoundary Caught Error]:', error, errorInfo);
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
        <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-xl border border-[#DFBC77]/50 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-[#FAF3E8] border border-[#DFBC77] text-[#855F14] flex items-center justify-center mx-auto text-2xl font-serif">
              ✦
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#1C1917]">
                Aura Experience Notice
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-2">
                We encountered a temporary display issue loading this sanctuary page.
              </p>
              {this.state.error?.message && (
                <p className="text-[11px] font-mono text-stone-500 bg-stone-50 p-2.5 rounded-xl border border-stone-200 mt-3 break-words text-left">
                  {String(this.state.error.message)}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 py-2.5 rounded-xl border border-[#C59B27] text-xs font-bold text-[#855F14] hover:bg-[#FAF3E8] transition-colors"
              >
                Reload Page
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex-1 py-2.5 rounded-xl bg-[#C59B27] hover:bg-[#A87D17] text-white text-xs font-bold uppercase tracking-wider shadow transition-colors"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

