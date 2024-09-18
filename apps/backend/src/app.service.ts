import { Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { PrismaService } from './common/services';
import { GetVersionResponse } from './dtos';
import { getVersion } from './getVersion';

export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async getVersion(): Promise<GetVersionResponse> {
    const version = await getVersion();
    return plainToInstance(GetVersionResponse, { version });
  }
}
