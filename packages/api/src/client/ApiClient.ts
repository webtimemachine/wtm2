import { User } from '../interfaces/user-basic-information';
import {
  BasicResponse,
  CloseActiveSessionsData,
  DeleteNavigationEntriesData,
  LoginData,
  LoginResponse,
  VerifyEmailResponse,
  isLoginRes,
  ActiveSession,
  PreferenciesResponse,
  GetVersionResponse,
  GetNavigationEntriesData,
  GetNavigationEntriesResponse,
  RecoverPasswordData,
  RecoverPasswordResponse,
  VerifyCodeErrorResponse,
  ResendCodeResponse,
  ResendCodeErrorResponse,
  RestorePasswordData,
  RestorePasswordErrorResponse,
  SignUpData,
  SignUpResponse,
  SignUpErrorResponse,
  UpdateDeviceAliasData,
  UpdatePreferenciesData,
  ValidateRecoveryCodeData,
  ValidateRecoveryCodeErrorResponse,
  ValidateRecoveryCodeResponse,
  VerifyCodeData,
  ChangeUserPassword,
  ChangeUserDisplayName,
  SystemModels,
  ExternalClientPayload,
  RetrieveExternalLoginPayload,
  ExternalLoginPayload,
} from '../interfaces';
import { ChangeUserAvatar } from '../interfaces/change-user-avatar.interface';
import { BulkDeleteNavigationEntriesData } from '../interfaces/navigation-entry.interface';

let fetchRetries = 0;

interface ApiClientOptions {
  getServerUrl: () => Promise<string>;

  getAccessToken: () => Promise<string>;
  getRefreshToken: () => Promise<string>;
  getPartialToken: () => Promise<string>;
  getRecoveryToken: () => Promise<string>;

  setAccessToken: (accessToken: string) => Promise<void>;
  setRefreshToken: (refreshToken: string) => Promise<void>;
  setPartialToken: (partialToken: string) => Promise<void>;
  setRecoveryToken: (recoveryToken: string) => Promise<void>;
}

export class ApiClient {
  private getServerUrl: () => Promise<string>;

  private getAccessToken: () => Promise<string>;
  private getRefreshToken: () => Promise<string>;
  private getPartialToken: () => Promise<string>;
  private getRecoveryToken: () => Promise<string>;

  private setAccessToken: (accessToken: string) => Promise<void>;
  private setRefreshToken: (refreshToken: string) => Promise<void>;
  private setPartialToken: (partialToken: string) => Promise<void>;
  private setRecoveryToken: (recoveryToken: string) => Promise<void>;

  private handleSessionExpired?: () => Promise<never>;

  constructor(options: ApiClientOptions) {
    this.getServerUrl = options.getServerUrl;

    this.getAccessToken = options.getAccessToken;
    this.getRefreshToken = options.getRefreshToken;
    this.getPartialToken = options.getPartialToken;
    this.getPartialToken = options.getPartialToken;
    this.getRecoveryToken = options.getRecoveryToken;

    this.setAccessToken = options.setAccessToken;
    this.setRefreshToken = options.setRefreshToken;
    this.setPartialToken = options.setPartialToken;
    this.setPartialToken = options.setPartialToken;
    this.setRecoveryToken = options.setRecoveryToken;
  }

  setHandleSessionExpired = (handleSessionExpired: () => Promise<never>) => {
    this.handleSessionExpired = handleSessionExpired;
  };

  fetch = async (
    endpoint: string,
    init: RequestInit = {},
  ): Promise<Response> => {
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
  };

