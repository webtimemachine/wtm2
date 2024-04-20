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

  const sendBackgroundMessage = async <T extends BackgroundMessageType>(
    type: T,
    data: BackgroundMessageDataMap[T],
  ): Promise<BackgroundMessageResponseMap[T]> => {
    const authData: AuthData = {
      serverUrl,
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

      if (res.error) {
        throw new Error(res.error);
      }

      return res as BackgroundMessageResponseMap[T];
    } catch (error) {
      console.error(`Error while sending '${type}'`);
      console.error(error);
      throw error;
    }
  };

  return { sendBackgroundMessage };
};
