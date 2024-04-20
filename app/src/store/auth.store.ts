import { useStore } from 'zustand';
import { createStore } from 'zustand/vanilla';
import { persist } from 'zustand/middleware';

interface AuthStore {
  serverUrl: string;
  accessToken: string | null;
  refreshToken: string | null;
  setServerUrl: (serverUrl: string) => void;
  setAccessToken: (accessToken: string) => void;
  setRefreshToken: (refreshToken: string) => void;
  logout: () => void;
}

export const authStore = createStore<AuthStore>()(
  persist(
    (set) => ({
      serverUrl: 'https://wtm-back.vercel.app',
      accessToken: null,
      refreshToken: null,

      setServerUrl: (serverUrl: string) =>
        set(() => ({ serverUrl: serverUrl })),
      setAccessToken: (accessToken: string) =>
        set(() => ({ accessToken: accessToken })),
      setRefreshToken: (refreshToken: string) =>
        set(() => ({ refreshToken: refreshToken })),
      logout: () =>
        set(() => ({
          accessToken: null,
          refreshToken: null,
        })),
    }),
    {
      name: 'auth-vanilla-store',
    },
  ),
);

export const useAuthStore = <T>(selector?: (state: AuthStore) => T) =>
  useStore(authStore, selector!);

export const useAccessToken = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  return { accessToken, setAccessToken };
};

export const useRefreshToken = () => {
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const setRefreshToken = useAuthStore((state) => state.setRefreshToken);
  return { refreshToken, setRefreshToken };
};

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);
  return { logout };
};

export const useServerUrl = () => {
  const serverUrl = useAuthStore((state) => state.serverUrl);
  const setServerUrl = useAuthStore((state) => state.setServerUrl);
  return { serverUrl, setServerUrl };
};
