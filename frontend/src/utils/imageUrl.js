const BACKEND_STATIC_BASE = (
  import.meta.env?.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, '')
    : (import.meta.env?.PROD ? 'https://api.niharadaura.com' : 'http://localhost:3000')
).replace(/\/+$/, '');

/**
 * Resolves an image URL or avatar path to a fully qualified URL.
 * Handles relative `/uploads/...` paths by prepending the backend static base URL.
 */
export function resolveImageUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (trimmed.startsWith('/uploads/')) {
    return `${BACKEND_STATIC_BASE}${trimmed}`;
  }
  return trimmed;
}

export function resolveAvatarUrl(url) {
  return resolveImageUrl(url);
}
