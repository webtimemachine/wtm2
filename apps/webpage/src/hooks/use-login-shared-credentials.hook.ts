import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/store';

import { apiClient } from '@/utils/api.client';

export const useLoginSharedCredentials = (
  backUrl: string | null,
  token: string | null,
) => {
  const { notifyLogin } = useAuthStore((state) => state);

  const reLoginMutation = useMutation({
    mutationFn: () =>
      token && backUrl ? apiClient.refresh(backUrl, token) : Promise.resolve(),
    onSuccess: () => {
      notifyLogin();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return { reLoginMutation };
};
