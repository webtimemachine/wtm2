import { CreateNavigationEntry } from '../interfaces/navigation-entry.interface';
import { DOMtoString } from '../utils';
import { apiClient } from '../utils/api.client';

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  try {
    const { accessToken, enabledLiteMode } = await chrome.storage.local.get([
      'accessToken',
      'enabledLiteMode',
    ]);
    if (accessToken && changeInfo.status === 'complete' && tabId) {
      if (
        tab.url &&
        !tab.url.startsWith('chrome://') &&
        !tab.url.startsWith('https://www.google.com/search?q')
      ) {
        let htmlContent = '';

        let results;
        if (!enabledLiteMode) {
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
        }

        const navigationEntry: CreateNavigationEntry = {
          url: tab.url,
          navigationDate: new Date().toISOString(),
          title: tab?.title || '',
          // Removes remaining HTML tags, more than 2 contiguous spaces, more than 2 contiguous line breaks, and HTML entities
          ...((enabledLiteMode === undefined || !enabledLiteMode) && {
            content: htmlContent.replace(
              /(<[^>]*>)|(\s{2,})|(\n{2,})||(&\w+;)/g,
              '',
            ),
          }),
        };

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
