import { useMutation } from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';

import { apiClient } from '../utils/api.client';
import { BasicResponse } from 'wtm-lib/interfaces';
import { useHandleSessionExpired } from '.';

export const useConfirmDeleteAccount = () => {
  const toast = useToast();

  const { handleSessionExpired } = useHandleSessionExpired();

  const confirmDeleteAccount = async () => {
    try {
      const res = await apiClient.securedFetch('/api/user', {
        method: 'DELETE',
      });

      if (res.status !== 200) {
        const errorJson = await res.json();
        throw new Error(
          errorJson?.message || 'DELETE Confirm delete account Error',
        );
      }

      const response: BasicResponse = await res.json();
      return response;
    } catch (error: any) {
      if (`${error?.message}`.toLowerCase().includes('unauthorized')) {
        await handleSessionExpired();
      } else {
        throw error;
      }
    }
  };

  const confirmDeleteAccountMutation = useMutation({
    mutationFn: confirmDeleteAccount,
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
