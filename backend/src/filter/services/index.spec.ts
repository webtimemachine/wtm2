import { OutputParserException } from '@langchain/core/output_parsers';
import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { CommonTestingModule } from '../../common/common.testing.module';
import { PrismaService } from '../../common/services';
import { ExplicitFilterService, FlagParser } from '../services';

jest.mock('../../common/services/prisma.service');
jest.mock('@langchain/openai', () => ({
  ChatOpenAI: jest.fn().mockReturnValue(jest.fn().mockReturnValue('True')),
}));

describe('ExplicitFilterService', () => {
  let prismaService: PrismaService;
  let explicitFilterService: ExplicitFilterService;

  const prismaClient = new PrismaClient();

  beforeEach(async () => {
    const commonTestModule = CommonTestingModule.forTest(prismaClient);
    const module: TestingModule = await Test.createTestingModule({
      imports: [commonTestModule],
      providers: [ExplicitFilterService],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
    explicitFilterService = module.get<ExplicitFilterService>(
      ExplicitFilterService,
    );
  });

  it('prismaService should be defined', () => {
    expect(prismaService).toBeDefined();
  });

  it('explicitFilterService should be defined', () => {
    expect(explicitFilterService).toBeDefined();
  });

  describe('Filter content', () => {
    it('should throw HTTP exception based on DB result', async () => {
      prismaService.blackList.count = jest.fn().mockResolvedValue(1);
      await expect(
        explicitFilterService.filter('Test content', 'example.com'),
      ).rejects.toThrow(HttpException);
    });

    it('should throw HTTP exception based on chain response', async () => {
      const mockCreate = jest.fn();
      prismaService.blackList.count = jest.fn().mockResolvedValue(0);
      prismaService.blackList.create = mockCreate;
      await expect(
        explicitFilterService.filter('Test content', 'example.com'),
      ).rejects.toThrow(HttpException);
      expect(mockCreate).toHaveBeenCalledWith({
        data: { url: 'example.com' },
      });
    });
  });

  describe('Parse responses', () => {
    const parser = new FlagParser();
    it('should parse to boolean', async () => {
      const trueflag = await parser.parse('True');
      const falseflag = await parser.parse('False');
      expect(trueflag).toEqual(true);
      expect(falseflag).toEqual(false);
    });

    it('should throw exception', async () => {
      await expect(
        parser.parse('The provided text contains explicit content'),
      ).rejects.toThrow(OutputParserException);
    });
  });
});
