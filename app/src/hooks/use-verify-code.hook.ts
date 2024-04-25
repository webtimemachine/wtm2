import { useMutation } from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';

import { useSendBackgroundMessage } from './use-send-message.hook';
import { VerifyCodeData } from '../background/interfaces/verify-code-interface';
import { useAuthStore } from '../store';

export const useVerifyCode = () => {
  const toast = useToast();
  const { setIsLoggedIn, setEmail, setIsValidatingEmail } = useAuthStore(
    (state) => state,
  );
  const { sendBackgroundMessage } = useSendBackgroundMessage();

  const verificationCodeMutation = useMutation({
    mutationFn: (data: VerifyCodeData) =>
      sendBackgroundMessage('verify-code', data),
    onSuccess: (loginRes) => {
      console.log(loginRes);
      setIsLoggedIn(true);
      setIsValidatingEmail(false);
      setEmail(loginRes.user.email);
      toast({
        title: 'Welcome!',
        description: `Welcome ${loginRes.user.email}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: 'Invalid verificacion code',
        description: 'Please review your verificacion code and try againg',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
  });
  return { verificationCodeMutation };
};
