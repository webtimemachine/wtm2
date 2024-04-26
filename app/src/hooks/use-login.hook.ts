import { useToast } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';

import { useSendBackgroundMessage } from './use-send-message.hook';
import { useAuthStore } from '../store';

import {
  LoginData,
  isLoginRes,
} from '../background/interfaces/login.interface';

export const useLogin = () => {
  const toast = useToast();
  const { notifyLogin, notifyEmailValidation } = useAuthStore((state) => state);
  const { sendBackgroundMessage } = useSendBackgroundMessage();

  const login = (data: LoginData) => sendBackgroundMessage('login', data);

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
