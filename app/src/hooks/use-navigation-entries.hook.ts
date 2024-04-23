import { useQuery } from '@tanstack/react-query';
import { useSendBackgroundMessage } from './use-send-message.hook';
import { useLogout } from './use-logout.hook';
import { useState } from 'react';

export const useNavigationEntries = () => {
  const { sendBackgroundMessage } = useSendBackgroundMessage();
  const { logout } = useLogout();
  const [page, setPage] = useState<number>(0);
  const [query, setQuery] = useState<string>('');
  const [isSemantic, setIsSemantic] = useState<boolean>(false);

  const LIMIT = 10;

  const getNavigationEntries = () =>
    sendBackgroundMessage('get-navigation-entries', {
      offset: page * LIMIT,
      limit: LIMIT,
      query,
      isSemantic,
    });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['getNavigationEntriesQuery', { page, query }],
    queryFn: getNavigationEntries,
    enabled: true,
    retry: false,
  });

  if (!isLoading && error && error.message.includes('Unauthorized')) {
    logout();
  }

  return {
    data,
    page,
    isLoading,
    error,
    refetch,
    setPage,
    setIsSemantic,
    setQuery,
  };
};
