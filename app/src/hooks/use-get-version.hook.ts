import { useToast } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';

import { useSendBackgroundMessage } from './use-send-message.hook';

export const useGetVersion = () => {
  const toast = useToast();
  const { sendBackgroundMessage } = useSendBackgroundMessage();

  const getVersion = async () => {
    try {
      const res = await sendBackgroundMessage('get-version', {
        sayHello: 'Hello world 🌎',
      });
      return res;
    } catch (error) {
      console.error('Error while getting version');
      console.error(error);
      throw error;
    }
  };

  const getVersionMutation = useMutation({
    mutationFn: getVersion,
    onSuccess: (res) => {
      toast({
        title: 'Message',
        description: res?.message,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });
  return { getVersionMutation };
};
