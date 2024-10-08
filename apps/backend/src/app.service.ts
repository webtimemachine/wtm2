import { plainToInstance } from 'class-transformer';

import { PrismaService } from './common/services';
import { GetVersionResponse } from './dtos';
import { getVersion } from './getVersion';

import { CustomLogger } from './common/helpers/custom-logger';

export class AppService {
  private readonly logger = new CustomLogger(AppService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async getVersion(): Promise<GetVersionResponse> {
    const version = await getVersion();
    return plainToInstance(GetVersionResponse, { version });
  }
}
