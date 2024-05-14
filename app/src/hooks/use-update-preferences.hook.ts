import { useMutation } from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';

import { apiClient } from '../utils/api.client';
import { PreferenciesResponse, UpdatePreferenciesData } from '../interfaces';
import { useHandleSessionExpired } from '.';

export const useUpdatePreferences = () => {
  const toast = useToast();

  const { handleSessioExpired } = useHandleSessionExpired();

  const updatePreferences = async (data: UpdatePreferenciesData) => {
    const res = await apiClient.securedFetch('/api/user/preferences', {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    if (res.status === 401) await handleSessioExpired();

    if (res.status !== 200) {
      const errorJson = await res.json();
      throw new Error(errorJson?.message || 'PUT Update Preferences Error');
    }

    const response: PreferenciesResponse = await res.json();
    return response;
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
