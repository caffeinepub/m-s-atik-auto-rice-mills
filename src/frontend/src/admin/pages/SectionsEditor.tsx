import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Plus, Pencil, Trash2 } from 'lucide-react';
import { useGetSections } from '@/hooks/useQueries';
import { useCreateSection, useUpdateSection, useDeleteSection } from '../hooks/useAdminContentMutations';
import { useAdminSession } from '../hooks/useAdminSession';
import { LoadingState, ErrorState, EmptyState } from '@/components/QueryState';
import { AdminDeleteConfirmDialog } from '../components/AdminDeleteConfirmDialog';
import { AdminFormErrorAlert } from '../components/AdminFormErrorAlert';
import { toast } from 'sonner';
import type { Section } from '@/backend';

export default function SectionsEditor() {
  const { token } = useAdminSession();
  const { data: sections, isLoading, error, refetch } = useGetSections();
  const createMutation = useCreateSection();
  const updateMutation = useUpdateSection();
  const deleteMutation = useDeleteSection();

  const [isAdding, setIsAdding] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Section | null>(null);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [formError, setFormError] = useState<string | null>(null);

  const resetForm = () => {
    setFormData({ title: '', content: '' });
    setFormError(null);
    setIsAdding(false);
    setEditingSection(null);
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setFormError('Title is required');
      return false;
    }
    if (!formData.content.trim()) {
      setFormError('Content is required');
      return false;
    }
    setFormError(null);
    return true;
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingSection(null);
    setFormData({ title: '', content: '' });
    setFormError(null);
  };

  const handleEdit = (section: Section) => {
    setEditingSection(section);
    setIsAdding(false);
    setFormData({ title: section.title, content: section.content });
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !token) return;

    try {
      if (editingSection) {
        await updateMutation.mutateAsync({
          id: editingSection.id,
          title: formData.title.trim(),
          content: formData.content.trim(),
          adminToken: token,
        });
        toast.success('Section updated successfully');
      } else {
        await createMutation.mutateAsync({
          title: formData.title.trim(),
          content: formData.content.trim(),
          adminToken: token,
        });
        toast.success('Section created successfully');
      }
      resetForm();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save section');
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm || !token) return;

    try {
      await deleteMutation.mutateAsync({
        id: deleteConfirm.id,
        adminToken: token,
      });
      toast.success('Section deleted successfully');
      setDeleteConfirm(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete section');
      setDeleteConfirm(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Page Sections
          </h1>
          <p className="text-muted-foreground mt-2">Manage content sections for your website pages</p>
        </div>
        <LoadingState message="Loading sections..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Page Sections
          </h1>
          <p className="text-muted-foreground mt-2">Manage content sections for your website pages</p>
        </div>
        <ErrorState message={error instanceof Error ? error.message : 'Failed to load sections'} onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Page Sections
          </h1>
          <p className="text-muted-foreground mt-2">Manage content sections for your website pages</p>
        </div>
        {!isAdding && !editingSection && (
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Section
          </Button>
        )}
      </div>

      {(isAdding || editingSection) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingSection ? 'Edit Section' : 'Add New Section'}</CardTitle>
            <CardDescription>{editingSection ? 'Update section details' : 'Create a new content section'}</CardDescription>
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
                  placeholder="Enter section title"
                  disabled={createMutation.isPending || updateMutation.isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter section content"
                  rows={6}
                  disabled={createMutation.isPending || updateMutation.isPending}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} disabled={createMutation.isPending || updateMutation.isPending}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {!sections || sections.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <EmptyState
              message="No sections yet. Create your first section to get started."
              action={
                !isAdding && (
                  <Button onClick={handleAdd}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Section
                  </Button>
                )
              }
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {sections.map((section) => (
            <Card key={section.id.toString()}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{section.title}</CardTitle>
                    <CardDescription className="mt-2">{section.content}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(section)} disabled={isAdding || !!editingSection}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setDeleteConfirm(section)} disabled={deleteMutation.isPending}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      <AdminDeleteConfirmDialog
        open={!!deleteConfirm}
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Delete Section"
        description="Are you sure you want to delete this section? This action cannot be undone."
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
