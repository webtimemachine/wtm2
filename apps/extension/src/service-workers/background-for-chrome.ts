import { isTokenExpired } from '@wtm/utils';
import { apiClient } from '../utils/api.client';
import { ExtensionServiceWorkerMLCEngineHandler } from '@mlc-ai/web-llm';

let intervalId: NodeJS.Timeout;

const startInterval = () => {
  intervalId = setInterval(refreshAccessToken, 60 * 60 * 1000);
};

const defaultIcons = {
  '16': 'app-icon-16.png',
  '32': 'app-icon-32.png',
  '48': 'app-icon-48.png',
  '128': 'app-icon-128.png',
};

const grayScaleIcons = {
  '16': 'app-icon-grayscale-16.png',
  '32': 'app-icon-grayscale-32.png',
  '48': 'app-icon-grayscale-48.png',
  '128': 'app-icon-grayscale-128.png',
};

const refreshAccessToken = async () => {
  try {
    const { accessToken, refreshToken } = await chrome.storage.local.get([
      'accessToken',
      'refreshToken',
    ]);

    if (!accessToken || !refreshToken) {
      chrome.action.setIcon({
        path: grayScaleIcons,
      });

      return;
    }

    const isAccessTokenExpired = isTokenExpired(accessToken);
    const isRefreshTokenExpired = isTokenExpired(refreshToken);

    if (isAccessTokenExpired && !isRefreshTokenExpired) {
      await apiClient.refresh();

      chrome.action.setIcon({
        path: defaultIcons,
      });
    } else if (!isAccessTokenExpired) {
      chrome.action.setIcon({
        path: defaultIcons,
      });
    }
  } catch (error) {
    chrome.action.setIcon({
      path: grayScaleIcons,
    });
    console.error(`Unexpected Error in windows onFocusChanged:`, error);
  }
};

chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId !== chrome.windows.WINDOW_ID_NONE) {
    clearInterval(intervalId);
    startInterval();
  }
});

chrome.runtime.onStartup.addListener(() => {
  refreshAccessToken();
  startInterval();
});

// Hookup an engine to a service worker handler
let handler: ExtensionServiceWorkerMLCEngineHandler;

chrome.runtime.onConnect.addListener(function (port) {
  console.assert(port.name === 'web_llm_service_worker');
  if (handler === undefined) {
    handler = new ExtensionServiceWorkerMLCEngineHandler(port);
  } else {
    handler.setPort(port);
  }
  port.onMessage.addListener(handler.onmessage.bind(handler));
});