  securedFetch = async (
    endpoint: string,
    init: RequestInit = {},
  ): Promise<Response> => {
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
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'Unauthorized') {
        if (fetchRetries >= 4) {
          throw error;
        }

        fetchRetries++;

        await this.refresh();
        console.log('ApiClient Retrying request after refresh', { endpoint });
        return this.securedFetch(endpoint, init);
      } else {
        throw error;
      }
    }
  };

  login = async (
    data: LoginData,
  ): Promise<LoginResponse | VerifyEmailResponse> => {
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
  };

  refresh = async (
    serverUrl?: string,
    refreshToken?: string,
  ): Promise<void> => {
    serverUrl = serverUrl ? serverUrl : await this.getServerUrl();
    refreshToken = refreshToken ? refreshToken : await this.getRefreshToken();

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

      if (!data.accessToken || !data.refreshToken) {
        throw new Error('Unauthorized');
      }

      await Promise.all([
        this.setAccessToken(data.accessToken),
        this.setRefreshToken(data.refreshToken),
      ]);
    } catch (error) {
      console.error('ApiClient Refresh Error', error);
      throw error;
    }
  };

  closeActiveSession = async (data: CloseActiveSessionsData) => {
    try {
      const res = await this.securedFetch('/api/auth/session/logout', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (res.status !== 200) {
        const errorJson = await res.json();
        throw new Error(errorJson?.message || 'POST Update Preferences Error');
      }

      const response: BasicResponse = await res.json();
      return response;
    } catch (error: any) {
      if (`${error?.message}`.toLowerCase().includes('unauthorized')) {
        if (this.handleSessionExpired) await this.handleSessionExpired();
      } else {
        throw error;
      }
    }
  };

  confirmDeleteAccount = async () => {
    try {
      const res = await this.securedFetch('/api/user', {
        method: 'DELETE',
      });

      if (res.status !== 200) {
        const errorJson = await res.json();
        throw new Error(
          errorJson?.message || 'DELETE Confirm delete account Error',
        );
      }

      const response: BasicResponse = await res.json();
      return response;
    } catch (error: any) {
      if (`${error?.message}`.toLowerCase().includes('unauthorized')) {
        if (this.handleSessionExpired) await this.handleSessionExpired();
      } else {
        throw error;
      }
    }
  };

  deleteNavigationEntry = async (data: DeleteNavigationEntriesData) => {
    try {
      const res = await this.securedFetch(`/api/navigation-entry/${data.id}`, {
        method: 'DELETE',
      });

      if (res.status !== 200) {
        const errorJson = await res.json();
        throw new Error(errorJson?.message || 'DELETE Navigation entry Error');
      }

      const response: BasicResponse = await res.json();
      return response;
    } catch (error: any) {
      if (`${error?.message}`.toLowerCase().includes('unauthorized')) {
        if (this.handleSessionExpired) await this.handleSessionExpired();
      } else {
        throw error;
      }
    }
  };

  getActiveSessions = async () => {
    try {
      const res = await this.securedFetch('/api/auth/session', {
        method: 'GET',
      });

      if (res.status !== 200) {
        const errorJson = await res.json();
        throw new Error(errorJson?.message || 'GET Active Session Error');
      }

      const response: ActiveSession[] = await res.json();
      return response;
    } catch (error: any) {
      if (`${error?.message}`.toLowerCase().includes('unauthorized')) {
        if (this.handleSessionExpired) await this.handleSessionExpired();
      } else {
        throw error;
      }
    }
  };

  getUserPreferences = async () => {
    try {
      const res = await this.securedFetch('/api/user/preferences', {
        method: 'GET',
      });

      if (res.status !== 200) {
        const errorJson = await res.json();
        throw new Error(errorJson?.message || 'GET User Preferences Error');
      }

      const response: PreferenciesResponse = await res.json();
      return response;
    } catch (error: any) {
      if (`${error?.message}`.toLowerCase().includes('unauthorized')) {
        if (this.handleSessionExpired) await this.handleSessionExpired();
      } else {
        throw error;
      }
    }
  };

  gerVersion = async () => {
    const res = await this.fetch('/api/system/version');
    const versionResponse: GetVersionResponse = await res.json();
    return versionResponse;
  };

  getNavigationEntries = async (params: GetNavigationEntriesData) => {
    const { offset, limit, query, tag, isEnhanceSearch } = params;

    const url =
      '/api/navigation-entry?' +
      new URLSearchParams({
        offset: offset.toString(),
        limit: limit.toString(),
        ...(tag && { tag }),
        ...(query && !isEnhanceSearch && { query: query }),
        ...(query && isEnhanceSearch && { queryTsVector: query }),
      }).toString();

    try {
      const res = await this.securedFetch(url, { method: 'GET' });

      if (res.status !== 200) {
        const errorJson = await res.json();
        throw new Error(errorJson?.message || 'GET Navigation Entries Error');
      }

      const response: GetNavigationEntriesResponse = await res.json();
      return response;
    } catch (error: any) {
      if (`${error?.message}`.toLowerCase().includes('unauthorized')) {
        if (this.handleSessionExpired) await this.handleSessionExpired();
      } else {
        throw error;
      }
    }
  };

  recoverPassword = async (data: RecoverPasswordData) => {
    const res = await this.fetch('/api/auth/password/recover', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (res.status === 200) {
      const response: RecoverPasswordResponse = await res.json();
      return response;
    } else {
      const errorRes: VerifyCodeErrorResponse = await res.json();
      throw new Error(errorRes?.message?.toString());
    }
  };

  resendCode = async () => {
    const partialToken = await this.getPartialToken();
    if (!partialToken) throw new Error('partialToken is missing');

    const res = await this.fetch('/api/auth/verify/resend', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${partialToken}`,
      },
    });

    if (res.status === 200) {
      const response: ResendCodeResponse = await res.json();
      return response;
    } else {
      const errorRes: ResendCodeErrorResponse = await res.json();
      throw new Error(errorRes?.message?.toString());
    }
  };

  restorePassword = async (data: RestorePasswordData) => {
    const recoveryToken = await this.getRecoveryToken();
    if (!recoveryToken) throw new Error('recoveryToken is missing');

    const res = await this.fetch('/api/auth/password/restore', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${recoveryToken}`,
      },
    });

    if (res.status === 200) {
      const response: LoginResponse = await res.json();
      const { accessToken, refreshToken } = response;

      await Promise.all([
        this.setAccessToken(accessToken),
        this.setRefreshToken(refreshToken),
      ]);
      return response;
    } else {
      const errorRes: RestorePasswordErrorResponse = await res.json();
      throw new Error(errorRes?.message?.toString());
    }
  };

  signUp = async (data: SignUpData) => {
    const res = await this.securedFetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (res.status === 200) {
      const response: SignUpResponse = await res.json();
      const { partialToken } = response;
      await this.setPartialToken(partialToken);
      return response;
    } else {
      const errorRes: SignUpErrorResponse = await res.json();
      throw new Error(errorRes?.error || errorRes?.message?.toString());
    }
  };

  updateDeviceAlias = async (data: UpdateDeviceAliasData) => {
    try {
      const res = await this.securedFetch(`/api/user/device/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify({ deviceAlias: data.deviceAlias }),
      });

      if (res.status !== 200) {
        const errorJson = await res.json();
        throw new Error(errorJson?.message || 'PUT Update Preferences Error');
      }

      const response: BasicResponse = await res.json();
      return response;
    } catch (error: any) {
      if (`${error?.message}`.toLowerCase().includes('unauthorized')) {
        if (this.handleSessionExpired) await this.handleSessionExpired();
      } else {
        throw error;
      }
    }
  };

  updatePreferences = async (data: UpdatePreferenciesData) => {
    try {
      const res = await this.securedFetch('/api/user/preferences', {
        method: 'PUT',
        body: JSON.stringify(data),
      });

      if (res.status !== 200) {
        const errorJson = await res.json();
        throw new Error(errorJson?.message || 'PUT Update Preferences Error');
      }

      const response: PreferenciesResponse = await res.json();
      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (`${error?.message}`.toLowerCase().includes('unauthorized')) {
          if (this.handleSessionExpired) await this.handleSessionExpired();
        } else {
          throw error;
        }
      }
      throw error;
    }
  };

  validateRecoveryCode = async (data: ValidateRecoveryCodeData) => {
    const res = await this.fetch('/api/auth/password/validate-recovery-code', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (res.status === 200) {
      const response: ValidateRecoveryCodeResponse = await res.json();
      const { recoveryToken } = response;
      await this.setRecoveryToken(recoveryToken);
      return response;
    } else {
      const errorRes: ValidateRecoveryCodeErrorResponse = await res.json();
      throw new Error(errorRes?.message?.toString());
    }
  };

  verificationCode = async (data: VerifyCodeData) => {
    const partialToken = await this.getPartialToken();
    if (!partialToken) throw new Error('partialToken is missing');

    const res = await this.fetch('/api/auth/verify', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${partialToken}`,
      },
    });

    if (res.status === 200) {
      const response: LoginResponse = await res.json();
      const { accessToken, refreshToken } = response;

      await Promise.all([
        this.setAccessToken(accessToken),
        this.setRefreshToken(refreshToken),
      ]);
      return response;
    } else {
      const errorRes: VerifyCodeErrorResponse = await res.json();
      throw new Error(errorRes?.message?.toString());
    }
  };

  getBasicUserInformation = async () => {
    try {
      const res = await this.securedFetch('/api/user/profile/me', {
        method: 'GET',
      });

      if (res.status !== 200) {
        const errorJson = await res.json();
        throw new Error(
          errorJson?.message || 'GET User Basic Information Error',
        );
      }

      const jsonRes: any = await res.json();
      const response: User = {
        ...jsonRes,
        passChangedAt: jsonRes.passChangedAt
          ? new Date(jsonRes.passChangedAt)
          : null,
      };
      return response;
    } catch (error: any) {
      if (`${error?.message}`.toLowerCase().includes('unauthorized')) {
        if (this.handleSessionExpired) await this.handleSessionExpired();
      } else {
        throw error;
      }
    }
  };
  changeUserPassword = async (data: ChangeUserPassword) => {
    try {
      const res = await this.securedFetch('/api/user/profile/change-password', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (res.status !== 200) {
        const errorJson = await res.json();
        throw new Error(errorJson?.message || 'POST Update Password Error');
      }

      const response: BasicResponse = await res.json();
      return response;
    } catch (error: any) {
      if (`${error?.message}`.toLowerCase().includes('unauthorized')) {
        if (this.handleSessionExpired) await this.handleSessionExpired();
      } else {
        throw error;
      }
    }
  };
  changeUserDisplayName = async (data: ChangeUserDisplayName) => {
    try {
      const res = await this.securedFetch(
        '/api/user/profile/change-displayname',
        {
          method: 'POST',
          body: JSON.stringify(data),
        },
      );
      if (res.status !== 200) {
        const errorJson = await res.json();
        throw new Error(errorJson?.message || 'POST Update Display Name Error');
      }

      const response: BasicResponse = await res.json();
      return response;
    } catch (error: any) {
      if (`${error?.message}`.toLowerCase().includes('unauthorized')) {
        if (this.handleSessionExpired) await this.handleSessionExpired();
      } else {
        throw error;
      }
    }
  };
  changeUserAvatar = async (data: ChangeUserAvatar) => {
    try {
      const res = await this.securedFetch(
        '/api/user/profile/change-profile-picture',
        {
          method: 'POST',
          body: JSON.stringify(data),
        },
      );
      if (res.status !== 200) {
        const errorJson = await res.json();
        throw new Error(errorJson?.message || 'POST Update Display Name Error');
      }

      const response: BasicResponse = await res.json();
      return response;
    } catch (error: any) {
      if (`${error?.message}`.toLowerCase().includes('unauthorized')) {
        if (this.handleSessionExpired) await this.handleSessionExpired();
      } else {
        throw error;
      }
    }
  };
  deleteBulkNavigationEntry = async (data: BulkDeleteNavigationEntriesData) => {
    try {
      const res = await this.securedFetch(`/api/navigation-entry`, {
        method: 'DELETE',
        body: JSON.stringify(data),
      });

      if (res.status !== 200) {
        const errorJson = await res.json();
        throw new Error(errorJson?.message || 'DELETE Navigation entry Error');
      }

      const response: BasicResponse = await res.json();
      return response;
    } catch (error: any) {
      if (`${error?.message}`.toLowerCase().includes('unauthorized')) {
        if (this.handleSessionExpired) await this.handleSessionExpired();
      } else {
        throw error;
      }
    }
  };
  getModelsInformation = async () => {
    try {
      const res = await this.securedFetch(`/api/system/models`, {
        method: 'GET',
      });

      if (res.status !== 200) {
        const errorJson = await res.json();
        throw new Error(errorJson?.message || "Models couldn't be reached");
      }
      const awaitedRes: any = await res.json();
      const response: SystemModels = { ...awaitedRes };
      return response;
    } catch (error: any) {
      if (`${error?.message}`.toLowerCase().includes('unauthorized')) {
        if (this.handleSessionExpired) await this.handleSessionExpired();
      } else {
        throw error;
      }
    }
  };

  retrieveExternalLoginToken = async (body: RetrieveExternalLoginPayload): Promise<{
    externalClientToken: string
  }> => {
    try {
      const response = await this.fetch('/api/auth/retrieve-external-login-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (response.status !== 200) {
        const errorJson = await response.json();
        throw new Error(errorJson?.message || 'External Login Error');
      }

      const jsonRes = await response.json();

      return jsonRes;

    } catch (error) {
      throw error;
    }
  }

  verifyExternalClient = async (externalClientToken: string): Promise<{
    payload: ExternalClientPayload
  }> => {
    try {
      const response = await this.securedFetch("/api/auth/verify-external-client", {
        method: 'POST',
        headers: {
         "webtm-ext-client-authorization": `Bearer ${externalClientToken}`,
        },
      })

      if (response.status !== 200) {
        const errorJson = await response.json();
        throw new Error(errorJson?.message || 'External Login Error');
      }

      const jsonRes = await response.json();

      return jsonRes;
    } catch (error) {
      throw error;
    }
  }

  externalLogin = async (body: ExternalLoginPayload): Promise<LoginResponse> => {
    try {
      const response = await this.securedFetch("/api/auth/external-login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (response.status !== 200) {
        const errorJson = await response.json();
        throw new Error(errorJson?.message || 'External Login Error');
      }

      const jsonRes = await response.json();

      return jsonRes;
    } catch (error) {
      throw error;
    }
  }
}
