import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';
import { useGetContactInfo } from '@/hooks/useQueries';
import { useUpdateContactInfo } from '../hooks/useAdminContentMutations';
import { useAdminSession } from '../hooks/useAdminSession';
import { LoadingState, ErrorState } from '@/components/QueryState';
import { AdminFormErrorAlert } from '../components/AdminFormErrorAlert';
import { toast } from 'sonner';

export default function ContactInfoEditor() {
  const { token } = useAdminSession();
  const { data: contactInfo, isLoading, error, refetch } = useGetContactInfo();
  const updateMutation = useUpdateContactInfo();

  const [formData, setFormData] = useState({ address: '', phone: '', email: '' });
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (contactInfo) {
      setFormData({
        address: contactInfo.address,
        phone: contactInfo.phone,
        email: contactInfo.email,
      });
    }
  }, [contactInfo]);

  const validateForm = (): boolean => {
    if (!formData.address.trim()) {
      setFormError('Address is required');
      return false;
    }
    if (!formData.phone.trim()) {
      setFormError('Phone is required');
      return false;
    }
    if (!formData.email.trim()) {
      setFormError('Email is required');
      return false;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormError('Please enter a valid email address');
      return false;
    }
    setFormError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !token) return;

    try {
      await updateMutation.mutateAsync({
        address: formData.address.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        adminToken: token,
      });
      toast.success('Contact information updated successfully');
    } catch (err: any) {
      setFormError(err.message || 'Failed to update contact information');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Mail className="h-8 w-8" />
            Contact Info
          </h1>
          <p className="text-muted-foreground mt-2">Update your contact information</p>
        </div>
        <LoadingState message="Loading contact information..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Mail className="h-8 w-8" />
            Contact Info
          </h1>
          <p className="text-muted-foreground mt-2">Update your contact information</p>
        </div>
        <ErrorState message={error instanceof Error ? error.message : 'Failed to load contact information'} onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Mail className="h-8 w-8" />
          Contact Info
        </h1>
        <p className="text-muted-foreground mt-2">Update your contact information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>Update your business contact details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <AdminFormErrorAlert error={formError} />
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter business address"
                disabled={updateMutation.isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Enter phone number"
                disabled={updateMutation.isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email address"
                disabled={updateMutation.isPending}
              />
            </div>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
