import { authStore } from '../store';
import { ApiClient } from 'wtm-lib/ApiClient';

export const apiClient: ApiClient = new ApiClient({
  getServerUrl: async () => {
    const { serverUrl } = authStore.getState();
    return (serverUrl as string) || '';
  },

  getAccessToken: async () => {
    const { accessToken } = authStore.getState();
    return (accessToken as string) || '';
  },
  getRefreshToken: async () => {
    const { refreshToken } = authStore.getState();
    return (refreshToken as string) || '';
  },
  getPartialToken: async () => {
    const { partialToken } = authStore.getState();
    return (partialToken as string) || '';
  },
  getRecoveryToken: async () => {
    const { recoveryToken } = authStore.getState();
    return (recoveryToken as string) || '';
  },

  setAccessToken: async (accessToken: string) => {
    authStore.setState({ accessToken });
  },
  setRefreshToken: async (refreshToken: string) => {
    authStore.setState({ refreshToken });
  },
  setPartialToken: async (partialToken: string) => {
    authStore.setState({ partialToken });
  },
  setRecoveryToken: async (recoveryToken: string) => {
    authStore.setState({ recoveryToken });
  },
});
