import { useState } from 'react';
import { useGetGallery } from '../hooks/useQueries';
import { LoadingState, EmptyState, CardSkeleton } from '../components/QueryState';
import BackendUnavailableState from '../components/BackendUnavailableState';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { isConnectivityError } from '../utils/queryTimeout';
import type { GalleryItem } from '../backend';

export default function GalleryPage() {
  const { data: gallery, isLoading, error, refetch } = useGetGallery();
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  if (isLoading) {
    return (
      <div className="py-16 md:py-24">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-12">Gallery</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error && isConnectivityError(error)) {
    return (
      <div className="py-16 md:py-24">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-12">Gallery</h1>
          <BackendUnavailableState onRetry={() => refetch()} />
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
            Explore our facilities, products, and the journey of quality rice processing.
          </p>
        </div>

        {!gallery || gallery.length === 0 ? (
          <EmptyState message="No gallery items available at the moment. Please check back soon." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map((item) => (
              <div
                key={Number(item.id)}
                className="group relative aspect-video overflow-hidden rounded-lg cursor-pointer bg-muted"
                onClick={() => setSelectedItem(item)}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = '/assets/generated/icons-set-3.dim_512x512.png';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-sm text-white/90">{item.caption}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Image Dialog */}
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedItem?.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <img
                src={selectedItem?.imageUrl || ''}
                alt={selectedItem?.title || ''}
                className="w-full rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = '/assets/generated/icons-set-3.dim_512x512.png';
                }}
              />
              <p className="text-muted-foreground">{selectedItem?.caption}</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
