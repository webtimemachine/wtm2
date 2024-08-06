import { useMutation } from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';
import { useAuthStore } from '../store';

import { apiClient } from '../utils/api.client';
import {
  RecoverPasswordData,
  RecoverPasswordResponse,
  VerifyCodeErrorResponse,
} from '@/interfaces';

export const useRecoverPassword = () => {
  const toast = useToast();
  const recoveryCodeSent = useAuthStore(
    (state) => state.notifyRecoveryCodeSent,
  );

  const recoverPassword = async (data: RecoverPasswordData) => {
    const res = await apiClient.fetch('/api/auth/password/recover', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (res.status === 200) {
      recoveryCodeSent(data.email);
      const response: RecoverPasswordResponse = await res.json();
      return response;
    } else {
      const errorRes: VerifyCodeErrorResponse = await res.json();
      throw new Error(errorRes?.message?.toString());
    }
  };

  const recoverPasswordMutation = useMutation({
    mutationFn: recoverPassword,
    onSuccess: (res) => {
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
