import { isUserSignedIn, refreshTokenData } from './auth.js';
import { saveHistoryEntry } from './history-entries.js';

import {
  handleDeleteHistoryEntry,
  handleGetHistory,
  handleLogin,
  handleLogout,
  handleSignUp,
} from './message-handlers.js';

const handleStartup = async () => {
  // Here is where we have to refresh the user authentication
  try {
    const userData = await isUserSignedIn(chrome);
    if (userData.userStatus) {
      const tokensResponse = await refreshTokenData(userData);

      if (!tokensResponse.accessToken || !tokensResponse.refreshToken) {
        throw Error('fail');
      }

      await chrome.storage.local.set({
        userStatus: true,
        user_info: { ...userData.user_info, ...tokensResponse },
      });
    }
  } catch (error) {
    console.error(error);
  }
};

/**
 * Return html content from a HTMLElement
 *
 * @param {string} selector
 * @returns {string}
 */
function DOMtoString(selector) {
  if (selector) {
    selector = document.querySelector(selector);
    if (!selector) return 'ERROR: querySelector failed to find node';
  } else {
    selector = document.documentElement.outerHTML;
  }

  return selector.outerHTML;
}

const handleUpdated = async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    if (tab.url && !tab.url?.startsWith('chrome://')) {
      let htmlContent = '';

      const results = await chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: DOMtoString,
        args: ['body'],
      });

      if (results.length) {
        htmlContent = results[0].result;
      }

      const record = {
        url: tab.url,
        navigationDate: new Date().toISOString(),
        title: tab.title,
        content: htmlContent.replace(/<[^>]*>/g, '').replace(/\s+/g, ' '),
      };

      const userData = await isUserSignedIn(chrome);
      if (userData.userStatus) {
        saveHistoryEntry(userData.user_info, record);
      }
    }
  }
};

const handleGetSettingInfo = async (chrome, sendResponse) => {
  const userData = await isUserSignedIn(chrome);
  sendResponse(userData);
};

chrome.runtime.onStartup.addListener(() => {
  handleStartup();
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  handleUpdated(tabId, changeInfo, tab);
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case 'getHistory':
      handleGetHistory(chrome, request, sendResponse);
      return true;
    case 'login':
      handleLogin(chrome, request, sendResponse);
      return true;
    case 'logout':
      handleLogout(sendResponse);
      return true;
    case 'deleteHistoryEntry':
      handleDeleteHistoryEntry(chrome, request, sendResponse);
      return true;
    case 'signUp':
      handleSignUp(request, sendResponse);
      return true;
    case 'getSettingInfo':
      handleGetSettingInfo(chrome, sendResponse);
      return true;

    default:
      return false;
  }
});
