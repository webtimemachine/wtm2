import {
  Device,
  Prisma,
  NavigationEntry,
  UserDevice,
  EntryTag,
  Tag,
} from '@prisma/client';
import { completeUserDeviceInclude } from '../../user/types';

export type CompleteNavigationEntry = NavigationEntry & {
  userDevice: UserDevice & {
    device: Device;
  };
  entryTags?: (EntryTag & { tag: Tag })[];
};

export const completeNavigationEntryInclude =
  Prisma.validator<Prisma.NavigationEntryInclude>()({
    userDevice: {
      include: completeUserDeviceInclude,
    },
    entryTags: {
      include: {
        tag: true,
      },
    },
  });
