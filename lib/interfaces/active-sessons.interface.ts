import { UserDevice } from './user-device.interface';

export interface ActiveSession {
  id: number;
  userDeviceId: number;
  expiration: Date;
  createdAt: Date;
  updateAt: Date;
  userDevice: UserDevice;
}
