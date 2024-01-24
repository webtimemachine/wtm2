import { Injectable, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { GetHelloReseponse } from './dtos';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor() {}

  async getHello(): Promise<GetHelloReseponse> {
    const message = 'Hello World 🌎';
    return plainToInstance(GetHelloReseponse, { message });
  }
}
