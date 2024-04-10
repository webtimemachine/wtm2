import { Injectable } from '@nestjs/common';
import { Query, Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

import { JwtContext } from '../../auth/interfaces';

import { PrismaService } from '../../common/services';
import { PaginationResponse } from '../../common/dtos';

import { SimpleNavigationEntryDto } from '../../navigation/dtos';

import { QueryResultDto, GetQueriesDto } from '../dtos';
import { QueryResult, queryResultInclude } from '../types';

export const toDtos = (queryResults: QueryResult[]): QueryResultDto[] => {
  return queryResults.map((queryResult): QueryResultDto => {
    return plainToInstance(QueryResultDto, {
      id: Number(queryResult.id),
      query: queryResult.query,
      results: queryResult.navigationEntries.map(
        (entry): SimpleNavigationEntryDto =>
          plainToInstance(SimpleNavigationEntryDto, {
            ...entry.navigationEntry,
          }),
      ),
    });
  });
};

@Injectable()
export class QueryService {
  constructor(private readonly prismaService: PrismaService) {}

  async newEntry(query: string, navigationEntriesIds: bigint[]) {
    let queryEntry: Query | null = await this.prismaService.query.findUnique({
      where: { query: query },
    });
    if (queryEntry == null) {
      queryEntry = await this.prismaService.query.create({
        data: { query: query },
      });
    }
    const newQueryEntries = navigationEntriesIds.map((entryId) => ({
      queryId: queryEntry!.id,
      navigationEntryId: entryId,
    }));
    await this.prismaService.navigationEntryQuery.createMany({
      data: newQueryEntries,
      skipDuplicates: true,
    });
  }

  async getQueries(
    jwtContext: JwtContext,
    queryParams: GetQueriesDto,
  ): Promise<PaginationResponse<QueryResultDto>> {
    const queryFilter: Prisma.StringFilter<'Query'> = {
      contains: queryParams.query,
      mode: 'insensitive',
    };
    const { limit, offset } = queryParams;
    const count = await this.prismaService.query.count({
      where: {
        navigationEntries: {
          some: { navigationEntry: { userId: jwtContext.user.id } },
        },
        query: queryParams.query ? queryFilter : undefined,
      },
    });
    const results: QueryResult[] = await this.prismaService.query.findMany({
      where: {
        navigationEntries: {
          some: { navigationEntry: { userId: jwtContext.user.id } },
        },
        query: queryParams.query ? queryFilter : undefined,
      },
      include: queryResultInclude,
      skip: offset,
      take: limit,
    });
    return plainToInstance(PaginationResponse<QueryResultDto>, {
      offset,
      limit,
      count,
      items: toDtos(results),
    });
  }
}
