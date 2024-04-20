import { BackgroundMessageHandler } from '../interfaces';
import { GetVersionResponse } from '../interfaces/get-version.interface';
import { apiClient } from '../api.client';

export const handleGetVersion: BackgroundMessageHandler<'get-version'> = async (
  _,
  sendResponse,
) => {
  try {
    const res = await apiClient.fetch('/api/version');
    const versionResponse: GetVersionResponse = await res.json();

    try {
      const meRes = await apiClient.fetch('/api/user/me');
      const me = await meRes.json();
      console.log('handleGetVersion', { me });
    } catch (error) {}

    sendResponse(versionResponse);
  } catch (error) {
    console.error('handleGetVersion', error);
    sendResponse({ error: 'Error geting version' });
  }
};
