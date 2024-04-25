import { useQuery } from '@tanstack/react-query';
import { useSendBackgroundMessage } from './use-send-message.hook';
import { GetNavigationEntriesData } from '../background/interfaces/navigation-entry.interface';

export const useNavigationEntries = (params: GetNavigationEntriesData) => {
  const { sendBackgroundMessage } = useSendBackgroundMessage();

  const navigationEntriesQuery = useQuery({
    queryKey: ['getNavigationEntriesQuery'],
    queryFn: () => sendBackgroundMessage('get-navigation-entries', params),
    enabled: false,
  });

  return { navigationEntriesQuery };
};
