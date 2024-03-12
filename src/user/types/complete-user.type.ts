import { User, UserPreferences } from '@prisma/client';

export type CompleteUser = User & {
  userPreferences: UserPreferences | null;
};
