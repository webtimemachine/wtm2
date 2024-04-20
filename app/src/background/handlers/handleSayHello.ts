import { BackgroundMessageHandler } from '../interfaces';

export const handleSayHello: BackgroundMessageHandler<'say-hello'> = async (
  payload,
  sendResponse,
) => {
  // const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
  // await sleep(3000);
  console.log('background.ts', { payload });
  const serverUrl = payload.authData.serverUrl;
  sendResponse({ message: `Hello from background.ts 👋 \n${serverUrl}` });
};
