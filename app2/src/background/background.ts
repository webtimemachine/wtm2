import { handleSayHello } from './handlers/handleSayHello';

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  switch (request.type) {
    case 'sayHello':
      handleSayHello(request, sendResponse);
      return true;

    default:
      return false;
  }
});
