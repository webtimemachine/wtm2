import { DOMtoString } from '../../utils';
import { apiClient } from '../api.client';

interface CreateNavigationEntry {
  url: string;
  navigationDate: string;
  title: string;
  content: string;
}

export const handleUpdated = async (
  tabId: number,
  changeInfo: chrome.tabs.TabChangeInfo,
  tab: chrome.tabs.Tab,
): Promise<void> => {
  const { accessToken } = await chrome.storage.local.get(['accessToken']);

  if (accessToken && changeInfo.status === 'complete') {
    if (
      tab.url &&
      !tab.url.startsWith('chrome://') &&
      !tab.url.startsWith('https://www.google.com/search?q') // REVIEW
    ) {
      let htmlContent = '';

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

      if (results.length) {
        htmlContent = results?.[0]?.result || '';
      }

      const navigationEntry: CreateNavigationEntry = {
        url: tab.url,
        navigationDate: new Date().toISOString(),
        title: tab?.title || '',
        // Removes remaining HTML tags, more than 2 contiguous spaces, more than 2 contiguous line breaks, and HTML entities
        content: htmlContent.replace(
          /(<[^>]*>)|(\s{2,})|(\n{2,})||(&\w+;)/g,
          '',
        ),
      };

      await apiClient.fetch('/api/navigation-entry', {
        method: 'POST',
        body: JSON.stringify(navigationEntry),
      });
    }
  }
};
