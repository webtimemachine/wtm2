import { create } from 'zustand';
import {
  LoginScreen,
  NavigationEntriesScreen,
  SettingsScreen,
  PreferencesScreen,
  SignUpScreen,
  ValidateEmailScreen,
} from '../screens';

import { last } from '../utils';

export type ScreenName =
  | 'login'
  | 'server-url'
  | 'navigation-entries'
  | 'settings'
  | 'preferences'
  | 'sign-up'
  | 'validate-email';

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
    case 'sign-up':
      return <SignUpScreen />;
    case 'validate-email':
      return <ValidateEmailScreen />;
  }
  return <></>;
};

let initialScreen: ScreenName = 'login';
let initialNavigation: ScreenName[] = [];
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
