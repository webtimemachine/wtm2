import { useAuthStore, useNavigation } from '../store';

export const useLogout = () => {
  const { navigateTo } = useNavigation();
  const notifyLogout = useAuthStore((state) => state.notifyLogout);

  const logout = async () => {
    notifyLogout();
    navigateTo('login');
  };

  return { logout };
};
