import { useMutation } from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';

import { apiClient } from '../utils/api.client';
import { BasicResponse, CloseActiveSessionsData } from 'wtm-lib/interfaces';

import { useHandleSessionExpired } from '.';

export const useCloseActiveSession = () => {
  const toast = useToast();

  const { handleSessionExpired } = useHandleSessionExpired();

  const closeActiveSession = async (data: CloseActiveSessionsData) => {
    try {
      const res = await apiClient.securedFetch('/api/auth/session/logout', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (res.status !== 200) {
        const errorJson = await res.json();
        throw new Error(errorJson?.message || 'POST Update Preferences Error');
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

  const closeActiveSessionMutation = useMutation({
    mutationFn: closeActiveSession,
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
