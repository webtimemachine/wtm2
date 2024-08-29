import { useToast } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/store';

import { apiClient } from '@/utils/api.client';
import { isLoginRes } from '@/interfaces';

export const useLogin = () => {
  const toast = useToast();
  const { notifyLogin, notifyEmailValidation } = useAuthStore((state) => state);

  const loginMutation = useMutation({
    mutationFn: apiClient.login,
    onSuccess: (loginRes) => {
      if (isLoginRes(loginRes)) {
        notifyLogin();

        toast({
          title: 'Welcome back!',
          description: `Welcome ${loginRes.user.email}`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        notifyEmailValidation();
      }
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: 'Invalid credentials',
        description: 'Please check your email and password and try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
  });

  return { loginMutation };
};
