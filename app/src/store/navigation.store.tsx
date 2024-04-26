import { create } from 'zustand';
import {
  LoginScreen,
  NavigationEntriesScreen,
  SettingsScreen,
  PreferencesScreen,
  ActiveSessionsScreen,
  SignUpScreen,
  ValidateEmailScreen,
} from '../screens';

import { last } from '../utils';
import { ConfirmDeleteAccountScreen } from '../screens/confirm-delete-account.screen';

export type ScreenName =
  | 'login'
  | 'server-url'
  | 'navigation-entries'
  | 'settings'
  | 'preferences'
  | 'active-sessions'
  | 'sign-up'
  | 'validate-email'
  | 'confirm-delete-account';

interface NavigationStore {
  CurrentScreen: () => JSX.Element;
  navigation: ScreenName[];
  navigateTo: (screenName: ScreenName) => void;
  navigateBack: () => void;
}

const mapScreenName = (screenName: ScreenName): JSX.Element => {
  switch (screenName) {
    case 'login':
      return <LoginScreen />;
    case 'navigation-entries':
      return <NavigationEntriesScreen />;
    case 'settings':
      return <SettingsScreen />;
    case 'preferences':
      return <PreferencesScreen />;
    case 'active-sessions':
      return <ActiveSessionsScreen />;
    case 'sign-up':
      return <SignUpScreen />;
    case 'validate-email':
      return <ValidateEmailScreen />;
    case 'confirm-delete-account':
      return <ConfirmDeleteAccountScreen />;
  }
  return <></>;
};

let initialScreen: ScreenName = 'login';
const initialNavigation: ScreenName[] = [];
const authVanillaStoreData = localStorage.getItem('auth-vanilla-store');
if (
  authVanillaStoreData &&
  JSON.parse(authVanillaStoreData)?.state?.isLoggedIn
) {
  initialScreen = 'navigation-entries';
}
if (
  authVanillaStoreData &&
  JSON.parse(authVanillaStoreData)?.state?.isValidatingEmail
) {
  initialScreen = 'validate-email';
  initialNavigation.push('login');
}
initialNavigation.push(initialScreen);

export const useNavigationStore = create<NavigationStore>()((set) => ({
  CurrentScreen: () => mapScreenName(initialScreen),
  navigation: initialNavigation,
  navigateTo: (screenName: ScreenName) =>
    set((state) => ({
      navigation: [...state.navigation, screenName],
      CurrentScreen: () => mapScreenName(screenName),
    })),
  navigateBack: () =>
    set((state) => {
      const navigation = state.navigation.slice(0, -1);
      return {
        navigation,
        CurrentScreen: () => mapScreenName(last(navigation)),
      };
    }),
}));
