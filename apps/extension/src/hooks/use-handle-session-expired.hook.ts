import { useToast } from '@chakra-ui/react';
import { useLogout } from '.';
import { useTabState } from '../store';

export const useHandleSessionExpired = () => {
  const { logout } = useLogout();
  const toast = useToast();
  const setDeferredState = useTabState((state) => state.setDeferredState);

  const handleLogout = async () => {
    setDeferredState(false);
    await logout();
  };
  const handleSessionExpired = async () => {
    handleLogout();
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
