import { Device, Prisma, NavigationEntry, UserDevice } from '@prisma/client';
import { completeUserDeviceInclude } from '../../user/types';

export type CompleteNavigationEntry = NavigationEntry & {
  userDevice: UserDevice & {
    device: Device;
  };
};

export const completeNavigationEntryInclude =
  Prisma.validator<Prisma.NavigationEntryInclude>()({
    userDevice: {
      include: completeUserDeviceInclude,
    },
  });
