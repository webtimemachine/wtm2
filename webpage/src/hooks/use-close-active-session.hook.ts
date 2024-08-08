import { useMutation } from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';

import { apiClient } from '@/utils/api.client';

import { useHandleSessionExpired } from '.';

export const useCloseActiveSession = () => {
  const toast = useToast();

  const { handleSessionExpired } = useHandleSessionExpired();

  apiClient.setHandleSessionExpired(handleSessionExpired);
  const closeActiveSessionMutation = useMutation({
    mutationFn: apiClient.closeActiveSession,
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

  return { closeActiveSessionMutation };
};
