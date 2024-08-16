import { apiClient } from '../utils/api.client';
import { DOMtoString, getImages } from '../utils';
import sanitizeHtml from "sanitize-html";
import htmlToMarkdown from "@wcj/html-to-markdown";
import { CreateNavigationEntry } from 'wtm-lib/interfaces';

function onUrlChange(callback: () => void) {
  let lastUrl = location.href;
  new MutationObserver(() => {
    const currentUrl = location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      callback();
    }
  }).observe(document, { subtree: true, childList: true });
}

onUrlChange(() => postNavigationEntry());

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

      const content = enabledLiteMode == undefined || !enabledLiteMode 
        ? await sanitizeAndConvertToMarkdown(htmlContent) 
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
postNavigationEntry();
