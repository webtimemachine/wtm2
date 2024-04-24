import { useMutation } from '@tanstack/react-query';
import { useSendBackgroundMessage } from './use-send-message.hook';
import { UpdatePreferenciesData } from '../background/interfaces/preferences';
import { useToast } from '@chakra-ui/react';

export const useUpdatePreferences = (params: UpdatePreferenciesData) => {
  const toast = useToast();
  const { sendBackgroundMessage } = useSendBackgroundMessage();

  const updatePreferencesQuery = useMutation({
    mutationFn: () => sendBackgroundMessage('update-preferences', params),
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

  return { updatePreferencesQuery };
};
