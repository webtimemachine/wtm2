import { SayHelloData, SayHelloResponse } from './say-hello.interface';
import { GetVersionResponse } from './get-version.interface';
import {
  LoginData,
  LoginResponse,
  VerifyEmailResponse,
} from './login.interface';
import {
  GetNavigationEntriesData,
  GetNavigationEntriesResponse,
} from './navigation-entry.interface';
import { UpdatePreferenciesData, PreferenciesResponse } from './preferences';
import { SignUpData, SignUpResponse } from './sign-up.interface';
import { ResendCodeResponse } from './resend-code-interface';
import { VerifyCodeData } from './verify-code-interface';

export type BackgroundMessageType =
  | 'say-hello'
  | 'get-version'
  | 'login'
  | 'get-navigation-entries'
  | 'update-preferences'
  | 'get-user-preferences'
  | 'sign-up'
  | 'resend-code'
  | 'verify-code';

export type BackgroundMessageDataMap = {
  'say-hello': SayHelloData;
  'get-version': undefined;
  login: LoginData;
  'get-navigation-entries': GetNavigationEntriesData;
  'update-preferences': UpdatePreferenciesData;
  'get-user-preferences': undefined;
  'sign-up': SignUpData;
  'resend-code': undefined;
  'verify-code': VerifyCodeData;
};
export type BackgroundMessageResponseMap = {
  'say-hello': SayHelloResponse;
  'get-version': GetVersionResponse;
  login: LoginResponse | VerifyEmailResponse;
  'get-navigation-entries': GetNavigationEntriesResponse;
  'update-preferences': PreferenciesResponse;
  'get-user-preferences': PreferenciesResponse;
  'sign-up': SignUpResponse;
  'resend-code': ResendCodeResponse;
  'verify-code': LoginResponse;
};

export interface BackgroundMessagePayload<T extends BackgroundMessageType> {
  data: BackgroundMessageDataMap[T];
}

export type BackgroundMessageHandler<T extends BackgroundMessageType> = (
  sendResponse: (
    response: BackgroundMessageResponseMap[T] | { error: string },
  ) => void,
  payload: BackgroundMessagePayload<T>,
) => Promise<void>;
