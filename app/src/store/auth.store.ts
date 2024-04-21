import { useStore } from 'zustand'
import { createStore } from 'zustand/vanilla'
import { persist } from 'zustand/middleware'
import { getRandomToken } from '../utils'

interface AuthStore {
  serverUrl: string
  deviceKey: string
  setServerUrl: (serverUrl: string) => void
  logout: () => void
}

export const authStore = createStore<AuthStore>()(
  persist(
    (set) => ({
      serverUrl: 'https://wtm-back.vercel.app',
      deviceKey: getRandomToken(),
      setServerUrl: (serverUrl: string) =>
        set(() => {
          chrome.storage.local.set({
            serverUrl,
            accessToken: '',
            refreshToken: '',
          })
          return { serverUrl }
        }),
      logout: () =>
        set((state) => {
          chrome.storage.local.set({
            accessToken: '',
            refreshToken: '',
          })
          return state
        })
    }),
    {
      name: 'auth-vanilla-store',
    },
  ),
)

export const useAuthStore = <T> (selector?: (state: AuthStore) => T) =>
  useStore(authStore, selector!)

export const useLogout = () => {
  const logout = async (): Promise<void> => {
    await chrome.storage.local.set({
      accessToken: '',
      refreshToken: '',
    })
  }

  return { logout }
}

export const useIsLogged = () => {
  const isLogged = async (): Promise<boolean> => {
    const tokens = await chrome.storage.local.get([
      'accessToken',
      'refreshToken'
    ])

    const { accessToken, refreshToken } = tokens

    return (accessToken ?? false) && (refreshToken ?? false)
  }

  return { isLogged }
}

export const useServerUrl = () => {
  const serverUrl = useAuthStore((state) => state.serverUrl)
  const setServerUrl = useAuthStore((state) => state.setServerUrl)
  return { serverUrl, setServerUrl }
}

const initStorage = async () => {
  const { serverUrl } = await chrome.storage.local.get(['serverUrl'])
  if (!serverUrl) {
    await chrome.storage.local.set({
      serverUrl: authStore.getState().serverUrl,
    })
  }

  const { deviceKey } = await chrome.storage.local.get(['deviceKey'])
  if (!deviceKey) {
    await chrome.storage.local.set({
      deviceKey: authStore.getState().deviceKey,
    })
  }
}
initStorage()
