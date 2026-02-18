import { useMutation } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import { withQueryTimeout, normalizeQueryError } from '../../utils/queryTimeout';

export function useChangeAdminPassword() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ adminToken, newPassword }: { adminToken: string | null; newPassword: string }) => {
      if (!actor) throw new Error('Actor not available');
      if (!adminToken) throw new Error('Admin token is required');
      return withQueryTimeout(() => actor.changeAdminPassword(adminToken, newPassword));
    },
    onError: (error: any) => {
      const normalized = normalizeQueryError(error);
      // Convert backend trap messages to user-friendly English
      if (normalized.includes('Admin account not found')) {
        throw new Error('Admin account not found. Please log in again.');
      }
      if (normalized.includes('Unauthorized') || normalized.includes('Invalid') || normalized.includes('expired')) {
        throw new Error('Your session has expired. Please log in again.');
      }
      throw new Error(normalized);
    },
  });
}
