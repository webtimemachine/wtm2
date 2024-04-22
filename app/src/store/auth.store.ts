import { useStore } from 'zustand';
import { createStore } from 'zustand/vanilla';
import { persist } from 'zustand/middleware';
import { getRandomToken } from '../utils';
import { useNavigationStore } from '.';

interface AuthStore {
  deviceKey: string;
  serverUrl: string;
  setServerUrl: (serverUrl: string) => void;
}

export const authStore = createStore<AuthStore>()(
  persist(
    (set) => ({
      deviceKey: getRandomToken(),
      serverUrl: 'https://wtm-back.vercel.app',
      setServerUrl: (serverUrl: string) =>
        set(() => {
          chrome.storage.local.set({
            serverUrl,
            accessToken: '',
            refreshToken: '',
          });
          return { serverUrl };
        }),
    }),
    {
      name: 'auth-vanilla-store',
    },
  ),
);

export const useAuthStore = <T>(selector?: (state: AuthStore) => T) =>
  useStore(authStore, selector!);

export const useLogout = () => {
  const { navigateTo } = useNavigationStore();

  const logout = async () => {
    await chrome.storage.local.set({
      accessToken: '',
      refreshToken: '',
    });
    navigateTo('login');
  };

  return { logout };
};

export const useServerUrl = () => {
  const serverUrl = useAuthStore((state) => state.serverUrl);
  const setServerUrl = useAuthStore((state) => state.setServerUrl);
  return { serverUrl, setServerUrl };
};

const initStorage = async () => {
  const { serverUrl } = await chrome.storage.local.get(['serverUrl']);
  if (!serverUrl) {
    await chrome.storage.local.set({
      serverUrl: authStore.getState().serverUrl,
    });
  }

  const { deviceKey } = await chrome.storage.local.get(['deviceKey']);
  if (!deviceKey) {
    await chrome.storage.local.set({
      deviceKey: authStore.getState().deviceKey,
    });
  }
};
initStorage();
