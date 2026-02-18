import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { normalizeQueryError } from '../utils/queryTimeout';

const HEALTH_CHECK_TIMEOUT = 8000; // 8 seconds
const MAX_STARTUP_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds between retries

export function useBackendHealth(enableRetry = false, retryCount = 0) {
  const { actor } = useActor();

  return useQuery<string>({
    queryKey: ['backendHealth', retryCount],
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
    retry: enableRetry ? MAX_STARTUP_RETRIES : false,
    retryDelay: RETRY_DELAY,
    staleTime: 0, // Always fresh
    gcTime: 0, // Don't cache
  });
}

export function useBackendHealthStatus(enableRetry = false, retryCount = 0): {
  status: 'checking' | 'retrying' | 'reachable' | 'unreachable';
  message: string;
  refetch: () => void;
  isRetrying: boolean;
  retriesExhausted: boolean;
} {
  const query = useBackendHealth(enableRetry, retryCount);
  const { data, isLoading, error, refetch, failureCount } = query;

  const isRetrying = enableRetry && failureCount > 0 && failureCount < MAX_STARTUP_RETRIES;
  const retriesExhausted = enableRetry && failureCount >= MAX_STARTUP_RETRIES;

  if (isLoading && !isRetrying) {
    return {
      status: 'checking',
      message: 'Checking backend connection...',
      refetch,
      isRetrying: false,
      retriesExhausted: false,
    };
  }

  if (isRetrying) {
    return {
      status: 'retrying',
      message: `Connecting to backend... (attempt ${failureCount + 1}/${MAX_STARTUP_RETRIES + 1})`,
      refetch,
      isRetrying: true,
      retriesExhausted: false,
    };
  }

  if (error) {
    return {
      status: 'unreachable',
      message: normalizeQueryError(error),
      refetch,
      isRetrying: false,
      retriesExhausted,
    };
  }

  return {
    status: 'reachable',
    message: data || 'Backend is reachable',
    refetch,
    isRetrying: false,
    retriesExhausted: false,
  };
}
