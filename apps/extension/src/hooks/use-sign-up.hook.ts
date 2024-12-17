import { useMutation } from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';
import { useAuthStore } from '../store';

import { apiClient } from '../utils/api.client';
import { useExtensionNavigation } from './use-extension-navigation';
import { ROUTES } from './use-extension-navigation';

export const useSignUp = () => {
  const toast = useToast();
  const { navigateTo } = useExtensionNavigation();
  const notifyEmailValidation = useAuthStore(
    (state) => state.notifyEmailValidation,
  );

  const signUpMutation = useMutation({
    mutationFn: apiClient.signUp,
    onSuccess: (res) => {
      if (res.partialToken) {
        notifyEmailValidation();
        navigateTo(ROUTES.VALIDATE_EMAIL);
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
            ? 'Please try again with a different email'
            : 'Please try again',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
  });

  return { signUpMutation };
};
