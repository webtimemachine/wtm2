import { BackgroundMessageHandler } from '../interfaces';
import { GetVersionResponse } from '../interfaces/get-version.interface';
// import { apiClient } from '../api.client';

export const handleGetVersion: BackgroundMessageHandler<'get-version'> = async (
  payload,
  sendResponse,
) => {
  try {
    const serverUrl = payload.authData.serverUrl;
    const res = await fetch(new URL('/api/version', serverUrl));
    const versionResponse: GetVersionResponse = await res.json();
    await chrome.storage.local.set({
      version: versionResponse.version,
    });
    sendResponse(versionResponse);
  } catch (error) {
    console.error('handleGetVersion', error);
    sendResponse({ error: 'Error geting version' });
  }
};
