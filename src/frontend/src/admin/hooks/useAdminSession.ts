import { useState } from 'react';

const ADMIN_TOKEN_KEY = 'admin_token';
const SESSION_ERROR_KEY = 'admin_session_error';

export function useAdminSession() {
  const [token, setTokenState] = useState<string | null>(() => {
    const stored = sessionStorage.getItem(ADMIN_TOKEN_KEY);
    // Validate stored token is a non-empty string
    if (stored && typeof stored === 'string' && stored.trim().length > 0) {
      return stored.trim();
    }
    return null;
  });

  const [sessionError, setSessionErrorState] = useState<string | null>(() => {
    const error = sessionStorage.getItem(SESSION_ERROR_KEY);
    if (error) {
      sessionStorage.removeItem(SESSION_ERROR_KEY);
    }
    return error;
  });

  const setToken = (newToken: string | null) => {
    // Only accept non-empty strings
    if (typeof newToken === 'string' && newToken.trim().length > 0) {
      const trimmed = newToken.trim();
      sessionStorage.setItem(ADMIN_TOKEN_KEY, trimmed);
      setTokenState(trimmed);
      // Clear any previous session errors
      sessionStorage.removeItem(SESSION_ERROR_KEY);
      setSessionErrorState(null);
    } else {
      console.error('Attempted to set invalid token:', newToken);
    }
  };

  const clearToken = () => {
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    setTokenState(null);
  };

  const getToken = (): string | null => {
    return token;
  };

  const setSessionError = (error: string) => {
    sessionStorage.setItem(SESSION_ERROR_KEY, error);
    setSessionErrorState(error);
  };

  const clearSessionError = () => {
    sessionStorage.removeItem(SESSION_ERROR_KEY);
    setSessionErrorState(null);
  };

  return {
    token,
    sessionError,
    setToken,
    clearToken,
    getToken,
    setSessionError,
    clearSessionError,
  };
}
