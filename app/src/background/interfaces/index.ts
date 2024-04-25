import { SayHelloData, SayHelloResponse } from './say-hello.interface';
import { GetVersionResponse } from './get-version.interface';
import { LoginData, LoginResponse } from './login.interface';
import {
  GetNavigationEntriesData,
  GetNavigationEntriesResponse,
} from './navigation-entry.interface';
import {
  UpdatePreferenciesData,
  PreferenciesResponse,
} from './preferences.interface';
import { ActiveSessionsResponse } from './active-sessons.interface';

export type BackgroundMessageType =
  | 'say-hello'
  | 'get-version'
  | 'login'
  | 'get-navigation-entries'
  | 'update-preferences'
  | 'get-user-preferences'
  | 'get-active-sessions';

export type BackgroundMessageDataMap = {
  'say-hello': SayHelloData;
  'get-version': undefined;
  login: LoginData;
  'get-navigation-entries': GetNavigationEntriesData;
  'update-preferences': UpdatePreferenciesData;
  'get-user-preferences': undefined;
  'get-active-sessions': undefined;
};
export type BackgroundMessageResponseMap = {
  'say-hello': SayHelloResponse;
  'get-version': GetVersionResponse;
  login: LoginResponse;
  'get-navigation-entries': GetNavigationEntriesResponse;
  'update-preferences': PreferenciesResponse;
  'get-user-preferences': PreferenciesResponse;
  'get-active-sessions': ActiveSessionsResponse;
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
