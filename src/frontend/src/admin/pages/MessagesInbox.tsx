import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Trash2, Mail, Clock } from 'lucide-react';
import { useGetMessages } from '@/hooks/useQueries';
import { useDeleteMessage } from '../hooks/useAdminContentMutations';
import { useAdminSession } from '../hooks/useAdminSession';
import { LoadingState, ErrorState, EmptyState } from '@/components/QueryState';
import { AdminDeleteConfirmDialog } from '../components/AdminDeleteConfirmDialog';
import { toast } from 'sonner';
import type { ContactMessage } from '@/backend';

export default function MessagesInbox() {
  const { token } = useAdminSession();
  const { data: messages, isLoading, error, refetch } = useGetMessages(token);
  const deleteMutation = useDeleteMessage();

  const [deleteConfirm, setDeleteConfirm] = useState<ContactMessage | null>(null);

  const handleDelete = async () => {
    if (!deleteConfirm || !token) return;

    try {
      await deleteMutation.mutateAsync({
        id: deleteConfirm.id,
        adminToken: token,
      });
      toast.success('Message deleted successfully');
      setDeleteConfirm(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete message');
      setDeleteConfirm(null);
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <MessageSquare className="h-8 w-8" />
            Messages
          </h1>
          <p className="text-muted-foreground mt-2">View and manage contact form submissions</p>
        </div>
        <LoadingState message="Loading messages..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <MessageSquare className="h-8 w-8" />
            Messages
          </h1>
          <p className="text-muted-foreground mt-2">View and manage contact form submissions</p>
        </div>
        <ErrorState message={error instanceof Error ? error.message : 'Failed to load messages'} onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <MessageSquare className="h-8 w-8" />
          Messages
        </h1>
        <p className="text-muted-foreground mt-2">View and manage contact form submissions</p>
      </div>

      {!messages || messages.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <EmptyState message="No messages yet. Messages from your contact form will appear here." />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <Card key={message.id.toString()}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {message.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(message.timestamp)}
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setDeleteConfirm(message)} disabled={deleteMutation.isPending}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Email:</span>{' '}
                    <a href={`mailto:${message.email}`} className="text-primary hover:underline">
                      {message.email}
                    </a>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Message:</span>
                    <p className="mt-1 text-muted-foreground whitespace-pre-wrap">{message.message}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AdminDeleteConfirmDialog
        open={!!deleteConfirm}
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Delete Message"
        description="Are you sure you want to delete this message? This action cannot be undone."
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
