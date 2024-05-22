import { DOMtoString, getImages } from '../utils';
import { apiClient } from '../utils/api.client';

interface CreateNavigationEntry {
  url: string;
  navigationDate: string;
  title: string;
  content: string;
  images: string[];
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  try {
    const { accessToken } = await chrome.storage.local.get(['accessToken']);
    if (accessToken && changeInfo.status === 'complete' && tabId) {
      if (
        tab.url &&
        !tab.url.startsWith('chrome://') &&
        !tab.url.startsWith('https://www.google.com/search?q')
      ) {
        const images = await chrome.scripting.executeScript({
          target: { tabId: tabId },
          func: getImages
        });

        let results;
        try {
          results = await chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: DOMtoString,
            args: ['body'],
          });
        } catch (error) {
          return;
        }

        const navigationEntry: CreateNavigationEntry = {
          url: tab.url,
          navigationDate: new Date().toISOString(),
          title: tab?.title || '',
          // Removes remaining HTML tags, more than 2 contiguous spaces, more than 2 contiguous line breaks, and HTML entities
          content: results ? results[0].result!.replace(
            /(<[^>]*>)|(\s{2,})|(\n{2,})||(&\w+;)/g,
            '',
          ) : '',
          images: images ? images[0].result! : []
        };

        console.log('handleUpdated', { navigationEntry });
        await apiClient.securedFetch('/api/navigation-entry', {
          method: 'POST',
          body: JSON.stringify(navigationEntry),
        });
      }
    }
  } catch (error) {
    console.error(`Unexpected Error in tabs onUpdated:`, error);
  }
});
