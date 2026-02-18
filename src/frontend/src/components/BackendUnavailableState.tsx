import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Link } from '@tanstack/react-router';
import { storeConnectivityError } from '../utils/connectivityDiagnostics';
import { useEffect } from 'react';

interface BackendUnavailableStateProps {
  onRetry?: () => void;
  compact?: boolean;
}

export default function BackendUnavailableState({ onRetry, compact = false }: BackendUnavailableStateProps) {
  const errorMessage = 'Unable to connect to the server. Please check your connection and try again.';

  // Store the error for diagnostics
  useEffect(() => {
    storeConnectivityError(errorMessage);
  }, [errorMessage]);

  if (compact) {
    return (
      <div className="py-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription className="mt-2 space-y-3">
            <p className="text-sm">{errorMessage}</p>
            <div className="flex flex-wrap gap-2">
              {onRetry && (
                <Button onClick={onRetry} variant="outline" size="sm" className="gap-2">
                  <RefreshCw className="h-3 w-3" />
                  Try Again
                </Button>
              )}
              <Link to="/diagnostics">
                <Button variant="ghost" size="sm">
                  View Diagnostics
                </Button>
              </Link>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="max-w-2xl mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="text-lg">Unable to Connect</AlertTitle>
          <AlertDescription className="mt-3 space-y-4">
            <p>{errorMessage}</p>
            <div className="flex flex-wrap gap-3">
              {onRetry && (
                <Button onClick={onRetry} variant="outline" size="default" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
              )}
              <Link to="/diagnostics">
                <Button variant="secondary" size="default">
                  View Diagnostics
                </Button>
              </Link>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
