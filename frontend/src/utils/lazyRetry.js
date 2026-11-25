/**
 * Wraps a dynamic import() with retry logic + automatic page reload
 * when chunks fail to load (e.g., after a new deployment).
 *
 * Usage:  const Home = lazy(() => lazyRetry(() => import('./pages/Home')));
 */
export default function lazyRetry(importFn, retries = 2) {
  return new Promise((resolve, reject) => {
    const attempt = (retriesLeft) => {
      importFn()
        .then(resolve)
        .catch((error) => {
          // Check if this is a chunk-loading / dynamic-import failure
          const isChunkError =
            error?.message?.includes('Failed to fetch dynamically imported module') ||
            error?.message?.includes('Importing a module script failed') ||
            error?.message?.includes('error loading dynamically imported module') ||
            error?.message?.includes('Loading chunk') ||
            error?.name === 'ChunkLoadError';

          if (retriesLeft > 0) {
            // Wait briefly then retry
            setTimeout(() => attempt(retriesLeft - 1), 1000);
            return;
          }

          if (isChunkError) {
            // All retries exhausted and it's a chunk error — force reload once
            const reloadKey = 'nda_chunk_reload';
            const lastReload = sessionStorage.getItem(reloadKey);
            const now = Date.now();

            // Only auto-reload once every 30 seconds to avoid infinite loops
            if (!lastReload || now - Number(lastReload) > 30000) {
              sessionStorage.setItem(reloadKey, String(now));
              window.location.reload();
              return;
            }
          }

          reject(error);
        });
    };

    attempt(retries);
  });
}
