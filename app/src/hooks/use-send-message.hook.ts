import { useAuthStore } from '../store';
import {
  BackgroundMessageType,
  BackgroundMessageDataMap,
  BackgroundMessageResponseMap,
  AuthData,
  BackgroundMessagePayload,
} from '../background/interfaces';

export const useSendBackgroundMessage = () => {
  const serverUrl = useAuthStore((state) => state.serverUrl);
  const accessToken = useAuthStore((state) => state.accessToken);
  const refreshToken = useAuthStore((state) => state.refreshToken);

  const sendBackgroundMessage = async <T extends BackgroundMessageType>(
    type: T,
    data: BackgroundMessageDataMap[T],
  ): Promise<BackgroundMessageResponseMap[T]> => {
    const authData: AuthData = {
      serverUrl,
      accessToken,
      refreshToken,
    };

    const payload: BackgroundMessagePayload<T> = {
      authData,
      data,
    };

    try {
      const res = await chrome.runtime.sendMessage({
        type,
        payload,
      });
      return res as BackgroundMessageResponseMap[T];
    } catch (error) {
      console.error(`Error while sending '${type}'`);
      console.error(error);
      throw error;
    }
  };

  return { sendBackgroundMessage };
};
