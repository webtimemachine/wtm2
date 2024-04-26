import { useMutation } from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';

import { useSendBackgroundMessage } from './use-send-message.hook';
import { RecoverPasswordData } from '../background/interfaces/recover-password.interface';
import { useAuthStore } from '../store';

export const useRecoverPassword = () => {
  const toast = useToast();
  const recoveryCodeSent = useAuthStore(
    (state) => state.notifyRecoveryCodeSent,
  );

  const { sendBackgroundMessage } = useSendBackgroundMessage();

  const recoverPasswordMutation = useMutation({
    mutationFn: (data: RecoverPasswordData) => {
      recoveryCodeSent(data.email);
      return sendBackgroundMessage('recover-password', data);
    },
    onSuccess: (res) => {
      console.log(res);
      toast({
        status: 'success',
        title: 'Recovery code sent!',
        description: 'Please review your email inbox.',
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        status: 'error',
        title: 'Error while sending recovery code',
        description: 'Please try againg',
        duration: 3000,
        isClosable: true,
      });
    },
  });
  return { recoverPasswordMutation };
};
