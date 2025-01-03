import { isTokenExpired } from '@wtm/utils';
import { apiClient } from '../utils/api.client';

import { Ports, ServiceWorkerMessageType, ServiceWorkerPayload } from './types';

let intervalId: NodeJS.Timeout;
const startInterval = () => {
  intervalId = setInterval(refreshAccessToken, 60 * 60 * 1000);
};

/**
 * Adds a listener for incoming connections to the service worker.
 * @param {chrome.runtime.Port} port - The port connecting to the service worker.
 */
chrome.runtime.onConnect.addListener(async (port) => {
  if (port.name !== Ports.SERVICE_WORKER) {
    console.log('Invalid port name');
    return;
  }

  /**
   * Handles messages received on the port.
   * @param {ServiceWorkerPayload} message - The message received from the port.
   */
  port.onMessage.addListener(async (message: ServiceWorkerPayload) => {
    switch (message.type) {
      case ServiceWorkerMessageType.CREATE_NAVIGATION_ENTRY: {
        const navigationEntry = message.navigationEntry;

        await apiClient.securedFetch('/api/navigation-entry', {
          method: 'POST',
          body: JSON.stringify(navigationEntry),
        });

        break;
      }

      case ServiceWorkerMessageType.EXTERNAL_LOGIN: {
        const { accessToken, refreshToken, serverUrl } = message;

        chrome.storage.local.set({
          accessToken,
          refreshToken,
          serverUrl,
        });

        break;
      }

      case ServiceWorkerMessageType.UPDATE_EXTENSION_ICON:
        setCorrectIconByUserPreferences();
        break;

      default:
        break;
    }
  });
});

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

chrome.runtime.onInstalled.addListener(() => {
  refreshAccessToken();
  startInterval();
});

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

const noTrackingIcons = {
  '16': 'app-icon-no-tracking-16.png',
  '32': 'app-icon-no-tracking-32.png',
  '48': 'app-icon-no-tracking-48.png',
  '128': 'app-icon-no-tracking-128.png',
};

/**
 * Sets the extension icon based on the user's preferences.
 * If the "stop tracking" preference is enabled, a no-tracking icon is used.
 * Otherwise, a default icon is set.
 * @async
 * @function setCorrectIconByUserPreferences
 * @returns {Promise<void>} Resolves when the icon has been set.
 */
const setCorrectIconByUserPreferences = async (): Promise<void> => {
  const response = await apiClient.getUserPreferences();
  if (response?.enableStopTracking) {
    chrome.action.setIcon({
      path: noTrackingIcons,
    });
  } else {
    chrome.action.setIcon({
      path: defaultIcons,
    });
  }
};

/**
 * Refreshes the access token if needed and updates the extension icon accordingly.
 * If the access token is expired and the refresh token is still valid, it refreshes the access token.
 * If no tokens are found or both are expired, the icon is set to grayscale.
 * @async
 * @function refreshAccessToken
 * @returns {Promise<void>} Resolves when the token check and potential refresh are complete.
 */
const refreshAccessToken = async (): Promise<void> => {
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

      setCorrectIconByUserPreferences();
    } else if (!isAccessTokenExpired) {
      setCorrectIconByUserPreferences();
    }
  } catch (error) {
    chrome.action.setIcon({
      path: grayScaleIcons,
    });
    console.error(`Unexpected Error in windows onFocusChanged:`, error);
  }
};
