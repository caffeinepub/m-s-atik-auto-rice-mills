import { useState } from 'react';
import { useInitializeContent } from '../../hooks/useQueries';
import { useAdminSession } from '../hooks/useAdminSession';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Loader2, Sparkles } from 'lucide-react';

export default function InitializeContentCard() {
  const [open, setOpen] = useState(false);
  const { token } = useAdminSession();
  const initializeContent = useInitializeContent();

  const handleInitialize = async () => {
    try {
      await initializeContent.mutateAsync(token);
      toast.success('Content initialized successfully!');
      setOpen(false);
    } catch (error) {
      toast.error('Failed to initialize content. Please try again.');
    }
  };

  return (
    <Card className="border-primary/50 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Initialize Content
        </CardTitle>
        <CardDescription>
          Your site appears to be empty. Initialize it with sample content to get started.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button>Initialize Sample Content</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Initialize Content?</AlertDialogTitle>
              <AlertDialogDescription>
                This will create sample sections, products, and gallery items. This action will not overwrite existing content.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleInitialize} disabled={initializeContent.isPending}>
                {initializeContent.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Initializing...
                  </>
                ) : (
                  'Initialize'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
