import { useEffect, useState } from 'react';
import { useAdminSession } from './hooks/useAdminSession';
import { useActor } from '../hooks/useActor';
import AdminLogin from './AdminLogin';
import AdminLayout from './AdminLayout';
import { LoadingState } from '../components/QueryState';
import { extractReplicaRejection } from './utils/replicaRejection';
import { getAuthErrorMessage, shouldPreserveToken } from './utils/adminAuthErrorMessages';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function AdminRoutes() {
  const { token, sessionError, clearToken, setSessionError, clearSessionError } = useAdminSession();
  const { actor, isFetching: actorLoading } = useActor();
  const [isValidating, setIsValidating] = useState(false);
  const [actorInitError, setActorInitError] = useState<string | null>(null);

  // Handle actor initialization errors when we have a token
  const hasToken = token && typeof token === 'string' && token.trim().length > 0;

  // Check if actor failed to initialize after a reasonable time
  useEffect(() => {
    if (hasToken && !actor && !actorLoading) {
      // Actor failed to initialize
      setActorInitError('Unable to connect to the admin backend service');
    } else if (actor) {
      // Actor initialized successfully
      setActorInitError(null);
    }
  }, [hasToken, actor, actorLoading]);

  // Validate token when actor is ready
  useEffect(() => {
    // Only validate if we have a valid non-empty string token
    if (!hasToken) {
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
        // Token is valid - validation succeeded, clear any session errors
        clearSessionError();
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
  if (actorLoading && hasToken) {
    return <LoadingState message="Loading admin panel..." />;
  }

  // If actor failed to initialize and we have a token, show backend unavailable state
  if (actorInitError && hasToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-lg w-full">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-destructive" />
              <CardTitle>Admin Backend Unavailable</CardTitle>
            </div>
            <CardDescription>
              Unable to connect to the admin backend service
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Connection Error</AlertTitle>
              <AlertDescription className="mt-2">
                {actorInitError}
              </AlertDescription>
            </Alert>
            <div className="flex gap-3">
              <Button onClick={() => window.location.reload()} className="flex-1 gap-2">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="flex-1"
              >
                Reload Page
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Not logged in - show login
  if (!hasToken) {
    return <AdminLogin sessionError={sessionError} />;
  }

  // Logged in with valid token - render admin layout with child routes
  return <AdminLayout />;
}
