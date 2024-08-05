import { create } from 'zustand';
import { last } from '@/utils';
import { readAuthStateFromLocal, useAuthStore } from './auth.store';
import { useScreenNavigation, ScreenName } from '@/store/use-screen-navigation'; // Ajusta la ruta de importación

interface NavigationStore {
  CurrentScreen: ScreenName;
  navigation: ScreenName[];
  navigateTo: (screenName: ScreenName) => void;
  navigateBack: () => void;
}

let initialScreen: ScreenName = 'login';

const authState = readAuthStateFromLocal();
if (authState && authState.persistedScreen) {
  initialScreen = authState.persistedScreen;
} else if (authState && authState.isLoggedIn) {
  initialScreen = 'navigation-entries';
}

const useNavigationStore = create<NavigationStore>((set) => ({
  CurrentScreen: initialScreen,
  navigation: [initialScreen],
  navigateTo: (screenName: ScreenName) =>
    set((state) => ({
      navigation: [...state.navigation, screenName],
      CurrentScreen: screenName,
    })),
  navigateBack: () =>
    set((state) => {
      const navigation = state.navigation.slice(0, -1);
      return {
        navigation,
        CurrentScreen: last(navigation),
      };
    }),
}));

export const useNavigation = () => {
  const navigationStore = useNavigationStore();
  const { notifyLogout } = useAuthStore((state) => state);
  const { navigateTo: navigateToScreen } = useScreenNavigation();

  const navigateTo = (screenName: ScreenName) => {
    if (screenName === 'login') notifyLogout();
    navigationStore.navigateTo(screenName);
    navigateToScreen(screenName);
  };

  return { ...navigationStore, navigateTo };
};
