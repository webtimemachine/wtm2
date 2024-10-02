import { useMutation } from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';

import { apiClient } from '../utils/api.client';
import { useHandleSessionExpired } from '.';
import { useCallback } from 'react';
import debounce from 'lodash/debounce';

export const useDeleteNavigationEntry = () => {
  const toast = useToast();

  const { handleSessionExpired } = useHandleSessionExpired();
  apiClient.setHandleSessionExpired(handleSessionExpired);

  const debouncedToast = useCallback(
    debounce(
      () => {
        toast({
          title: 'Success',
          description: 'Navigation entry deleted!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      },
      3000,
      { leading: true, trailing: false },
    ),
    [toast],
  );

  const deleteNavigationEntryMutation = useMutation({
    mutationFn: apiClient.deleteNavigationEntry,
    onSuccess: () => {
      debouncedToast();
    },
  });

  return { deleteNavigationEntryMutation };
};
