import { BackgroundMessageHandler } from '../interfaces';
import { apiClient } from '../api.client';
import { ActiveSessionsResponse } from '../interfaces/active-sessons.interface';

export const handleGetActiveSessions: BackgroundMessageHandler<
  'get-active-sessions'
> = async (sendResponse) => {
  try {
    const actSessionsResponse = await apiClient.fetch('/api/auth/session', {
      method: 'GET',
    });

    if (actSessionsResponse.status === 401) {
      sendResponse({ error: 'Unnauthorized' });
      return;
    }

    if (actSessionsResponse.status !== 200) {
      const errorJson = await actSessionsResponse.json();
      throw new Error(errorJson?.message || 'GET Active Session Error');
    }

    const getActSessionsResponse: ActiveSessionsResponse[] =
      await actSessionsResponse.json();

    sendResponse(getActSessionsResponse);
  } catch (error) {
    console.error('handleGetActiveSessions', error);
    sendResponse({ error: 'Error while getting active sessions' });
  }
};
