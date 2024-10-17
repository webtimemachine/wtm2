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
    '16': 'image.png',
    '32': 'image.png',
    '48': 'image.png',
    '128': 'image.png',
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
