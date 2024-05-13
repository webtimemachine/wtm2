import { useQuery } from '@tanstack/react-query';

import { apiClient } from '../utils/api.client';
import { ActiveSession } from '../interfaces';
import { useHandleSessionExpired } from '.';

export const useGetActiveSessions = () => {
  const { handleSessioExpired } = useHandleSessionExpired();

  const getActiveSessions = async () => {
    const res = await apiClient.securedFetch('/api/auth/session', {
      method: 'GET',
    });

    if (res.status === 401) await handleSessioExpired();

    if (res.status !== 200) {
      const errorJson = await res.json();
      throw new Error(errorJson?.message || 'GET Active Session Error');
    }

    const response: ActiveSession[] = await res.json();
    return response;
  };

  const getActiveSessionsQuery = useQuery({
    queryKey: ['getActiveSessions'],
    queryFn: () => getActiveSessions(),
    enabled: true,
  });

  return { getActiveSessionsQuery };
};
