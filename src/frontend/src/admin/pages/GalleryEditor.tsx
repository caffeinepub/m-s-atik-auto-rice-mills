import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Image } from 'lucide-react';

export default function GalleryEditor() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Image className="h-8 w-8" />
          Gallery
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your image gallery
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gallery Management</CardTitle>
          <CardDescription>Upload and organize gallery images</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Gallery editor coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
