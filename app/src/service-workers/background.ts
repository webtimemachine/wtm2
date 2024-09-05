import { CreateNavigationEntry } from 'wtm-lib/interfaces';
import { DOMtoString, getImages } from '../utils';
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
