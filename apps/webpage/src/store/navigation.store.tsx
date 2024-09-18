// import { create } from 'zustand';
// import { last } from '@/utils';
import { useAuthStore } from './auth.store';
import {
  useScreenNavigation,
  ScreenName,
} from '../store/use-screen-navigation';
/* 
**************************IMPORTANT**************************
The reason of commented code is that, maybe it helps for some development, or something. 
This file needs to be relocated, since it's no more a store.
**************************IMPORTANT**************************
*/

// interface NavigationStore {
//   CurrentScreen: ScreenName;
//   navigation: ScreenName[];
//   navigateTo: (screenName: ScreenName) => void;
//   navigateBack: () => void;
// }

// let initialScreen: ScreenName = 'login';

// const authState = readAuthStateFromLocal();

// const useNavigationStore = create<NavigationStore>((set) => ({
//   CurrentScreen: initialScreen,
//   navigation: [initialScreen],
//   navigateTo: (screenName: ScreenName) =>
//     set((state) => ({
//       navigation: [...state.navigation, screenName],
//       CurrentScreen: screenName,
//     })),
//   navigateBack: () =>
//     set((state) => {
//       const navigation = state.navigation.slice(0, -1);
//       return {
//         navigation,
//         CurrentScreen: last(navigation),
//       };
//     }),
// }));

export const useNavigation = () => {
  // const navigationStore = useNavigationStore();
  const { notifyLogout } = useAuthStore((state) => state);
  const { navigateTo: navigateToScreen, navigateBack: navigateBack } =
    useScreenNavigation();

  const navigateTo = (screenName: ScreenName) => {
    if (screenName === 'login') notifyLogout();
    // navigationStore.navigateTo(screenName);
    navigateToScreen(screenName);
  };

  return { navigateBack, navigateTo };
};
