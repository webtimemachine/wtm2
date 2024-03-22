import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services';

@Injectable()
export class QueryService {
  constructor(private readonly prismaService: PrismaService) {}

  async newEntry(
    query: string,
    isSemantic: boolean,
    navigationEntriesIds: bigint[],
  ) {
    const newQueryEntry = await this.prismaService.query.create({
      data: { query: query, semantic: isSemantic },
    });
    const newQueryEntries = navigationEntriesIds.map((entryId) => ({
      queryId: newQueryEntry.id,
      navigationEntryId: entryId,
    }));
    await this.prismaService.navigationEntryQuery.createMany({
      data: newQueryEntries,
    });
  }
}
