import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services';
import { Query } from '@prisma/client';

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
    });
  }
}
