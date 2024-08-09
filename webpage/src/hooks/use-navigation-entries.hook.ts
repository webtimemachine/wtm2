import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/utils/api.client';
import { GetNavigationEntriesData } from '@/interfaces';
import { useHandleSessionExpired } from '.';

export const useNavigationEntries = (params: GetNavigationEntriesData) => {
  const { handleSessionExpired } = useHandleSessionExpired();

  apiClient.setHandleSessionExpired(handleSessionExpired);

  const navigationEntriesQuery = useQuery({
    queryKey: ['getNavigationEntriesQuery'],
    queryFn: () => apiClient.getNavigationEntries(params),
    enabled: false,
  });

  return { navigationEntriesQuery };
};
