import { useQuery } from '@tanstack/react-query';

import { apiClient } from '../utils/api.client';
import { useHandleSessionExpired } from '.';

export const useGetBasicUserIngormation = () => {
  const { handleSessionExpired } = useHandleSessionExpired();

  apiClient.setHandleSessionExpired(handleSessionExpired);

  const basicUserInformationQuery = useQuery({
    queryKey: ['getBasicUserInformationQuery'],
    queryFn: () => apiClient.getBasicUserInformation(),
    enabled: true,
    retry: false,
  });

  return { basicUserInformationQuery };
};
