/**
 * Client-side utility to store and retrieve the last connectivity error
 * for display in the diagnostics view.
 */

const STORAGE_KEY = 'last_connectivity_error';

export function storeConnectivityError(errorMessage: string): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, errorMessage);
  } catch (e) {
    // Ignore storage errors
    console.warn('Failed to store connectivity error:', e);
  }
}

export function getStoredConnectivityError(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch (e) {
    // Ignore storage errors
    return null;
  }
}

export function clearStoredConnectivityError(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    // Ignore storage errors
  }
}
