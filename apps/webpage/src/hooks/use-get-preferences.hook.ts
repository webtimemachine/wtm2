import { useQuery } from '@tanstack/react-query';

import { apiClient } from '../utils/api.client';
import { useHandleSessionExpired } from '.';

export const useGetPreferences = () => {
  const { handleSessionExpired } = useHandleSessionExpired();

  apiClient.setHandleSessionExpired(handleSessionExpired);

  const userPreferencesQuery = useQuery({
    queryKey: ['getUserPreferencesQuery'],
    queryFn: () => apiClient.getUserPreferences(),
    enabled: true,
  });

  return { userPreferencesQuery };
};
