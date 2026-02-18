import { useState } from 'react';
import { useAdminSession } from '../hooks/useAdminSession';
import { useListAdminAccounts, useAddAdminAccount, useDeleteAdminAccount } from '../hooks/useAdminAccounts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Loader2, UserPlus, Users, Trash2, AlertCircle, CheckCircle2, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { LoadingState, ErrorState, EmptyState } from '@/components/QueryState';

export default function AdminAccountsPage() {
  const { token } = useAdminSession();
  const { data: adminAccounts, isLoading, error, refetch } = useListAdminAccounts(token);
  const { mutate: addAdmin, isPending: isAdding } = useAddAdminAccount();
  const { mutate: deleteAdmin, isPending: isDeleting } = useDeleteAdminAccount();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setSuccessMessage(null);

    // Client-side validation
    if (!username.trim() || !password.trim()) {
      setValidationError('Username and password are required.');
      return;
    }

    if (username.trim().length < 3) {
      setValidationError('Username must be at least 3 characters long.');
      return;
    }

    if (password.length < 4) {
      setValidationError('Password must be at least 4 characters long.');
      return;
    }

    // Submit to backend
    addAdmin(
      { username: username.trim(), password, adminToken: token },
      {
        onSuccess: () => {
          setSuccessMessage(`Admin account "${username}" created successfully!`);
          setUsername('');
          setPassword('');
          toast.success('Admin account created successfully');
          refetch();
        },
        onError: (error: any) => {
          const message = error.message || 'Failed to create admin account. Please try again.';
          setValidationError(message);
          toast.error(message);
        },
      }
    );
  };

  const handleDeleteAdmin = (usernameToDelete: string) => {
    deleteAdmin(
      { username: usernameToDelete, adminToken: token },
      {
        onSuccess: () => {
          toast.success(`Admin account "${usernameToDelete}" deleted successfully`);
          refetch();
        },
        onError: (error: any) => {
          const message = error.message || 'Failed to delete admin account.';
          toast.error(message);
        },
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Admin Accounts</h1>
        <p className="text-muted-foreground mt-2">Manage multiple admin accounts for your site</p>
      </div>

      <div className="grid gap-6">
        {/* Add New Admin Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Add New Admin
            </CardTitle>
            <CardDescription>
              Create a new admin account with username and password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddAdmin} className="space-y-4">
              {successMessage && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
                </Alert>
              )}

              {validationError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{validationError}</AlertDescription>
                </Alert>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    disabled={isAdding}
                    autoComplete="off"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    disabled={isAdding}
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <Button type="submit" disabled={isAdding}>
                {isAdding ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Admin...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Admin Account
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Existing Admins List Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Existing Admin Accounts
            </CardTitle>
            <CardDescription>
              View and manage all admin accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingState message="Loading admin accounts..." />
            ) : error ? (
              <ErrorState 
                message={error instanceof Error ? error.message : 'Failed to load admin accounts'} 
                onRetry={refetch} 
              />
            ) : !adminAccounts || adminAccounts.length === 0 ? (
              <EmptyState message="No admin accounts found" />
            ) : (
              <div className="space-y-2">
                {adminAccounts.map((adminUsername) => (
                  <div
                    key={adminUsername}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{adminUsername}</p>
                        {adminUsername === 'admin' && (
                          <p className="text-xs text-muted-foreground">Default admin account</p>
                        )}
                      </div>
                    </div>

                    {adminUsername !== 'admin' && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={isDeleting}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Admin Account</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete the admin account "{adminUsername}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteAdmin(adminUsername)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
