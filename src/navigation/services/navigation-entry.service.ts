import { Injectable, Logger } from '@nestjs/common';
import { JwtContext } from 'src/auth/interfaces';
import { PrismaService } from 'src/common/services';
import { CreateNavigationEntryInputDto, NavigationEntryDto } from '../dtos';
import { NavigationEntry } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { GetNavigationEntryDto } from '../dtos/get-navigation-entry.dto';
import { Prisma } from '@prisma/client';
import { PaginationResponse } from 'src/common/dtos';

@Injectable()
export class NavigationEntryService {
  private readonly logger = new Logger(NavigationEntryService.name);

  constructor(private readonly prismaService: PrismaService) {}

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
        },
      });
    } else {
      navigationEntry = await this.prismaService.navigationEntry.create({
        data: {
          ...createNavigationEntryInputDto,
          userId: jwtContext.user.id,
        },
      });
    }

    return plainToInstance(NavigationEntryDto, {
      ...navigationEntry,
      id: Number(navigationEntry.id),
      userId: Number(navigationEntry.userId),
    });
  }

  async getNavigationEntry(
    jwtContext: JwtContext,
    queryParams: GetNavigationEntryDto,
  ): Promise<PaginationResponse<NavigationEntryDto>> {
    const { limit, offset, query } = queryParams;

    const queryFilter: Prisma.StringFilter<'NavigationEntry'> = {
      contains: query,
      mode: 'insensitive',
    };

    const count: number = await this.prismaService.navigationEntry.count({
      where: {
        userId: jwtContext.user.id,
        OR: [{ url: queryFilter }, { title: queryFilter }],
      },
    });

    const navigationEntries: NavigationEntry[] =
      await this.prismaService.navigationEntry.findMany({
        where: {
          userId: jwtContext.user.id,
          OR: [{ url: queryFilter }, { title: queryFilter }],
        },
        take: limit,
        skip: offset,
      });

    const navigationEntryDtos = plainToInstance(
      NavigationEntryDto,
      navigationEntries.map((navigationEntry) => ({
        ...navigationEntry,
        id: Number(navigationEntry.id),
        userId: Number(navigationEntry.userId),
      })),
    );

    return plainToInstance(PaginationResponse<NavigationEntryDto>, {
      offset,
      limit,
      count,
      items: navigationEntryDtos,
    });
  }
}
