import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { plainToClassFromExist, plainToInstance } from 'class-transformer';
import { NavigationEntry, Prisma } from '@prisma/client';
import { JwtContext } from 'src/auth/interfaces';

import {
  CompleteNavigationEntryDto,
  CreateNavigationEntryInputDto,
  GetNavigationEntryDto,
} from '../dtos';

import {
  CompleteNavigationEntry,
  completeNavigationEntryInclude,
} from '../types';

import { PrismaService } from '../../common/services';
import { MessageResponse, PaginationResponse } from '../../common/dtos';

import { CompleteUser } from '../../user/types';
import { UserService } from '../../user/services';

@Injectable()
export class NavigationEntryService {
  private readonly logger = new Logger(NavigationEntryService.name);

  constructor(private readonly prismaService: PrismaService) {}

  static getExpitationDate(
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

  static completeNavigationEntryToDto(
    jwtContext: JwtContext,
    completeNavigationEntry: CompleteNavigationEntry,
  ): CompleteNavigationEntryDto {
    const userDeviceDto = UserService.userDeviceToDto(
      jwtContext,
      completeNavigationEntry.userDevice,
    );

    const completeNavigationEntryDto = plainToInstance(
      CompleteNavigationEntryDto,
      {
        ...completeNavigationEntry,
        id: Number(completeNavigationEntry.id),
        userId: Number(completeNavigationEntry.userId),
        userDeviceId: Number(completeNavigationEntry.userDeviceId),
        expirationDate: NavigationEntryService.getExpitationDate(
          jwtContext.user,
          completeNavigationEntry,
        ),
      },
    );
    completeNavigationEntryDto.userDevice = userDeviceDto;
    return completeNavigationEntryDto;
  }

  static completeNavigationEntriesToDtos(
    jwtContext: JwtContext,
    completeNavigationEntries: CompleteNavigationEntry[],
  ): CompleteNavigationEntryDto[] {
    return completeNavigationEntries.map((completeNavigationEntry) =>
      NavigationEntryService.completeNavigationEntryToDto(
        jwtContext,
        completeNavigationEntry,
      ),
    );
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
  ): Promise<CompleteNavigationEntryDto> {
    const lastEntry = await this.prismaService.navigationEntry.findFirst({
      where: {
        userId: jwtContext.user.id,
      },
      take: 1,
      orderBy: {
        navigationDate: 'desc',
      },
    });

    let completeNavigationEntry: CompleteNavigationEntry;
    if (lastEntry?.url === createNavigationEntryInputDto.url) {
      completeNavigationEntry = await this.prismaService.navigationEntry.update(
        {
          where: {
            id: lastEntry.id,
          },
          data: {
            ...createNavigationEntryInputDto,
            userDeviceId: jwtContext.session.userDeviceId,
          },
          include: completeNavigationEntryInclude,
        },
      );
    } else {
      completeNavigationEntry = await this.prismaService.navigationEntry.create(
        {
          data: {
            userId: jwtContext.user.id,
            ...createNavigationEntryInputDto,
            userDeviceId: jwtContext.session.userDeviceId,
          },
          include: completeNavigationEntryInclude,
        },
      );
    }

    return NavigationEntryService.completeNavigationEntryToDto(
      jwtContext,
      completeNavigationEntry,
    );
  }

  async getNavigationEntry(
    jwtContext: JwtContext,
    queryParams: GetNavigationEntryDto,
  ): Promise<PaginationResponse<CompleteNavigationEntryDto>> {
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

    const completeNavigationEntries: CompleteNavigationEntry[] =
      await this.prismaService.navigationEntry.findMany({
        where: {
          userId: jwtContext.user.id,
          ...whereQuery,
        },
        include: completeNavigationEntryInclude,
        skip: offset,
        take: limit,
        orderBy: {
          navigationDate: 'desc',
        },
      });

    const completeNavigationEntryDtos =
      NavigationEntryService.completeNavigationEntriesToDtos(
        jwtContext,
        completeNavigationEntries,
      );

    return plainToInstance(PaginationResponse<CompleteNavigationEntryDto>, {
      offset,
      limit,
      count,
      query,
      items: completeNavigationEntryDtos,
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
