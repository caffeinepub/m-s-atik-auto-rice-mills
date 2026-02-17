import { useGetSections, useGetProducts, useGetGallery, useGetMessages } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Package, Image, MessageSquare } from 'lucide-react';
import { LoadingState } from '../../components/QueryState';
import InitializeContentCard from '../components/InitializeContentCard';

export default function AdminDashboard() {
  const { data: sections, isLoading: sectionsLoading } = useGetSections();
  const { data: products, isLoading: productsLoading } = useGetProducts();
  const { data: gallery, isLoading: galleryLoading } = useGetGallery();
  const { data: messages, isLoading: messagesLoading } = useGetMessages();

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
      description: 'Contact submissions',
    },
  ];

  const hasContent = (sections?.length || 0) > 0 || (products?.length || 0) > 0 || (gallery?.length || 0) > 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the admin panel. Manage your website content from here.
        </p>
      </div>

      {!hasContent && <InitializeContentCard />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
    </div>
  );
}
