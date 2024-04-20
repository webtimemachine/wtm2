import { BackgroundMessageHandler } from '../interfaces';
// import { apiClient } from '../api.client';

export const handleGetVersion: BackgroundMessageHandler<'get-version'> = async (
  payload,
  sendResponse,
) => {
  const serverUrl = payload.authData.serverUrl;
  const res = await fetch(new URL('/api/version', serverUrl));
  const jsonRes = await res.json();

  console.log(jsonRes);
  sendResponse({ message: `Hello from handleGetVersion 👋 \n${serverUrl}` });
};
