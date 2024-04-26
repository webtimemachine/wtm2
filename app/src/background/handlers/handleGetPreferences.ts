import { BackgroundMessageHandler } from '../interfaces';
import { apiClient } from '../api.client';
import { PreferenciesResponse } from '../interfaces/preferences.interface';

export const handleGetPreferences: BackgroundMessageHandler<
  'get-user-preferences'
> = async (sendResponse) => {
  try {
    const preferencesResponse = await apiClient.securedFetch(
      '/api/user/preferences',
      {
        method: 'GET',
      },
    );

    if (preferencesResponse.status === 401) {
      sendResponse({ error: 'Unnauthorized' });
      return;
    }

    if (preferencesResponse.status !== 200) {
      const errorJson = await preferencesResponse.json();
      throw new Error(errorJson?.message || 'GET User Preferences Error');
    }

    const getPreferenciesResponse: PreferenciesResponse =
      await preferencesResponse.json();

    sendResponse(getPreferenciesResponse);
  } catch (error) {
    console.error('handleGetPreferences', error);
    sendResponse({ error: 'Error while getting user preferences' });
  }
};
