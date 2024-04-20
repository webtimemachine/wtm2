import { handleGetVersion, handleSayHello } from './handlers';
import { BackgroundMessageType } from './interfaces';

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  const type: BackgroundMessageType = request.type;

  switch (type) {
    case 'say-hello':
      handleSayHello(request.payload, sendResponse);
      return true;

    case 'get-version':
      handleGetVersion(request.payload, sendResponse);
      return true;

    default:
      return false;
  }
});
