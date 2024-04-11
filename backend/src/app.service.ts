import { Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { PrismaService } from './common/services';
import { GetVersionReseponse } from './dtos';
import { getVersion } from './getVersion';

export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async getVersion(): Promise<GetVersionReseponse> {
    const version = await getVersion();
    return plainToInstance(GetVersionReseponse, { version });
  }
}
