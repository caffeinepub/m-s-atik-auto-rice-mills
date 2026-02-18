import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function SectionsEditor() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <FileText className="h-8 w-8" />
          Page Sections
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage content sections for your website pages
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Content Sections</CardTitle>
          <CardDescription>Create and edit page sections</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Section editor coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
