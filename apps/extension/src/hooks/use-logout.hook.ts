import { useAuthStore, useNavigation } from '../store';

export const useLogout = () => {
  const { navigateTo } = useNavigation();
  const notifyLogout = useAuthStore((state) => state.notifyLogout);

  const logout = async () => {
    notifyLogout();

    const message = {
      isLogin: false,
    };
    browser.runtime.sendNativeMessage('com.ttt246llc.wtm', message);

    navigateTo('login');
  };

  return { logout };
};
