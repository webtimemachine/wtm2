import { CreateNavigationEntry } from '@wtm/api';
import { DOMtoString, getImages, isTokenExpired } from '@wtm/utils';
import { apiClient } from '../utils/api.client';
import * as cheerio from 'cheerio';
import { convertHtmlToMarkdown } from 'dom-to-semantic-markdown';
import { AnyNode } from 'domhandler';
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const getSemanticMarkdownForLLM = (
  data: string | AnyNode | AnyNode[] | Buffer,
) => {
  const $ = cheerio.load(data);
  $('script, style, nav, footer, header, .ads, .banner').remove();

  $('code').each((_, elem) => {
    const codeText = $(elem).html();
    $(elem).html(`<code>${codeText}</code>`);
  });

  $('body *').each((_, elem) => {
    if ($(elem).is('button') || $(elem).is('div[onclick]')) {
      $(elem).remove();
      return;
    }
    const text = $(elem).text().trim();
    if (!text || text.length < 5) {
      $(elem).remove();
    }

    // Unify links test in one line
    if ($(elem).is('a')) {
      const linkText = $(elem).text().replace(/\s+/g, ' ').trim(); // Replaces multiple spaces for an empty space.
      $(elem).text(linkText); // Updates text content from an <a>
    }
  });
  const content = $('body').html();
  return convertHtmlToMarkdown(content || '');
};

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  try {
    const { accessToken, enabledLiteMode, stopTrackingEnabled } =
      await chrome.storage.local.get([
        'accessToken',
        'enabledLiteMode',
        'stopTrackingEnabled',
      ]);

    if (stopTrackingEnabled) return;

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

          // If body it's present in DOM, we take it from the inital position.
          const htmlContent = results[0].result || '';

          const content =
            enabledLiteMode == undefined || !enabledLiteMode
              ? getSemanticMarkdownForLLM(htmlContent)
              : '';
          const navigationEntry: CreateNavigationEntry = {
            url: tab.url!,
            navigationDate: new Date().toISOString(),
            title: tab?.title || '',
            // Removes remaining HTML tags, more than 2 contiguous spaces, more than 2 contiguous line breaks, and HTML entities
            ...((enabledLiteMode === undefined || !enabledLiteMode) && {
              ...(content && { content }),
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

      chrome.action.setIcon({
        path: defaultIcons,
      });
    } else if (!isAccessTokenExpired) {
      chrome.action.setIcon({
        path: defaultIcons,
      });
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
