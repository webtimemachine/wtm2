import { useMutation } from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';

import { apiClient } from '../utils/api.client';

export const useValidateRecoveryCode = () => {
  const toast = useToast();

  const validateRecoveryCodeMutation = useMutation({
    mutationFn: apiClient.validateRecoveryCode,
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
