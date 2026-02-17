import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import { useAdminSession } from './useAdminSession';
import { extractToken } from '../utils/option';
import { extractReplicaRejection } from '../utils/replicaRejection';
import { getAuthErrorMessage } from '../utils/adminAuthErrorMessages';

export function useAdminLogin() {
  const { actor } = useActor();
  const { setToken } = useAdminSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      if (!actor) throw new Error('Actor not available');
      
      try {
        const result = await actor.adminLogin(username, password);
        
        // Extract the actual token string from the optional result
        const token = extractToken(result);
        
        if (!token) {
          throw new Error('Invalid username or password');
        }
        
        return token;
      } catch (error: any) {
        // Extract replica rejection details
        const rejectionDetails = extractReplicaRejection(error);
        
        // Convert to user-friendly English message
        const userMessage = getAuthErrorMessage(rejectionDetails, 'login');
        
        // Throw a new error with the user-friendly message
        throw new Error(userMessage);
      }
    },
    onSuccess: (token) => {
      // token is guaranteed to be a non-empty string here
      setToken(token);
      queryClient.invalidateQueries();
    },
  });
}

export function useAdminLogout() {
  const { clearToken } = useAdminSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // No backend call needed - token is invalidated by clearing it
      return Promise.resolve();
    },
    onSuccess: () => {
      clearToken();
      queryClient.clear();
    },
    onError: () => {
      // Clear session even if something fails
      clearToken();
      queryClient.clear();
    },
  });
}
