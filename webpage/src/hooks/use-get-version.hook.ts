import { useToast } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';

import { apiClient } from '../utils/api.client';

export const useGetVersion = () => {
  const toast = useToast();

  const getVersionMutation = useMutation({
    mutationFn: apiClient.gerVersion,
    onSuccess: ({ version }) => {
      toast({
        title: 'Version Response',
        description: `Server version: ${version}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: 'Error while getting version',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
    retry: false,
  });
  return { getVersionMutation };
};
