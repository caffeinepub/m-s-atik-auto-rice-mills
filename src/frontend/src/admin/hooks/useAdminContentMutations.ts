import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import { withQueryTimeout, normalizeQueryError } from '../../utils/queryTimeout';

// Section mutations
export function useCreateSection() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, content, adminToken }: { title: string; content: string; adminToken: string }) => {
      if (!actor) throw new Error('Actor not available');
      if (!adminToken) throw new Error('Admin token is required');
      return withQueryTimeout(() => actor.createSection(title, content, adminToken));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
    },
    onError: (error: any) => {
      throw normalizeQueryError(error);
    },
  });
}

export function useUpdateSection() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, title, content, adminToken }: { id: bigint; title: string; content: string; adminToken: string }) => {
      if (!actor) throw new Error('Actor not available');
      if (!adminToken) throw new Error('Admin token is required');
      return withQueryTimeout(() => actor.updateSection(id, title, content, adminToken));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
    },
    onError: (error: any) => {
      throw normalizeQueryError(error);
    },
  });
}

export function useDeleteSection() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, adminToken }: { id: bigint; adminToken: string }) => {
      if (!actor) throw new Error('Actor not available');
      if (!adminToken) throw new Error('Admin token is required');
      return withQueryTimeout(() => actor.deleteSection(id, adminToken));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
    },
    onError: (error: any) => {
      throw normalizeQueryError(error);
    },
  });
}

// Product mutations
export function useAddProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, description, price, imageUrl, adminToken }: { name: string; description: string; price: bigint; imageUrl: string; adminToken: string }) => {
      if (!actor) throw new Error('Actor not available');
      if (!adminToken) throw new Error('Admin token is required');
      return withQueryTimeout(() => actor.addProduct(name, description, price, imageUrl, adminToken));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: any) => {
      throw normalizeQueryError(error);
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name, description, price, imageUrl, adminToken }: { id: bigint; name: string; description: string; price: bigint; imageUrl: string; adminToken: string }) => {
      if (!actor) throw new Error('Actor not available');
      if (!adminToken) throw new Error('Admin token is required');
      return withQueryTimeout(() => actor.updateProduct(id, name, description, price, imageUrl, adminToken));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: any) => {
      throw normalizeQueryError(error);
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, adminToken }: { id: bigint; adminToken: string }) => {
      if (!actor) throw new Error('Actor not available');
      if (!adminToken) throw new Error('Admin token is required');
      return withQueryTimeout(() => actor.deleteProduct(id, adminToken));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: any) => {
      throw normalizeQueryError(error);
    },
  });
}

// Gallery mutations
export function useAddGalleryItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, caption, imageUrl, adminToken }: { title: string; caption: string; imageUrl: string; adminToken: string }) => {
      if (!actor) throw new Error('Actor not available');
      if (!adminToken) throw new Error('Admin token is required');
      return withQueryTimeout(() => actor.addGalleryItem(title, caption, imageUrl, adminToken));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    },
    onError: (error: any) => {
      throw normalizeQueryError(error);
    },
  });
}

export function useUpdateGalleryItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, title, caption, imageUrl, adminToken }: { id: bigint; title: string; caption: string; imageUrl: string; adminToken: string }) => {
      if (!actor) throw new Error('Actor not available');
      if (!adminToken) throw new Error('Admin token is required');
      return withQueryTimeout(() => actor.updateGalleryItem(id, title, caption, imageUrl, adminToken));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    },
    onError: (error: any) => {
      throw normalizeQueryError(error);
    },
  });
}

export function useDeleteGalleryItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, adminToken }: { id: bigint; adminToken: string }) => {
      if (!actor) throw new Error('Actor not available');
      if (!adminToken) throw new Error('Admin token is required');
      return withQueryTimeout(() => actor.deleteGalleryItem(id, adminToken));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    },
    onError: (error: any) => {
      throw normalizeQueryError(error);
    },
  });
}

// Contact info mutation
export function useUpdateContactInfo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ address, phone, email, adminToken }: { address: string; phone: string; email: string; adminToken: string }) => {
      if (!actor) throw new Error('Actor not available');
      if (!adminToken) throw new Error('Admin token is required');
      return withQueryTimeout(() => actor.updateContactInfo(address, phone, email, adminToken));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactInfo'] });
    },
    onError: (error: any) => {
      throw normalizeQueryError(error);
    },
  });
}

// Message mutation
export function useDeleteMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, adminToken }: { id: bigint; adminToken: string }) => {
      if (!actor) throw new Error('Actor not available');
      if (!adminToken) throw new Error('Admin token is required');
      return withQueryTimeout(() => actor.deleteMessage(id, adminToken));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
    onError: (error: any) => {
      throw normalizeQueryError(error);
    },
  });
}
