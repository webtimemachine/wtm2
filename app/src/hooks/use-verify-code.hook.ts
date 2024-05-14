import { useMutation } from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';

import { useAuthStore } from '../store';
import { apiClient } from '../utils/api.client';
import { VerifyCodeData, VerifyCodeErrorResponse } from '../interfaces';
import { LoginResponse } from '../interfaces/login.interface';

export const useVerifyCode = () => {
  const toast = useToast();
  const notifyLogin = useAuthStore((state) => state.notifyLogin);

  const verificationCode = async (data: VerifyCodeData) => {
    const { partialToken } = await chrome.storage.local.get(['partialToken']);
    if (!partialToken) throw new Error('partialToken is missing');

    const res = await apiClient.fetch('/api/auth/verify', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${partialToken}`,
      },
    });

    if (res.status === 200) {
      const response: LoginResponse = await res.json();
      const { accessToken, refreshToken } = response;
      await chrome.storage.local.set({
        accessToken,
        refreshToken,
      });
      return response;
    } else {
      const errorRes: VerifyCodeErrorResponse = await res.json();
      throw new Error(errorRes?.message?.toString());
    }
  };

  const verificationCodeMutation = useMutation({
    mutationFn: verificationCode,
    onSuccess: (loginRes) => {
      console.log(loginRes);
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
