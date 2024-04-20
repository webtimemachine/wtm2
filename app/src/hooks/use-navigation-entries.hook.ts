import { useQuery } from '@tanstack/react-query'

import { useSendBackgroundMessage } from './use-send-message.hook'

export const useNavigationEntries = () => {
  const { sendBackgroundMessage } = useSendBackgroundMessage()

  const getNavigationEntries = () => sendBackgroundMessage('get-navigation-entries', undefined)

  const { data, isLoading, error, refetch } = useQuery({ queryKey: ['getNavigationEntriesQuery'], queryFn: getNavigationEntries, enabled: true })

  return { data, isLoading, error, refetch }
}
