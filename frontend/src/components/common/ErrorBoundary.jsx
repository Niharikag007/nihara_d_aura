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

    // Auto-reload once for chunk load failures (stale deployment)
    const isChunkError =
      error?.message?.includes('Failed to fetch dynamically imported module') ||
      error?.message?.includes('Importing a module script failed') ||
      error?.message?.includes('error loading dynamically imported module') ||
      error?.message?.includes('Loading chunk') ||
      error?.name === 'ChunkLoadError';

    if (isChunkError) {
      const reloadKey = 'nda_error_boundary_reload';
      const lastReload = sessionStorage.getItem(reloadKey);
      const now = Date.now();

      // Auto-reload once every 30s to avoid infinite loops
      if (!lastReload || now - Number(lastReload) > 30000) {
        sessionStorage.setItem(reloadKey, String(now));
        window.location.reload();
        return;
      }
    }
  }

  handleReload = () => {
    // Clear the reload guard so manual reload always works
    sessionStorage.removeItem('nda_error_boundary_reload');
    sessionStorage.removeItem('nda_chunk_reload');
    window.location.reload();
  };

  handleGoHome = () => {
    sessionStorage.removeItem('nda_error_boundary_reload');
    sessionStorage.removeItem('nda_chunk_reload');
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const isChunkError = this.state.error?.message?.includes('dynamically imported module') ||
        this.state.error?.message?.includes('Loading chunk');

      return (
        <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-xl border border-[#DFBC77]/50 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-[#FAF3E8] border border-[#DFBC77] text-[#855F14] flex items-center justify-center mx-auto text-2xl font-serif">
              ✦
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#1C1917]">
                {isChunkError ? 'New Update Available' : 'Aura Experience Notice'}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-2">
                {isChunkError
                  ? 'A new version of Nihara D\'Aura is available. Please reload to get the latest experience.'
                  : 'We encountered a temporary display issue loading this sanctuary page.'
                }
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 py-2.5 rounded-xl border border-[#C59B27] text-xs font-bold text-[#855F14] hover:bg-[#FAF3E8] transition-colors"
              >
                {isChunkError ? 'Update Now' : 'Reload Page'}
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

