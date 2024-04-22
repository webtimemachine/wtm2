import { LoginData, LoginResponse } from './interfaces/login.interface';

class ApiClient {
  async fetch(endpoint: string, init: RequestInit = {}): Promise<Response> {
    const { serverUrl, accessToken } = await chrome.storage.local.get([
      'serverUrl',
      'accessToken',
    ]);

    try {
      if (accessToken) {
        init = {
          ...init,
          headers: {
            'Content-Type': 'application/json',
            ...init?.headers,
            Authorization: `Bearer ${accessToken}`,
          },
        };
      }
      const res = await fetch(new URL(endpoint, serverUrl), init);

      if (res.status === 401) {
        const jsonRes = await res.json();
        console.error('ApiClient', { endpoint, response: jsonRes });
        throw new Error('Unauthorized');
      }

      return res;
    } catch (error: any) {
      if (error?.message === 'Unauthorized') {
        try {
          await this.refresh();
          console.log('ApiClient Retrying request after refresh', { endpoint });
          return this.fetch(endpoint, init);
        } catch (error) {
          throw error;
        }
      } else {
        throw error;
      }
    }
  }

  async login(data: LoginData): Promise<LoginResponse> {
    const { serverUrl } = await chrome.storage.local.get(['serverUrl']);
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

  async refresh(): Promise<void> {
    console.log('ApiClient Refreshing...');
    const { serverUrl, refreshToken } = await chrome.storage.local.get([
      'serverUrl',
      'refreshToken',
    ]);

    try {
      const res = await fetch(new URL('/api/auth/refresh', serverUrl), {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${refreshToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.status !== 200) {
        throw new Error('Unauthorized');
      }

      const data = await res.json();
      await chrome.storage.local.set({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
    } catch (error) {
      console.error('ApiClient Refresh Error', error);
      throw error;
    }
  }
}

export const apiClient: ApiClient = new ApiClient();
