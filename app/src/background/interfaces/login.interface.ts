import { UserDeviceResponse } from './user-device.interface';

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
    device: UserDeviceResponse;
  };
}

export interface LoginData {
  email: string;
  password: string;
  deviceKey: string;
  userAgent: string;
}
