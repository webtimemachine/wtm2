import { useQuery } from '@tanstack/react-query'
import { useSendBackgroundMessage } from './use-send-message.hook'
import { useLogout } from './use-logout.hook'

export const useNavigationEntries = () => {
  const { sendBackgroundMessage } = useSendBackgroundMessage()
  const { logout } = useLogout()

  // TODO pass parameters
  const getNavigationEntries = () => sendBackgroundMessage('get-navigation-entries', undefined)

  const { data, isLoading, error, refetch } = useQuery({ queryKey: ['getNavigationEntriesQuery'], queryFn: getNavigationEntries, enabled: true, retry: false })

  if (!isLoading && error && error.message.includes('Unauthorized')) {
    logout()
  }

  return { data, isLoading, error, refetch }
}
