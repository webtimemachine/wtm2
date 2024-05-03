import { BackgroundMessageHandler } from '../interfaces';
import { apiClient } from '../api.client';
import { GetNavigationEntriesResponse } from '../interfaces/navigation-entry.interface';

export const handleGetNavigationEntries: BackgroundMessageHandler<
  'get-navigation-entries'
> = async (sendResponse, payload) => {
  try {
    const { offset, limit, query, isSemantic } = payload.data;
    const url =
      '/api/navigation-entry?' +
      new URLSearchParams({
        offset: offset.toString(),
        limit: limit.toString(),
        query: query,
        isSemantic: String(isSemantic),
      }).toString();

    const res = await apiClient.securedFetch(url, { method: 'GET' });

    if (res.status === 401) {
      sendResponse({ error: 'Unauthorized' });
      return;
    }

    if (res.status !== 200) {
      const errorJson = await res.json();
      throw new Error(errorJson?.message || 'GET Navigation Entries Error');
    }

    const getNavigationEntriesResponse: GetNavigationEntriesResponse =
      await res.json();

    sendResponse(getNavigationEntriesResponse);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('handleGetNavigationEntries', error);
    sendResponse({ error: error?.message || 'GET Navigation Entries Error' });
  }
};
