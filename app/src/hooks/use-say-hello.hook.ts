import { useToast } from '@chakra-ui/react';

import { useMutation } from '@tanstack/react-query';

export const useSayHello = () => {
  const sayHello = async () => {
    try {
      const res = await chrome.runtime.sendMessage({
        type: 'sayHello',
        payload: { sayHello: 'Hello world 🌎' },
      });
      return res;
    } catch (error) {
      console.error("Error while sending 'Hello world'");
      console.error(error);
      throw error;
    }
  };
  const toast = useToast();

  const sayHelloMutation = useMutation({
    mutationFn: sayHello,
    onSuccess: (res) => {
      console.log('sendHelloWorldMutation res', { res });
      toast({
        title: 'Message',
        description: res?.message,
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });
  return { sayHelloMutation };
};
