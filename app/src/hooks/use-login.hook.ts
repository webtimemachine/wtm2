import { useToast } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';

import { useSendBackgroundMessage } from './use-send-message.hook';
import { LoginData } from '../background/interfaces/login.interface';
import { useNavigationStore } from '../store';
import { useIsLoggedIn } from './use-logged-in.hook';

export const useLogin = () => {
  const toast = useToast();
  const { sendBackgroundMessage } = useSendBackgroundMessage();
  const { navigateTo } = useNavigationStore();
  const { isLoggedIn } = useIsLoggedIn();

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
      navigateTo('navigation-entries');
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
    retry: false,
  });

  const navigateToMainPageIfIsLogged = async () => {
    //TODO Verify if token are expired before navigation
    const isUserLogged = await isLoggedIn();

    if (isUserLogged) {
      navigateTo('navigation-entries');
    }
  };

  return { loginMutation, navigateToMainPageIfIsLogged };
};
