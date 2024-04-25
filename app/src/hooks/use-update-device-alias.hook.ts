import { useMutation } from '@tanstack/react-query';
import { useSendBackgroundMessage } from './use-send-message.hook';
import { useToast } from '@chakra-ui/react';
import { UpdateDeviceAliasData } from '../background/interfaces/user-device.interface';

export const useUpdateDeviceAlias = () => {
  const toast = useToast();
  const { sendBackgroundMessage } = useSendBackgroundMessage();

  const updateDeviceAlias = useMutation({
    mutationFn: (params: UpdateDeviceAliasData) =>
      sendBackgroundMessage('update-device-alias', params),
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

  return { updateDeviceAlias };
};
