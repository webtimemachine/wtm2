import { useMutation } from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';

import { apiClient } from '../utils/api.client';
import { useHandleSessionExpired } from '.';
import { BulkDeleteNavigationEntriesData } from '@wtm/api';

export const useBulkDeleteNavigationEntries = () => {
  const toast = useToast();
  const { handleSessionExpired } = useHandleSessionExpired();
  apiClient.setHandleSessionExpired(handleSessionExpired);

  const deleteBulkNavigationEntriesMutation = useMutation({
    mutationFn: (data: BulkDeleteNavigationEntriesData) =>
      apiClient.deleteBulkNavigationEntry(data),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: `The navigation entries were deleted!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: `Navigation entries couldn't be deleted! Please contact for support.`,
        status: 'error',
        duration: 8000,
        isClosable: true,
      });
    },
  });

  return { deleteBulkNavigationEntriesMutation };
};
