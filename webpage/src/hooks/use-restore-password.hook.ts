import { useMutation } from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';
import { authStore, useAuthStore } from '../store';

import { apiClient } from '@/utils/api.client';
import {
  LoginResponse,
  RestorePasswordData,
  RestorePasswordErrorResponse,
} from '@/interfaces';

export const useRestorePassword = () => {
  const toast = useToast();
  const notifyLogin = useAuthStore((state) => state.notifyLogin);
  const { recoveryToken } = authStore.getState();

  const restorePassword = async (data: RestorePasswordData) => {
    if (!recoveryToken) throw new Error('recoveryToken is missing');

    const res = await apiClient.fetch('/api/auth/password/restore', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${recoveryToken}`,
      },
    });

    if (res.status === 200) {
      const response: LoginResponse = await res.json();
      const { accessToken, refreshToken } = response;

      authStore.setState({
        accessToken,
        refreshToken,
      });

      return response;
    } else {
      const errorRes: RestorePasswordErrorResponse = await res.json();
      throw new Error(errorRes?.message?.toString());
    }
  };

  const restorePasswordMutation = useMutation({
    mutationFn: restorePassword,
    onSuccess: (loginRes) => {
      notifyLogin();
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
        title: 'Unexpected Error',
        description: 'Please try againg',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
  });
  return { restorePasswordMutation };
};
