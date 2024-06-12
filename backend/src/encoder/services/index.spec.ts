import { Test, TestingModule } from '@nestjs/testing';
import { CommonTestingModule } from '../../common/common.testing.module';
import { PrismaService } from '../../common/services';
import { PrismaClient } from '@prisma/client';
import { WeaviateStore } from '@langchain/weaviate';
import { Document } from '@langchain/core/documents';
import { OpenAIEmbeddings } from '@langchain/openai';
import { IndexerService } from '.';
import * as utils from '../utils';

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

describe('Indexer service', () => {
  let prismaService: PrismaService;
  let indexerService: IndexerService;

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
      providers: [IndexerService],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
    indexerService = module.get<IndexerService>(IndexerService);
  });

  it('prismaService should be defined', () => {
    expect(prismaService).toBeDefined();
  });

  it('indexerService should be defined', () => {
    expect(indexerService).toBeDefined();
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

      const mockCaption = jest
        .spyOn(utils, 'caption')
        .mockImplementation()
        .mockResolvedValueOnce('image caption 1')
        .mockResolvedValueOnce('image caption 2');

      await indexerService.index(
        'Test.Content',
        ['imageURL 1', 'imageURL 2'],
        'example.com',
        1n,
        true,
      );

      expect(mockCaption).toHaveBeenCalledTimes(2);
      expect(mockCaption).toHaveBeenCalledWith('imageURL 1');
      expect(mockCaption).toHaveBeenCalledWith('imageURL 2');
      expect(mockWeaviate).toHaveBeenCalledWith(
        [
          new Document({
            pageContent: 'Test.Content',
            metadata: {
              loc: { lines: { from: 1, to: 1 } },
              source: 'example.com',
            },
          }),
          new Document({
            pageContent: 'image caption 1',
            metadata: {
              source: 'example.com',
            },
          }),
          new Document({
            pageContent: 'image caption 2',
            metadata: {
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

      await indexerService.index('Test.Content', [], 'example.com', 1n, true);

      expect(mockWeaviate).not.toHaveBeenCalled();
    });
  });

  describe('Search data', () => {
    it('should return URLs', async () => {
      const mockRelevantDocuments = [
        { metadata: { source: 'source1' }, pageContent: 'relevant content 1' },
        { metadata: { source: 'source2' }, pageContent: 'relevant content 2' },
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

      const results = await indexerService.search('Test query', 1n);
      const expectedSearchResult = {
        urls: new Set(['source1', 'source2']),
        mostRelevantResults: new Map<string, string>([
          ['source1', 'relevant content 1'],
          ['source2', 'relevant content 2'],
        ]),
      };
      expect(results).toEqual(expectedSearchResult);
      expect(mockRetriever.getRelevantDocuments).toHaveBeenCalledWith(
        'Test query',
      );
      expect(mockWeaviate).toHaveBeenCalledWith(
        expect.any(OpenAIEmbeddings),
        expectedData,
      );
    });
  });

  describe('Delete data', () => {
    it('should delete documents successfully', async () => {
      const deleteMock = jest.fn();

      const mockFromExistingIndex = jest.fn().mockResolvedValue({
        delete: deleteMock,
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

      prismaService.navigationEntry.count = jest.fn().mockResolvedValue(1);

      await indexerService.delete('example.com', 1n);

      expect(mockWeaviate).toHaveBeenCalledWith(
        expect.any(OpenAIEmbeddings),
        expectedData,
      );
      expect(deleteMock).toHaveBeenCalledWith({
        filter: {
          where: {
            operator: 'Equal',
            path: ['source'],
            valueText: 'example.com',
          },
        },
      });
      mockWeaviate.mockRestore();
    });

    it('should skip deletion', async () => {
      const mockFromExistingIndex = jest.fn();
      const mockWeaviate = jest
        .spyOn(WeaviateStore, 'fromExistingIndex')
        .mockImplementation();

      prismaService.navigationEntry.count = jest.fn().mockResolvedValue(2);

      await indexerService.delete('example.com', 1n);

      expect(mockFromExistingIndex).not.toHaveBeenCalled();
      mockWeaviate.mockRestore();
    });
  });
});
