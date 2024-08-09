import { useQuery } from '@tanstack/react-query';

import { apiClient } from '../utils/api.client';
import { PreferenciesResponse } from 'wtm-lib/interfaces';
import { useHandleSessionExpired } from '.';

export const useGetPreferences = () => {
  const { handleSessionExpired } = useHandleSessionExpired();

  const getUserPreferences = async () => {
    try {
      const res = await apiClient.securedFetch('/api/user/preferences', {
        method: 'GET',
      });

      if (res.status !== 200) {
        const errorJson = await res.json();
        throw new Error(errorJson?.message || 'GET User Preferences Error');
      }

      const response: PreferenciesResponse = await res.json();
      return response;
    } catch (error: any) {
      if (`${error?.message}`.toLowerCase().includes('unauthorized')) {
        await handleSessionExpired();
      } else {
        throw error;
      }
    }
  };

  const userPreferencesQuery = useQuery({
    queryKey: ['getUserPreferencesQuery'],
    queryFn: () => getUserPreferences(),
    enabled: true,
  });

  return { userPreferencesQuery };
};
