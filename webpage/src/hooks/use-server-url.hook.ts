import { useAuthStore } from '../store';

export const useServerUrl = () => {
  const serverUrl = useAuthStore((state) => state.serverUrl);
  const setServerUrl = useAuthStore((state) => state.updateServerUrl);
  return { serverUrl, setServerUrl };
};
