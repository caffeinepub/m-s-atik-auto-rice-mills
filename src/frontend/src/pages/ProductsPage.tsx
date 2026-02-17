import { useGetProducts } from '../hooks/useQueries';
import { LoadingState, ErrorState, EmptyState, CardSkeleton } from '../components/QueryState';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ProductsPage() {
  const { data: products, isLoading, error, refetch } = useGetProducts();

  if (isLoading) {
    return (
      <div className="py-16 md:py-24">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-12">Our Products</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 md:py-24">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-12">Our Products</h1>
          <ErrorState message="Failed to load products" onRetry={() => refetch()} />
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Products</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our range of premium quality rice products, carefully processed to preserve natural goodness.
          </p>
        </div>

        {!products || products.length === 0 ? (
          <EmptyState message="No products available at the moment. Please check back soon." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Card key={Number(product.id)} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-muted relative overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/assets/generated/icons-set-3.dim_512x512.png';
                    }}
                  />
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl">{product.name}</CardTitle>
                    {Number(product.price) > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        ${Number(product.price)}
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="mt-2">{product.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
