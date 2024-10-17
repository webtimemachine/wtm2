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
} from '../types';

import { MessageResponse, PaginationResponse } from '../../common/dtos';
import { PrismaService } from '../../common/services';

import { UserService } from '../../user/services';
import { CompleteUser } from '../../user/types';

import { IndexerService } from '../../encoder/services';
import { QueryService } from '../../query/services';
import { ExplicitFilterService } from '../../filter/services';
import { appEnv } from '../../config';
import { subDays } from 'date-fns';
import { CustomLogger } from '../../common/helpers/custom-logger';
import { OpenAI } from '@langchain/openai';

@Injectable()
export class NavigationEntryService {
  private readonly logger = new CustomLogger(NavigationEntryService.name);

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
    relevantSegment?: string,
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
        relevantSegment,
        aiGeneratedContent: completeNavigationEntry.aiGeneratedContent,
      },
    );
    completeNavigationEntryDto.userDevice = userDeviceDto;
    return completeNavigationEntryDto;
  }

  static completeNavigationEntriesToDtos(
    jwtContext: JwtContext,
    completeNavigationEntries: CompleteNavigationEntry[],
    relevantSegments?: Map<string, string>,
  ): CompleteNavigationEntryDto[] {
    return completeNavigationEntries.map((completeNavigationEntry) =>
      NavigationEntryService.completeNavigationEntryToDto(
        jwtContext,
        completeNavigationEntry,
        relevantSegments?.get(completeNavigationEntry.url || ''),
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
  ): Promise<void> {
    const domains = appEnv.AVOID_DOMAIN_LIST;
    const noTrackingDomains = (domains && domains.split(', ')) || [];

    const { hostname } = new URL(createNavigationEntryInputDto.url);

    if (hostname && noTrackingDomains.includes(hostname)) return;

    const { content, images, ...entryData } = createNavigationEntryInputDto;

    const liteMode = !content;

    if (!liteMode) {
      const userPreference = await this.prismaService.userPreferences.findFirst(
        {
          where: {
            userId: jwtContext.user.id,
          },
          select: {
            enableImageEncoding: true,
            enableExplicitContentFilter: true,
          },
        },
      );
      if (userPreference?.enableExplicitContentFilter) {
        await this.explicitFilter.filter(
          content!,
          createNavigationEntryInputDto.url,
        );
      }
      try {
        await this.indexerService.index(
          content!,
          images,
          createNavigationEntryInputDto.url,
          jwtContext.user.id,
          userPreference?.enableImageEncoding || false,
        );
      } catch (error) {
        this.logger.error(
          `An error occurred indexing '${createNavigationEntryInputDto.url}'. Cause: ${error.message}`,
        );
      }
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

    const openai = new OpenAI({
      openAIApiKey: appEnv.OPENAI_ACCESS_TOKEN,
      modelName: 'gpt-4o-mini',
      temperature: 0.8,
    });

    const formatPrompt = `
      # IDENTITY and PURPOSE

      You are an expert content summarizer. You take semantic markdown content in and output a Markdown formatted summary using the format below. Also, you are an expert code formatter in markdown, making code more legible and well formatted.

      Take a deep breath and think step by step about how to best accomplish this goal using the following steps.

      # OUTPUT SECTIONS

      - Combine all of your understanding of the content into a single, 20-word sentence in a section called Search Summary:.

      - Output the 10 if exists, including most important points of the content as a list with no more than 15 words per point into a section called Main Points:.

      - Output a list of the 5 best takeaways from the content in a section called Takeaways:.

      - Output code must be formatted with Prettier like.

      - Output a section named Code: that shows a list of code present in INPUT content in markdown

      - Output a section named Tags found: that shows in a list of tags you find

      # OUTPUT INSTRUCTIONS

      - Create the output using the formatting above.
      - You only output human readable Markdown.
      - Sections MUST be in capital case.
      - Sections must be h2 to lower.
      - Output numbered lists, not bullets.
      - Do not output warnings or notes—just the requested sections.
      - Do not repeat items in the output sections.
      - Do not start items with the same opening words.
      - Do not show Code: section if no code is present on input provided.
      - You must detect the type of code and add it to code block so markdown styles are applied.
      - Set codes proper language if you can detect it.
      - Detect code and apply format to it.
      - The wrapped tags must be tags that you find from page information.
      - Tags must be a link that redirects to source url.
      # INPUT:

      INPUT:

      The search result is:

      ### Source: ${createNavigationEntryInputDto.url}
      ${content}
      `;

    const formattedResult = await openai.invoke([formatPrompt]);

    if (lastEntry?.url === createNavigationEntryInputDto.url) {
      await this.prismaService.navigationEntry.update({
        where: {
          id: lastEntry.id,
        },
        data: {
          liteMode,
          userDeviceId: jwtContext.session.userDeviceId,
          aiGeneratedContent: formattedResult,
          ...entryData,
        },
        include: completeNavigationEntryInclude,
      });
    } else {
      await this.prismaService.navigationEntry.create({
        data: {
          liteMode,
          userId: jwtContext.user.id,
          userDeviceId: jwtContext.session.userDeviceId,
          aiGeneratedContent: formattedResult,
          ...entryData,
        },
        include: completeNavigationEntryInclude,
      });
    }

    return;
  }

  async addContextToNavigationEntry(
    jwtContext: JwtContext,
    addContextToNavigationEntryDto: AddContextToNavigationEntryDto,
  ) {
    try {
      const { content, url } = addContextToNavigationEntryDto;

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

      await this.indexerService.index(
        content,
        [],
        url,
        jwtContext.user.id,
        false,
      );
    } catch (error) {
      this.logger.error(
        `An error occurred indexing '${addContextToNavigationEntryDto.url}'. Cause: ${error.message}`,
      );
    }
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
    let mostRelevantResults: Map<string, string> | undefined = undefined;
    if (isSemantic) {
      if (query) {
        try {
          const searchResults = await this.indexerService.search(
            query,
            jwtContext.user.id,
          );
          whereQuery = { url: { in: [...searchResults.urls!] } };
          mostRelevantResults = searchResults.mostRelevantResults;
        } catch (error: unknown) {
          if (
            error instanceof Error &&
            error.message.includes('Cannot query field')
          ) {
            this.logger.warn(`Ignoring AI search, schema does not exist yet`);
          } else throw error;
        }
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
        mostRelevantResults,
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
              try {
                await this.indexerService.delete(
                  navigationEntry.url,
                  jwtContext.user.id,
                );
              } catch (err) {}

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
            });

            await Promise.allSettled(
              entries.map(async (entry) => {
                const { url, userId, id } = entry;
                try {
                  await this.indexerService.delete(url, userId);
                  await this.prismaService.navigationEntry.delete({
                    where: { id, userId },
                  });
                } catch (error) {
                  console.error(`Error deleting entry ${id}:`, error);
                }
              }),
            );
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
