import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useAdminSession } from '../admin/hooks/useAdminSession';
import type { Section, Product, GalleryItem, ContactInfo, SiteSettings, ContactMessage, UserProfile } from '../backend';

// Site Settings
export function useGetSiteSettings() {
  const { actor, isFetching } = useActor();

  return useQuery<SiteSettings>({
    queryKey: ['siteSettings'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSiteSettings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateSiteSettings() {
  const { actor } = useActor();
  const { getToken, clearToken, setSessionError } = useAdminSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ siteName, logoUrl }: { siteName: string; logoUrl: string }) => {
      if (!actor) throw new Error('Actor not available');
      const token = getToken();
      if (!token) throw new Error('Admin session expired. Please log in again.');
      return actor.updateSiteSettings(siteName, logoUrl, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteSettings'] });
    },
    onError: (error: any) => {
      if (error?.message?.includes('Unauthorized') || error?.message?.includes('admin')) {
        clearToken();
        setSessionError('Your session has expired. Please log in again.');
      }
    },
  });
}

// Sections
export function useGetSections() {
  const { actor, isFetching } = useActor();

  return useQuery<Section[]>({
    queryKey: ['sections'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSections();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateSection() {
  const { actor } = useActor();
  const { getToken, clearToken, setSessionError } = useAdminSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, content }: { title: string; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      const token = getToken();
      if (!token) throw new Error('Admin session expired. Please log in again.');
      return actor.createSection(title, content, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
    },
    onError: (error: any) => {
      if (error?.message?.includes('Unauthorized') || error?.message?.includes('admin')) {
        clearToken();
        setSessionError('Your session has expired. Please log in again.');
      }
    },
  });
}

export function useUpdateSection() {
  const { actor } = useActor();
  const { getToken, clearToken, setSessionError } = useAdminSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, title, content }: { id: bigint; title: string; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      const token = getToken();
      if (!token) throw new Error('Admin session expired. Please log in again.');
      return actor.updateSection(id, title, content, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
    },
    onError: (error: any) => {
      if (error?.message?.includes('Unauthorized') || error?.message?.includes('admin')) {
        clearToken();
        setSessionError('Your session has expired. Please log in again.');
      }
    },
  });
}

export function useDeleteSection() {
  const { actor } = useActor();
  const { getToken, clearToken, setSessionError } = useAdminSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      const token = getToken();
      if (!token) throw new Error('Admin session expired. Please log in again.');
      return actor.deleteSection(id, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
    },
    onError: (error: any) => {
      if (error?.message?.includes('Unauthorized') || error?.message?.includes('admin')) {
        clearToken();
        setSessionError('Your session has expired. Please log in again.');
      }
    },
  });
}

// Products
export function useGetProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddProduct() {
  const { actor } = useActor();
  const { getToken, clearToken, setSessionError } = useAdminSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, description, price, imageUrl }: { name: string; description: string; price: bigint; imageUrl: string }) => {
      if (!actor) throw new Error('Actor not available');
      const token = getToken();
      if (!token) throw new Error('Admin session expired. Please log in again.');
      return actor.addProduct(name, description, price, imageUrl, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: any) => {
      if (error?.message?.includes('Unauthorized') || error?.message?.includes('admin')) {
        clearToken();
        setSessionError('Your session has expired. Please log in again.');
      }
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const { getToken, clearToken, setSessionError } = useAdminSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name, description, price, imageUrl }: { id: bigint; name: string; description: string; price: bigint; imageUrl: string }) => {
      if (!actor) throw new Error('Actor not available');
      const token = getToken();
      if (!token) throw new Error('Admin session expired. Please log in again.');
      return actor.updateProduct(id, name, description, price, imageUrl, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: any) => {
      if (error?.message?.includes('Unauthorized') || error?.message?.includes('admin')) {
        clearToken();
        setSessionError('Your session has expired. Please log in again.');
      }
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const { getToken, clearToken, setSessionError } = useAdminSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      const token = getToken();
      if (!token) throw new Error('Admin session expired. Please log in again.');
      return actor.deleteProduct(id, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: any) => {
      if (error?.message?.includes('Unauthorized') || error?.message?.includes('admin')) {
        clearToken();
        setSessionError('Your session has expired. Please log in again.');
      }
    },
  });
}

