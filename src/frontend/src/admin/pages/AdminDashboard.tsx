import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard, FileText, Package, Image, MessageSquare } from 'lucide-react';
import { useGetSections, useGetProducts, useGetGallery, useGetMessages } from '../../hooks/useQueries';
import { useAdminSession } from '../hooks/useAdminSession';
import { LoadingState } from '../../components/QueryState';

export default function AdminDashboard() {
  const { token } = useAdminSession();
  const { data: sections, isLoading: sectionsLoading } = useGetSections();
  const { data: products, isLoading: productsLoading } = useGetProducts();
  const { data: gallery, isLoading: galleryLoading } = useGetGallery();
  const { data: messages, isLoading: messagesLoading } = useGetMessages(token);

  const isLoading = sectionsLoading || productsLoading || galleryLoading || messagesLoading;

  if (isLoading) {
    return <LoadingState message="Loading dashboard..." />;
  }

  const stats = [
    {
      title: 'Page Sections',
      value: sections?.length || 0,
      icon: FileText,
      description: 'Content sections',
    },
    {
      title: 'Products',
      value: products?.length || 0,
      icon: Package,
      description: 'Product listings',
    },
    {
      title: 'Gallery Items',
      value: gallery?.length || 0,
      icon: Image,
      description: 'Gallery images',
    },
    {
      title: 'Messages',
      value: messages?.length || 0,
      icon: MessageSquare,
      description: 'Contact messages',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to the admin panel. Manage your site content from here.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Use the sidebar navigation to manage different sections of your website.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
