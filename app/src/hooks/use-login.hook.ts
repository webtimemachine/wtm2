import { useToast } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../store';

import {
  LoginData,
  LoginResponse,
  VerifyEmailResponse,
  isLoginRes,
} from 'wtm-lib/interfaces';

import { apiClient } from '../utils/api.client';

export const useLogin = () => {
  const toast = useToast();
  const { notifyLogin, notifyEmailValidation } = useAuthStore((state) => state);

  const login = async (
    data: LoginData,
  ): Promise<LoginResponse | VerifyEmailResponse> => {
    const loginResponse = await apiClient.login(data);
    return loginResponse;
  };

  const loginMutation = useMutation({
    mutationFn: login,
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
