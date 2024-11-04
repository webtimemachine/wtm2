import { DOMtoString, getImages } from '@wtm/utils';
import { CreateNavigationEntry } from '@wtm/api';
import * as cheerio from 'cheerio';
import { convertHtmlToMarkdown } from 'dom-to-semantic-markdown';
import { AnyNode } from 'domhandler';
import {
  ServiceWorkerPayload,
  ServiceWorkerMessageType,
  Ports,
} from '../service-workers/types';

const serviceWorkerPort = chrome.runtime.connect({
  name: Ports.SERVICE_WORKER,
});

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

      serviceWorkerPort.postMessage({
        type: ServiceWorkerMessageType.CREATE_NAVIGATION_ENTRY,
        navigationEntry,
      });
    }
  } catch (error) {
    console.error(`Unexpected Error in tabs onUpdated:`, error);
  }
};
postNavigationEntry();

serviceWorkerPort.onMessage.addListener(async function (
  payload: ServiceWorkerPayload,
) {
  if (payload.type === ServiceWorkerMessageType.ENGINE_READY) {
    const { accessToken, enabledLiteMode, stopTrackingEnabled, webLLMEnabled } =
      await chrome.storage.local.get([
        'accessToken',
        'enabledLiteMode',
        'stopTrackingEnabled',
        'webLLMEnabled',
      ]);

    const url = window.location.href;

    const webLLMDisabled =
      !webLLMEnabled ||
      stopTrackingEnabled ||
      !accessToken ||
      enabledLiteMode ||
      url.startsWith('chrome://');

    if (webLLMDisabled) return;

    const htmlContent = DOMtoString('body');

    const content = getSemanticMarkdownForLLM(htmlContent);

    serviceWorkerPort.postMessage({
      type: ServiceWorkerMessageType.GENERATE_COMPLETION,
      content,
      url: window.location.href,
    });
    return;
  }
});