// Gallery
export function useGetGallery() {
  const { actor, isFetching } = useActor();

  return useQuery<GalleryItem[]>({
    queryKey: ['gallery'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getGallery();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddGalleryItem() {
  const { actor } = useActor();
  const { getToken, clearToken, setSessionError } = useAdminSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, caption, imageUrl }: { title: string; caption: string; imageUrl: string }) => {
      if (!actor) throw new Error('Actor not available');
      const token = getToken();
      if (!token) throw new Error('Admin session expired. Please log in again.');
      return actor.addGalleryItem(title, caption, imageUrl, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    },
    onError: (error: any) => {
      if (error?.message?.includes('Unauthorized') || error?.message?.includes('admin')) {
        clearToken();
        setSessionError('Your session has expired. Please log in again.');
      }
    },
  });
}

export function useUpdateGalleryItem() {
  const { actor } = useActor();
  const { getToken, clearToken, setSessionError } = useAdminSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, title, caption, imageUrl }: { id: bigint; title: string; caption: string; imageUrl: string }) => {
      if (!actor) throw new Error('Actor not available');
      const token = getToken();
      if (!token) throw new Error('Admin session expired. Please log in again.');
      return actor.updateGalleryItem(id, title, caption, imageUrl, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    },
    onError: (error: any) => {
      if (error?.message?.includes('Unauthorized') || error?.message?.includes('admin')) {
        clearToken();
        setSessionError('Your session has expired. Please log in again.');
      }
    },
  });
}

export function useDeleteGalleryItem() {
  const { actor } = useActor();
  const { getToken, clearToken, setSessionError } = useAdminSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      const token = getToken();
      if (!token) throw new Error('Admin session expired. Please log in again.');
      return actor.deleteGalleryItem(id, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    },
    onError: (error: any) => {
      if (error?.message?.includes('Unauthorized') || error?.message?.includes('admin')) {
        clearToken();
        setSessionError('Your session has expired. Please log in again.');
      }
    },
  });
}

// Contact Info
export function useGetContactInfo() {
  const { actor, isFetching } = useActor();

  return useQuery<ContactInfo>({
    queryKey: ['contactInfo'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getContactInfo();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateContactInfo() {
  const { actor } = useActor();
  const { getToken, clearToken, setSessionError } = useAdminSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ address, phone, email }: { address: string; phone: string; email: string }) => {
      if (!actor) throw new Error('Actor not available');
      const token = getToken();
      if (!token) throw new Error('Admin session expired. Please log in again.');
      return actor.updateContactInfo(address, phone, email, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactInfo'] });
    },
    onError: (error: any) => {
      if (error?.message?.includes('Unauthorized') || error?.message?.includes('admin')) {
        clearToken();
        setSessionError('Your session has expired. Please log in again.');
      }
    },
  });
}

// Messages
export function useGetMessages() {
  const { actor, isFetching } = useActor();
  const { getToken, clearToken, setSessionError } = useAdminSession();

  return useQuery<ContactMessage[]>({
    queryKey: ['messages'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const token = getToken();
      if (!token) throw new Error('Admin session expired. Please log in again.');
      try {
        return await actor.getMessages(token);
      } catch (error: any) {
        if (error?.message?.includes('Unauthorized') || error?.message?.includes('admin')) {
          clearToken();
          setSessionError('Your session has expired. Please log in again.');
        }
        throw error;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSendMessage() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ name, email, message }: { name: string; email: string; message: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.sendMessage(name, email, message);
    },
  });
}

export function useDeleteMessage() {
  const { actor } = useActor();
  const { getToken, clearToken, setSessionError } = useAdminSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      const token = getToken();
      if (!token) throw new Error('Admin session expired. Please log in again.');
      return actor.deleteMessage(id, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
    onError: (error: any) => {
      if (error?.message?.includes('Unauthorized') || error?.message?.includes('admin')) {
        clearToken();
        setSessionError('Your session has expired. Please log in again.');
      }
    },
  });
}

// Initialize Content
export function useInitializeContent() {
  const { actor } = useActor();
  const { getToken, clearToken, setSessionError } = useAdminSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const token = getToken();
      if (!token) throw new Error('Admin session expired. Please log in again.');
      return actor.initializeContent(token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
    onError: (error: any) => {
      if (error?.message?.includes('Unauthorized') || error?.message?.includes('admin')) {
        clearToken();
        setSessionError('Your session has expired. Please log in again.');
      }
    },
  });
}

// User Profile
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Admin Check - kept for backward compatibility but not used in new token flow
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch {
        return false;
      }
    },
    enabled: !!actor && !isFetching,
  });
}
