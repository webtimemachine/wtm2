import { useLocation } from 'wouter';
import { useAuthStore } from '../store';

export const useLogout = () => {
  const [, navigate] = useLocation();
  const notifyLogout = useAuthStore((state) => state.notifyLogout);

  const logout = async () => {
    notifyLogout();

    const message = {
      isLogin: false,
    };

    chrome.runtime.sendNativeMessage('com.ttt246llc.wtm', message);

    navigate('/');
  };

  return { logout };
};
