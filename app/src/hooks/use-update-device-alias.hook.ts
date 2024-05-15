import { useMutation } from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';

import { apiClient } from '../utils/api.client';
import { UpdateDeviceAliasData, BasicResponse } from '../interfaces';
import { useHandleSessionExpired } from '.';

export const useUpdateDeviceAlias = () => {
  const toast = useToast();
  const { handleSessioExpired } = useHandleSessionExpired();

  const updateDeviceAlias = async (data: UpdateDeviceAliasData) => {
    try {
      const res = await apiClient.securedFetch(`/api/user/device/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify({ deviceAlias: data.deviceAlias }),
      });

      if (res.status !== 200) {
        const errorJson = await res.json();
        throw new Error(errorJson?.message || 'PUT Update Preferences Error');
      }

      const response: BasicResponse = await res.json();
      return response;
    } catch (error) {
      await handleSessioExpired();
    }
  };

  const updateDeviceAliasMutation = useMutation({
    mutationFn: updateDeviceAlias,
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
