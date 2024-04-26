import { UserDeviceResponse } from './user-device.interface';

export interface ActiveSessionsResponse {
  id: number;
  userDeviceId: number;
  expiration: Date;
  createdAt: Date;
  updateAt: Date;
  userDevice: UserDeviceResponse;
}
