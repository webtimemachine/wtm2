import { useMutation } from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';

import { apiClient } from '../utils/api.client';
import { BasicResponse, DeleteNavigationEntriesData } from '../interfaces';
import { useHandleSessionExpired } from '.';

export const useDeleteNavigationEntry = () => {
  const toast = useToast();

  const { handleSessioExpired } = useHandleSessionExpired();

  const deleteNavigationEntry = async (data: DeleteNavigationEntriesData) => {
    const res = await apiClient.securedFetch(
      `/api/navigation-entry/${data.id}`,
      {
        method: 'DELETE',
      },
    );

    if (res.status === 401) await handleSessioExpired();

    if (res.status !== 200) {
      const errorJson = await res.json();
      throw new Error(errorJson?.message || 'DELETE Navigation entry Error');
    }

    const response: BasicResponse = await res.json();
    return response;
  };

  const deleteNavigationEntryMutation = useMutation({
    mutationFn: deleteNavigationEntry,
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
