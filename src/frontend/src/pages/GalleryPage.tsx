import { useGetGallery } from '../hooks/useQueries';
import { LoadingState, ErrorState, EmptyState, CardSkeleton } from '../components/QueryState';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useState } from 'react';
import type { GalleryItem } from '../backend';

export default function GalleryPage() {
  const { data: gallery, isLoading, error, refetch } = useGetGallery();
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  if (isLoading) {
    return (
      <div className="py-16 md:py-24">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-12">Gallery</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
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
          <h1 className="text-4xl md:text-5xl font-bold mb-12">Gallery</h1>
          <ErrorState message="Failed to load gallery" onRetry={() => refetch()} />
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Gallery</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Take a look at our facilities, processes, and the quality that defines us.
          </p>
        </div>

        {!gallery || gallery.length === 0 ? (
          <EmptyState message="No gallery items available yet. Check back soon for updates." />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((item) => (
                <div
                  key={Number(item.id)}
                  className="group relative aspect-video bg-muted rounded-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all"
                  onClick={() => setSelectedItem(item)}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = '/assets/generated/hero-rice-mill.dim_1600x900.png';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      {item.caption && <p className="text-sm opacity-90">{item.caption}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>{selectedItem?.title}</DialogTitle>
                  {selectedItem?.caption && <DialogDescription>{selectedItem.caption}</DialogDescription>}
                </DialogHeader>
                <div className="mt-4">
                  <img
                    src={selectedItem?.imageUrl || ''}
                    alt={selectedItem?.title || ''}
                    className="w-full rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = '/assets/generated/hero-rice-mill.dim_1600x900.png';
                    }}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </div>
  );
}
