import { useToast } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';

import { useSendBackgroundMessage } from './use-send-message.hook';
import { SignUpData } from '../background/interfaces/sign-up.interface';
import { useAuthStore, useNavigationStore } from '../store';

export const useSignUp = () => {
  const toast = useToast();
  const { sendBackgroundMessage } = useSendBackgroundMessage();
  const navigateTo = useNavigationStore((state) => state.navigateTo);
  const setIsValidatingEmail = useAuthStore(
    (state) => state.setIsValidatingEmail,
  );

  const signUp = (data: SignUpData) => sendBackgroundMessage('sign-up', data);

  const signUpMutation = useMutation({
    mutationFn: signUp,
    onSuccess: (res) => {
      if (res.partialToken) {
        setIsValidatingEmail(true);
        navigateTo('validate-email');
      }
    },
    onError: (error) => {
      console.error(error);
      toast({
        title:
          error.message === 'Conflict'
            ? 'Email Already in Use'
            : 'Unexpected Error',
        description:
          error.message === 'Conflict'
            ? 'Please try againg with a different email'
            : 'Please try againg',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
  });
  return { signUpMutation };
};
