import { isTokenExpired } from '@wtm/utils';
import { apiClient } from '../utils/api.client';

import { CreateMLCEngine, MLCEngineInterface } from '@mlc-ai/web-llm';
import {
  ENGINE_STATUS,
  SERVICE_WORKER_MESSAGE_TYPE,
  ServiceWorkerPayload,
} from './types';
let engine: MLCEngineInterface | undefined = undefined;

let engineStatus: ENGINE_STATUS = ENGINE_STATUS.NOT_READY;

async function initEngine() {
  try {
    engine = await CreateMLCEngine('SmolLM-360M-Instruct-q4f16_1-MLC', {
      initProgressCallback: () => {
        if (engineStatus === ENGINE_STATUS.NOT_READY) {
          engineStatus = ENGINE_STATUS.LOADING;
        }
      },
    });

    engineStatus = ENGINE_STATUS.READY;
  } catch (error) {
    console.error('Error initializing engine', error);
  }
}

chrome.runtime.onConnect.addListener(async (port) => {
  if (engineStatus === ENGINE_STATUS.NOT_READY) {
    try {
      await initEngine();
      port.postMessage({
        type: SERVICE_WORKER_MESSAGE_TYPE.engineReady,
      });
    } catch (error) {
      console.error(error);
    }
  }

  port.onMessage.addListener(async (message: ServiceWorkerPayload) => {
    switch (message.type) {
      case SERVICE_WORKER_MESSAGE_TYPE.generateCompletion: {
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

      case SERVICE_WORKER_MESSAGE_TYPE.updateExtensionIcon:
        setCorrectIconByUserPreferences();
        break;

      default:
        break;
    }
  });
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

const noTrackingIcons = {
  '16': 'app-icon-no-tracking-16.png',
  '32': 'app-icon-no-tracking-32.png',
  '48': 'app-icon-no-tracking-48.png',
  '128': 'app-icon-no-tracking-128.png',
};

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
