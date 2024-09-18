import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';

import { apiClient } from '../utils/api.client';
import { useHandleSessionExpired } from '.';
import { ChangeUserDisplayName } from '@wtm/api';

export const useChangeUserDisplayName = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { handleSessionExpired } = useHandleSessionExpired();
  apiClient.setHandleSessionExpired(handleSessionExpired);

  const changeUserDisplayNameMutation = useMutation({
    mutationFn: (data: ChangeUserDisplayName) =>
      apiClient.changeUserDisplayName(data),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: `Your displayname has been changed!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      queryClient.invalidateQueries({
        queryKey: ['getBasicUserInformationQuery'],
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: `Your displayname has not been changed! Please check the requirements and try again.`,
        status: 'error',
        duration: 8000,
        isClosable: true,
      });
    },
  });

  return { changeUserDisplayNameMutation };
};
