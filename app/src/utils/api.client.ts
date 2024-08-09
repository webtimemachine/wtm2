import { ApiClient } from 'wtm-lib/ApiClient';

export const apiClient: ApiClient = new ApiClient({
  getServerUrl: async () => {
    const { serverUrl } = await chrome.storage.local.get(['serverUrl']);
    return (serverUrl as string) || '';
  },

  getAccessToken: async () => {
    const { accessToken } = await chrome.storage.local.get(['accessToken']);
    return (accessToken as string) || '';
  },
  getRefreshToken: async () => {
    const { refreshToken } = await chrome.storage.local.get(['refreshToken']);
    return (refreshToken as string) || '';
  },
  getPartialToken: async () => {
    const { partialToken } = await chrome.storage.local.get(['partialToken']);
    return (partialToken as string) || '';
  },
  getRecoveryToken: async () => {
    const { recoveryToken } = await chrome.storage.local.get(['recoveryToken']);
    return (recoveryToken as string) || '';
  },

  setAccessToken: async (accessToken: string) => {
    await chrome.storage.local.set({ accessToken });
  },
  setRefreshToken: async (refreshToken: string) => {
    await chrome.storage.local.set({ refreshToken });
  },
  setPartialToken: async (partialToken: string) => {
    await chrome.storage.local.set({ partialToken });
  },
  setRecoveryToken: async (recoveryToken: string) => {
    await chrome.storage.local.set({ recoveryToken });
  },
});
