import { create } from 'zustand';
import {
  LoginScreen,
  NavigationEntriesScreen,
  SettingsScreen,
  PreferencesScreen,
  ActiveSessionsScreen,
  SignUpScreen,
  ValidateEmailScreen,
  ForgotPasswordScreen,
  ValidateRecoveryCode,
  RecoveryNewPassword,
} from '../screens';

import { last } from '../utils';
import { readAuthStateFromLocal, useAuthStore } from './auth.store';

export type ScreenName =
  | 'login'
  | 'server-url'
  | 'navigation-entries'
  | 'settings'
  | 'preferences'
  | 'active-sessions'
  | 'sign-up'
  | 'validate-email'
  | 'forgot-password'
  | 'validate-recovery-code'
  | 'recovery-new-password';

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
    case 'forgot-password':
      return <ForgotPasswordScreen />;
    case 'validate-recovery-code':
      return <ValidateRecoveryCode />;
    case 'recovery-new-password':
      return <RecoveryNewPassword />;
  }
  return <></>;
};

let initialScreen: ScreenName = 'login';

const authState = readAuthStateFromLocal();
if (authState && authState.persistedScreen) {
  initialScreen = authState.persistedScreen;
} else if (authState && authState.isLoggedIn) {
  initialScreen = 'navigation-entries';
}

const useNavigationStore = create<NavigationStore>()((set) => ({
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

export const useNavigation = () => {
  const navigationStore = useNavigationStore();
  const { notifyLogout } = useAuthStore((state) => state);

  const navigateTo = (screenName: ScreenName) => {
    if (screenName === 'login') notifyLogout();
    return navigationStore.navigateTo(screenName);
  };

  return { ...navigationStore, navigateTo };
};
