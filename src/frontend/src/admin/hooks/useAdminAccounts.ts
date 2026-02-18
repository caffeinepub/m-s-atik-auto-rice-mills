import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import { withQueryTimeout, normalizeQueryError } from '../../utils/queryTimeout';

export function useListAdminAccounts(adminToken: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['adminAccounts', adminToken],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      if (!adminToken) throw new Error('Admin token is required');
      return withQueryTimeout(() => actor.listAdminAccounts(adminToken));
    },
    enabled: !!actor && !isFetching && !!adminToken,
    retry: 1,
  });
}

export function useAddAdminAccount() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ username, password, adminToken }: { username: string; password: string; adminToken: string | null }) => {
      if (!actor) throw new Error('Actor not available');
      if (!adminToken) throw new Error('Admin token is required');
      return withQueryTimeout(() => actor.addAdminAccount(username, password, adminToken));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAccounts'] });
    },
    onError: (error: any) => {
      const normalized = normalizeQueryError(error);
      // Convert backend trap messages to user-friendly English
      if (normalized.includes('Username already exists')) {
        throw new Error('This username is already taken. Please choose a different username.');
      }
      if (normalized.includes('Unauthorized')) {
        throw new Error('You do not have permission to add admin accounts. Please log in again.');
      }
      throw new Error(normalized);
    },
  });
}

export function useDeleteAdminAccount() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ username, adminToken }: { username: string; adminToken: string | null }) => {
      if (!actor) throw new Error('Actor not available');
      if (!adminToken) throw new Error('Admin token is required');
      return withQueryTimeout(() => actor.deleteAdminAccount(adminToken, username));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAccounts'] });
    },
    onError: (error: any) => {
      const normalized = normalizeQueryError(error);
      // Convert backend trap messages to user-friendly English
      if (normalized.includes('Cannot delete default admin')) {
        throw new Error('The default admin account cannot be deleted.');
      }
      if (normalized.includes('Admin account not found')) {
        throw new Error('Admin account not found.');
      }
      throw new Error(normalized);
    },
  });
}
