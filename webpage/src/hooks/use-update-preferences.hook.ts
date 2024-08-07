import { useMutation } from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';

import { apiClient } from '../utils/api.client';
import { PreferenciesResponse, UpdatePreferenciesData } from '@/interfaces';
import { useHandleSessionExpired } from '.';

export const useUpdatePreferences = () => {
  const toast = useToast();

  const { handleSessionExpired } = useHandleSessionExpired();

  const updatePreferences = async (data: UpdatePreferenciesData) => {
    try {
      const res = await apiClient.securedFetch('/api/user/preferences', {
        method: 'PUT',
        body: JSON.stringify(data),
      });

      if (res.status !== 200) {
        const errorJson = await res.json();
        throw new Error(errorJson?.message || 'PUT Update Preferences Error');
      }

      const response: PreferenciesResponse = await res.json();
      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (`${error?.message}`.toLowerCase().includes('unauthorized')) {
          await handleSessionExpired();
        } else {
          throw error;
        }
      }
      throw error;
    }
  };

  const updatePreferencesMutation = useMutation({
    mutationFn: (data: UpdatePreferenciesData) => updatePreferences(data),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: `User preferences updated!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
  });

  return { updatePreferencesMutation };
};
