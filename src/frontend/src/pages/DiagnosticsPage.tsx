import { useActor } from '../hooks/useActor';
import { useBackendHealthStatus } from '../hooks/useBackendHealth';
import { getStoredConnectivityError, clearStoredConnectivityError } from '../utils/connectivityDiagnostics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle, RefreshCw, Home } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export default function DiagnosticsPage() {
  const { actor, isFetching: actorLoading } = useActor();
  const { status, message, refetch } = useBackendHealthStatus();
  const [lastError, setLastError] = useState<string | null>(null);

  useEffect(() => {
    const stored = getStoredConnectivityError();
    setLastError(stored);
  }, []);

  const handleRetry = () => {
    clearStoredConnectivityError();
    setLastError(null);
    refetch();
    // Trigger a page reload to reinitialize the actor
    window.location.reload();
  };

  const actorStatus = actor ? 'initialized' : actorLoading ? 'initializing' : 'error';

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Connection Diagnostics</h1>
          <p className="text-muted-foreground">
            View the current status of the backend connection and troubleshoot connectivity issues.
          </p>
        </div>

        <div className="space-y-6">
          {/* Overall Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {status === 'reachable' ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-destructive" />
                )}
                Overall Status
              </CardTitle>
              <CardDescription>
                Current connection status to the backend service
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Badge
                    variant={status === 'reachable' ? 'default' : 'destructive'}
                    className="text-sm"
                  >
                    {status === 'checking' && 'Checking...'}
                    {status === 'reachable' && 'Connected'}
                    {status === 'unreachable' && 'Disconnected'}
                  </Badge>
                </div>
                <Button onClick={handleRetry} variant="outline" size="sm" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Retry Connection
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Actor Status */}
          <Card>
            <CardHeader>
              <CardTitle>Actor Initialization</CardTitle>
              <CardDescription>
                Status of the backend actor (API client)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Actor Status:</span>
                <Badge variant={actorStatus === 'initialized' ? 'default' : 'secondary'}>
                  {actorStatus}
                </Badge>
              </div>
              {actorStatus === 'error' && (
                <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <p className="text-sm text-destructive font-medium mb-1">Actor Error:</p>
                  <p className="text-sm text-muted-foreground">
                    Failed to initialize the backend actor. The backend may be unavailable.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Health Check */}
          <Card>
            <CardHeader>
              <CardTitle>Backend Health Check</CardTitle>
              <CardDescription>
                Direct health check query to the backend canister
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Health Status:</span>
                <Badge
                  variant={status === 'reachable' ? 'default' : status === 'checking' ? 'secondary' : 'destructive'}
                >
                  {status}
                </Badge>
              </div>
              <Separator />
              <div className="p-3 bg-muted/50 rounded-md">
                <p className="text-sm">{message}</p>
              </div>
            </CardContent>
          </Card>

          {/* Last Error */}
          {lastError && (
            <Card>
              <CardHeader>
                <CardTitle>Last Connectivity Error</CardTitle>
                <CardDescription>
                  Most recent error message from a failed connection attempt
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <p className="text-sm text-destructive">{lastError}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Troubleshooting Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Troubleshooting Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Check your internet connection</li>
                <li>Verify that the backend canister is running</li>
                <li>Try refreshing the page</li>
                <li>Clear your browser cache and cookies</li>
                <li>If the issue persists, the service may be under maintenance</li>
              </ul>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Link to="/" className="flex-1">
              <Button variant="default" className="w-full gap-2">
                <Home className="h-4 w-4" />
                Return to Home
              </Button>
            </Link>
            <Button onClick={() => window.location.reload()} variant="outline" className="flex-1">
              Reload Page
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
