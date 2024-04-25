import { useAuthStore, useNavigationStore } from '../store';

export const useLogout = () => {
  const { navigateTo } = useNavigationStore();
  const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);
  const setIsValidatingEmail = useAuthStore(
    (state) => state.setIsValidatingEmail,
  );

  const logout = async () => {
    await chrome.storage.local.set({
      accessToken: '',
      refreshToken: '',
      partialToken: '',
    });
    setIsLoggedIn(false);
    setIsValidatingEmail(false);
    navigateTo('login');
  };

  return { logout };
};
