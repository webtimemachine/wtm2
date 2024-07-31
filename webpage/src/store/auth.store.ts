'use client';

import { useStore } from 'zustand';
import { createStore } from 'zustand/vanilla';
import { persist } from 'zustand/middleware';
import { getRandomToken } from '../utils';

import { ScreenName } from './navigation.store';

interface AuthState {
  deviceKey: string;
  serverUrl: string;
  recoveryEmail: string;
  persistedScreen: ScreenName | '';
  isLoggedIn: boolean;
  accessToken: string;
  refreshToken: string;
  partialToken: string;
  recoveryToken: string;
  enabledLiteMode: boolean;
}

interface AuthStore extends AuthState {
  notifyLogin: () => void;
  notifyLogout: () => void;
  notifyEmailValidation: () => void;
  notifyRecoveryCodeSent: (email: string) => void;
  notifyRecoveryCodeValidated: () => void;
  updateServerUrl: (serverUrl: string) => void;
}

// export const readAuthStateFromLocal = (): AuthState | undefined => {
//   const authVanillaStoreData = localStorage.getItem('auth-vanilla-store');
//   if (authVanillaStoreData && JSON.parse(authVanillaStoreData)?.state) {
//     const state: AuthState = JSON.parse(authVanillaStoreData)?.state;
//     return state;
//   }
// };

export const authStore = createStore<AuthStore>()(
  persist(
    (set) => ({
      deviceKey: getRandomToken(),
      serverUrl: 'https://wtm-back.vercel.app',
      persistedScreen: '',
      recoveryEmail: '',
      isLoggedIn: false,

      updateServerUrl: (serverUrl: string) =>
        set(() => {
          // chrome.storage.local.set({
          //   serverUrl,
          //   accessToken: '',
          //   refreshToken: '',
          //   partialToken: '',
          //   recoveryToken: '',
          // });

          return {
            serverUrl,
            persistedScreen: '',
            recoveryEmail: '',
            isLoggedIn: false,
            accessToken: '',
            refreshToken: '',
            partialToken: '',
            recoveryToken: '',
          };
        }),

      notifyRecoveryCodeSent: (recoveryEmail: string) =>
        set(() => {
          // chrome.storage.local.set({
          //   accessToken: '',
          //   refreshToken: '',
          //   partialToken: '',
          //   recoveryToken: '',
          // });

          return {
            persistedScreen: 'validate-recovery-code',
            recoveryEmail,
            isLoggedIn: false,
            accessToken: '',
            refreshToken: '',
            partialToken: '',
            recoveryToken: '',
          };
        }),

      notifyRecoveryCodeValidated: () =>
        set(() => {
          // chrome.storage.local.set({
          //   accessToken: '',
          //   refreshToken: '',
          //   partialToken: '',
          // });

          return {
            persistedScreen: 'recovery-new-password',
            isLoggedIn: false,
            accessToken: '',
            refreshToken: '',
            partialToken: '',
          };
        }),

      notifyEmailValidation: () =>
        set(() => {
          // chrome.storage.local.set({
          //   accessToken: '',
          //   refreshToken: '',
          //   recoveryToken: '',
          // });

          return {
            persistedScreen: 'validate-email',
            recoveryEmail: '',
            isLoggedIn: false,
            accessToken: '',
            refreshToken: '',
            recoveryToken: '',
          };
        }),

      notifyLogin: () =>
        set(() => {
          // chrome.storage.local.set({
          //   partialToken: '',
          //   recoveryToken: '',
          // });
          return {
            persistedScreen: '',
            recoveryEmail: '',
            isLoggedIn: true,
            partialToken: '',
            recoveryToken: '',
          };
        }),

      notifyLogout: () =>
        set(() => {
          // chrome.storage.local.set({
          //   accessToken: '',
          //   refreshToken: '',
          //   partialToken: '',
          //   recoveryToken: '',
          // });
          return {
            persistedScreen: '',
            recoveryEmail: '',
            isLoggedIn: false,
            accessToken: '',
            refreshToken: '',
            partialToken: '',
            recoveryToken: '',
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

// const initStorage = async () => {
//   const { serverUrl } = await chrome.storage.local.get(['serverUrl']);
//   if (!serverUrl) {
//     await chrome.storage.local.set({
//       serverUrl: authStore.getState().serverUrl,
//     });
//   }

//   const { deviceKey } = await chrome.storage.local.get(['deviceKey']);
//   if (!deviceKey) {
//     await chrome.storage.local.set({
//       deviceKey: authStore.getState().deviceKey,
//     });
//   }
// };
// initStorage();
