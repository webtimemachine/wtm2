import { Injectable, Logger } from '@nestjs/common';
import { JwtContext } from 'src/auth/interfaces';
import { PrismaService } from 'src/common/services';

import { CreateNavigationEntryInputDto, NavigationEntryDto } from '../dtos';
import { NavigationEntry, User } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class NavigationEntryService {
  private readonly logger = new Logger(NavigationEntryService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async createNavigationEntry(
    jwtContext: JwtContext,
    createNavigationEntryInputDto: CreateNavigationEntryInputDto,
  ): Promise<NavigationEntryDto> {
    const navigationEntry: NavigationEntry =
      await this.prismaService.navigationEntry.create({
        data: {
          ...createNavigationEntryInputDto,
          userId: jwtContext.user.id,
        },
      });

    return plainToInstance(NavigationEntryDto, {
      ...navigationEntry,
      id: Number(navigationEntry.id),
      userId: Number(navigationEntry.userId),
    });
  }

  async getNavigationEntry(
    jwtContext: JwtContext,
  ): Promise<NavigationEntryDto[]> {
    const navigationEntries: NavigationEntry[] =
      await this.prismaService.navigationEntry.findMany({
        where: {
          userId: jwtContext.user.id,
        },
      });

    return plainToInstance(
      NavigationEntryDto,
      navigationEntries.map((navigationEntry) => ({
        ...navigationEntry,
        id: Number(navigationEntry.id),
        userId: Number(navigationEntry.userId),
      })),
    );
  }
}
