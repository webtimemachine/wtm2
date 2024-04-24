import { BackgroundMessageHandler } from '../interfaces';
import { apiClient } from '../api.client';
import { GetNavigationEntriesResponse } from '../interfaces/navigation-entry';

export const handleGetNavigationEntries: BackgroundMessageHandler<
  'get-navigation-entries'
> = async (sendResponse, payload) => {
  try {
    const { offset, limit, query, isSemantic } = payload.data;
    const res = await apiClient.fetch(
      `/api/navigation-entry?offset=${offset}&limit=${limit}${query ? `&query=${query}` : ''}&isSemantic=${isSemantic}`,
      { method: 'GET' },
    );

    if (res.status === 401) {
      sendResponse({ error: 'Unnauthorized' });
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
