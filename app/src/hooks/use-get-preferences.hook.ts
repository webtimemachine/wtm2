import { useQuery } from '@tanstack/react-query';
import { useSendBackgroundMessage } from './use-send-message.hook';

export const useGetPreferences = () => {
  const { sendBackgroundMessage } = useSendBackgroundMessage();

  const userPreferencesQuery = useQuery({
    queryKey: ['getUserPreferencesQuery'],
    queryFn: () => sendBackgroundMessage('get-user-preferences', undefined),
    enabled: true,
  });

  return { userPreferencesQuery };
};
