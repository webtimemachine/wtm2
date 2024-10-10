import { isTokenExpired } from '@wtm/utils';
import { apiClient } from '../utils/api.client';

import { CreateMLCEngine, MLCEngineInterface } from '@mlc-ai/web-llm';
import {
  ENGINESTATUS,
  SERVICEWORKERMESSAGETYPE,
  ServiceWorkerPayload,
} from './types';
let engine: MLCEngineInterface | undefined = undefined;

let engineStatus: ENGINESTATUS = ENGINESTATUS.NOT_READY;

console.log('Background script running', {
  engine,
});

async function initEngine() {
  try {
    engine = await CreateMLCEngine('Llama-3.2-1B-Instruct-q4f16_1-MLC', {
      initProgressCallback: () => {
        if (engineStatus === ENGINESTATUS.NOT_READY) {
          engineStatus = ENGINESTATUS.LOADING;
        }
      },
    });

    engineStatus = ENGINESTATUS.READY;
  } catch (error) {
    console.error('Error initializing engine', error);
  }
}

chrome.runtime.onConnect.addListener(async (port) => {
  if (engineStatus === ENGINESTATUS.NOT_READY) {
    await initEngine();
  }

  port.postMessage({
    type: SERVICEWORKERMESSAGETYPE.ENGINE_READY,
  });

  port.onMessage.addListener(async (message: ServiceWorkerPayload) => {
    switch (message.type) {
      case SERVICEWORKERMESSAGETYPE.CREATE_NAVIGATION_ENTRY: {
        console.log('Creating navigation entry');

        await apiClient.securedFetch('/api/navigation-entry', {
          method: 'POST',
          body: JSON.stringify(message.navigationEntry),
        });
        break;
      }

      case SERVICEWORKERMESSAGETYPE.GENERATE_COMPLETION: {
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
  '16': 'image.png',
  '32': 'image.png',
  '48': 'image.png',
  '128': 'image.png',
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
