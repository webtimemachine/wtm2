import { useAuthStore } from '../store';
import {
  ExtensionRoutes,
  useExtensionNavigation,
} from './use-extension-navigation';

export const useLogout = () => {
  const { navigateTo } = useExtensionNavigation();
  const notifyLogout = useAuthStore((state) => state.notifyLogout);

  const logout = async () => {
    notifyLogout();

    const message = {
      isLogin: false,
    };

    chrome.runtime.sendNativeMessage('com.ttt246llc.wtm', message);

    navigateTo(ExtensionRoutes.LOGIN);
  };

  return { logout };
};
