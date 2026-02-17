import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useGetGallery, useAddGalleryItem, useUpdateGalleryItem, useDeleteGalleryItem } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Loader2, Plus, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { LoadingState, ErrorState, EmptyState } from '../../components/QueryState';
import { Link } from '@tanstack/react-router';
import type { GalleryItem } from '../../backend';

interface GalleryForm {
  title: string;
  caption: string;
  imageUrl: string;
}

export default function GalleryEditor() {
  const { data: gallery, isLoading, error, refetch } = useGetGallery();
  const addGalleryItem = useAddGalleryItem();
  const updateGalleryItem = useUpdateGalleryItem();
  const deleteGalleryItem = useDeleteGalleryItem();

  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<GalleryItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<GalleryForm>();

  if (isLoading) {
    return <LoadingState message="Loading gallery..." />;
  }

  if (error) {
    return <ErrorState message="Failed to load gallery" onRetry={() => refetch()} />;
  }

  const onSubmit = async (data: GalleryForm) => {
    try {
      if (editingItem) {
        await updateGalleryItem.mutateAsync({ id: editingItem.id, ...data });
        toast.success('Gallery item updated successfully!');
      } else {
        await addGalleryItem.mutateAsync(data);
        toast.success('Gallery item added successfully!');
      }
      setDialogOpen(false);
      setEditingItem(null);
      reset();
    } catch (error) {
      toast.error('Failed to save gallery item. Please try again.');
    }
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    reset({ title: item.title, caption: item.caption, imageUrl: item.imageUrl });
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    try {
      await deleteGalleryItem.mutateAsync(deletingItem.id);
      toast.success('Gallery item deleted successfully!');
      setDeletingItem(null);
    } catch (error) {
      toast.error('Failed to delete gallery item. Please try again.');
    }
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditingItem(null);
      reset({ title: '', caption: '', imageUrl: '' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gallery</h1>
          <p className="text-muted-foreground">
            Manage your gallery images and captions.
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/gallery">
            <Button variant="outline" size="sm">
              <ExternalLink className="mr-2 h-4 w-4" />
              Preview
            </Button>
          </Link>
          <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Image
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingItem ? 'Edit Gallery Item' : 'Add Gallery Item'}</DialogTitle>
                <DialogDescription>
                  {editingItem ? 'Update the gallery item details below.' : 'Add a new image to your gallery.'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    {...register('title', { required: 'Title is required' })}
                    placeholder="Image title"
                    className={errors.title ? 'border-destructive' : ''}
                  />
                  {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="caption">Caption</Label>
                  <Textarea
                    id="caption"
                    {...register('caption')}
                    placeholder="Optional caption for the image"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL *</Label>
                  <Input
                    id="imageUrl"
                    {...register('imageUrl', { required: 'Image URL is required' })}
                    placeholder="/assets/generated/hero-rice-mill.dim_1600x900.png"
                    className={errors.imageUrl ? 'border-destructive' : ''}
                  />
                  {errors.imageUrl && <p className="text-sm text-destructive">{errors.imageUrl.message}</p>}
                  <p className="text-xs text-muted-foreground">Provide a URL to the image</p>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => handleDialogClose(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={addGalleryItem.isPending || updateGalleryItem.isPending}>
                    {(addGalleryItem.isPending || updateGalleryItem.isPending) ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save'
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {!gallery || gallery.length === 0 ? (
          <div className="col-span-full">
            <EmptyState message="No gallery items yet. Add your first image to get started." />
          </div>
        ) : (
          gallery.map((item) => (
            <div key={Number(item.id)} className="group relative aspect-video bg-muted rounded-lg overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/assets/generated/hero-rice-mill.dim_1600x900.png';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  {item.caption && <p className="text-sm opacity-90 line-clamp-2">{item.caption}</p>}
                  <div className="flex gap-2 mt-3">
                    <Button variant="secondary" size="sm" onClick={() => handleEdit(item)}>
                      <Pencil className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => setDeletingItem(item)}>
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <AlertDialog open={!!deletingItem} onOpenChange={() => setDeletingItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Gallery Item?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingItem?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleteGalleryItem.isPending}>
              {deleteGalleryItem.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
