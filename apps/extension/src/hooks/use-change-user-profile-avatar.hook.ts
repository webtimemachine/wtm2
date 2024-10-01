import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';

import { apiClient } from '../utils/api.client';
import { useHandleSessionExpired } from '.';
import { ChangeUserAvatar } from '@wtm/api';

export const useChangeUserAvatar = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { handleSessionExpired } = useHandleSessionExpired();
  apiClient.setHandleSessionExpired(handleSessionExpired);

  const changeUserAvatarMutation = useMutation({
    mutationFn: (data: ChangeUserAvatar) => apiClient.changeUserAvatar(data),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: `Your avatar has been changed!`,
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
        description: `Your avatar has not been changed! Please contact support.`,
        status: 'error',
        duration: 8000,
        isClosable: true,
      });
    },
  });

  return { changeUserAvatarMutation };
};
