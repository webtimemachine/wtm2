import { useMutation } from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';
import { useAuthStore } from '../store';
import { useLocation } from 'wouter';

import { apiClient } from '../utils/api.client';

export const useSignUp = () => {
  const toast = useToast();
  const [, navigate] = useLocation();
  const notifyEmailValidation = useAuthStore(
    (state) => state.notifyEmailValidation,
  );

  const signUpMutation = useMutation({
    mutationFn: apiClient.signUp,
    onSuccess: (res) => {
      if (res.partialToken) {
        notifyEmailValidation();
        navigate('/validate-email');
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
