/**
 * Utility to extract and normalize replica rejection error details from thrown errors.
 * Handles IC0508 (canister stopped) and other replica rejection codes.
 */

export interface ReplicaRejectionDetails {
  errorCode?: string;
  rejectCode?: number;
  rejectMessage?: string;
  isCanisterStopped: boolean;
}

/**
 * Extracts replica rejection details from an error object.
 * Handles various error shapes including nested causes and string messages.
 */
export function extractReplicaRejection(error: any): ReplicaRejectionDetails {
  const details: ReplicaRejectionDetails = {
    isCanisterStopped: false,
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
  }

  // Check error message string for rejection details
  if (error.message && typeof error.message === 'string') {
    const message = error.message;
    
    // Extract error code (IC0508, etc.)
    const errorCodeMatch = message.match(/IC\d{4}/);
    if (errorCodeMatch && !details.errorCode) {
      details.errorCode = errorCodeMatch[0];
    }

    // Extract reject code
    const rejectCodeMatch = message.match(/Reject code:\s*(\d+)/);
    if (rejectCodeMatch && details.rejectCode === undefined) {
      details.rejectCode = Number(rejectCodeMatch[1]);
    }

    // Extract reject message
    const rejectMessageMatch = message.match(/Reject text:\s*([^\n]+)/);
    if (rejectMessageMatch && !details.rejectMessage) {
      details.rejectMessage = rejectMessageMatch[1].trim();
    }

    // Store the full message if we don't have a reject message yet
    if (!details.rejectMessage && message.includes('is stopped')) {
      details.rejectMessage = message;
    }
  }

  // Determine if this is a canister-stopped error
  details.isCanisterStopped = 
    details.errorCode === 'IC0508' ||
    details.rejectCode === 5 ||
    (details.rejectMessage?.toLowerCase().includes('is stopped') ?? false);

  return details;
}
