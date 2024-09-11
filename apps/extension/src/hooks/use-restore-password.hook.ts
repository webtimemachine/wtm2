import { useMutation } from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';
import { useAuthStore } from '../store';

import { apiClient } from '../utils/api.client';

export const useRestorePassword = () => {
  const toast = useToast();
  const notifyLogin = useAuthStore((state) => state.notifyLogin);

  const restorePasswordMutation = useMutation({
    mutationFn: apiClient.restorePassword,
    onSuccess: (loginRes) => {
      console.log(loginRes);
      notifyLogin();
      toast({
        title: 'Welcome!',
        description: `Welcome ${loginRes.user.email}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: 'Unexpected Error',
        description: 'Please try againg',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
  });
  return { restorePasswordMutation };
};
