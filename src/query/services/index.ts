import { Injectable } from '@nestjs/common';
import { Query } from '@prisma/client';
import { PrismaService } from '../../common/services';
import { JwtContext } from 'src/auth/interfaces';
import { PaginationResponse } from '../../common/dtos';
import { QueryResultDto } from '../dtos/queryResult.dto';
import { SimpleNavigationEntryDto } from '../../navigation/dtos/simple-navigation-entry.dto';
import { GetPaginationsParamsDto } from '../../common/dtos';
import { plainToInstance } from 'class-transformer';
import { QueryResult, queryResultInclude } from '../types';

const toDtos = (queryResults: QueryResult[]): QueryResultDto[] => {
  return queryResults.map((queryResult): QueryResultDto => {
    return plainToInstance(QueryResultDto, {
      id: queryResult.id,
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
    queryParams: GetPaginationsParamsDto,
  ): Promise<PaginationResponse<QueryResultDto>> {
    const { limit, offset } = queryParams;
    const count = await this.prismaService.query.count({
      where: {
        navigationEntries: {
          some: { navigationEntry: { userId: jwtContext.user.id } },
        },
      },
    });
    const results: QueryResult[] = await this.prismaService.query.findMany({
      where: {
        navigationEntries: {
          some: { navigationEntry: { userId: jwtContext.user.id } },
        },
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
