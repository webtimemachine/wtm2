import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../utils/api.client';

export const useModelsInformation = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['ModelsInformation'],
    queryFn: apiClient.getModelsInformation,
  });

  return { data, isLoading, error };
};
