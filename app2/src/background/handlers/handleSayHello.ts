const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const handleSayHello = async (
  request: any,
  sendResponse: (response?: any) => void,
) => {
  await sleep(3000);
  console.log('background.js', { payload: request.payload });
  sendResponse({ message: 'Hello from background.js 👋' });
};
