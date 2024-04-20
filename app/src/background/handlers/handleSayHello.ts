import { BackgroundMessageHandler } from '../interfaces';

export const handleSayHello: BackgroundMessageHandler<'say-hello'> = async (
  payload,
  sendResponse,
) => {
  console.log('background.ts', { payload });
  const serverUrl = payload.authData.serverUrl;
  sendResponse({
    message: `Hello from background.ts 👋 - serverUrl:  ${serverUrl}`,
  });
};
