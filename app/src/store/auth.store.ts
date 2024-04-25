import { useStore } from 'zustand';
import { createStore } from 'zustand/vanilla';
import { persist } from 'zustand/middleware';
import { getRandomToken } from '../utils';

interface AuthStore {
  email: string;
  setEmail: (email: string) => void;
  deviceKey: string;
  serverUrl: string;
  setServerUrl: (serverUrl: string) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  isValidatingEmail: boolean;
  setIsValidatingEmail: (isValidatingEmail: boolean) => void;
  logout: () => void;
}

export const authStore = createStore<AuthStore>()(
  persist(
    (set) => ({
      email: '',
      setEmail: (email: string) => set(() => ({ email })),
      deviceKey: getRandomToken(),
      serverUrl: 'https://wtm-back.vercel.app',
      setServerUrl: (serverUrl: string) =>
        set(() => {
          chrome.storage.local.set({
            serverUrl,
            accessToken: '',
            refreshToken: '',
            partialToken: '',
            isLoggedIn: false,
          });
          return { serverUrl };
        }),
      isLoggedIn: false,
      setIsLoggedIn: (isLoggedIn: boolean) => set(() => ({ isLoggedIn })),
      isValidatingEmail: false,
      setIsValidatingEmail: (isValidatingEmail: boolean) =>
        set(() => {
          if (!isValidatingEmail) {
            chrome.storage.local.set({
              partialToken: '',
            });
          }
          return { isValidatingEmail };
        }),
      logout: () =>
        set(() => ({
          isLoggedIn: false,
          isValidatingEmail: false,
          email: '',
        })),
    }),
    {
      name: 'auth-vanilla-store',
    },
  ),
);

export const useAuthStore = <T>(selector?: (state: AuthStore) => T) =>
  useStore(authStore, selector!);

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
