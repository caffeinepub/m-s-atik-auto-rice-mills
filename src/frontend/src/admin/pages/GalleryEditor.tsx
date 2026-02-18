import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Image, Plus, Pencil, Trash2 } from 'lucide-react';
import { useGetGallery } from '@/hooks/useQueries';
import { useAddGalleryItem, useUpdateGalleryItem, useDeleteGalleryItem } from '../hooks/useAdminContentMutations';
import { useAdminSession } from '../hooks/useAdminSession';
import { LoadingState, ErrorState, EmptyState } from '@/components/QueryState';
import { AdminDeleteConfirmDialog } from '../components/AdminDeleteConfirmDialog';
import { AdminFormErrorAlert } from '../components/AdminFormErrorAlert';
import { ImageStringUploadField } from '../components/ImageStringUploadField';
import { toast } from 'sonner';
import type { GalleryItem } from '@/backend';

export default function GalleryEditor() {
  const { token } = useAdminSession();
  const { data: gallery, isLoading, error, refetch } = useGetGallery();
  const addMutation = useAddGalleryItem();
  const updateMutation = useUpdateGalleryItem();
  const deleteMutation = useDeleteGalleryItem();

  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<GalleryItem | null>(null);
  const [formData, setFormData] = useState({ title: '', caption: '', imageUrl: '' });
  const [formError, setFormError] = useState<string | null>(null);

  const resetForm = () => {
    setFormData({ title: '', caption: '', imageUrl: '' });
    setFormError(null);
    setIsAdding(false);
    setEditingItem(null);
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setFormError('Title is required');
      return false;
    }
    if (!formData.imageUrl.trim()) {
      setFormError('Image URL is required');
      return false;
    }
    setFormError(null);
    return true;
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingItem(null);
    setFormData({ title: '', caption: '', imageUrl: '' });
    setFormError(null);
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setIsAdding(false);
    setFormData({
      title: item.title,
      caption: item.caption,
      imageUrl: item.imageUrl,
    });
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !token) return;

    try {
      if (editingItem) {
        await updateMutation.mutateAsync({
          id: editingItem.id,
          title: formData.title.trim(),
          caption: formData.caption.trim(),
          imageUrl: formData.imageUrl.trim(),
          adminToken: token,
        });
        toast.success('Gallery item updated successfully');
      } else {
        await addMutation.mutateAsync({
          title: formData.title.trim(),
          caption: formData.caption.trim(),
          imageUrl: formData.imageUrl.trim(),
          adminToken: token,
        });
        toast.success('Gallery item added successfully');
      }
      resetForm();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save gallery item');
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm || !token) return;

    try {
      await deleteMutation.mutateAsync({
        id: deleteConfirm.id,
        adminToken: token,
      });
      toast.success('Gallery item deleted successfully');
      setDeleteConfirm(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete gallery item');
      setDeleteConfirm(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Image className="h-8 w-8" />
            Gallery
          </h1>
          <p className="text-muted-foreground mt-2">Manage your image gallery</p>
        </div>
        <LoadingState message="Loading gallery..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Image className="h-8 w-8" />
            Gallery
          </h1>
          <p className="text-muted-foreground mt-2">Manage your image gallery</p>
        </div>
        <ErrorState message={error instanceof Error ? error.message : 'Failed to load gallery'} onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Image className="h-8 w-8" />
            Gallery
          </h1>
          <p className="text-muted-foreground mt-2">Manage your image gallery</p>
        </div>
        {!isAdding && !editingItem && (
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Image
          </Button>
        )}
      </div>

      {(isAdding || editingItem) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingItem ? 'Edit Gallery Item' : 'Add New Gallery Item'}</CardTitle>
            <CardDescription>{editingItem ? 'Update gallery item details' : 'Add a new image to your gallery'}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <AdminFormErrorAlert error={formError} />
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter image title"
                  disabled={addMutation.isPending || updateMutation.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="caption">Caption</Label>
                <Textarea
                  id="caption"
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="Enter image caption (optional)"
                  rows={3}
                  disabled={addMutation.isPending || updateMutation.isPending}
                />
              </div>
              <ImageStringUploadField
                label="Gallery Image"
                value={formData.imageUrl}
                onChange={(value) => setFormData({ ...formData, imageUrl: value })}
                disabled={addMutation.isPending || updateMutation.isPending}
                required
                placeholder="Enter image URL or upload a file"
                id="imageUrl"
              />
              <div className="flex gap-2">
                <Button type="submit" disabled={addMutation.isPending || updateMutation.isPending}>
                  {addMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} disabled={addMutation.isPending || updateMutation.isPending}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {!gallery || gallery.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <EmptyState
              message="No gallery items yet. Add your first image to get started."
              action={
                !isAdding && (
                  <Button onClick={handleAdd}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Image
                  </Button>
                )
              }
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {gallery.map((item) => (
            <Card key={item.id.toString()}>
              <CardHeader className="p-0">
                <div className="aspect-square relative overflow-hidden rounded-t-lg bg-muted">
                  <img src={item.imageUrl} alt={item.title} className="object-cover w-full h-full" />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-lg mb-2">{item.title}</CardTitle>
                {item.caption && <CardDescription className="line-clamp-2 mb-4">{item.caption}</CardDescription>}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(item)} disabled={isAdding || !!editingItem} className="flex-1">
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setDeleteConfirm(item)} disabled={deleteMutation.isPending}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AdminDeleteConfirmDialog
        open={!!deleteConfirm}
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Delete Gallery Item"
        description="Are you sure you want to delete this gallery item? This action cannot be undone."
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
