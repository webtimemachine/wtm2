import { useToast } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';

import { useSendBackgroundMessage } from './use-send-message.hook';

export const useGetVersion = () => {
  const toast = useToast();
  const { sendBackgroundMessage } = useSendBackgroundMessage();

  const gerVersion = () => sendBackgroundMessage('get-version', undefined);

  const getVersionMutation = useMutation({
    mutationFn: gerVersion,
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
  });
  return { getVersionMutation };
};
