import { getErrorMessage } from '../utils'
import { LoginData, LoginResponse } from './interfaces/login.interface'
import { GetNavigationEntriesData, GetNavigationEntriesResponse } from './interfaces/navigation-entry'
class ApiClient {
  async fetch (endpoint: string, init: RequestInit = {}): Promise<Response> {
    const { serverUrl, accessToken } = await chrome.storage.local.get([
      'serverUrl',
      'accessToken',
    ])

    if (accessToken) {
      init = {
        ...init,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          ...init?.headers,
        },
      }
    }

    return fetch(new URL(endpoint, serverUrl), init)
  }

  async refreshToken (): Promise<void> {
    const { serverUrl, refreshToken } = await chrome.storage.local.get([
      'serverUrl',
      'refreshToken'
    ])

    try {
      const resp = await fetch(new URL('/api/auth/refresh', serverUrl), {
        method: 'GET', headers: {
          Authorization: `Bearer ${refreshToken}`,
          'Content-Type': 'application/json'
        },
      })

      const data = await resp.json()

      await chrome.storage.local.set({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      })
    } catch (error) {
      console.error('Refresh Token Error', error)
      throw error
    }
  }

  async login (data: LoginData): Promise<LoginResponse> {
    const { serverUrl } = await chrome.storage.local.get(['serverUrl'])
    console.log('login', data)

    try {
      const res = await fetch(new URL('/api/auth/login', serverUrl), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (res.status !== 200) {
        const errorJson = await res.json()
        throw new Error(errorJson?.message || 'Login Error')
      }

      const loginResponse: LoginResponse = await res.json()
      const { accessToken, refreshToken } = loginResponse
      await chrome.storage.local.set({
        accessToken,
        refreshToken,
      })

      return loginResponse
    } catch (error) {
      console.error('ApiClient login', error)
      throw error
    }
  }

  async getNavigationEntries (data: GetNavigationEntriesData): Promise<GetNavigationEntriesResponse> {
    try {
      const { offset, limit, query, isSemantic } = data
      const res = await this.fetch(`/api/navigation-entry?offset=${offset}&limit=${limit}${query ? `&query=${query}` : ''}&isSemantic=${isSemantic}`, { method: 'GET' })

      if (res.status !== 200) {
        const errorJson = await res.json()
        throw new Error(errorJson?.message || 'GET Navigation Entries Error')
      }

      const getNavigationEntriesResponse: GetNavigationEntriesResponse = await res.json()

      return getNavigationEntriesResponse

    } catch (error) {
      console.error('ApiClient getNavigationEntries', error)
      const message = getErrorMessage(error)

      if (message.includes('Unauthorized')) {
        try {
          await this.refreshToken()
          return this.getNavigationEntries(data)
        } catch (refreshError) {
          throw error
        }
      }
      throw error
    }
  }
}

export const apiClient: ApiClient = new ApiClient()
