import { BackgroundMessageHandler } from '../interfaces'
import { apiClient } from '../api.client'
import { GetNavigationEntriesData, GetNavigationEntriesResponse } from '../interfaces/navigation-entry'

const getNavigationEntries = async (data: GetNavigationEntriesData): Promise<GetNavigationEntriesResponse> => {
  try {
    const { offset, limit, query, isSemantic } = data
    const res = await apiClient.fetch(`/api/navigation-entry?offset=${offset}&limit=${limit}${query ? `&query=${query}` : ''}&isSemantic=${isSemantic}`, { method: 'GET' })

    if (res.status !== 200) {
      const errorJson = await res.json()
      throw new Error(errorJson?.message || 'GET Navigation Entries Error')
    }

    const getNavigationEntriesResponse: GetNavigationEntriesResponse = await res.json()

    return getNavigationEntriesResponse

  } catch (error) {
    console.error('ApiClient getNavigationEntries', error)
    throw error
  }
}

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
    const getNavigationEntriesResp = await getNavigationEntries(data)
    sendResponse(getNavigationEntriesResp)
  } catch (error) {
    console.error('handleGetNavigationEntries', error)
    sendResponse({ error: 'Error retrieving navigation entries' })
  }
}
