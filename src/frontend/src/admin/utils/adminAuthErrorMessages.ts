/**
 * Centralized user-facing English error messages for admin authentication states.
 */

import { ReplicaRejectionDetails } from './replicaRejection';

export const ADMIN_AUTH_ERRORS = {
  CANISTER_STOPPED: 'The admin backend is temporarily unavailable. The service may be stopped or under maintenance. Please try again later.',
  BACKEND_UNAVAILABLE: 'The admin backend is temporarily unavailable. Please try again later.',
  INVALID_CREDENTIALS: 'Invalid username or password. Please check your credentials and try again.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  SESSION_INVALID: 'Your session is invalid. Please log in again.',
  GENERIC_ERROR: 'An error occurred. Please try again.',
} as const;

/**
 * Converts replica rejection details into a user-friendly English error message.
 */
export function getAuthErrorMessage(
  details: ReplicaRejectionDetails,
  context: 'login' | 'validation'
): string {
  // IC0508 / canister stopped
  if (details.isCanisterStopped) {
    return ADMIN_AUTH_ERRORS.CANISTER_STOPPED;
  }

  // General connectivity failure
  if (details.isConnectivityFailure) {
    return ADMIN_AUTH_ERRORS.BACKEND_UNAVAILABLE;
  }

  // For validation context, distinguish between expired/invalid
  if (context === 'validation') {
    return ADMIN_AUTH_ERRORS.SESSION_EXPIRED;
  }

  // For login context, assume invalid credentials if not a system error
  return ADMIN_AUTH_ERRORS.INVALID_CREDENTIALS;
}

/**
 * Determines if an error should preserve the stored admin token.
 * Returns true for temporary backend issues (IC0508, connectivity failures), false for auth failures.
 */
export function shouldPreserveToken(details: ReplicaRejectionDetails): boolean {
  return details.isCanisterStopped || details.isConnectivityFailure;
}
