// Release channel utility - determines if app is running in production or preview mode
export type ReleaseChannel = 'production' | 'preview';

export interface ReleaseInfo {
  channel: ReleaseChannel;
  previewId?: string;
}

export function getReleaseChannel(): ReleaseInfo {
  // Check build-time environment variable
  const envChannel = import.meta.env.VITE_RELEASE_CHANNEL;
  if (envChannel === 'preview') {
    return {
      channel: 'preview',
      previewId: import.meta.env.VITE_PREVIEW_ID || 'preview',
    };
  }

  // Check URL hints (e.g., preview.example.com or example.com/preview/*)
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;

    // Check for preview subdomain
    if (hostname.startsWith('preview.') || hostname.includes('-preview')) {
      return {
        channel: 'preview',
        previewId: 'preview',
      };
    }

    // Check for preview path prefix
    if (pathname.startsWith('/preview/')) {
      return {
        channel: 'preview',
        previewId: 'preview',
      };
    }
  }

  // Default to production
  return {
    channel: 'production',
  };
}

export function isPreviewMode(): boolean {
  return getReleaseChannel().channel === 'preview';
}
