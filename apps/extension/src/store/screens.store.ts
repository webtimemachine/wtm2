// navigation.store.ts

import { createStore } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { updateIcon } from '../utils/updateIcon';
import { chromeStorageSync } from '../utils/chrome-storage-sync';

export type ScreenName =
  | '/'
  | '/navigation-entries'
  | '/settings'
  | '/preferences'
  | '/active-sessions'
  | '/sign-up'
  | '/validate-email'
  | '/confirm-delete-account'
  | '/forgot-password'
  | '/validate-recovery-code'
  | '/recovery-new-password'
  | '/about-wtm'
  | '/profile'
  | '/testqueryparams/*';

interface ScreenState {
  screenStack: ScreenName[];
  isLoggedIn: boolean;
}

interface ScreenStore extends ScreenState {
  notifyScreen: (screen: ScreenName) => void;
  goBack: () => void;
  notifyLogin: () => void;
  notifyLogout: () => void;
  notifyEmailValidation: () => void;
  notifyRecoveryCodeSent: () => void;
  notifyRecoveryCodeValidated: () => void;
  notifyForgotPassword: () => void;
  notifySignup: () => void;
}

export const screenStore = createStore<ScreenStore>()(
  persist(
    (set) => ({
      screenStack: ['/'],
      isLoggedIn: false,

      notifyScreen: (screen: ScreenName) =>
        set((state) => ({
          screenStack: [...state.screenStack, screen],
        })),

      goBack: () =>
        set((state) => {
          const newStack = state.screenStack.slice(0, -1);
          return {
            screenStack: newStack.length > 0 ? newStack : ['/'],
          };
        }),
      notifyForgotPassword: () =>
        set(() => ({
          screenStack: ['/forgot-password'],
          isLoggedIn: false,
        })),
      notifySignup: () =>
        set(() => ({
          screenStack: ['/sign-up'],
          isLoggedIn: false,
        })),
      notifyRecoveryCodeSent: () =>
        set(() => ({
          screenStack: ['/validate-recovery-code'],
          isLoggedIn: false,
        })),

      notifyRecoveryCodeValidated: () =>
        set(() => ({
          screenStack: ['/validate-recovery-code'],
          isLoggedIn: false,
        })),

      notifyEmailValidation: () =>
        set(() => ({
          screenStack: ['/validate-email'],
          isLoggedIn: false,
        })),

      notifyLogin: () =>
        set(() => {
          updateIcon(true);
          return {
            screenStack: ['/'],
            isLoggedIn: true,
          };
        }),

      notifyLogout: () =>
        set(() => {
          updateIcon(false);
          return {
            screenStack: ['/'],
            isLoggedIn: false,
          };
        }),
    }),
    {
      name: 'screen-vanilla-store',
      storage: createJSONStorage(() => chromeStorageSync),
    },
  ),
);
