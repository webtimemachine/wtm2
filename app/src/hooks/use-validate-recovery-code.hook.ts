import { useMutation } from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';

import { useSendBackgroundMessage } from './use-send-message.hook';
import { ValidateRecoveryCodeData } from '../background/interfaces/validate-recovery-code.interface';

export const useValidateRecoveryCode = () => {
  const toast = useToast();

  const { sendBackgroundMessage } = useSendBackgroundMessage();

  const validateRecoveryCodeMutation = useMutation({
    mutationFn: (data: ValidateRecoveryCodeData) =>
      sendBackgroundMessage('validate-recovery-code', data),
    onSuccess: (res) => {
      console.log(res);
      toast({
        status: 'success',
        title: 'Code verification success!',
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        status: 'error',
        title: 'Invalid recovery code',
        description: 'Please review your recovery code and try againg',
        duration: 3000,
        isClosable: true,
      });
    },
  });
  return { validateRecoveryCodeMutation };
};
