import { useMutation } from '@tanstack/react-query';
import { useSendBackgroundMessage } from './use-send-message.hook';
import { useToast } from '@chakra-ui/react';

export const useConfirmDeleteAccount = () => {
  const toast = useToast();
  const { sendBackgroundMessage } = useSendBackgroundMessage();

  const confirmDeleteAccount = useMutation({
    mutationFn: () =>
      sendBackgroundMessage('confirm-delete-account', undefined),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: `User Account deleted!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
  });

  return { confirmDeleteAccount };
};
