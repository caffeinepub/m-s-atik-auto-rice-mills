/**
 * Utility to extract and normalize replica rejection error details from thrown errors.
 * Handles IC0508 (canister stopped) and other replica rejection codes, plus general connectivity failures.
 */

export interface ReplicaRejectionDetails {
  errorCode?: string;
  rejectCode?: number;
  rejectMessage?: string;
  isCanisterStopped: boolean;
  isConnectivityFailure: boolean;
  isUnauthorized: boolean;
}

/**
 * Extracts replica rejection details from an error object.
 * Handles various error shapes including nested causes and string messages.
 */
export function extractReplicaRejection(error: any): ReplicaRejectionDetails {
  const details: ReplicaRejectionDetails = {
    isCanisterStopped: false,
    isConnectivityFailure: false,
    isUnauthorized: false,
  };

  if (!error) {
    return details;
  }

  // Check direct properties
  if (error.error_code) {
    details.errorCode = String(error.error_code);
  }
  if (error.reject_code !== undefined) {
    details.rejectCode = Number(error.reject_code);
  }
  if (error.reject_message) {
    details.rejectMessage = String(error.reject_message);
  }

  // Check nested cause
  if (error.cause) {
    const causeDetails = extractReplicaRejection(error.cause);
    if (causeDetails.errorCode) details.errorCode = causeDetails.errorCode;
    if (causeDetails.rejectCode) details.rejectCode = causeDetails.rejectCode;
    if (causeDetails.rejectMessage) details.rejectMessage = causeDetails.rejectMessage;
    if (causeDetails.isUnauthorized) details.isUnauthorized = true;
  }

  // Check error message string for rejection details
  if (error.message && typeof error.message === 'string') {
    const message = error.message.toLowerCase();
    
    // Extract error code (IC0508, etc.)
    const errorCodeMatch = error.message.match(/IC\d{4}/);
    if (errorCodeMatch && !details.errorCode) {
      details.errorCode = errorCodeMatch[0];
    }

    // Extract reject code
    const rejectCodeMatch = error.message.match(/Reject code:\s*(\d+)/);
    if (rejectCodeMatch && details.rejectCode === undefined) {
      details.rejectCode = Number(rejectCodeMatch[1]);
    }

    // Extract reject message
    const rejectMessageMatch = error.message.match(/Reject text:\s*([^\n]+)/);
    if (rejectMessageMatch && !details.rejectMessage) {
      details.rejectMessage = rejectMessageMatch[1].trim();
    }

    // Store the full message if we don't have a reject message yet
    if (!details.rejectMessage && message.includes('is stopped')) {
      details.rejectMessage = error.message;
    }

    // Check for unauthorized/invalid token patterns
    if (
      message.includes('unauthorized') ||
      message.includes('invalid') && (message.includes('token') || message.includes('admin')) ||
      message.includes('expired') ||
      message.includes('only admins can') ||
      (details.rejectMessage && (
        details.rejectMessage.toLowerCase().includes('unauthorized') ||
        details.rejectMessage.toLowerCase().includes('invalid') ||
        details.rejectMessage.toLowerCase().includes('expired')
      ))
    ) {
      details.isUnauthorized = true;
    }

    // Check for general connectivity failures
    if (
      message.includes('timed out') ||
      message.includes('actor not available') ||
      message.includes('actor initialization timed out') ||
      message.includes('failed to fetch') ||
      message.includes('fetch failed') ||
      message.includes('networkerror') ||
      message.includes('network') ||
      message.includes('unreachable') ||
      message.includes('unavailable')
    ) {
      details.isConnectivityFailure = true;
    }
  }

  // Determine if this is a canister-stopped error
  details.isCanisterStopped = 
    details.errorCode === 'IC0508' ||
    details.rejectCode === 5 ||
    (details.rejectMessage?.toLowerCase().includes('is stopped') ?? false);

  // Canister stopped is also a connectivity failure
  if (details.isCanisterStopped) {
    details.isConnectivityFailure = true;
  }

  return details;
}
