import {
  LoginData,
  LoginResponse,
  VerifyEmailResponse,
  isLoginRes,
} from './interfaces/login.interface';

interface ApiClientOptions {
  getServerUrl: () => Promise<string>;
  getAccessToken: () => Promise<string>;
  getRefreshToken: () => Promise<string>;
  setAccessToken: (accessToken: string) => Promise<void>;
  setRefreshToken: (refreshToken: string) => Promise<void>;
  setPartialToken: (partialToken: string) => Promise<void>;
}

export class ApiClient {
  private getServerUrl: () => Promise<string>;
  private getAccessToken: () => Promise<string>;
  private getRefreshToken: () => Promise<string>;
  private setAccessToken: (accessToken: string) => Promise<void>;
  private setRefreshToken: (refreshToken: string) => Promise<void>;
  private setPartialToken: (partialToken: string) => Promise<void>;

  constructor(options: ApiClientOptions) {
    this.getServerUrl = options.getServerUrl;
    this.getAccessToken = options.getAccessToken;
    this.getRefreshToken = options.getRefreshToken;
    this.setAccessToken = options.setAccessToken;
    this.setRefreshToken = options.setRefreshToken;
    this.setPartialToken = options.setPartialToken;
  }

  async fetch(endpoint: string, init: RequestInit = {}): Promise<Response> {
    const serverUrl = await this.getServerUrl();
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
    const serverUrl = await this.getServerUrl();
    const accessToken = await this.getAccessToken();

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
    const serverUrl = await this.getServerUrl();
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
        await Promise.all([
          this.setAccessToken(accessToken),
          this.setRefreshToken(refreshToken),
        ]);
      } else {
        const { partialToken } = loginResponse;
        await this.setPartialToken(partialToken);
      }

      return loginResponse;
    } catch (error) {
      console.error('ApiClient login', error);
      throw error;
    }
  }

  async refresh(): Promise<void> {
    const serverUrl = await this.getServerUrl();
    const refreshToken = await this.getRefreshToken();

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
      await Promise.all([
        this.setAccessToken(data.accessToken),
        this.setRefreshToken(data.refreshToken),
      ]);
    } catch (error) {
      console.error('ApiClient Refresh Error', error);
      throw error;
    }
  }
}
