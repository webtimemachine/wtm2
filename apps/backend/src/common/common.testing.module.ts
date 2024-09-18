import { DynamicModule, Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { EmailService, PrismaService } from './services';

const mockEmailService = {
  sendWelcomeEmail: jest.fn().mockResolvedValue(null),
  sendPasswordResetEmail: jest.fn().mockResolvedValue(null),
};

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
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
      exports: [PrismaService, EmailService],
    };
  }
}
