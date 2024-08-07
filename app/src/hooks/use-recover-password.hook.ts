import { useMutation } from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';
import { useAuthStore } from '../store';

import { apiClient } from '../utils/api.client';

export const useRecoverPassword = () => {
  const toast = useToast();
  const recoveryCodeSent = useAuthStore(
    (state) => state.notifyRecoveryCodeSent,
  );

  const recoverPasswordMutation = useMutation({
    mutationFn: apiClient.recoverPassword,
    onSuccess: (res, variables) => {
      console.log(res);
      recoveryCodeSent(variables.email);
      toast({
        status: 'success',
        title: 'Recovery code sent!',
        description: 'Please review your email inbox.',
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        status: 'error',
        title: 'Error while sending recovery code',
        description: 'Please try againg',
        duration: 3000,
        isClosable: true,
      });
    },
  });
  return { recoverPasswordMutation };
};
