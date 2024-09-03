import { apiClient } from '../utils/api.client';
import { DOMtoString, getImages } from '../utils';
import { CreateNavigationEntry } from 'wtm-lib/interfaces';
import * as cheerio from 'cheerio';
import { convertHtmlToMarkdown } from 'dom-to-semantic-markdown';

import { AnyNode } from 'domhandler';
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
      let linkText = $(elem).text().replace(/\s+/g, ' ').trim(); // Replaces multiple spaces for an empty space.
      $(elem).text(linkText); // Updates text content from an <a>
    }
  });
  const content = $('body').html();
  return convertHtmlToMarkdown(content || '');
};

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

      const content =
        enabledLiteMode == undefined || !enabledLiteMode
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
postNavigationEntry();

const startInterval = () => {
  setInterval(refreshAccessToken, 1.5 * 60 * 1000);
};

const refreshAccessToken = async () => {
  try {
    const { accessToken } = await chrome.storage.local.get(['accessToken']);

    if (accessToken) {
      await apiClient.refresh();

      chrome.action.setIcon({
        path: {
          '16': 'app-icon-16.png',
          '32': 'app-icon-32.png',
          '48': 'app-icon-48.png',
          '128': 'app-icon-128.png',
        },
      });
    } else {
      chrome.action.setIcon({
        path: {
          '16': 'app-icon-grayscale-16.png',
          '32': 'app-icon-grayscale-32.png',
          '48': 'app-icon-grayscale-48.png',
          '128': 'app-icon-grayscale-128.png',
        },
      });
    }
  } catch (error) {
    chrome.action.setIcon({
      path: {
        '16': 'app-icon-grayscale-16.png',
        '32': 'app-icon-grayscale-32.png',
        '48': 'app-icon-grayscale-48.png',
        '128': 'app-icon-grayscale-128.png',
      },
    });
    console.error(`Unexpected Error in windows onFocusChanged:`, error);
  }
};
startInterval();
