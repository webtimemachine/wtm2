import { useMutation } from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';

import { apiClient } from '../utils/api.client';
import {
  ValidateRecoveryCodeData,
  ValidateRecoveryCodeErrorResponse,
  ValidateRecoveryCodeResponse,
} from '@/interfaces';
import { authStore } from '@/store';

export const useValidateRecoveryCode = () => {
  const toast = useToast();

  const validateRecoveryCode = async (data: ValidateRecoveryCodeData) => {
    const res = await apiClient.fetch(
      '/api/auth/password/validate-recovery-code',
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
    );

    if (res.status === 200) {
      const response: ValidateRecoveryCodeResponse = await res.json();
      const { recoveryToken } = response;
      authStore.setState({
        recoveryToken,
      });
      return response;
    } else {
      const errorRes: ValidateRecoveryCodeErrorResponse = await res.json();
      throw new Error(errorRes?.message?.toString());
    }
  };

  const validateRecoveryCodeMutation = useMutation({
    mutationFn: validateRecoveryCode,
    onSuccess: (res) => {
      console.log(res);
      toast({
        status: 'success',
        title: 'Code verification success!',
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        status: 'error',
        title: 'Invalid recovery code',
        description: 'Please review your recovery code and try againg',
        duration: 3000,
        isClosable: true,
      });
    },
  });
  return { validateRecoveryCodeMutation };
};
