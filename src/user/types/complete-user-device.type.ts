import { Device, Prisma, UserDevice } from '@prisma/client';

export type CompleteUserDevice = UserDevice & {
  device: Device;
};

export const completeUserDeviceInclude =
  Prisma.validator<Prisma.UserDeviceInclude>()({
    device: true,
  });
