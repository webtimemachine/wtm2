import { useMutation } from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';

import { apiClient } from '../utils/api.client';
import { useHandleSessionExpired } from '.';

export const useUpdatePreferences = () => {
  const toast = useToast();

  const { handleSessionExpired } = useHandleSessionExpired();
  apiClient.setHandleSessionExpired(handleSessionExpired);

  const updatePreferencesMutation = useMutation({
    mutationFn: apiClient.updatePreferences,
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
