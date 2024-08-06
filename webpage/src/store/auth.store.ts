'use client';

import { useStore } from 'zustand';
import { createStore } from 'zustand/vanilla';
import { persist } from 'zustand/middleware';
import { getRandomToken } from '../utils';

import { ScreenName } from './use-screen-navigation';

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

export interface AuthStore extends AuthState {
  notifyLogin: () => void;
  notifyLogout: () => void;
  notifyEmailValidation: () => void;
  notifyRecoveryCodeSent: (email: string) => void;
  notifyRecoveryCodeValidated: () => void;
  updateServerUrl: (serverUrl: string) => void;
  updateEnabledLiteMode: (enabledLiteMode: boolean) => void;
}

export const authStore = createStore<AuthStore>()(
  persist(
    (set) => ({
      deviceKey: getRandomToken(),
      serverUrl: 'https://wtm-back.vercel.app',
      persistedScreen: '',
      recoveryEmail: '',
      isLoggedIn: false,
      accessToken: '',
      refreshToken: '',
      partialToken: '',
      recoveryToken: '',
      enabledLiteMode: false,

      updateEnabledLiteMode: (enabledLiteMode: boolean) =>
        set(() => {
          return {
            enabledLiteMode,
          };
        }),

      updateServerUrl: (serverUrl: string) =>
        set(() => {
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

export const readAuthStateFromLocal = (): AuthState | undefined => {
  if (typeof window !== 'undefined' && localStorage) {
    const authVanillaStoreData = localStorage.getItem('auth-vanilla-store');
    if (authVanillaStoreData && JSON.parse(authVanillaStoreData)?.state) {
      const state: AuthState = JSON.parse(authVanillaStoreData)?.state;
      return state;
    }
  }
  return undefined;
};
