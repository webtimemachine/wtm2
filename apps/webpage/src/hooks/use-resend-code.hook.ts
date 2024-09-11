import { useMutation } from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';

import { apiClient } from '../utils/api.client';

export const useResendCode = () => {
  const toast = useToast();

  const resendCodeMutation = useMutation({
    mutationFn: apiClient.resendCode,
    onSuccess: (res) => {
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
