import { useState } from 'react';
import { useGetSiteSettings, useSaveSiteSettings } from '../../hooks/useQueries';
import { useAdminSession } from '../hooks/useAdminSession';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingState, ErrorState } from '../../components/QueryState';
import { Settings, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function SiteSettingsEditor() {
  const { token } = useAdminSession();
  const { data: settings, isLoading, error } = useGetSiteSettings();
  const saveMutation = useSaveSiteSettings();

  const [siteName, setSiteName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  // Initialize form when settings load
  useState(() => {
    if (settings) {
      setSiteName(settings.siteName);
      setLogoUrl(settings.logoUrl);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await saveMutation.mutateAsync({
        siteName,
        logoUrl,
        adminToken: token,
      });
      toast.success('Site settings saved successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save site settings');
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading site settings..." />;
  }

  if (error) {
    return <ErrorState message="Failed to load site settings" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Settings className="h-8 w-8" />
          Site Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Configure your website's basic information
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Update your site name and logo</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="Enter site name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logoUrl">Logo URL</Label>
              <Input
                id="logoUrl"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="Enter logo URL"
                required
              />
            </div>

            <Button type="submit" disabled={saveMutation.isPending} className="gap-2">
              <Save className="h-4 w-4" />
              {saveMutation.isPending ? 'Saving...' : 'Save Settings'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
