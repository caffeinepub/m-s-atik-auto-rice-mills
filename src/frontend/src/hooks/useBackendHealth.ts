import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { normalizeQueryError } from '../utils/queryTimeout';

const HEALTH_CHECK_TIMEOUT = 8000; // 8 seconds

export function useBackendHealth() {
  const { actor } = useActor();

  return useQuery<string>({
    queryKey: ['backendHealth'],
    queryFn: async () => {
      if (!actor) {
        throw new Error('Actor not available');
      }

      // Race health check against timeout
      const healthResult = await Promise.race([
        actor.health(),
        new Promise<string>((_, reject) =>
          setTimeout(
            () => reject(new Error('Health check timed out')),
            HEALTH_CHECK_TIMEOUT
          )
        ),
      ]);

      return healthResult;
    },
    enabled: !!actor,
    retry: false,
    staleTime: 0, // Always fresh
    gcTime: 0, // Don't cache
  });
}

export function useBackendHealthStatus(): {
  status: 'checking' | 'reachable' | 'unreachable';
  message: string;
  refetch: () => void;
} {
  const { data, isLoading, error, refetch } = useBackendHealth();

  if (isLoading) {
    return {
      status: 'checking',
      message: 'Checking backend connection...',
      refetch,
    };
  }

  if (error) {
    return {
      status: 'unreachable',
      message: normalizeQueryError(error),
      refetch,
    };
  }

  return {
    status: 'reachable',
    message: data || 'Backend is reachable',
    refetch,
  };
}
