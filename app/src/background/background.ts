import { handleGetVersion, handleLogin, handleSayHello } from './handlers';
import { BackgroundMessageType } from './interfaces';

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  const type: BackgroundMessageType = request.type;

  switch (type) {
    case 'say-hello':
      handleSayHello(sendResponse, request?.payload);
      return true;

    case 'get-version':
      handleGetVersion(sendResponse, request?.payload);
      return true;

    case 'login':
      handleLogin(sendResponse, request?.payload);
      return true;

    default:
      return false;
  }
});
