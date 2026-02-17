import { useState } from 'react';
import { useGetMessages, useDeleteMessage } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, Trash2, Mail } from 'lucide-react';
import { LoadingState, ErrorState, EmptyState } from '../../components/QueryState';
import type { ContactMessage } from '../../backend';

export default function MessagesInbox() {
  const { data: messages, isLoading, error, refetch } = useGetMessages();
  const deleteMessage = useDeleteMessage();
  const [deletingMessage, setDeletingMessage] = useState<ContactMessage | null>(null);

  if (isLoading) {
    return <LoadingState message="Loading messages..." />;
  }

  if (error) {
    return <ErrorState message="Failed to load messages" onRetry={() => refetch()} />;
  }

  const handleDelete = async () => {
    if (!deletingMessage) return;
    try {
      await deleteMessage.mutateAsync(deletingMessage.id);
      toast.success('Message deleted successfully!');
      setDeletingMessage(null);
    } catch (error) {
      toast.error('Failed to delete message. Please try again.');
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Messages Inbox</h1>
        <p className="text-muted-foreground">
          View and manage contact form submissions.
        </p>
      </div>

      {!messages || messages.length === 0 ? (
        <EmptyState message="No messages yet. Messages from your contact form will appear here." />
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <Card key={Number(message.id)}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {message.name}
                    </CardTitle>
                    <CardDescription>
                      {message.email} • {formatDate(message.timestamp)}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeletingMessage(message)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{message.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!deletingMessage} onOpenChange={() => setDeletingMessage(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Message?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this message from {deletingMessage?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleteMessage.isPending}>
              {deleteMessage.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
