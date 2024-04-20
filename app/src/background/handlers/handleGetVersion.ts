import { BackgroundMessageHandler } from '../interfaces';
import { GetVersionResponse } from '../interfaces/get-version.interface';
import { apiClient } from '../api.client';

export const handleGetVersion: BackgroundMessageHandler<'get-version'> = async (
  sendResponse,
  _,
) => {
  try {
    const res = await apiClient.fetch('/api/version');
    const versionResponse: GetVersionResponse = await res.json();
    sendResponse(versionResponse);
  } catch (error) {
    console.error('handleGetVersion', error);
    sendResponse({ error: 'Error geting version' });
  }
};
