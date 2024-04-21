import { BackgroundMessageHandler } from '../interfaces'
import { apiClient } from '../api.client'
import { GetNavigationEntriesData } from '../interfaces/navigation-entry'

export const handleGetNavigationEntries: BackgroundMessageHandler<'get-navigation-entries'> = async (
  sendResponse
) => {
  try {
    const data: GetNavigationEntriesData = {
      isSemantic: false,
      limit: 10,
      offset: 0,
      query: ''
    }
    const getNavigationEntriesResp = await apiClient.getNavigationEntries(data)
    sendResponse(getNavigationEntriesResp)
  } catch (error) {
    console.error('handleGetNavigationEntries', error)
    sendResponse({ error: 'Error retrieving navigation entries' })
  }
}
