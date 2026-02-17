import { useForm } from 'react-hook-form';
import { useGetSiteSettings, useUpdateSiteSettings } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, ExternalLink } from 'lucide-react';
import { LoadingState, ErrorState } from '../../components/QueryState';
import { Link } from '@tanstack/react-router';

interface SiteSettingsForm {
  siteName: string;
  logoUrl: string;
}

export default function SiteSettingsEditor() {
  const { data: settings, isLoading, error, refetch } = useGetSiteSettings();
  const updateSettings = useUpdateSiteSettings();

  const { register, handleSubmit, formState: { errors } } = useForm<SiteSettingsForm>({
    values: settings ? {
      siteName: settings.siteName,
      logoUrl: settings.logoUrl,
    } : undefined,
  });

  if (isLoading) {
    return <LoadingState message="Loading settings..." />;
  }

  if (error) {
    return <ErrorState message="Failed to load settings" onRetry={() => refetch()} />;
  }

  const onSubmit = async (data: SiteSettingsForm) => {
    try {
      await updateSettings.mutateAsync(data);
      toast.success('Settings updated successfully!');
    } catch (error) {
      toast.error('Failed to update settings. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Site Settings</h1>
          <p className="text-muted-foreground">
            Manage your website's global settings and branding.
          </p>
        </div>
        <Link to="/">
          <Button variant="outline" size="sm">
            <ExternalLink className="mr-2 h-4 w-4" />
            View Site
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>
            Update your site name and logo URL.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                {...register('siteName', { required: 'Site name is required' })}
                placeholder="M/S Atik Auto Rice Mills"
                className={errors.siteName ? 'border-destructive' : ''}
              />
              {errors.siteName && (
                <p className="text-sm text-destructive">{errors.siteName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="logoUrl">Logo URL</Label>
              <Input
                id="logoUrl"
                {...register('logoUrl')}
                placeholder="/assets/generated/atik-logo.dim_512x512.png"
              />
              <p className="text-xs text-muted-foreground">
                Leave as default to use the generated logo, or provide a custom URL.
              </p>
            </div>

            <Button type="submit" disabled={updateSettings.isPending}>
              {updateSettings.isPending ? (
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
