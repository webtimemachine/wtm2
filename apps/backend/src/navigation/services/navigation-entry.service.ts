import {
  ForbiddenException,
  Injectable,
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
  AddContextToNavigationEntryDto,
} from '../dtos';

import {
  CompleteNavigationEntry,
  completeNavigationEntryInclude,
  countNavigationEntriesQueryRaw,
  navigationEntriesQueryRaw,
  RawCompleteNavigationEntry,
  transformRawToCompleteNavigationEntries,
} from '../types';

import { MessageResponse, PaginationResponse } from '../../common/dtos';
import { PrismaService } from '../../common/services';

import { UserService } from '../../user/services';
import { CompleteUser } from '../../user/types';

import { ExplicitFilterService } from '../../filter/services';
import { appEnv } from '../../config';
import { subDays } from 'date-fns';
import { WebTMLogger } from '../../common/helpers/webtm-logger';
import { PROMPTS } from '../../openai/service/open-ai.prompts';
import { OpenAIService } from '../../openai/service';
import { SummaryPromptResponse } from '../../openai/types';

@Injectable()
export class NavigationEntryService {
  private readonly logger = new WebTMLogger(NavigationEntryService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly explicitFilter: ExplicitFilterService,
    private readonly openAIService: OpenAIService,
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
        aiGeneratedContent: completeNavigationEntry.aiGeneratedContent,
        tags:
          completeNavigationEntry?.entryTags?.map((entry) => entry.tag.name) ||
          [],
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

  private async saveTags(
    navEntry: NavigationEntry,
    parsedData: SummaryPromptResponse,
    prismaClient: Prisma.TransactionClient,
  ) {
    const tags = parsedData.data.tags;

    await prismaClient.tag.createMany({
      data: tags.map((tagName) => ({ name: tagName })),
      skipDuplicates: true,
    });

    const allTags = await prismaClient.tag.findMany({
      where: { name: { in: tags } },
      select: { id: true },
    });

    await prismaClient.entryTag.createMany({
      data: allTags.map((tag) => ({
        entryId: navEntry.id,
        tagId: tag.id,
      })),
      skipDuplicates: true,
    });
  }

  private async getUserPreferences(userId: bigint) {
    return await this.prismaService.userPreferences.findFirstOrThrow({
      where: {
        userId,
      },
      select: {
        enableImageEncoding: true,
        enableExplicitContentFilter: true,
        enableStopTracking: true,
      },
    });
  }

  private readonly getLastEntryFromUser = async (userId: bigint) => {
    return await this.prismaService.navigationEntry.findFirstOrThrow({
      where: {
        userId,
      },
      take: 1,
      orderBy: {
        navigationDate: 'desc',
      },
    });
  };

  private readonly formatImageCaptionsMarkdown = (
    captions: string[],
  ): string => {
    const header = '## Image Captions\n\n';
    const formattedCaptions = captions
      .map(
        (caption, index) =>
          `${index + 1}. **Caption ${index + 1}:** ${caption}`,
      )
      .join('\n\n');

    return `${header}${formattedCaptions}`;
  };

  async createNavigationEntry(
    jwtContext: JwtContext,
    createNavigationEntryInputDto: CreateNavigationEntryInputDto,
  ): Promise<void> {
    try {
      const domains = appEnv.AVOID_DOMAIN_LIST;
      const noTrackingDomains = (domains && domains.split(', ')) || [];

      const { hostname } = new URL(createNavigationEntryInputDto.url);

      if (hostname && noTrackingDomains.includes(hostname)) return;

      const userPreference = await this.getUserPreferences(jwtContext.user.id);
      if (userPreference.enableStopTracking) return;

      const { content, images, ...entryData } = createNavigationEntryInputDto;

      const liteMode = !content;

      if (userPreference.enableExplicitContentFilter && content) {
        await this.explicitFilter.filter(
          content,
          createNavigationEntryInputDto.url,
        );
      }

      const lastEntry = await this.getLastEntryFromUser(jwtContext.user.id);

      const imageCaptions =
        await this.openAIService.generateImageCaptions(images);

      const imageCaptionsMarkdown =
        this.formatImageCaptionsMarkdown(imageCaptions);

      const prompt = PROMPTS.navigationEntrySummary(
        createNavigationEntryInputDto.url,
        content || '',
      );

      const summary = await this.openAIService.generateEntrySummary(prompt);

      await this.prismaService.$transaction(async (prismaClient) => {
        if (lastEntry.url === createNavigationEntryInputDto.url) {
          const navEntry = await prismaClient.navigationEntry.update({
            where: {
              id: lastEntry.id,
            },
            data: {
              liteMode,
              userDeviceId: jwtContext.session.userDeviceId,
              aiGeneratedContent: `${summary.data.content}\n\n${imageCaptions.length > 0 ? imageCaptionsMarkdown : ''}`,
              imageCaptions: imageCaptions,
              ...entryData,
            },
            include: completeNavigationEntryInclude,
          });
          await prismaClient.entryTag.deleteMany({
            where: {
              entryId: navEntry.id,
            },
          });
          await this.saveTags(navEntry, summary, prismaClient);
        } else {
          const navEntry = await prismaClient.navigationEntry.create({
            data: {
              liteMode,
              userId: jwtContext.user.id,
              userDeviceId: jwtContext.session.userDeviceId,
              aiGeneratedContent: `${summary.data.content}\n\n${imageCaptions.length > 0 ? imageCaptionsMarkdown : ''}`,
              imageCaptions: imageCaptions,
              ...entryData,
            },
            include: completeNavigationEntryInclude,
          });
          await this.saveTags(navEntry, summary, prismaClient);
        }
      });
    } catch (error) {
      console.error('Error parsing formatted result:', error);
    }
  }

  async addContextToNavigationEntry(
    jwtContext: JwtContext,
    addContextToNavigationEntryDto: AddContextToNavigationEntryDto,
  ) {
    try {
      const { content } = addContextToNavigationEntryDto;

      const userPreference = await this.prismaService.userPreferences.findFirst(
        {
          where: {
            userId: jwtContext.user.id,
          },
          select: {
            enableExplicitContentFilter: true,
          },
        },
      );

      if (userPreference?.enableExplicitContentFilter) {
        await this.explicitFilter.filter(
          content!,
          addContextToNavigationEntryDto.url,
        );
      }
    } catch (error) {
      this.logger.error(
        `An error occurred indexing '${addContextToNavigationEntryDto.url}'. Cause: ${error?.message}`,
      );
    }
  }

  async getNavigationEntry(
    jwtContext: JwtContext,
    queryParams: GetNavigationEntryDto,
  ): Promise<PaginationResponse<CompleteNavigationEntryDto>> {
    const { limit, offset, tag, query } = queryParams;
    const queryTsVector = queryParams.queryTsVector
      ? queryParams.queryTsVector.trim()
      : undefined;
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

    let count: number = 0;
    let completeNavigationEntries: CompleteNavigationEntry[] = [];
    const userId = jwtContext.user.id;

    if (queryTsVector) {
      const tokens = queryTsVector
        .toLowerCase()
        .split(' ')
        .filter((v) => v);

      const tsqueryTerm = tokens.join(' | ');
      const similarTerm = `%(${tokens.join('|')})%`;

      const keywords = tsqueryTerm;
      const similarPattern = similarTerm;

      const countResult: { count: number }[] =
        await this.prismaService.$queryRawUnsafe(
          countNavigationEntriesQueryRaw,
          userId,
          keywords,
          similarPattern,
          similarPattern,
        );

      const rawCompleteNavigationEntries: RawCompleteNavigationEntry[] =
        await this.prismaService.$queryRawUnsafe(
          navigationEntriesQueryRaw,
          userId,
          keywords,
          similarPattern,
          similarPattern,
          limit,
          offset,
        );

      const entriesResult = transformRawToCompleteNavigationEntries(
        rawCompleteNavigationEntries,
      );

      count = countResult?.[0].count || 0;
      completeNavigationEntries = entriesResult;
    } else {
      whereQuery = {
        ...whereQuery,
        ...(tag && {
          entryTags: {
            some: {
              tag: {
                name: tag,
              },
            },
          },
        }),
      };

      count = await this.prismaService.navigationEntry.count({
        where: {
          userId,
          ...whereQuery,
        },
      });

      completeNavigationEntries =
        await this.prismaService.navigationEntry.findMany({
          where: {
            userId,
            ...whereQuery,
          },
          include: completeNavigationEntryInclude,
          skip: offset,
          take: limit,
          orderBy: {
            navigationDate: 'desc',
          },
        });
    }

    const completeNavigationEntryDtos =
      NavigationEntryService.completeNavigationEntriesToDtos(
        jwtContext,
        completeNavigationEntries,
      );

    const userQuery = query ? query : queryTsVector;
    return plainToInstance(PaginationResponse<CompleteNavigationEntryDto>, {
      offset,
      limit,
      count,
      query: userQuery,
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

    return plainToInstance(MessageResponse, {
      message: 'Navigation entry has been deleted',
    });
  }

  async deleteNavigationEntries(
    jwtContext: JwtContext,
    deleteNavigationEntriesDto: DeleteNavigationEntriesDto,
  ): Promise<MessageResponse> {
    const { navigationEntryIds } = deleteNavigationEntriesDto;

    const entries = await this.prismaService.navigationEntry.findMany({
      where: {
        id: { in: navigationEntryIds },
        userId: jwtContext.user.id,
      },
    });

    if (entries.length !== navigationEntryIds.length) {
      throw new ForbiddenException();
    }

    await this.prismaService.$transaction(async (prismaClient) => {
      await prismaClient.navigationEntry.deleteMany({
        where: {
          id: { in: navigationEntryIds },
          userId: jwtContext.user.id,
        },
      });
    });

    return plainToInstance(MessageResponse, {
      message: `${entries.length} navigation entries have been deleted`,
    });
  }

  async deleteExpiredNavigationEntries(): Promise<void> {
    try {
      console.log(`deleteExpiredNavigationEntries has started`);
      const userPreferences = await this.prismaService.userPreferences.findMany(
        {
          where: {
            enableNavigationEntryExpiration: true,
            navigationEntryExpirationInDays: {
              not: null,
            },
          },
          select: {
            userId: true,
            navigationEntryExpirationInDays: true,
          },
        },
      );
      if (userPreferences.length === 0) {
        console.log(`There is no entries to delete`);
        return;
      }
      await Promise.allSettled(
        userPreferences.map(async (preference) => {
          const { userId, navigationEntryExpirationInDays } = preference;

          const expirationDate = subDays(
            new Date(),
            navigationEntryExpirationInDays!,
          );

          try {
            const entries = await this.prismaService.navigationEntry.findMany({
              where: {
                userId: userId,
                createdAt: {
                  lt: expirationDate,
                },
              },
              take: 50,
            });

            const entriesToDelete = entries.map((entry) => entry.id);
            await this.prismaService.navigationEntry.deleteMany({
              where: {
                id: {
                  in: entriesToDelete,
                },
              },
            });
          } catch (error) {
            console.error(`Error getting entries of user ${userId}:`, error);
          }
        }),
      ).catch((error) => {
        console.error('Error deleting expired navigation entries:', error);
      });
      console.log(`deleteExpiredNavigationEntries has finished`);
    } catch (error) {
      console.error('Error executing process', error);
    }
  }
}
