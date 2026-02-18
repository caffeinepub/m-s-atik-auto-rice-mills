// Router base path utility - derives base path from runtime location
export function getRouterBasePath(): string {
  // Check build-time configuration
  const envBasePath = import.meta.env.VITE_BASE_PATH;
  if (envBasePath) {
    return envBasePath;
  }

  // Check for preview path prefix in URL
  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname;
    const previewMatch = pathname.match(/^(\/preview\/[^/]+)/);
    if (previewMatch) {
      return previewMatch[1];
    }
  }

  // Default to root
  return '/';
}
