import { useQuery } from '@tanstack/react-query';

import { apiClient } from '../utils/api.client';
import { useHandleSessionExpired } from '.';

export const useGetActiveSessions = () => {
  const { handleSessionExpired } = useHandleSessionExpired();
  apiClient.setHandleSessionExpired(handleSessionExpired);

  const getActiveSessionsQuery = useQuery({
    queryKey: ['getActiveSessions'],
    queryFn: () => apiClient.getActiveSessions(),
    enabled: true,
  });

  return { getActiveSessionsQuery };
};
