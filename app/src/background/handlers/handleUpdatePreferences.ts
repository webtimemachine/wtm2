import { BackgroundMessageHandler } from '../interfaces';
import { apiClient } from '../api.client';
import { PreferenciesResponse } from '../interfaces/preferences';

export const handleUpdatePreferences: BackgroundMessageHandler<
  'update-preferences'
> = async (sendResponse, payload) => {
  try {
    const preferencesResponse = await apiClient.fetch('/api/user/preferences', {
      method: 'PUT',
      body: JSON.stringify(payload.data),
    });

    if (preferencesResponse.status === 401) {
      sendResponse({ error: 'Unnauthorized' });
      return;
    }

    if (preferencesResponse.status !== 200) {
      const errorJson = await preferencesResponse.json();
      throw new Error(errorJson?.message || 'PUT Update Preferences Error');
    }

    const updatePreferenciesResponse: PreferenciesResponse =
      await preferencesResponse.json();

    sendResponse(updatePreferenciesResponse);
  } catch (error) {
    console.error('handleUpdatePreferences', error);
    sendResponse({ error: 'Error while updating preferences' });
  }
};
