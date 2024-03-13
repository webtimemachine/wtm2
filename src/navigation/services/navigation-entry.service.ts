import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { JwtContext } from 'src/auth/interfaces';
import { PrismaService } from '../../common/services';
import { CreateNavigationEntryInputDto, NavigationEntryDto } from '../dtos';
import { NavigationEntry } from '@prisma/client';
import { plainToClassFromExist, plainToInstance } from 'class-transformer';
import { GetNavigationEntryDto } from '../dtos/get-navigation-entry.dto';
import { Prisma } from '@prisma/client';
import { MessageResponse, PaginationResponse } from '../../common/dtos';
import { CompleteUser } from 'src/user/types';

@Injectable()
export class NavigationEntryService {
  private readonly logger = new Logger(NavigationEntryService.name);

  constructor(private readonly prismaService: PrismaService) {}

  getExpitationDate(
    user: CompleteUser,
    navigationEntry: NavigationEntry,
  ): Date | undefined {
    const enableNavigationEntryExpiration =
      user?.userPreferences?.enableNavigationEntryExpiration;
    const navigationEntryExpirationInDays =
      user?.userPreferences?.navigationEntryExpirationInDays;

    if (enableNavigationEntryExpiration && navigationEntryExpirationInDays) {
      const expirationDate = new Date(navigationEntry.navigationDate);
      expirationDate.setDate(
        expirationDate.getDate() + navigationEntryExpirationInDays,
      );
      return expirationDate;
    }
  }

  getNavigationEntryExpirationInDays(user: CompleteUser): number | undefined {
    const enableNavigationEntryExpiration =
      user?.userPreferences?.enableNavigationEntryExpiration;
    const navigationEntryExpirationInDays =
      user?.userPreferences?.navigationEntryExpirationInDays;

    if (enableNavigationEntryExpiration && navigationEntryExpirationInDays) {
      return navigationEntryExpirationInDays;
    }
  }

  async createNavigationEntry(
    jwtContext: JwtContext,
    createNavigationEntryInputDto: CreateNavigationEntryInputDto,
  ): Promise<NavigationEntryDto> {
    const lastEntry = await this.prismaService.navigationEntry.findFirst({
      where: {
        userId: jwtContext.user.id,
      },
      take: 1,
      orderBy: {
        navigationDate: 'desc',
      },
    });

    let navigationEntry: NavigationEntry;
    if (lastEntry?.url === createNavigationEntryInputDto.url) {
      navigationEntry = await this.prismaService.navigationEntry.update({
        where: {
          id: lastEntry.id,
        },
        data: {
          ...createNavigationEntryInputDto,
          userAgent: jwtContext?.session?.userAgent || '',
        },
      });
    } else {
      navigationEntry = await this.prismaService.navigationEntry.create({
        data: {
          ...createNavigationEntryInputDto,
          userId: jwtContext.user.id,
          userAgent: jwtContext?.session?.userAgent || '',
        },
      });
    }

    return plainToInstance(NavigationEntryDto, {
      ...navigationEntry,
      id: Number(navigationEntry.id),
      userId: Number(navigationEntry.userId),
      expirationDate: this.getExpitationDate(jwtContext.user, navigationEntry),
    });
  }

  async getNavigationEntry(
    jwtContext: JwtContext,
    queryParams: GetNavigationEntryDto,
  ): Promise<PaginationResponse<NavigationEntryDto>> {
    const { limit, offset, query } = queryParams;

    const navigationEntryExpirationInDays =
      this.getNavigationEntryExpirationInDays(jwtContext.user);

    let expirationThreshold: Date | undefined;
    if (navigationEntryExpirationInDays) {
      expirationThreshold = new Date();
      expirationThreshold.setDate(
        expirationThreshold.getDate() - navigationEntryExpirationInDays,
      );
    }

    const queryFilter: Prisma.StringFilter<'NavigationEntry'> = {
      contains: query,
      mode: 'insensitive',
    };

    const whereQuery: Prisma.NavigationEntryWhereInput = {
      ...(query !== undefined
        ? { OR: [{ url: queryFilter }, { title: queryFilter }] }
        : {}),
      ...(expirationThreshold
        ? {
            navigationDate: {
              gte: expirationThreshold,
            },
          }
        : {}),
    };

    const count: number = await this.prismaService.navigationEntry.count({
      where: {
        userId: jwtContext.user.id,
        ...whereQuery,
      },
    });

    const navigationEntries: NavigationEntry[] =
      await this.prismaService.navigationEntry.findMany({
        where: {
          userId: jwtContext.user.id,
          ...whereQuery,
        },
        take: limit,
        skip: offset,
        orderBy: {
          navigationDate: 'desc',
        },
      });

    const navigationEntryDtos = plainToInstance(
      NavigationEntryDto,
      navigationEntries.map((navigationEntry) => ({
        ...navigationEntry,
        id: Number(navigationEntry.id),
        userId: Number(navigationEntry.userId),
        expirationDate: this.getExpitationDate(
          jwtContext.user,
          navigationEntry,
        ),
      })),
    );

    return plainToInstance(PaginationResponse<NavigationEntryDto>, {
      offset,
      limit,
      count,
      items: navigationEntryDtos,
    });
  }

  async deleteNavigationEntry(
    jwtContext: JwtContext,
    id: number,
  ): Promise<MessageResponse> {
    const navigationEntry = await this.prismaService.navigationEntry.findUnique(
      {
        where: {
          userId: jwtContext.user.id,
          id,
        },
      },
    );

    if (!navigationEntry) {
      throw new NotFoundException();
    }

    await this.prismaService.navigationEntry.delete({
      where: { id, userId: jwtContext.user.id },
    });

    return plainToClassFromExist(new MessageResponse(), {
      message: 'Navigation entry has been deleted',
    });
  }
}
