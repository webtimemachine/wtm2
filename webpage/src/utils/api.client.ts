import { authStore } from '@/store';
import {
  LoginData,
  LoginResponse,
  VerifyEmailResponse,
  isLoginRes,
} from '../interfaces/login.interface';

class ApiClient {
  async fetch(endpoint: string, init: RequestInit = {}): Promise<Response> {
    const { serverUrl } = authStore.getState();
    // const { serverUrl } = await chrome.storage.local.get(['serverUrl']);
    init = {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    };

    const res = await fetch(new URL(endpoint, serverUrl), init);
    return res;
  }

  async securedFetch(
    endpoint: string,
    init: RequestInit = {},
  ): Promise<Response> {
    const { serverUrl, accessToken } = authStore.getState();
    // const { serverUrl, accessToken } = await chrome.storage.local.get([
    //   'serverUrl',
    //   'accessToken',
    // ]);

    init = {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    };

    try {
      if (accessToken) {
        init = {
          ...init,
          headers: {
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error?.message === 'Unauthorized') {
        await this.refresh();
        console.log('ApiClient Retrying request after refresh', { endpoint });
        return this.securedFetch(endpoint, init);
      } else {
        throw error;
      }
    }
  }

  async login(data: LoginData): Promise<LoginResponse | VerifyEmailResponse> {
    const { serverUrl } = authStore.getState();
    // const { serverUrl } = await chrome.storage.local.get(['serverUrl']);
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

      const loginResponse: LoginResponse | VerifyEmailResponse =
        await res.json();
      if (isLoginRes(loginResponse)) {
        const { accessToken, refreshToken } = loginResponse;

        authStore.setState({
          accessToken,
          refreshToken,
        });
        // await chrome.storage.local.set({
        //   accessToken,
        //   refreshToken,
        // });
      } else {
        const { partialToken } = loginResponse;
        authStore.setState({
          partialToken,
        });
        // await chrome.storage.local.set({
        //   partialToken,
        // });
      }

      return loginResponse;
    } catch (error) {
      console.error('ApiClient login', error);
      throw error;
    }
  }

  async refresh(): Promise<void> {
    const { serverUrl, refreshToken } = authStore.getState();

    // const { serverUrl, refreshToken } = await chrome.storage.local.get([
    //   'serverUrl',
    //   'refreshToken',
    // ]);

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
      authStore.setState({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      // await chrome.storage.local.set({
      //   accessToken: data.accessToken,
      //   refreshToken: data.refreshToken,
      // });
    } catch (error) {
      console.error('ApiClient Refresh Error', error);
      throw error;
    }
  }
}

export const apiClient: ApiClient = new ApiClient();
