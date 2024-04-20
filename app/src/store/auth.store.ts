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
        set(() => {
          chrome.storage.local.set({
            serverUrl,
            accessToken: null,
            refreshToken: null,
          });
          return { serverUrl };
        }),
      setAccessToken: (accessToken: string) => set(() => ({ accessToken })),
      setRefreshToken: (refreshToken: string) => set(() => ({ refreshToken })),
      logout: () =>
        set(() => {
          chrome.storage.local.set({
            accessToken: null,
            refreshToken: null,
          });
          return {
            accessToken: null,
            refreshToken: null,
          };
        }),
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

const initStorage = async () => {
  const fieldName = 'serverUrl';
  let { [fieldName]: serverUrl } = await chrome.storage.local.get([fieldName]);
  if (!serverUrl) {
    authStore.getState().serverUrl;
    await chrome.storage.local.set({
      [fieldName]: authStore.getState().serverUrl,
    });
  }
};
initStorage();
