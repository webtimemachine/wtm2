import { Test, TestingModule } from '@nestjs/testing';
import { CommonTestingModule } from '../../common/common.testing.module';
import { PrismaService } from '../../common/services';
import { PrismaClient } from '@prisma/client';
import { WeaviateStore } from '@langchain/weaviate';
import { Document } from '@langchain/core/documents';
import { OpenAIEmbeddings } from '@langchain/openai';
import { SemanticProcessor } from '../../semanticSearch/services';

jest.mock('weaviate-ts-client', () => ({
  __esModule: true,
  default: {
    client: jest.fn().mockReturnValue({
      schema: {
        classCreator: jest.fn().mockReturnValue({
          withClass: jest.fn().mockReturnThis(),
          do: jest.fn(),
        }),
        tenantsCreator: jest.fn().mockReturnValue({
          do: jest.fn(),
        }),
        classDeleter: jest.fn().mockReturnThis(),
        classGetter: jest.fn().mockReturnThis(),
        exists: jest.fn().mockReturnThis(),
        getter: jest.fn().mockReturnThis(),
        propertyCreator: jest.fn().mockReturnThis(),
        deleteAll: jest.fn().mockReturnThis(),
        shardsGetter: jest.fn().mockReturnThis(),
        shardUpdater: jest.fn().mockReturnThis(),
        shardsUpdater: jest.fn().mockReturnThis(),
        tenantsGetter: jest.fn().mockReturnThis(),
        tenantsUpdater: jest.fn().mockReturnThis(),
        tenantsDeleter: jest.fn().mockReturnThis(),
      },
    }),
  },
}));

import weaviate from 'weaviate-ts-client';

jest.mock('../../common/services/prisma.service');

describe('SemanticProcessor', () => {
  let prismaService: PrismaService;
  let semanticProcessor: SemanticProcessor;

  const prismaClient = new PrismaClient();

  beforeEach(async () => {
    jest.mock('@langchain/openai', () => ({
      OpenAIEmbeddings: jest.fn(() => ({
        embed: jest.fn(() => 'Mocked embeddings'),
      })),
    }));

    const commonTestModule = CommonTestingModule.forTest(prismaClient);
    const module: TestingModule = await Test.createTestingModule({
      imports: [commonTestModule],
      providers: [SemanticProcessor],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
    semanticProcessor = module.get<SemanticProcessor>(SemanticProcessor);
  });

  it('prismaService should be defined', () => {
    expect(prismaService).toBeDefined();
  });

  it('semanticProcessor should be defined', () => {
    expect(semanticProcessor).toBeDefined();
  });

  describe('Index data', () => {
    it('should index successfully', async () => {
      const expectedData = {
        client: weaviate.client({ scheme: 'http', host: 'localhost:8084' }),
        indexName: 'MultiTenancyCollection',
        metadataKeys: ['source'],
        textKey: 'text',
        tenant: `Tenant-1`,
      };
      const mockWeaviate = jest
        .spyOn(WeaviateStore, 'fromDocuments')
        .mockImplementation();

      prismaService.navigationEntry.count = jest.fn().mockResolvedValue(0);

      await semanticProcessor.index('Test.Content', 'example.com', 1n);

      expect(mockWeaviate).toHaveBeenCalledWith(
        [
          new Document({
            pageContent: 'Test.Content',
            metadata: {
              loc: { lines: { from: 1, to: 1 } },
              source: 'example.com',
            },
          }),
        ],
        expect.any(OpenAIEmbeddings),
        expectedData,
      );
      mockWeaviate.mockRestore();
    });

    it('should not index', async () => {
      const mockWeaviate = jest
        .spyOn(WeaviateStore, 'fromDocuments')
        .mockImplementation();

      prismaService.navigationEntry.count = jest.fn().mockResolvedValue(1);

      await semanticProcessor.index('Test.Content', 'example.com', 1n);

      expect(mockWeaviate).not.toHaveBeenCalled();
    });
  });

  describe('Search data', () => {
    it('should return URLs', async () => {
      const mockRelevantDocuments = [
        { metadata: { source: 'source1' } },
        { metadata: { source: 'source2' } },
      ];
      const mockRetriever = {
        getRelevantDocuments: jest
          .fn()
          .mockResolvedValue(mockRelevantDocuments),
      };
      const mockAsRetriever = jest.fn().mockReturnValue(mockRetriever);
      const mockFromExistingIndex = jest.fn().mockResolvedValue({
        asRetriever: mockAsRetriever,
      });
      const mockWeaviate = jest
        .spyOn(WeaviateStore, 'fromExistingIndex')
        .mockImplementation(mockFromExistingIndex);
      const expectedData = {
        client: weaviate.client({ scheme: 'http', host: 'localhost:8084' }),
        indexName: 'MultiTenancyCollection',
        metadataKeys: ['source'],
        textKey: 'text',
        tenant: `Tenant-1`,
      };

      const results = await semanticProcessor.search('Test query', 1n);
      expect(results).toEqual(new Set(['source1', 'source2']));
      expect(mockRetriever.getRelevantDocuments).toHaveBeenCalledWith(
        'Test query',
      );
      expect(mockWeaviate).toHaveBeenCalledWith(
        expect.any(OpenAIEmbeddings),
        expectedData,
      );
    });
  });
});
