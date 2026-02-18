import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Section, Product, GalleryItem, ContactInfo, SiteSettings, ContactMessage, UserProfile } from '../backend';
import { withQueryTimeout, normalizeQueryError } from '../utils/queryTimeout';

// Query hooks
export function useGetSections() {
  const { actor, isFetching } = useActor();

  return useQuery<Section[]>({
    queryKey: ['sections'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return withQueryTimeout(() => actor.getSections());
    },
    enabled: !!actor && !isFetching,
    retry: 1,
  });
}

export function useGetProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return withQueryTimeout(() => actor.getProducts());
    },
    enabled: !!actor && !isFetching,
    retry: 1,
  });
}

export function useGetGallery() {
  const { actor, isFetching } = useActor();

  return useQuery<GalleryItem[]>({
    queryKey: ['gallery'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return withQueryTimeout(() => actor.getGallery());
    },
    enabled: !!actor && !isFetching,
    retry: 1,
  });
}

export function useGetContactInfo() {
  const { actor, isFetching } = useActor();

  return useQuery<ContactInfo>({
    queryKey: ['contactInfo'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return withQueryTimeout(() => actor.getContactInfo());
    },
    enabled: !!actor && !isFetching,
    retry: 1,
  });
}

export function useGetSiteSettings() {
  const { actor, isFetching } = useActor();

  return useQuery<SiteSettings>({
    queryKey: ['siteSettings'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return withQueryTimeout(() => actor.getSiteSettings());
    },
    enabled: !!actor && !isFetching,
    retry: 1,
  });
}

export function useGetMessages(adminToken: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<ContactMessage[]>({
    queryKey: ['messages', adminToken],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return withQueryTimeout(() => actor.getMessages(adminToken));
    },
    enabled: !!actor && !isFetching && !!adminToken,
    retry: 1,
  });
}

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

// Mutation hooks
export function useSendMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, email, message }: { name: string; email: string; message: string }) => {
      if (!actor) throw new Error('Actor not available');
      return withQueryTimeout(() => actor.sendMessage(name, email, message));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
    onError: (error: any) => {
      throw normalizeQueryError(error);
    },
  });
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

export function useSaveSiteSettings() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ siteName, logoUrl, adminToken }: { siteName: string; logoUrl: string; adminToken: string | null }) => {
      if (!actor) throw new Error('Actor not available');
      return withQueryTimeout(() => actor.updateSiteSettings(siteName, logoUrl, adminToken));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siteSettings'] });
    },
    onError: (error: any) => {
      throw normalizeQueryError(error);
    },
  });
}

export function useInitializeContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (adminToken: string | null) => {
      if (!actor) throw new Error('Actor not available');
      return withQueryTimeout(() => actor.initializeContent(adminToken));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    },
    onError: (error: any) => {
      throw normalizeQueryError(error);
    },
  });
}
