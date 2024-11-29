import { plainToInstance } from 'class-transformer';

import { PrismaService } from './common/services';
import { GetVersionResponse } from './dtos';
import { getVersion } from './getVersion';

import { WebTMLogger } from './common/helpers/webtm-logger';

export class AppService {
  private readonly logger = new WebTMLogger(AppService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async getVersion(): Promise<GetVersionResponse> {
    const version = await getVersion();
    return plainToInstance(GetVersionResponse, { version });
  }
}
