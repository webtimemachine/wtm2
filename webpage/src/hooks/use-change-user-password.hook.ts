import { useMutation } from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';

import { apiClient } from '../utils/api.client';
import { useHandleSessionExpired } from '.';
import { ChangeUserPassword } from '@/interfaces/change-user-password.interface';

export const useChangeUserPassword = () => {
  const toast = useToast();

  const { handleSessionExpired } = useHandleSessionExpired();
  apiClient.setHandleSessionExpired(handleSessionExpired);

  const changeUserPasswordMutation = useMutation({
    mutationFn: (data: ChangeUserPassword) =>
      apiClient.changeUserPassword(data),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: `Your password has been changed!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: `Your password has not been changed! Please check the requirements and try again.`,
        status: 'error',
        duration: 8000,
        isClosable: true,
      });
    },
  });

  return { changeUserPasswordMutation };
};
