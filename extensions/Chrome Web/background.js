import { getStorageData, refreshTokenData } from './auth.js';
import { API_URL } from './consts.js';
import { saveHistoryEntry } from './history-entries.js';
import {
  handleDeleteHistoryEntry,
  handleDeleteUserAccount,
  handleGetHistory,
  handleGetPreferences,
  handleLogin,
  handleLogout,
  handleSignUp,
  handleUpdatePreferences,
} from './message-handlers.js';

const handleStartup = async () => {
  // Here is where we have to refresh the user authentication
  try {
    const storageData = await getStorageData(chrome);
    const baseURL = storageData.baseURL || API_URL;
    if (storageData.userStatus) {
      const tokensResponse = await refreshTokenData(storageData, baseURL);

      if (!tokensResponse.accessToken || !tokensResponse.refreshToken) {
        await chrome.storage.local.set({
          userStatus: false,
          user_info: {},
        });

        throw Error('fail');
      }

      await chrome.storage.local.set({
        userStatus: true,
        user_info: { ...storageData.user_info, ...tokensResponse },
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
function DOMtoString (selector) {
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

      const storageData = await getStorageData(chrome);

      const baseURL = storageData.baseURL || API_URL;
      if (storageData.userStatus) {
        saveHistoryEntry(storageData.user_info, baseURL, record);
      }
    }
  }
};

const handleGetSettingInfo = async (chrome, sendResponse) => {
  const storageData = await getStorageData(chrome);
  sendResponse(storageData);
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
    case 'getPreferences':
      handleGetPreferences(chrome, sendResponse);
      return true;
    case 'setPreferences':
      handleUpdatePreferences(chrome, request, sendResponse);
      return true;
    case 'deleteUserAccount':
      handleDeleteUserAccount(chrome, sendResponse);
      return true;
    default:
      return false;
  }
});
