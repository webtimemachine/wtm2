import { useQuery } from '@tanstack/react-query';
import { useSendBackgroundMessage } from './use-send-message.hook';

export const useGetActiveSessions = () => {
  const { sendBackgroundMessage } = useSendBackgroundMessage();

  const getActiveSessionsQuery = useQuery({
    queryKey: ['getActiveSessions'],
    queryFn: () => sendBackgroundMessage('get-active-sessions', undefined),
    enabled: true,
  });

  return { getActiveSessionsQuery };
};
