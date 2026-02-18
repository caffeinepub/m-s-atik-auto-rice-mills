import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Package, Plus, Pencil, Trash2 } from 'lucide-react';
import { useGetProducts } from '@/hooks/useQueries';
import { useAddProduct, useUpdateProduct, useDeleteProduct } from '../hooks/useAdminContentMutations';
import { useAdminSession } from '../hooks/useAdminSession';
import { LoadingState, ErrorState, EmptyState } from '@/components/QueryState';
import { AdminDeleteConfirmDialog } from '../components/AdminDeleteConfirmDialog';
import { AdminFormErrorAlert } from '../components/AdminFormErrorAlert';
import { ImageStringUploadField } from '../components/ImageStringUploadField';
import { toast } from 'sonner';
import type { Product } from '@/backend';

export default function ProductsEditor() {
  const { token } = useAdminSession();
  const { data: products, isLoading, error, refetch } = useGetProducts();
  const addMutation = useAddProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Product | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', imageUrl: '' });
  const [formError, setFormError] = useState<string | null>(null);

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', imageUrl: '' });
    setFormError(null);
    setIsAdding(false);
    setEditingProduct(null);
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setFormError('Product name is required');
      return false;
    }
    if (!formData.description.trim()) {
      setFormError('Description is required');
      return false;
    }
    if (!formData.imageUrl.trim()) {
      setFormError('Image URL is required');
      return false;
    }
    const priceNum = Number(formData.price);
    if (!formData.price || isNaN(priceNum) || priceNum < 0) {
      setFormError('Valid price is required');
      return false;
    }
    setFormError(null);
    return true;
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingProduct(null);
    setFormData({ name: '', description: '', price: '', imageUrl: '' });
    setFormError(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsAdding(false);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      imageUrl: product.imageUrl,
    });
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !token) return;

    try {
      const price = BigInt(formData.price);
      if (editingProduct) {
        await updateMutation.mutateAsync({
          id: editingProduct.id,
          name: formData.name.trim(),
          description: formData.description.trim(),
          price,
          imageUrl: formData.imageUrl.trim(),
          adminToken: token,
        });
        toast.success('Product updated successfully');
      } else {
        await addMutation.mutateAsync({
          name: formData.name.trim(),
          description: formData.description.trim(),
          price,
          imageUrl: formData.imageUrl.trim(),
          adminToken: token,
        });
        toast.success('Product added successfully');
      }
      resetForm();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save product');
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm || !token) return;

    try {
      await deleteMutation.mutateAsync({
        id: deleteConfirm.id,
        adminToken: token,
      });
      toast.success('Product deleted successfully');
      setDeleteConfirm(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete product');
      setDeleteConfirm(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Package className="h-8 w-8" />
            Products
          </h1>
          <p className="text-muted-foreground mt-2">Manage your product catalog</p>
        </div>
        <LoadingState message="Loading products..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Package className="h-8 w-8" />
            Products
          </h1>
          <p className="text-muted-foreground mt-2">Manage your product catalog</p>
        </div>
        <ErrorState message={error instanceof Error ? error.message : 'Failed to load products'} onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Package className="h-8 w-8" />
            Products
          </h1>
          <p className="text-muted-foreground mt-2">Manage your product catalog</p>
        </div>
        {!isAdding && !editingProduct && (
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        )}
      </div>

      {(isAdding || editingProduct) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</CardTitle>
            <CardDescription>{editingProduct ? 'Update product details' : 'Add a new product to your catalog'}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <AdminFormErrorAlert error={formError} />
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter product name"
                  disabled={addMutation.isPending || updateMutation.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter product description"
                  rows={4}
                  disabled={addMutation.isPending || updateMutation.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="Enter price"
                  disabled={addMutation.isPending || updateMutation.isPending}
                />
              </div>
              <ImageStringUploadField
                label="Product Image"
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

      {!products || products.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <EmptyState
              message="No products yet. Add your first product to get started."
              action={
                !isAdding && (
                  <Button onClick={handleAdd}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                )
              }
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id.toString()}>
              <CardHeader>
                <div className="aspect-video relative overflow-hidden rounded-md bg-muted mb-4">
                  <img src={product.imageUrl} alt={product.name} className="object-cover w-full h-full" />
                </div>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <CardDescription className="mt-2 line-clamp-2">{product.description}</CardDescription>
                    <p className="text-lg font-semibold mt-2">${product.price.toString()}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(product)} disabled={isAdding || !!editingProduct} className="flex-1">
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setDeleteConfirm(product)} disabled={deleteMutation.isPending}>
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
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
