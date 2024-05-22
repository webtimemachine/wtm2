import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { NavigationEntry, Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { JwtContext } from '../../auth/interfaces';

import {
  CompleteNavigationEntryDto,
  CreateNavigationEntryInputDto,
  GetNavigationEntryDto,
  DeleteNavigationEntriesDto,
} from '../dtos';

import {
  CompleteNavigationEntry,
  completeNavigationEntryInclude,
} from '../types';

import { MessageResponse, PaginationResponse } from '../../common/dtos';
import { PrismaService } from '../../common/services';

import { UserService } from '../../user/services';
import { CompleteUser } from '../../user/types';

import { IndexerService } from '../../encoder/services';
import { QueryService } from '../../query/services';
import { ExplicitFilterService } from '../../filter/services';

@Injectable()
export class NavigationEntryService {
  private readonly logger = new Logger(NavigationEntryService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly indexerService: IndexerService,
    private readonly queryService: QueryService,
    private readonly explicitFilter: ExplicitFilterService,
  ) {}

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
    const { content, images, ...entryData } = createNavigationEntryInputDto;

    const liteMode = !content;

    if (!liteMode) {
      await this.explicitFilter.filter(
        content!,
        createNavigationEntryInputDto.url,
      );
    }

    const lastEntry = await this.prismaService.navigationEntry.findFirst({
      where: {
        userId: jwtContext.user.id,
      },
      take: 1,
      orderBy: {
        navigationDate: 'desc',
      },
    });
    try {
      await this.indexerService.index(
        content!,
        images,
        createNavigationEntryInputDto.url,
        jwtContext.user.id,
      );
    } catch (error) {
      this.logger.error(
        `An error occurred indexing '${createNavigationEntryInputDto.url}'. Cause: ${error.message}`,
      );
    }

    let completeNavigationEntry: CompleteNavigationEntry;
    if (lastEntry?.url === createNavigationEntryInputDto.url) {
      completeNavigationEntry = await this.prismaService.navigationEntry.update(
        {
          where: {
            id: lastEntry.id,
          },
          data: {
            liteMode,
            userDeviceId: jwtContext.session.userDeviceId,
            ...entryData,
          },
          include: completeNavigationEntryInclude,
        },
      );
    } else {
      completeNavigationEntry = await this.prismaService.navigationEntry.create(
        {
          data: {
            liteMode,
            userId: jwtContext.user.id,
            userDeviceId: jwtContext.session.userDeviceId,
            ...entryData,
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
    const { limit, offset, query, isSemantic } = queryParams;

    const navigationEntryExpirationInDays =
      this.getNavigationEntryExpirationInDays(jwtContext.user);

    let expirationThreshold: Date | undefined;
    if (navigationEntryExpirationInDays) {
      expirationThreshold = new Date();
      expirationThreshold.setDate(
        expirationThreshold.getDate() - navigationEntryExpirationInDays,
      );
    }
    let whereQuery: Prisma.NavigationEntryWhereInput = {};
    if (isSemantic) {
      let urls: Set<string> | undefined;
      if (query) {
        urls = await this.indexerService.search(query, jwtContext.user.id);
        whereQuery = { url: { in: [...urls!] } };
      }
    } else {
      const queryFilter: Prisma.StringFilter<'NavigationEntry'> = {
        contains: query,
        mode: 'insensitive',
      };

      whereQuery = {
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
    }

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

    if (query && count > 0 && isSemantic)
      await this.queryService.newEntry(
        query,
        completeNavigationEntries.map((entry) => entry.id),
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
    this.indexerService.delete(navigationEntry.url, jwtContext.user.id);
    await this.prismaService.navigationEntry.delete({
      where: { id, userId: jwtContext.user.id },
    });

    return plainToInstance(MessageResponse, {
      message: 'Navigation entry has been deleted',
    });
  }

  async deleteNavigationEntries(
    jwtContext: JwtContext,
    deleteNavigationEntriesDto: DeleteNavigationEntriesDto,
  ): Promise<MessageResponse> {
    const { navigationEntryIds } = deleteNavigationEntriesDto;

    const { deletedNavigationEntries } = await this.prismaService.$transaction(
      async (prismaClient) => {
        const entriesThatDontBelongToCurrentUser =
          await prismaClient.navigationEntry.findMany({
            where: {
              id: {
                in: navigationEntryIds,
              },
              userId: {
                not: jwtContext.user.id,
              },
            },
          });

        if (entriesThatDontBelongToCurrentUser?.length > 0) {
          throw new ForbiddenException();
        }

        const deletedNavigationEntries: NavigationEntry[] = [];
        await Promise.all(
          navigationEntryIds.map(async (navigationEntryId) => {
            const navigationEntry =
              await this.prismaService.navigationEntry.findUnique({
                where: {
                  userId: jwtContext.user.id,
                  id: navigationEntryId,
                },
              });

            if (navigationEntry) {
              this.indexerService.delete(
                navigationEntry.url,
                jwtContext.user.id,
              );
              const deletedNavigationEntry: NavigationEntry =
                await this.prismaService.navigationEntry.delete({
                  where: { id: navigationEntryId, userId: jwtContext.user.id },
                });
              deletedNavigationEntries.push(deletedNavigationEntry);
            }
          }),
        );

        return { deletedNavigationEntries };
      },
    );

    return plainToInstance(MessageResponse, {
      message: `${deletedNavigationEntries.length} navigation entries has been deleted`,
    });
  }
}
