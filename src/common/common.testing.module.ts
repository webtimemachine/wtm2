import { DynamicModule, Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from './services';

@Module({})
export class CommonTestingModule {
  static forTest(prismaClient: PrismaClient): DynamicModule {
    return {
      module: CommonTestingModule,
      providers: [
        {
          provide: PrismaService,
          useFactory: () => prismaClient as PrismaService,
        },
      ],
      exports: [PrismaService],
    };
  }
}
