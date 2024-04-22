import { LoginData, LoginResponse } from './interfaces/login.interface';
class ApiClient {
  async fetch(endpoint: string, init: RequestInit = {}): Promise<Response> {
    const { serverUrl, accessToken } = await chrome.storage.local.get([
      'serverUrl',
      'accessToken',
    ]);

    if (accessToken) {
      init = {
        ...init,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          ...init?.headers,
        },
      };
    }

    return fetch(new URL(endpoint, serverUrl), init);
  }

  async login(data: LoginData): Promise<LoginResponse> {
    const { serverUrl } = await chrome.storage.local.get(['serverUrl']);
    console.log('login', data);

    try {
      const res = await fetch(new URL('/api/auth/login', serverUrl), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (res.status !== 200) {
        const errorJson = await res.json();
        throw new Error(errorJson?.message || 'Login Error');
      }

      const loginResponse: LoginResponse = await res.json();
      const { accessToken, refreshToken } = loginResponse;
      await chrome.storage.local.set({
        accessToken,
        refreshToken,
      });

      return loginResponse;
    } catch (error) {
      console.error('ApiClient login', error);
      throw error;
    }
  }
}

export const apiClient: ApiClient = new ApiClient();
