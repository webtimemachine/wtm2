import { useMutation } from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';
import { useAuthStore, useNavigation } from '../store';

import { apiClient } from '../utils/api.client';

export const useSignUp = () => {
  const toast = useToast();
  const { navigateTo } = useNavigation();
  const notifyEmailValidation = useAuthStore(
    (state) => state.notifyEmailValidation,
  );

  const signUpMutation = useMutation({
    mutationFn: apiClient.signUp,
    onSuccess: (res) => {
      if (res.partialToken) {
        notifyEmailValidation();
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
