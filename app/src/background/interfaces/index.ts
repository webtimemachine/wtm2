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
import {
  UpdatePreferenciesData,
  PreferenciesResponse,
} from './preferences.interface';
import { CloseActiveSessionsData } from './close-active-session';
import { BasicResponse } from './basic-response';
import {
  UpdateDeviceAliasData,
  UserDeviceResponse,
} from './user-device.interface';
import { SignUpData, SignUpResponse } from './sign-up.interface';
import { ResendCodeResponse } from './resend-code-interface';
import { VerifyCodeData } from './verify-code-interface';
import { ActiveSessionsResponse } from './active-sessons.interface';

export type BackgroundMessageType =
  | 'say-hello'
  | 'get-version'
  | 'login'
  | 'get-navigation-entries'
  | 'update-preferences'
  | 'get-user-preferences'
  | 'get-active-sessions'
  | 'close-active-session'
  | 'update-device-alias'
  | 'sign-up'
  | 'resend-code'
  | 'verify-code'
  | 'confirm-delete-account';

export type BackgroundMessageDataMap = {
  'say-hello': SayHelloData;
  'get-version': undefined;
  login: LoginData;
  'get-navigation-entries': GetNavigationEntriesData;
  'update-preferences': UpdatePreferenciesData;
  'get-user-preferences': undefined;
  'get-active-sessions': undefined;
  'close-active-session': CloseActiveSessionsData;
  'update-device-alias': UpdateDeviceAliasData;
  'sign-up': SignUpData;
  'resend-code': undefined;
  'verify-code': VerifyCodeData;
  'confirm-delete-account': undefined;
};
export type BackgroundMessageResponseMap = {
  'say-hello': SayHelloResponse;
  'get-version': GetVersionResponse;
  login: LoginResponse | VerifyEmailResponse;
  'get-navigation-entries': GetNavigationEntriesResponse;
  'update-preferences': PreferenciesResponse;
  'get-user-preferences': PreferenciesResponse;
  'get-active-sessions': ActiveSessionsResponse[];
  'close-active-session': BasicResponse;
  'update-device-alias': UserDeviceResponse;
  'sign-up': SignUpResponse;
  'resend-code': ResendCodeResponse;
  'verify-code': LoginResponse;
  'confirm-delete-account': BasicResponse;
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
