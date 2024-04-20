import { useToast } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';

import { useSendBackgroundMessage } from './use-send-message.hook';

export const useSayHello = () => {
  const toast = useToast();
  const { sendBackgroundMessage } = useSendBackgroundMessage();

  const sayHello = async () => {
    try {
      const res = await sendBackgroundMessage('say-hello', {
        sayHello: 'Hello world 🌎',
      });
      return res;
    } catch (error) {
      console.error("Error while sending 'Hello world'");
      console.error(error);
      throw error;
    }
  };

  const sayHelloMutation = useMutation({
    mutationFn: sayHello,
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
  return { sayHelloMutation };
};
