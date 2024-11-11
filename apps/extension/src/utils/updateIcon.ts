import { apiClient } from './api.client';

export const updateIcon = (isLoggedIn: boolean) => {
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

  if (!isLoggedIn) {
    chrome.action.setIcon({ path: grayScaleIcons });
    return;
  }

  apiClient.getUserPreferences().then((response) => {
    if (response?.enableStopTracking) {
      chrome.action.setIcon({
        path: noTrackingIcons,
      });
    } else {
      chrome.action.setIcon({ path: defaultIcons });
    }
  });
};
