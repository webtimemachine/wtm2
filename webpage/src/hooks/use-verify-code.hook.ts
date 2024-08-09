import { useMutation } from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';

import { useAuthStore } from '../store';
import { apiClient } from '@/utils/api.client';

export const useVerifyCode = () => {
  const toast = useToast();
  const notifyLogin = useAuthStore((state) => state.notifyLogin);

  const verificationCodeMutation = useMutation({
    mutationFn: apiClient.verificationCode,
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
        title: 'Invalid verificacion code',
        description: 'Please review your verificacion code and try againg',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
  });
  return { verificationCodeMutation };
};
