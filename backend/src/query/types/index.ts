import { Query, Prisma } from '@prisma/client';

interface SimpleNavigationEntry {
  url: string;
  title: string;
  navigationDate: Date;
}

export type QueryResult = Query & {
  navigationEntries: { navigationEntry: SimpleNavigationEntry }[];
};

export const queryResultInclude = Prisma.validator<Prisma.QueryInclude>()({
  navigationEntries: {
    select: {
      navigationEntry: {
        select: {
          url: true,
          title: true,
          navigationDate: true,
        },
      },
    },
    orderBy: { navigationEntry: { navigationDate: 'desc' } },
  },
});
