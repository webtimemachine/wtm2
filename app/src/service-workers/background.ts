import { CreateNavigationEntry } from '../interfaces/navigation-entry.interface';
import { DOMtoString, getImages } from '../utils';
import { apiClient } from '../utils/api.client';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  try {
    const { accessToken, enabledLiteMode } = await chrome.storage.local.get([
      'accessToken',
      'enabledLiteMode',
    ]);
    if (accessToken && changeInfo.status === 'complete' && tabId) {
      if (tab.url && !tab.url.startsWith('chrome://')) {
        await sleep(300);
        tab = await chrome.tabs.get(tabId);

        const images = await chrome.scripting.executeScript({
          target: { tabId: tabId },
          func: getImages,
        });

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

          const navigationEntry: CreateNavigationEntry = {
            url: tab.url!,
            navigationDate: new Date().toISOString(),
            title: tab?.title || '',
            // Removes remaining HTML tags, more than 2 contiguous spaces, more than 2 contiguous line breaks, and HTML entities
            ...((enabledLiteMode === undefined || !enabledLiteMode) && {
              content: results
                ? results[0].result!.replace(
                    /(<[^>]*>)|(\s{2,})|(\n{2,})||(&\w+;)/g,
                    '',
                  )
                : '',
              images: images ? images[0].result! : [],
            }),
          };

          await apiClient.securedFetch('/api/navigation-entry', {
            method: 'POST',
            body: JSON.stringify(navigationEntry),
          });
        }
      }
    }
  } catch (error) {
    console.error(`Unexpected Error in tabs onUpdated:`, error);
  }
});
