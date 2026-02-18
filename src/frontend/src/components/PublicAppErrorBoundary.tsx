import React, { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class PublicAppErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error safely without exposing sensitive information
    console.error('Application error caught by boundary:', error, errorInfo);
  }

  handleReload = () => {
    // Clear error state and reload
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  handleGoHome = () => {
    // Clear error state and navigate home
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <Card className="max-w-lg w-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-destructive" />
                <CardTitle>Something Went Wrong</CardTitle>
              </div>
              <CardDescription>
                We encountered an unexpected error while loading the page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Details</AlertTitle>
                <AlertDescription className="mt-2">
                  {this.state.error?.message || 'An unknown error occurred'}
                </AlertDescription>
              </Alert>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>Try the following to resolve this issue:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Reload the page to restart the application</li>
                  <li>Return to the home page and try again</li>
                  <li>Clear your browser cache if the problem persists</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex gap-3">
              <Button onClick={this.handleReload} className="flex-1">
                Reload Page
              </Button>
              <Button 
                variant="outline" 
                onClick={this.handleGoHome}
                className="flex-1"
              >
                Go to Home
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
