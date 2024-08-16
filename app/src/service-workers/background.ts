import { CreateNavigationEntry } from 'wtm-lib/interfaces';
import { DOMtoString, getImages } from '../utils';
import { apiClient } from '../utils/api.client';
import sanitizeHtml from "sanitize-html";
import htmlToMarkdown from "@wcj/html-to-markdown";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
function sanitizeAndConvertToMarkdown(html: string) {
  const sanitizedHtml = sanitizeHtml(html, {
    allowedTags: [
      "address", "article", "aside", "footer", "header", "h1", "h2", "h3", "h4", "h5", "h6", "hgroup", "main", "nav", "section",
      "blockquote", "dd", "div", "dl", "dt", "figcaption", "figure", "hr", "li", "main", "ol", "p", "pre", "ul", "a", "abbr", "b", "bdi", "bdo",
      "br", "cite", "code", "data", "dfn", "em", "i", "kbd", "mark", "q", "rb", "rp", "rt", "rtc", "ruby", "s", "samp", "small", "span", "strong",
      "sub", "sup", "time", "u", "var", "wbr", "caption", "col", "colgroup", "table", "tbody", "td", "tfoot", "th", "thead", "tr"
    ],
    allowedAttributes: { a: ["href"] },
  });

  return htmlToMarkdown({ html: sanitizedHtml.trim() });
}
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

          // If body it's present in DOM, we take it from the inital position.
          const htmlContent = results[0].result || '';

          const content = enabledLiteMode == undefined || !enabledLiteMode 
        ? await sanitizeAndConvertToMarkdown(htmlContent) 
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
