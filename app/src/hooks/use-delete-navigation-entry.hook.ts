import { useMutation } from '@tanstack/react-query';
import { useSendBackgroundMessage } from './use-send-message.hook';
import { useToast } from '@chakra-ui/react';
import { DeleteNavigationEntriesData } from '../background/interfaces/navigation-entry.interface';

export const useDeleteNavigationEntry = () => {
  const toast = useToast();
  const { sendBackgroundMessage } = useSendBackgroundMessage();

  const deleteNavigationEntryMutation = useMutation({
    mutationFn: (params: DeleteNavigationEntriesData) =>
      sendBackgroundMessage('delete-navigation-entry', params),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: `Navigation entry deleted!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
  });

  return { deleteNavigationEntryMutation };
};
