import { useMutation } from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';

import { apiClient } from '@/utils/api.client';
import { useHandleSessionExpired } from '.';

export const useDeleteNavigationEntry = () => {
  const toast = useToast();

  const { handleSessionExpired } = useHandleSessionExpired();

  apiClient.setHandleSessionExpired(handleSessionExpired);

  const deleteNavigationEntryMutation = useMutation({
    mutationFn: apiClient.deleteNavigationEntry,
    onSuccess: () => {
      toast({
        title: 'Success',
        description: `Navigation entry deleted!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
  });

  return { deleteNavigationEntryMutation };
};
