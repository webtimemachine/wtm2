import { apiClient } from '../utils/api.client';
import { DOMtoString, getImages } from '../utils';

interface CreateNavigationEntry {
  url: string;
  navigationDate: string;
  title: string;
  content: string;
  images: string[];
}

export const postNavigationEntry = async () => {
  try {
    const url = window.location.href;

    const { accessToken } = await chrome.storage.local.get(['accessToken']);
    if (
      accessToken &&
      url &&
      !url.startsWith('chrome://') &&
      !url.startsWith('https://www.google.com/search?q')
    ) {
      const htmlContent = DOMtoString('body');
      const images = getImages()

      const navigationEntry: CreateNavigationEntry = {
        url,
        navigationDate: new Date().toISOString(),
        title: document.title || '',
        // Removes remaining HTML tags, more than 2 contiguous spaces, more than 2 contiguous line breaks, and HTML entities
        content: htmlContent.replace(
          /(<[^>]*>)|(\s{2,})|(\n{2,})||(&\w+;)/g,
          '',
        ),
        images
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
