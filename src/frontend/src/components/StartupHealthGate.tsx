import { ReactNode, useState } from 'react';
import { useBackendHealthStatus } from '../hooks/useBackendHealth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCw, RotateCw } from 'lucide-react';
import { useActor } from '../hooks/useActor';

interface StartupHealthGateProps {
  children: ReactNode;
}

export default function StartupHealthGate({ children }: StartupHealthGateProps) {
  const { actor, isFetching: actorFetching } = useActor();
  const [manualRetryCount, setManualRetryCount] = useState(0);
  
  // Enable automatic retries during startup
  const { status, message, refetch: refetchHealth, isRetrying, retriesExhausted } = useBackendHealthStatus(true, manualRetryCount);

  // Wait for actor initialization
  if (actorFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-lg w-full">
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
            <CardDescription>Connecting to the backend service</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <RotateCw className="h-8 w-8 animate-spin text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error if actor failed to initialize (not fetching but no actor)
  if (!actor) {
    const handleTryAgain = () => {
      // Trigger a page reload to reinitialize the actor
      window.location.reload();
    };

    const handleReload = () => {
      window.location.reload();
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-lg w-full">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-destructive" />
              <CardTitle>Connection Error</CardTitle>
            </div>
            <CardDescription>
              Unable to connect to the backend service
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Details</AlertTitle>
              <AlertDescription className="mt-2">
                Failed to initialize the backend connection. The service may be temporarily unavailable.
              </AlertDescription>
            </Alert>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>This could be due to:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Network connectivity issues</li>
                <li>Backend service temporarily unavailable</li>
                <li>Browser configuration blocking the connection</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex gap-3">
            <Button 
              onClick={handleTryAgain}
              className="flex-1 gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            <Button 
              variant="outline" 
              onClick={handleReload}
              className="flex-1"
            >
              Reload Page
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Show connecting/retrying state during automatic retries
  if (status === 'checking' || status === 'retrying') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-lg w-full">
          <CardHeader>
            <CardTitle>{isRetrying ? 'Reconnecting...' : 'Checking Connection...'}</CardTitle>
            <CardDescription>
              {isRetrying 
                ? 'The backend is starting up, please wait...' 
                : 'Verifying backend service availability'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <RotateCw className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">{message}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Only show unreachable UI after retries are exhausted
  if (status === 'unreachable' && retriesExhausted) {
    const handleTryAgain = () => {
      setManualRetryCount(prev => prev + 1);
      refetchHealth();
    };

    const handleReload = () => {
      window.location.reload();
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-lg w-full">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-destructive" />
              <CardTitle>Backend Unreachable</CardTitle>
            </div>
            <CardDescription>
              The backend service is not responding
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Connection Failed</AlertTitle>
              <AlertDescription className="mt-2">
                {message}
              </AlertDescription>
            </Alert>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Please try the following:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Check your internet connection</li>
                <li>Wait a moment and try again</li>
                <li>Reload the page to restart the connection</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex gap-3">
            <Button 
              onClick={handleTryAgain}
              className="flex-1 gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            <Button 
              variant="outline" 
              onClick={handleReload}
              className="flex-1"
            >
              Reload Page
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Backend is reachable, render the app
  return <>{children}</>;
}
