import { useQuery } from '@tanstack/react-query'

import { useSendBackgroundMessage } from './use-send-message.hook'
import { useLogout, useNavigationStore } from '../store'

export const useNavigationEntries = () => {
  const { sendBackgroundMessage } = useSendBackgroundMessage()
  const { logout } = useLogout()
  const { navigateTo } = useNavigationStore()

  const getNavigationEntries = () => sendBackgroundMessage('get-navigation-entries', undefined)

  const { data, isLoading, error, refetch } = useQuery({ queryKey: ['getNavigationEntriesQuery'], queryFn: getNavigationEntries, enabled: true })

  if (!isLoading && error && error.message.includes('Unauthorized')) {
    logout()
    navigateTo('login')
  }

  return { data, isLoading, error, refetch }
}
