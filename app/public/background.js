const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const handleSayHello = async (request, sendResponse) => {
  await sleep(3000);
  console.log('background.js', { payload: request.payload });
  sendResponse({ message: 'Hello from background.js 👋' });
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case 'sayHello':
      handleSayHello(request, sendResponse);
      return true;

    default:
      return false;
  }
});
