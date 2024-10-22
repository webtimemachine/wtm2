import { useMutation } from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';

import { apiClient } from '../utils/api.client';
import { useHandleSessionExpired } from '.';

export const useModelsInformation = () => {
  const toast = useToast();

  const { handleSessionExpired } = useHandleSessionExpired();
  apiClient.setHandleSessionExpired(handleSessionExpired);
  const useModelsInformationMutation = useMutation({
    mutationFn: apiClient.getModelsInformation,
    onSuccess: () => {
      toast({
        title: 'Success',
        description: `Models information retrieved`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: `Models information couldn't be retrieved, please try again later.`,
        status: 'error',
        duration: 8000,
        isClosable: true,
      });
    },
  });

  return { useModelsInformationMutation };
};
