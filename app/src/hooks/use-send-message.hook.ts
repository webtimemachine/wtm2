import {
  BackgroundMessageType,
  BackgroundMessageDataMap,
  BackgroundMessageResponseMap,
  BackgroundMessagePayload,
} from '../background/interfaces';
import { useLogout } from './use-logout.hook';
import { useToast } from '@chakra-ui/react';

export const useSendBackgroundMessage = () => {
  const { logout } = useLogout();
  const toast = useToast();

  const sendBackgroundMessage = async <T extends BackgroundMessageType>(
    type: T,
    data: BackgroundMessageDataMap[T],
  ): Promise<BackgroundMessageResponseMap[T]> => {
    const payload: BackgroundMessagePayload<T> = {
      data,
    };

    try {
      const res = await chrome.runtime.sendMessage({
        type,
        payload,
      });

      if (res.error) {
        if (res.error.includes('Unauthorized')) {
          await logout();
          toast({
            title: 'Session expired',
            description: 'Session has expired please login again.',
            status: 'error',
            duration: 9000,
            isClosable: true,
          });
          throw new Error(res.error);
        } else {
          throw new Error(res.error);
        }
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
