import { BackgroundMessageHandler } from '../interfaces';

export const handleSayHello: BackgroundMessageHandler<'say-hello'> = async (
  sendResponse,
) => {
  const { serverUrl } = await chrome.storage.local.get(['serverUrl']);
  sendResponse({
    message: `Hello from background.ts 👋 - serverUrl:  ${serverUrl}`,
  });
};
