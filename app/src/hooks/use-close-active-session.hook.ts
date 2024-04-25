import { useMutation } from '@tanstack/react-query';
import { useSendBackgroundMessage } from './use-send-message.hook';
import { useToast } from '@chakra-ui/react';
import { CloseActiveSessionsData } from '../background/interfaces/close-active-session';

export const useCloseActiveSession = () => {
  const toast = useToast();
  const { sendBackgroundMessage } = useSendBackgroundMessage();

  const closeActiveSession = useMutation({
    mutationFn: (params: CloseActiveSessionsData) =>
      sendBackgroundMessage('close-active-session', params),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: `Device session logged out!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
  });

  return { closeActiveSession };
};
