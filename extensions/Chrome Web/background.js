import { getStorageData, refreshTokenData } from './auth.js';
import { API_URL } from './consts.js';
import { saveHistoryEntry } from './history-entries.js';
import {
  handleDeleteHistoryEntry,
  handleDeleteUserAccount,
  handleGetHistory,
  handleGetPreferences,
  handleGetQueries,
  handleLogin,
  handleLogout,
  handleSignUp,
  handleUpdatePreferences,
} from './message-handlers.js';

const handleStartup = async () => {
  // Here is where we have to refresh the user authentication
  try {
    const storageData = await getStorageData(chrome);
    if (storageData.userStatus) {
      const tokensResponse = await refreshTokenData(storageData);

      if (!tokensResponse.accessToken || !tokensResponse.refreshToken) {
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
function DOMtoString(selector) {
  if (selector) {
    // this function was added because the regex replacement is inconsistent if any of the properties in the tags contains these chars: ["<", ">"]
    function removeAllAttributes(node) {
      // Remove attributes from the current node
      while (node.attributes.length > 0) {
        node.removeAttribute(node.attributes[0].name);
      }

      // Recursively remove attributes from child nodes
      for (let i = 0; i < node.childNodes.length; i++) {
        const childNode = node.childNodes[i];
        if (childNode.nodeType === Node.ELEMENT_NODE) {
          removeAllAttributes(childNode);
        }
      }
    }

    selector = document.querySelector(selector).cloneNode(true);

    if (!selector) {
      return "ERROR: querySelector failed to find node"
    }

    const styleNodes = selector.querySelectorAll('style');
    const scriptNodes = selector.querySelectorAll('script');
    const linkNodes = selector.querySelectorAll('link');

    // Remove each style element from the cloned body
    styleNodes.forEach(styleNode => {
      styleNode.parentNode.removeChild(styleNode);
    });
    scriptNodes.forEach(scriptNode => {
      scriptNode.parentNode.removeChild(scriptNode);
    });
    linkNodes.forEach(linkNode => {
      linkNode.parentNode.removeChild(linkNode);
    });

  } else {
    selector = document.documentElement.outerHTML;
  }

  removeAllAttributes(selector)

  return selector.outerHTML;
}

const handleUpdated = async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    if (tab.url && !tab.url?.startsWith('chrome://') && !tab.url.startsWith("https://www.google.com/search?q")) {
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
        // removes remaining html tags, more that 2 contiguous spaces, more that 2 contiguous line breaks and html entities
        content: htmlContent.replace(/(<[^>]*>)|(\s{2,})|(\n{2,})||(&\w+;)/g, ''),
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
    case 'getQueries':
      handleGetQueries(chrome, request, sendResponse);
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
