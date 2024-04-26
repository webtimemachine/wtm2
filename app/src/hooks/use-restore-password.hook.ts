import { useMutation } from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';

import { useSendBackgroundMessage } from './use-send-message.hook';
import { RestorePasswordData } from '../background/interfaces/restore-password.interface';
import { useAuthStore } from '../store';

export const useRestorePassword = () => {
  const toast = useToast();
  const notifyLogin = useAuthStore((state) => state.notifyLogin);

  const { sendBackgroundMessage } = useSendBackgroundMessage();

  const restorePasswordMutation = useMutation({
    mutationFn: (data: RestorePasswordData) =>
      sendBackgroundMessage('restore-password', data),
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
