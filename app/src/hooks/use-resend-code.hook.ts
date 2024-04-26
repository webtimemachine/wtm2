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
        status: 'success',
        title: 'Validation code successfully sent!',
        description: 'Please review your email inbox.',
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        status: 'error',
        title: 'Error while sending email',
        description: 'Please try againg',
        duration: 3000,
        isClosable: true,
      });
    },
  });
  return { resendCodeMutation };
};
