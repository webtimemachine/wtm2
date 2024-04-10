import { Device, Prisma, Session, UserDevice } from '@prisma/client';

export type CompleteSession = Session & {
  userDevice: UserDevice & {
    device: Device;
  };
};

export const completeSessionInclude = Prisma.validator<Prisma.SessionInclude>()(
  {
    userDevice: {
      include: {
        device: true,
      },
    },
  },
);
