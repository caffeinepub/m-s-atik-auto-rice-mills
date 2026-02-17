import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useGetSections, useCreateSection, useUpdateSection, useDeleteSection } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Loader2, Plus, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { LoadingState, ErrorState, EmptyState } from '../../components/QueryState';
import { Link } from '@tanstack/react-router';
import type { Section } from '../../backend';

interface SectionForm {
  title: string;
  content: string;
}

export default function SectionsEditor() {
  const { data: sections, isLoading, error, refetch } = useGetSections();
  const createSection = useCreateSection();
  const updateSection = useUpdateSection();
  const deleteSection = useDeleteSection();

  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [deletingSection, setDeletingSection] = useState<Section | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SectionForm>();

  if (isLoading) {
    return <LoadingState message="Loading sections..." />;
  }

  if (error) {
    return <ErrorState message="Failed to load sections" onRetry={() => refetch()} />;
  }

  const onSubmit = async (data: SectionForm) => {
    try {
      if (editingSection) {
        await updateSection.mutateAsync({ id: editingSection.id, ...data });
        toast.success('Section updated successfully!');
      } else {
        await createSection.mutateAsync(data);
        toast.success('Section created successfully!');
      }
      setDialogOpen(false);
      setEditingSection(null);
      reset();
    } catch (error) {
      toast.error('Failed to save section. Please try again.');
    }
  };

  const handleEdit = (section: Section) => {
    setEditingSection(section);
    reset({ title: section.title, content: section.content });
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingSection) return;
    try {
      await deleteSection.mutateAsync(deletingSection.id);
      toast.success('Section deleted successfully!');
      setDeletingSection(null);
    } catch (error) {
      toast.error('Failed to delete section. Please try again.');
    }
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditingSection(null);
      reset({ title: '', content: '' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Page Sections</h1>
          <p className="text-muted-foreground">
            Manage content sections that appear across your website.
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ExternalLink className="mr-2 h-4 w-4" />
              Preview
            </Button>
          </Link>
          <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Section
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingSection ? 'Edit Section' : 'Create Section'}</DialogTitle>
                <DialogDescription>
                  {editingSection ? 'Update the section details below.' : 'Add a new content section to your website.'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    {...register('title', { required: 'Title is required' })}
                    placeholder="Section title"
                    className={errors.title ? 'border-destructive' : ''}
                  />
                  {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    {...register('content', { required: 'Content is required' })}
                    placeholder="Section content"
                    rows={8}
                    className={errors.content ? 'border-destructive' : ''}
                  />
                  {errors.content && <p className="text-sm text-destructive">{errors.content.message}</p>}
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => handleDialogClose(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createSection.isPending || updateSection.isPending}>
                    {(createSection.isPending || updateSection.isPending) ? (
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

      <Card>
        <CardHeader>
          <CardTitle>All Sections</CardTitle>
          <CardDescription>
            View and manage all content sections.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!sections || sections.length === 0 ? (
            <EmptyState message="No sections yet. Create your first section to get started." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Content Preview</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sections.map((section) => (
                  <TableRow key={Number(section.id)}>
                    <TableCell className="font-medium">{section.title}</TableCell>
                    <TableCell className="max-w-md truncate text-muted-foreground">
                      {section.content}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(section)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingSection(section)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deletingSection} onOpenChange={() => setDeletingSection(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Section?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingSection?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleteSection.isPending}>
              {deleteSection.isPending ? (
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
