import { useMutation } from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';

import { useSendBackgroundMessage } from './use-send-message.hook';

export const useResendCode = () => {
  const toast = useToast();
  const { sendBackgroundMessage } = useSendBackgroundMessage();

  const resendCodeMutation = useMutation({
    mutationFn: () => sendBackgroundMessage('resend-code', undefined),
    onSuccess: (res) => {
      console.log(res);
      toast({
        title: 'Validation code successfully sent!',
        description: 'Please review your email inbox.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: 'Error while sending email',
        description: 'Please try againg',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
  });
  return { resendCodeMutation };
};
