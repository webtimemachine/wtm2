import { CreateMLCEngine, MLCEngineInterface } from '@mlc-ai/web-llm';
import { isTokenExpired } from '@wtm/utils';
import { apiClient } from '../utils/api.client';

import {
  EngineStatus,
  Ports,
  ServiceWorkerMessageType,
  ServiceWorkerPayload,
} from './types';

let engine: MLCEngineInterface | undefined = undefined;
let engineStatus: EngineStatus = EngineStatus.NOT_READY;

let intervalId: NodeJS.Timeout;
const startInterval = () => {
  intervalId = setInterval(refreshAccessToken, 60 * 60 * 1000);
};

/**
 * Adds a listener for incoming connections to the service worker.
 * @param {chrome.runtime.Port} port - The port connecting to the service worker.
 */
chrome.runtime.onConnect.addListener(async (port) => {
  if (port.name !== Ports.SERVICE_WORKER) {
    console.log('Invalid port name');
    return;
  }

  if (engineStatus === EngineStatus.NOT_READY) {
    try {
      await initEngine();
      port.postMessage({
        type: ServiceWorkerMessageType.ENGINE_READY,
      });
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Handles messages received on the port.
   * @param {ServiceWorkerPayload} message - The message received from the port.
   */
  port.onMessage.addListener(async (message: ServiceWorkerPayload) => {
    switch (message.type) {
      case ServiceWorkerMessageType.GENERATE_COMPLETION: {
        if (!engine) {
          console.error('Engine is not ready');
          return;
        }

        const result = await engine.chat.completions.create({
          messages: [
            {
              role: 'system',
              content:
                "You will be provided with a webpage's content in semantic markdown format. Your task is to analyze the markdown and generate a brief summary of the key points in 3 to 5 sentences. The summary should be concise and focus on the most important information presented in the content.",
            },
            {
              role: 'user',
              content: message.content,
            },
          ],
        });

        const response = result.choices.at(0)?.message.content;

        const url = message.url;

        await apiClient.securedFetch('/api/navigation-entry/add-context', {
          method: 'POST',
          body: JSON.stringify({
            content: response,
            url,
          }),
        });

        break;
      }

      case ServiceWorkerMessageType.CREATE_NAVIGATION_ENTRY: {
        const navigationEntry = message.navigationEntry;

        await apiClient.securedFetch('/api/navigation-entry', {
          method: 'POST',
          body: JSON.stringify(navigationEntry),
        });

        break;
      }

      case ServiceWorkerMessageType.UPDATE_EXTENSION_ICON:
        setCorrectIconByUserPreferences();
        break;

      default:
        break;
    }
  });
});

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

chrome.runtime.onInstalled.addListener(() => {
  refreshAccessToken();
  startInterval();
});

/**
 * Initializes the MLCEngine for use in generating completions.
 * @returns {Promise<void>} A promise that resolves when the engine is initialized.
 */
const initEngine = async () => {
  try {
    engine = await CreateMLCEngine('SmolLM-360M-Instruct-q4f16_1-MLC', {
      initProgressCallback: () => {
        if (engineStatus === EngineStatus.NOT_READY) {
          engineStatus = EngineStatus.LOADING;
        }
      },
    });

    engineStatus = EngineStatus.READY;
  } catch (error) {
    console.error('Error initializing engine', error);
  }
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

const noTrackingIcons = {
  '16': 'app-icon-no-tracking-16.png',
  '32': 'app-icon-no-tracking-32.png',
  '48': 'app-icon-no-tracking-48.png',
  '128': 'app-icon-no-tracking-128.png',
};

/**
 * Sets the extension icon based on the user's preferences.
 * If the "stop tracking" preference is enabled, a no-tracking icon is used.
 * Otherwise, a default icon is set.
 * @async
 * @function setCorrectIconByUserPreferences
 * @returns {Promise<void>} Resolves when the icon has been set.
 */
const setCorrectIconByUserPreferences = async () => {
  const response = await apiClient.getUserPreferences();
  if (response?.enableStopTracking) {
    chrome.action.setIcon({
      path: noTrackingIcons,
    });
  } else {
    chrome.action.setIcon({
      path: defaultIcons,
    });
  }
};

/**
 * Refreshes the access token if needed and updates the extension icon accordingly.
 * If the access token is expired and the refresh token is still valid, it refreshes the access token.
 * If no tokens are found or both are expired, the icon is set to grayscale.
 * @async
 * @function refreshAccessToken
 * @returns {Promise<void>} Resolves when the token check and potential refresh are complete.
 */
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

      setCorrectIconByUserPreferences();
    } else if (!isAccessTokenExpired) {
      setCorrectIconByUserPreferences();
    }
  } catch (error) {
    chrome.action.setIcon({
      path: grayScaleIcons,
    });
    console.error(`Unexpected Error in windows onFocusChanged:`, error);
  }
};
