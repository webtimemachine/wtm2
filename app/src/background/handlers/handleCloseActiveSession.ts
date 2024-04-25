import { BackgroundMessageHandler } from '../interfaces';
import { apiClient } from '../api.client';
import { BasicResponse } from '../interfaces/basic-response';

export const handleCloseActiveSession: BackgroundMessageHandler<
  'close-active-session'
> = async (sendResponse, payload) => {
  try {
    const closeActiveSessionsResponse = await apiClient.fetch(
      '/api/auth/session/logout',
      {
        method: 'POST',
        body: JSON.stringify(payload.data),
      },
    );

    if (closeActiveSessionsResponse.status === 401) {
      sendResponse({ error: 'Unnauthorized' });
      return;
    }

    if (closeActiveSessionsResponse.status !== 200) {
      const errorJson = await closeActiveSessionsResponse.json();
      throw new Error(errorJson?.message || 'POST Update Preferences Error');
    }

    const closeActSessionsResponse: BasicResponse =
      await closeActiveSessionsResponse.json();

    sendResponse(closeActSessionsResponse);
  } catch (error) {
    console.error('handleCloseActiveSession', error);
    sendResponse({ error: 'Error while closing an active session' });
  }
};
