import { useForm } from 'react-hook-form';
import { useGetContactInfo, useUpdateContactInfo } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, ExternalLink } from 'lucide-react';
import { LoadingState, ErrorState } from '../../components/QueryState';
import { Link } from '@tanstack/react-router';

interface ContactInfoForm {
  address: string;
  phone: string;
  email: string;
}

export default function ContactInfoEditor() {
  const { data: contactInfo, isLoading, error, refetch } = useGetContactInfo();
  const updateContactInfo = useUpdateContactInfo();

  const { register, handleSubmit, formState: { errors } } = useForm<ContactInfoForm>({
    values: contactInfo ? {
      address: contactInfo.address,
      phone: contactInfo.phone,
      email: contactInfo.email,
    } : undefined,
  });

  if (isLoading) {
    return <LoadingState message="Loading contact information..." />;
  }

  if (error) {
    return <ErrorState message="Failed to load contact information" onRetry={() => refetch()} />;
  }

  const onSubmit = async (data: ContactInfoForm) => {
    try {
      await updateContactInfo.mutateAsync(data);
      toast.success('Contact information updated successfully!');
    } catch (error) {
      toast.error('Failed to update contact information. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Contact Information</h1>
          <p className="text-muted-foreground">
            Update your business contact details displayed on the website.
          </p>
        </div>
        <Link to="/contact">
          <Button variant="outline" size="sm">
            <ExternalLink className="mr-2 h-4 w-4" />
            Preview
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contact Details</CardTitle>
          <CardDescription>
            These details will be displayed on your contact page and footer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                {...register('address', { required: 'Address is required' })}
                placeholder="123 Main Street, City, Country"
                rows={3}
                className={errors.address ? 'border-destructive' : ''}
              />
              {errors.address && (
                <p className="text-sm text-destructive">{errors.address.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                {...register('phone', { required: 'Phone is required' })}
                placeholder="+1 234 567 8900"
                className={errors.phone ? 'border-destructive' : ''}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                placeholder="info@example.com"
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <Button type="submit" disabled={updateContactInfo.isPending}>
              {updateContactInfo.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
