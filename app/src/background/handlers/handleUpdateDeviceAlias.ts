import { BackgroundMessageHandler } from '../interfaces';
import { apiClient } from '../api.client';
import { BasicResponse } from '../interfaces/basic-response';

export const handleUpdateDeviceAlias: BackgroundMessageHandler<
  'update-device-alias'
> = async (sendResponse, payload) => {
  try {
    const updateDeviceAliasResponse = await apiClient.securedFetch(
      `/api/user/device/${payload.data.id}`,
      {
        method: 'PUT',
        body: JSON.stringify({ deviceAlias: payload.data.deviceAlias }),
      },
    );

    if (updateDeviceAliasResponse.status === 401) {
      sendResponse({ error: 'Unnauthorized' });
      return;
    }

    if (updateDeviceAliasResponse.status !== 200) {
      const errorJson = await updateDeviceAliasResponse.json();
      throw new Error(errorJson?.message || 'PUT Update Preferences Error');
    }

    const deviceResponse: BasicResponse =
      await updateDeviceAliasResponse.json();

    sendResponse(deviceResponse);
  } catch (error) {
    console.error('handleUpdateDeviceAlias', error);
    sendResponse({ error: 'Error while updating device alias' });
  }
};
