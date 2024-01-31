import { Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { PrismaService } from './common/services';
import { GetHelloReseponse } from './dtos';

export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async getHello(): Promise<GetHelloReseponse> {
    const message = 'Hello World 🌎';
    return plainToInstance(GetHelloReseponse, { message });
  }
}
