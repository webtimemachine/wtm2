import { useMutation } from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';

import { apiClient } from '../utils/api.client';
import { BasicResponse, CloseActiveSessionsData } from '../interfaces';

import { useHandleSessionExpired } from '.';

export const useCloseActiveSession = () => {
  const toast = useToast();

  const { handleSessioExpired } = useHandleSessionExpired();

  const closeActiveSession = async (data: CloseActiveSessionsData) => {
    const res = await apiClient.securedFetch('/api/auth/session/logout', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (res.status === 401) await handleSessioExpired();

    if (res.status !== 200) {
      const errorJson = await res.json();
      throw new Error(errorJson?.message || 'POST Update Preferences Error');
    }

    const response: BasicResponse = await res.json();
    return response;
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
