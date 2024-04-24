import { create } from 'zustand';
import {
  LoginScreen,
  NavigationEntriesScreen,
  SettingsScreen,
} from '../screens';
import { last } from '../utils';

export type ScreenName =
  | 'login'
  | 'server-url'
  | 'navigation-entries'
  | 'settings';

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
  }
  return <></>;
};

let initialScreen: ScreenName = 'login';
const authVanillaStoreData = localStorage.getItem('auth-vanilla-store');
if (authVanillaStoreData && JSON.parse(authVanillaStoreData)?.isLoggedIn) {
  initialScreen = 'navigation-entries';
}

export const useNavigationStore = create<NavigationStore>()((set) => ({
  CurrentScreen: () => mapScreenName(initialScreen),
  navigation: [initialScreen],
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
