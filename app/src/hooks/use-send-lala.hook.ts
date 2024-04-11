import { useToast } from '@chakra-ui/react';

import { useMutation } from '@tanstack/react-query';

export const useSendLala = () => {
  const sendLala = async () => {
    try {
      const res = await chrome.runtime.sendMessage({
        type: 'lala',
        payload: { sayHello: 'Hello world 🌎' },
      });
      return res;
    } catch (error) {
      console.error('Error while sending lala');
      console.error(error);
      throw error;
    }
  };
  const toast = useToast();

  const sendLalaMutation = useMutation({
    mutationFn: sendLala,
    onSuccess: (res) => {
      console.log('sendLalaMutation res', { res });
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
  return { sendLalaMutation };
};
