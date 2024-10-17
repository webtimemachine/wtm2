import { isTokenExpired } from '@wtm/utils';
import { apiClient } from '../utils/api.client';

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

const noTrackingIcons = {
  '16': 'app-icon-no-tracking-16.png',
  '32': 'app-icon-no-tracking-32.png',
  '48': 'app-icon-no-tracking-48.png',
  '128': 'app-icon-no-tracking-128.png',
};

const setCorrectIconByUserPreferences = async () => {
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
