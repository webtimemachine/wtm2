import { useAuthStore, useNavigationStore } from '../store';

export const useLogout = () => {
  const { navigateTo } = useNavigationStore();
  const storeLogout = useAuthStore((state) => state.logout);

  const logout = async () => {
    await chrome.storage.local.set({
      accessToken: '',
      refreshToken: '',
      partialToken: '',
    });
    storeLogout();
    navigateTo('login');
  };

  return { logout };
};
