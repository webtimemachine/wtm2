import { DOMtoString, getImages } from '@wtm/utils';
import { CreateNavigationEntry } from '@wtm/api';
import * as cheerio from 'cheerio';
import { convertHtmlToMarkdown } from 'dom-to-semantic-markdown';
import { AnyNode } from 'domhandler';
import {
  ServiceWorkerPayload,
  SERVICEWORKERMESSAGETYPE,
} from '../service-workers/types';
import { apiClient } from '../utils/api.client';

const port = chrome.runtime.connect({ name: 'web_llm_service_worker' });

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
      const linkText = $(elem).text().replace(/\s+/g, ' ').trim(); // Replaces multiple spaces for an empty space.
      $(elem).text(linkText); // Updates text content from an <a>
    }
  });
  const content = $('body').html();
  return convertHtmlToMarkdown(content || '');
};

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

port.onMessage.addListener(async function (payload: ServiceWorkerPayload) {
  if (payload.type === SERVICEWORKERMESSAGETYPE.ENGINE_READY) {
    const { accessToken, enabledLiteMode, stopTrackingEnabled, webLLMEnabled } =
      await chrome.storage.local.get([
        'accessToken',
        'enabledLiteMode',
        'stopTrackingEnabled',
        'webLLMEnabled',
      ]);

    const url = window.location.href;

    if (!webLLMEnabled) return;
    if (stopTrackingEnabled) return;
    if (!accessToken) return;
    if (enabledLiteMode) return;
    if (url.startsWith('chrome://')) return;

    const htmlContent = DOMtoString('body');

    const content = getSemanticMarkdownForLLM(htmlContent);

    port.postMessage({
      type: SERVICEWORKERMESSAGETYPE.GENERATE_COMPLETION,
      content,
      url: window.location.href,
    });
    return;
  }
});
