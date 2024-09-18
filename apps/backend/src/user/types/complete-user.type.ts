import { Prisma, User, UserPreferences } from '@prisma/client';

export type CompleteUser = User & {
  userPreferences?: UserPreferences | null;
};

export const completeUserInclude = Prisma.validator<Prisma.UserInclude>()({
  userPreferences: true,
});
