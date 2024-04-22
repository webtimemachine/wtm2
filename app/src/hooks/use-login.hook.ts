import { useToast } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';

import { useSendBackgroundMessage } from './use-send-message.hook';
import { LoginData } from '../background/interfaces/login.interface';

export const useLogin = () => {
  const toast = useToast();
  const { sendBackgroundMessage } = useSendBackgroundMessage();

  const login = (data: LoginData) => sendBackgroundMessage('login', data);

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (loginRes) => {
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
      console.error(error);
      toast({
        title: 'Error while login',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
  });
  return { loginMutation };
};
