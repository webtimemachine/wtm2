import { useQuery } from '@tanstack/react-query';

import { apiClient } from '../utils/api.client';
import {
  GetNavigationEntriesData,
  GetNavigationEntriesResponse,
} from 'wtm-lib/interfaces';
import { useHandleSessionExpired } from '.';

export const useNavigationEntries = (params: GetNavigationEntriesData) => {
  //

  const { handleSessionExpired } = useHandleSessionExpired();

  const getNavigationEntries = async (params: GetNavigationEntriesData) => {
    const { offset, limit, query, isSemantic } = params;

    const url =
      '/api/navigation-entry?' +
      new URLSearchParams({
        offset: offset.toString(),
        limit: limit.toString(),
        isSemantic: String(isSemantic),
        ...(query && { query: query }),
      }).toString();

    try {
      const res = await apiClient.securedFetch(url, { method: 'GET' });

      if (res.status !== 200) {
        const errorJson = await res.json();
        throw new Error(errorJson?.message || 'GET Navigation Entries Error');
      }

      const response: GetNavigationEntriesResponse = await res.json();
      return response;
    } catch (error: any) {
      if (`${error?.message}`.toLowerCase().includes('unauthorized')) {
        await handleSessionExpired();
      } else {
        throw error;
      }
    }
  };

  const navigationEntriesQuery = useQuery({
    queryKey: ['getNavigationEntriesQuery'],
    queryFn: () => getNavigationEntries(params),
    enabled: false,
  });

  return { navigationEntriesQuery };
};
