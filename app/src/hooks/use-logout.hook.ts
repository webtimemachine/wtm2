import { useAuthStore, useNavigationStore } from '../store';

export const useLogout = () => {
  const { navigateTo } = useNavigationStore();
  const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);

  const logout = async () => {
    await chrome.storage.local.set({
      accessToken: '',
      refreshToken: '',
    });
    setIsLoggedIn(false);
    navigateTo('login');
  };

  return { logout };
};
