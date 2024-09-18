import { useMutation } from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';

import { apiClient } from '@/utils/api.client';
import { useHandleSessionExpired } from '.';

export const useConfirmDeleteAccount = () => {
  const toast = useToast();

  const { handleSessionExpired } = useHandleSessionExpired();

  apiClient.setHandleSessionExpired(handleSessionExpired);

  const confirmDeleteAccountMutation = useMutation({
    mutationFn: apiClient.confirmDeleteAccount,
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

  return { confirmDeleteAccountMutation };
};
