import { UserDevice } from './user-device.interface';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
  };
  userDevice: {
    id: number;
    userId: number;
    deviceId: number;
    isCurrentDevice: boolean;
    deviceAlias: string;
    device: UserDevice;
  };
}

export interface VerifyEmailResponse {
  id: number;
  email: string;
  partialToken: string;
}

export interface LoginData {
  email: string;
  password: string;
  deviceKey: string;
  userAgent: string;
  userAgentData: string;
}

export const isLoginRes = (
  loginRes: LoginResponse | VerifyEmailResponse,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): loginRes is LoginResponse => (loginRes as any)?.accessToken;
