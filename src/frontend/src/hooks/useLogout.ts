import { useQueryClient } from '@tanstack/react-query';
import { useInternetIdentity } from './useInternetIdentity';

export function useLogout() {
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();

  const logout = async () => {
    // Clear Internet Identity session
    await clear();
    
    // Clear all cached application data including user profile
    queryClient.clear();
  };

  return { logout };
}
