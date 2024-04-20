import { SayHelloData, SayHelloResponse } from './say-hello.interface';
import { GetVersionResponse } from './get-version.interface';

export type BackgroundMessageType =
  | 'say-hello'
  | 'get-version'
  | 'login'
  | 'logout';

export type BackgroundMessageDataMap = {
  'say-hello': SayHelloData;
  'get-version': undefined;
  login: LoginData;
  logout: LogoutData;
};
export type BackgroundMessageResponseMap = {
  'say-hello': SayHelloResponse;
  'get-version': GetVersionResponse;
  login: LoginResponse;
  logout: LogoutResponse;
};

export interface LoginData {
  username: string;
  password: string;
}

export interface LoginResponse {
  userId: number;
  username: string;
  accessToken: string;
  refreshToken: string;
}

export interface LogoutData {
  userId: number;
}

export interface LogoutResponse {
  message: string;
}

export interface AuthData {
  serverUrl: string;
  accessToken: string | null;
  refreshToken: string | null;
}

export interface BackgroundMessagePayload<T extends BackgroundMessageType> {
  authData: AuthData;
  data?: BackgroundMessageDataMap[T];
}

export type BackgroundMessageHandler<T extends BackgroundMessageType> = (
  payload: BackgroundMessagePayload<T>,
  sendResponse: (
    response: BackgroundMessageResponseMap[T] | { error: string },
  ) => void,
) => Promise<void>;
