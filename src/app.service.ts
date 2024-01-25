import { Injectable, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { Example } from '@prisma/client';
import { PrismaService } from './common/services';

import { ExampleDto, GetHelloReseponse } from './dtos';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async getHello(): Promise<GetHelloReseponse> {
    const message = 'Hello World 🌎';
    return plainToInstance(GetHelloReseponse, { message });
  }

  async createExampleEntry(text: string): Promise<ExampleDto> {
    const exampleEntry: Example = await this.prismaService.example.create({
      data: {
        text,
      },
    });
    return plainToInstance(ExampleDto, exampleEntry);
  }

  async getExampleEntries(): Promise<ExampleDto[]> {
    const exampleEntries: Example[] =
      await this.prismaService.example.findMany();
    return plainToInstance(ExampleDto, exampleEntries);
  }
}
