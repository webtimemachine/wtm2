import { useToast } from '@chakra-ui/react';
import { useLogout } from '.';

export const useHandleSessionExpired = () => {
  const { logout } = useLogout();
  const toast = useToast();

  const handleSessionExpired = async () => {
    await logout();
    toast({
      title: 'Session expired',
      description: 'Session has expired please login again.',
      status: 'error',
      duration: 9000,
      isClosable: true,
    });

    throw new Error('Session expired');
  };

  return { handleSessionExpired };
};
