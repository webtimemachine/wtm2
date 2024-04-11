const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const handleLala = async (chrome, request, sendResponse) => {
  await sleep(3000);
  sendResponse({ message: 'Hi lalalala' });
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case 'lala':
      handleLala(chrome, request, sendResponse);
      return true;

    default:
      return false;
  }
});
