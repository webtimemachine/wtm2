import { useNavigationStore } from '../store';

export const useLogout = () => {
  const { navigateTo } = useNavigationStore();

  const logout = async () => {
    await chrome.storage.local.set({
      accessToken: '',
      refreshToken: '',
    });
    navigateTo('login');
  };

  return { logout };
};
