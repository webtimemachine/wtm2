import { useMutation } from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';

import { apiClient } from '../utils/api.client';

import { useHandleSessionExpired } from '.';

export const useUpdateDeviceAlias = () => {
  const toast = useToast();
  const { handleSessionExpired } = useHandleSessionExpired();
  apiClient.setHandleSessionExpired(handleSessionExpired);

  const updateDeviceAliasMutation = useMutation({
    mutationFn: apiClient.updateDeviceAlias,
    onSuccess: () => {
      toast({
        title: 'Success',
        description: `Device alias updated!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
  });

  return { updateDeviceAliasMutation };
};
