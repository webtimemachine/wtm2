import { apiClient } from '../utils/api.client';
import { DOMtoString, getImages } from '../utils';
import { CreateNavigationEntry } from '../interfaces/navigation-entry.interface';

export const postNavigationEntry = async () => {
  try {
    const url = window.location.href;

    const { accessToken, enabledLiteMode } = await chrome.storage.local.get([
      'accessToken',
      'enabledLiteMode',
    ]);
    if (accessToken && url && !url.startsWith('chrome://')) {
      const htmlContent = DOMtoString('body');
      const images = getImages();

      const navigationEntry: CreateNavigationEntry = {
        url,
        navigationDate: new Date().toISOString(),
        title: document.title || '',
        // Removes remaining HTML tags, more than 2 contiguous spaces, more than 2 contiguous line breaks, and HTML entities
        ...((enabledLiteMode === undefined || !enabledLiteMode) && {
          content: htmlContent.replace(
            /(<[^>]*>)|(\s{2,})|(\n{2,})||(&\w+;)/g,
            '',
          ),
          images,
        }),
      };

      await apiClient.securedFetch('/api/navigation-entry', {
        method: 'POST',
        body: JSON.stringify(navigationEntry),
      });
    }
  } catch (error) {
    console.error(`Unexpected Error in tabs onUpdated:`, error);
  }
};

postNavigationEntry();
