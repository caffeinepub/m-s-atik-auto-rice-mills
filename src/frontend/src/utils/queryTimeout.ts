/**
 * Wraps an async query function with a timeout to prevent indefinite hanging.
 * Returns a normalized error message when the backend is unreachable.
 */
export async function withQueryTimeout<T>(
  queryFn: () => Promise<T>,
  timeoutMs: number = 10000
): Promise<T> {
  return Promise.race([
    queryFn(),
    new Promise<T>((_, reject) =>
      setTimeout(
        () => reject(new Error('Request timed out. The backend may be unavailable.')),
        timeoutMs
      )
    ),
  ]);
}

/**
 * Normalizes backend errors into user-friendly messages.
 */
export function normalizeQueryError(error: unknown): string {
  if (error instanceof Error) {
    // Check for common backend unavailability patterns
    if (
      error.message.includes('timed out') ||
      error.message.includes('Actor not available') ||
      error.message.includes('Actor initialization timed out') ||
      error.message.includes('Failed to fetch') ||
      error.message.includes('fetch failed') ||
      error.message.includes('NetworkError') ||
      error.message.includes('network') ||
      error.message.includes('canister') ||
      error.message.includes('IC0508') ||
      error.message.includes('is stopped') ||
      error.message.includes('unreachable') ||
      error.message.includes('unavailable')
    ) {
      return 'Unable to connect to the server. Please check your connection and try again.';
    }
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
}

/**
 * Checks if an error is a connectivity/backend-unavailable error.
 */
export function isConnectivityError(error: unknown): boolean {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    return (
      msg.includes('timed out') ||
      msg.includes('actor not available') ||
      msg.includes('actor initialization timed out') ||
      msg.includes('failed to fetch') ||
      msg.includes('fetch failed') ||
      msg.includes('networkerror') ||
      msg.includes('network') ||
      msg.includes('canister') ||
      msg.includes('ic0508') ||
      msg.includes('is stopped') ||
      msg.includes('unreachable') ||
      msg.includes('unavailable')
    );
  }
  return false;
}
