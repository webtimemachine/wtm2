import { useQuery } from '@tanstack/react-query';

import { apiClient } from '../utils/api.client';
import { PreferenciesResponse } from '../interfaces';
import { useHandleSessionExpired } from '.';

export const useGetPreferences = () => {
  const { handleSessioExpired } = useHandleSessionExpired();

  const getUserPreferences = async () => {
    const res = await apiClient.securedFetch('/api/user/preferences', {
      method: 'GET',
    });

    if (res.status === 401) await handleSessioExpired();

    if (res.status !== 200) {
      const errorJson = await res.json();
      throw new Error(errorJson?.message || 'GET User Preferences Error');
    }

    const response: PreferenciesResponse = await res.json();
    return response;
  };

  const userPreferencesQuery = useQuery({
    queryKey: ['getUserPreferencesQuery'],
    queryFn: () => getUserPreferences(),
    enabled: true,
  });

  return { userPreferencesQuery };
};
