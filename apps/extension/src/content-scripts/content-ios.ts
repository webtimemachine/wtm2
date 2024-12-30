import * as cheerio from 'cheerio';
import { AnyNode } from 'domhandler';
import { convertHtmlToMarkdown } from 'dom-to-semantic-markdown';

import { getImages } from '@wtm/utils';
import { CreateNavigationEntry } from '@wtm/api';
import { apiClient } from '../utils/api.client';
import { ServiceWorkerMessageType } from '../service-workers/types';

/**
 * Extracts and converts the HTML content of a webpage to semantic markdown, removing unwanted elements.
 * @param {string | AnyNode | AnyNode[] | Buffer} data - The input HTML content to process.
 * @returns {string} The semantic markdown representation of the HTML content.
 */
const getSemanticMarkdownForLLM = (
  data: string | AnyNode | AnyNode[] | Buffer,
) => {
  const $ = cheerio.load(data);
  $('script, style, nav, footer, header, .ads, .banner').remove();

  // Encapsulates code blocks in <code> tags for better formatting.
  $('code').each((_, elem) => {
    const codeText = $(elem).html();
    $(elem).html(`<code>${codeText}</code>`);
  });

  // Processes all child elements of the body and removes unnecessary ones.
  $('body *').each((_, elem) => {
    if ($(elem).is('button') || $(elem).is('div[onclick]')) {
      $(elem).remove();
      return;
    }
    const text = $(elem).text().trim();
    if (!text || text.length < 5) {
      $(elem).remove();
    }

    // Normalizes link text by replacing multiple spaces with a single space.
    if ($(elem).is('a')) {
      const linkText = $(elem).text().replace(/\s+/g, ' ').trim();
      $(elem).text(linkText);
    }
  });
  const content = $('body').html();
  return convertHtmlToMarkdown(content || '');
};

/**
 * Sends a navigation entry to the service worker, including page metadata and content.
 * Retrieves user settings from local storage and checks if tracking is enabled.
 * @async
 * @function postNavigationEntry
 * @returns {Promise<void>} Resolves when the entry has been sent or skips if tracking is disabled.
 */
export const postNavigationEntry = async () => {
  try {
    const url = window.location.href;

    const { accessToken, enabledLiteMode, stopTrackingEnabled } =
      await chrome.storage.local.get([
        'accessToken',
        'enabledLiteMode',
        'stopTrackingEnabled',
      ]);

    if (stopTrackingEnabled) return;

    if (accessToken && url && !url.startsWith('chrome://')) {
      const htmlContent = document.querySelector('body')?.outerHTML;
      const images = getImages();

      const content =
        (enabledLiteMode == undefined || !enabledLiteMode) && htmlContent
          ? getSemanticMarkdownForLLM(htmlContent)
          : '';

      const navigationEntry: CreateNavigationEntry = {
        url,
        navigationDate: new Date().toISOString(),
        title: document.title || '',
        ...(content && { content }),
        images,
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

// Automatically sends a navigation entry upon script execution.
postNavigationEntry();

/**
 * Observes changes in the URL and triggers a callback when the URL changes.
 * @param {() => void} callback - The callback function to execute when the URL changes.
 */
const onUrlChange = (callback: () => void) => {
  let lastUrl = location.href;
  new MutationObserver(() => {
    const currentUrl = location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      callback();
    }
  }).observe(document, { subtree: true, childList: true });
};

/**
 * Monitors changes to the current URL and triggers a callback when a change is detected.
 * @param {() => void} callback - The function to execute when the URL changes.
 */
onUrlChange(() => postNavigationEntry());

window.addEventListener('message', (event) => {
  // Validate the origin of the message
  if (event.origin !== window.location.origin) return;

  if (event?.type == ServiceWorkerMessageType.EXTERNAL_LOGIN) {
    const { accessToken, refreshToken, serverUrl } = event.data;

    chrome.storage.local.set({
      accessToken,
      refreshToken,
      serverUrl,
    });
  }
});
