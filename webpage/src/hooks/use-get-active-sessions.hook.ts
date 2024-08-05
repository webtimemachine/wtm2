import { useQuery } from '@tanstack/react-query';

import { apiClient } from '../utils/api.client';
import { ActiveSession } from '@/interfaces';
import { useHandleSessionExpired } from '.';

export const useGetActiveSessions = () => {
  const { handleSessionExpired } = useHandleSessionExpired();

  const getActiveSessions = async () => {
    try {
      const res = await apiClient.securedFetch('/api/auth/session', {
        method: 'GET',
      });

      if (res.status !== 200) {
        const errorJson = await res.json();
        throw new Error(errorJson?.message || 'GET Active Session Error');
      }

      const response: ActiveSession[] = await res.json();
      return response;
    } catch (error: any) {
      if (`${error?.message}`.toLowerCase().includes('unauthorized')) {
        await handleSessionExpired();
      } else {
        throw error;
      }
    }
  };

  const getActiveSessionsQuery = useQuery({
    queryKey: ['getActiveSessions'],
    queryFn: () => getActiveSessions(),
    enabled: true,
  });

  return { getActiveSessionsQuery };
};
