import { useStore } from 'zustand';
import { createStore } from 'zustand/vanilla';
import { persist } from 'zustand/middleware';
import { getRandomToken } from '@wtm/utils';
import { screenStore } from './screens.store';
import { ScreenName } from './navigation.store';
import { updateIcon } from '../utils/updateIcon';

interface AuthState {
  deviceKey: string;
  serverUrl: string;
  recoveryEmail: string;
  persistedScreen: ScreenName | '';
  isLoggedIn: boolean;
}

interface AuthStore extends AuthState {
  notifyLogin: () => void;
  notifyLogout: () => void;
  notifyEmailValidation: () => void;
  notifyRecoveryCodeSent: (email: string) => void;
  notifyRecoveryCodeValidated: () => void;
  updateServerUrl: (serverUrl: string) => void;
  externalLogin: (accessToken: string, refreshToken: string) => void;
}

export const readAuthStateFromLocal = (): AuthState | undefined => {
  const authVanillaStoreData = localStorage.getItem('auth-vanilla-store');
  if (authVanillaStoreData && JSON.parse(authVanillaStoreData)?.state) {
    const state: AuthState = JSON.parse(authVanillaStoreData)?.state;
    return state;
  }
};

export const authStore = createStore<AuthStore>()(
  persist<AuthStore>(
    (set) => ({
      deviceKey: getRandomToken(),
      serverUrl: 'https://wtm-back.vercel.app',
      persistedScreen: '',
      recoveryEmail: '',
      isLoggedIn: false,

      updateServerUrl: (serverUrl: string) =>
        set(() => {
          chrome.storage.local.set({
            serverUrl,
            accessToken: '',
            refreshToken: '',
            partialToken: '',
            recoveryToken: '',
          });
          screenStore.getState().notifyScreen('/');

          return {
            serverUrl,
            recoveryEmail: '',
            isLoggedIn: false,
          };
        }),

      notifyRecoveryCodeSent: (recoveryEmail: string) =>
        set(() => {
          chrome.storage.local.set({
            accessToken: '',
            refreshToken: '',
            partialToken: '',
            recoveryToken: '',
          });
          screenStore.getState().notifyRecoveryCodeSent();
          return {
            recoveryEmail,
            isLoggedIn: false,
          };
        }),

      notifyRecoveryCodeValidated: () =>
        set(() => {
          chrome.storage.local.set({
            accessToken: '',
            refreshToken: '',
            partialToken: '',
          });
          screenStore.getState().notifyRecoveryCodeValidated();

          return {
            isLoggedIn: false,
          };
        }),

      notifyEmailValidation: () =>
        set(() => {
          chrome.storage.local.set({
            accessToken: '',
            refreshToken: '',
            recoveryToken: '',
          });
          screenStore.getState().notifyEmailValidation();
          return {
            recoveryEmail: '',
            isLoggedIn: false,
          };
        }),

      notifyLogin: () =>
        set(() => {
          chrome.storage.local.set({
            partialToken: '',
            recoveryToken: '',
          });
          screenStore.getState().notifyLogin();
          updateIcon(true);
          return {
            recoveryEmail: '',
            isLoggedIn: true,
          };
        }),

      externalLogin: (accessToken: string, refreshToken: string) =>
        set(() => {
          chrome.storage.local.set({
            accessToken,
            refreshToken,
          });

          return {
            isLoggedIn: true,
            partialToken: '',
            recoveryToken: '',
            persistedScreen: '',
          };
        }),

      notifyLogout: () =>
        set(() => {
          chrome.storage.local.set({
            accessToken: '',
            refreshToken: '',
            partialToken: '',
            recoveryToken: '',
          });

          updateIcon(false);
          screenStore.getState().notifyLogout();

          return {
            recoveryEmail: '',
            isLoggedIn: false,
          };
        }),
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
