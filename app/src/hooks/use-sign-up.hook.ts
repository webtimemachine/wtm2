import { useMutation } from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';
import { useAuthStore, useNavigation } from '../store';

import { apiClient } from '../utils/api.client';
import {
  SignUpData,
  SignUpResponse,
  SignUpErrorResponse,
} from 'wtm-lib/interfaces';

export const useSignUp = () => {
  const toast = useToast();
  const { navigateTo } = useNavigation();
  const notifyEmailValidation = useAuthStore(
    (state) => state.notifyEmailValidation,
  );

  const signUp = async (data: SignUpData) => {
    const res = await apiClient.securedFetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (res.status === 200) {
      const response: SignUpResponse = await res.json();
      const { partialToken } = response;
      await chrome.storage.local.set({ partialToken });
      return response;
    } else {
      const errorRes: SignUpErrorResponse = await res.json();
      throw new Error(errorRes?.error || errorRes?.message?.toString());
    }
  };

  const signUpMutation = useMutation({
    mutationFn: signUp,
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
