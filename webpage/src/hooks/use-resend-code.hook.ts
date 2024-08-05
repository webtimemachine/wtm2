import { useMutation } from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';

import { apiClient } from '@/utils/api.client';
import { ResendCodeResponse, ResendCodeErrorResponse } from '@/interfaces';
import { authStore } from '@/store';

export const useResendCode = () => {
  const toast = useToast();

  const resendCode = async () => {
    const { partialToken } = authStore.getState();

    if (!partialToken) throw new Error('partialToken is missing');

    const res = await apiClient.fetch('/api/auth/verify/resend', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${partialToken}`,
      },
    });

    if (res.status === 200) {
      const response: ResendCodeResponse = await res.json();
      return response;
    } else {
      const errorRes: ResendCodeErrorResponse = await res.json();
      throw new Error(errorRes?.message?.toString());
    }
  };

  const resendCodeMutation = useMutation({
    mutationFn: resendCode,
    onSuccess: (res) => {
      toast({
        status: 'success',
        title: 'Validation code successfully sent!',
        description: 'Please review your email inbox.',
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        status: 'error',
        title: 'Error while sending email',
        description: 'Please try againg',
        duration: 3000,
        isClosable: true,
      });
    },
  });
  return { resendCodeMutation };
};
