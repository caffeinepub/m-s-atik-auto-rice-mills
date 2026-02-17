import { useEffect, useState } from 'react';
import { useAdminSession } from './hooks/useAdminSession';
import { useActor } from '../hooks/useActor';
import AdminLogin from './AdminLogin';
import AdminLayout from './AdminLayout';
import { LoadingState } from '../components/QueryState';
import { extractReplicaRejection } from './utils/replicaRejection';
import { getAuthErrorMessage, shouldPreserveToken } from './utils/adminAuthErrorMessages';

export default function AdminRoutes() {
  const { token, sessionError, clearToken, setSessionError } = useAdminSession();
  const { actor, isFetching: actorLoading } = useActor();
  const [isValidating, setIsValidating] = useState(false);

  // Validate token when actor is ready
  useEffect(() => {
    // Only validate if we have a valid non-empty string token
    if (!token || typeof token !== 'string' || token.trim().length === 0) {
      return;
    }
    
    if (!actor || actorLoading) {
      return;
    }

    // Prevent multiple simultaneous validations
    if (isValidating) {
      return;
    }

    // Try to validate the token by making a simple admin call
    const validateToken = async () => {
      setIsValidating(true);
      try {
        // Use getMessages as a validation call - it requires admin token
        await actor.getMessages(token);
        // Token is valid - validation succeeded
      } catch (error: any) {
        // Extract replica rejection details
        const rejectionDetails = extractReplicaRejection(error);
        
        // Get user-friendly error message
        const userMessage = getAuthErrorMessage(rejectionDetails, 'validation');
        
        // Determine if we should preserve the token (for temporary backend issues)
        if (shouldPreserveToken(rejectionDetails)) {
          // Backend is temporarily unavailable - keep token, show error
          console.error('Token validation failed due to backend unavailability:', error);
          setSessionError(userMessage);
        } else {
          // Token is invalid or expired - clear it
          console.error('Token validation failed:', error);
          clearToken();
          setSessionError(userMessage);
        }
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token, actor, actorLoading]); // Removed clearToken and setSessionError from deps to avoid loops

  // Show loading while actor is initializing
  if (actorLoading) {
    return <LoadingState message="Loading admin panel..." />;
  }

  // Not logged in - show login
  if (!token || typeof token !== 'string' || token.trim().length === 0) {
    return <AdminLogin sessionError={sessionError} />;
  }

  // Logged in with valid token - render admin layout with child routes
  return <AdminLayout />;
}
