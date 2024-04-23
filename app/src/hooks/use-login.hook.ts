import { useToast } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';

import { useSendBackgroundMessage } from './use-send-message.hook';
import { LoginData } from '../background/interfaces/login.interface';
import { useAuthStore } from '../store';

export const useLogin = () => {
  const toast = useToast();
  const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);
  const { sendBackgroundMessage } = useSendBackgroundMessage();

  const login = (data: LoginData) => sendBackgroundMessage('login', data);

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (loginRes) => {
      setIsLoggedIn(true);
      console.log(loginRes);
      toast({
        title: 'Login Response',
        description: `Welcome: ${loginRes.user.email}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error) => {
      setIsLoggedIn(false);
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
