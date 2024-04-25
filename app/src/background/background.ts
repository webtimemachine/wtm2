import {
  handleGetVersion,
  handleLogin,
  handleSayHello,
  handleUpdated,
  handleGetNavigationEntries,
} from './handlers';
import { handleCloseActiveSession } from './handlers/handleCloseActiveSession';
import { handleGetActiveSessions } from './handlers/handleGetActiveSessions';
import { handleGetPreferences } from './handlers/handleGetPreferences';
import { handleUpdatePreferences } from './handlers/handleUpdatePreferences';
import { BackgroundMessageType } from './interfaces';

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  handleUpdated(tabId, changeInfo, tab);
});

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
    case 'get-navigation-entries':
      handleGetNavigationEntries(sendResponse, request?.payload);
      return true;
    case 'update-preferences':
      handleUpdatePreferences(sendResponse, request?.payload);
      return true;
    case 'get-user-preferences':
      handleGetPreferences(sendResponse, request?.payload);
      return true;
    case 'get-active-sessions':
      handleGetActiveSessions(sendResponse, request?.payload);
      return true;
    case 'close-active-session':
      handleCloseActiveSession(sendResponse, request?.payload);
      return true;
    default:
      return false;
  }
});
