import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient, UserType } from '@prisma/client';

import { PaginationResponse } from '../../common/dtos';
import { CommonTestingModule } from '../../common/common.testing.module';
import { PrismaService } from '../../common/services';

import { ExplicitFilterService } from '../../filter/services';
import { ExplicitFilterTestingModule } from '../../filter/filter.testing.module';

import {
  CompleteNavigationEntryDto,
  CreateNavigationEntryInputDto,
  GetNavigationEntryDto,
} from '../dtos';
import { CompleteNavigationEntry } from '../types';
import { NavigationEntryService } from './navigation-entry.service';

import { QueryService } from '../../query/services';
import { QueryTestingModule } from '../../query/query.testing.module';

import { IndexerService } from '../../encoder/services';
import { EncoderTestingModule } from '../../encoder/encoder.testing.module';

import { JWTPayload, JwtContext } from '../../auth/interfaces';

jest.mock('../../common/services/prisma.service');

const mockJWTPayload: JWTPayload = {
  sub: 'mock-subject',
  userId: 123,
  userType: UserType.MEMBER,
  sessionId: 456,
};

const existingUser = {
  id: BigInt(1),
  email: 'test@example.com',
  password: 'hashedPassword',
  verified: true,
  verificationCode: '1234',
  userType: UserType.MEMBER,
  createdAt: new Date(),
  updateAt: new Date(),
  deletedAt: null,
  recoveryCode: null,
  userPreferences: {
    id: BigInt(1),
    userId: BigInt(1),
    enableNavigationEntryExpiration: false,
    navigationEntryExpirationInDays: 120,
    enableImageEncoding: true,
    enableExplicitContentFilter: true,
    createdAt: new Date(),
    updateAt: new Date(),
  },
};

const mockedSession = {
  id: BigInt(1),
  refreshToken: '',
  userDeviceId: BigInt(1),
  expiration: new Date(),
  createdAt: new Date(),
  updateAt: new Date(),
  userDevice: {
    id: BigInt(1),
    userId: BigInt(1),
    deviceId: BigInt(1),
    deviceAlias: 'Personal Computer',
    createdAt: new Date(),
    updateAt: new Date(),
    device: {
      id: BigInt(1),
      deviceKey: '123',
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      userAgentData:
        '{"brands":[{"brand":"Chromium","version":"124"},{"brand":"Google Chrome","version":"124"},{"brand":"Not-A.Brand","version":"99"}],"mobile":false,"platform":"Windows"}',
      createdAt: new Date(),
      updateAt: new Date(),
    },
  },
};

const navigationDate = new Date();

const createNavigationEntryInputDto: CreateNavigationEntryInputDto = {
  url: 'example.com',
  title: 'Example Title',
  navigationDate,
  content: 'Test content',
  images: [],
};

const jwtContext: JwtContext = {
  user: existingUser,
  session: mockedSession,
  payload: mockJWTPayload,
};

const createdNavigationEntry: CompleteNavigationEntryDto = {
  id: 1,
  url: 'example.com',
  title: 'Example Title',
  userId: 1,
  userDeviceId: 1,
  liteMode: true,
  userDevice: {
    id: 1,
    userId: 1,
    deviceId: 1,
    deviceAlias: 'Personal Computer',
    isCurrentDevice: true,
    device: {
      id: 1,
      deviceKey: '123',
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      uaResult: {
        ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        browser: {
          name: 'Chrome',
          version: '121.0.0.0',
          major: '121',
        },
        engine: {
          name: 'Blink',
          version: '121.0.0.0',
        },
        os: {
          name: 'Windows',
          version: '10',
        },
        device: {},
        cpu: {
          architecture: 'amd64',
        },
      },
    },
  },
  navigationDate,
};

const mockedEntry: CompleteNavigationEntry = {
  id: BigInt(1),
  url: 'example1.com',
  title: 'Example Title 1',
  liteMode: true,
  navigationDate: new Date('2024-02-09T12:00:00Z'),
  userId: BigInt(1),
  userDeviceId: BigInt(1),
  createdAt: new Date('2024-02-09T12:00:00Z'),
  updateAt: null,
  userDevice: {
    id: BigInt(1),
    userId: BigInt(1),
    deviceId: BigInt(1),
    deviceAlias: 'Personal Computer',
    createdAt: new Date(),
    updateAt: new Date(),
    device: {
      id: BigInt(1),
      deviceKey: '123',
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      userAgentData:
        '{"brands":[{"brand":"Chromium","version":"124"},{"brand":"Google Chrome","version":"124"},{"brand":"Not-A.Brand","version":"99"}],"mobile":false,"platform":"Windows"}',
      createdAt: new Date(),
      updateAt: new Date(),
    },
  },
};

const mockedEntries: CompleteNavigationEntry[] = [
  mockedEntry,
  { ...mockedEntry, id: BigInt(2) },
  { ...mockedEntry, id: BigInt(3) },
];

const completeNavigationEntriesDtos =
  NavigationEntryService.completeNavigationEntriesToDtos(
    jwtContext,
    mockedEntries,
  );

const expectedResponse: PaginationResponse<CompleteNavigationEntryDto> = {
  offset: 0,
  limit: 10,
  query: 'example',
  count: mockedEntries.length,
  items: completeNavigationEntriesDtos,
};

const queryParams: GetNavigationEntryDto = {
  limit: 10,
  offset: 0,
  query: 'example',
  isSemantic: true,
};

describe('NavigationEntryService', () => {
  let navigationEntryService: NavigationEntryService;
  let prismaService: PrismaService;
  let indexerService: IndexerService;
  let queryService: QueryService;
  let explicitFilterService: ExplicitFilterService;

  const prismaClient = new PrismaClient();

  beforeEach(async () => {
    const commonTestModule = CommonTestingModule.forTest(prismaClient);
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        commonTestModule,
        EncoderTestingModule.forTest(commonTestModule),
        QueryTestingModule.forTest(commonTestModule),
        ExplicitFilterTestingModule.forTest(commonTestModule),
      ],
      providers: [NavigationEntryService],
    }).compile();

    navigationEntryService = module.get<NavigationEntryService>(
      NavigationEntryService,
    );
    prismaService = module.get<PrismaService>(PrismaService);
    indexerService = module.get<IndexerService>(IndexerService);
    queryService = module.get<QueryService>(QueryService);
    explicitFilterService = module.get<ExplicitFilterService>(
      ExplicitFilterService,
    );
  });

  it('navigationEntryService should be defined', () => {
    expect(navigationEntryService).toBeDefined();
  });

  it('prismaService should be defined', () => {
    expect(prismaService).toBeDefined();
  });

  it('indexerService should be defined', () => {
    expect(indexerService).toBeDefined();
  });

  it('queryService should be defined', () => {
    expect(queryService).toBeDefined();
  });
  it('explicitFilterService should be defined', () => {
    expect(explicitFilterService).toBeDefined();
  });

  describe('createNavigationEntry', () => {
    it('should create a new navigation entry successfully', async () => {
      const mockIndex = jest
        .spyOn(indexerService, 'index')
        .mockImplementation();

      const mockFilter = jest
        .spyOn(explicitFilterService, 'filter')
        .mockImplementation();

      prismaService.navigationEntry.findFirst = jest
        .fn()
        .mockReturnValue(mockedEntry);
      prismaService.navigationEntry.create = jest
        .fn()
        .mockReturnValue(createdNavigationEntry);

      prismaService.navigationEntry.count = jest.fn().mockReturnValue(1);
      prismaService.userPreferences.findFirst = jest.fn().mockResolvedValue({
        enableImageEncoding: true,
        enableExplicitContentFilter: true,
      });

      const result = await navigationEntryService.createNavigationEntry(
        jwtContext,
        createNavigationEntryInputDto,
      );

      expect(result).toBeDefined();
      expect(result).toEqual(createdNavigationEntry);
      expect(mockIndex).toHaveBeenCalledWith(
        'Test content',
        [],
        'example.com',
        1n,
        true,
      );
      expect(mockFilter).toHaveBeenCalledWith('Test content', 'example.com');
    });

    it('should create a new navigation entry successfully on repetitive entry', async () => {
      const mockIndex = jest
        .spyOn(indexerService, 'index')
        .mockImplementation();

      const mockFilter = jest
        .spyOn(explicitFilterService, 'filter')
        .mockImplementation();
      prismaService.navigationEntry.findFirst = jest
        .fn()
        .mockReturnValue(createdNavigationEntry);
      prismaService.navigationEntry.update = jest
        .fn()
        .mockReturnValue(createdNavigationEntry);
      prismaService.userPreferences.findFirst = jest.fn().mockResolvedValue({
        enableImageEncoding: true,
        enableExplicitContentFilter: true,
      });

      const result = await navigationEntryService.createNavigationEntry(
        jwtContext,
        createNavigationEntryInputDto,
      );

      expect(result).toBeDefined();
      expect(result).toEqual(createdNavigationEntry);
      expect(mockIndex).toHaveBeenCalledWith(
        'Test content',
        [],
        'example.com',
        1n,
        true,
      );
      expect(mockFilter).toHaveBeenCalledWith('Test content', 'example.com');
    });
  });

  describe('getNavigationEntry', () => {
    it('should get navigation entries successfully', async () => {
      const mockSearchReturnValue = {
        urls: new Set(['example1', 'example2']),
        mostRelevantResults: new Map<string, string>([
          ['example1', 'example2 relevant segment'],
          ['example1', 'example2 relevant segment'],
        ]),
      };
      const mockSearch = jest
        .spyOn(indexerService, 'search')
        .mockImplementation()
        .mockReturnValue(
          new Promise((resolve) => resolve(mockSearchReturnValue)),
        );

      const mockNewEntry = jest.fn();
      queryService.newEntry = mockNewEntry;

      prismaService.navigationEntry.count = jest
        .fn()
        .mockReturnValue(mockedEntries.length);
      prismaService.navigationEntry.findMany = jest
        .fn()
        .mockReturnValue(mockedEntries);
      const result = await navigationEntryService.getNavigationEntry(
        jwtContext,
        queryParams,
      );

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResponse);
      expect(mockSearch).toHaveBeenCalledWith(queryParams.query, 1n);
      expect(mockSearch).toHaveReturnedWith(
        new Promise((resolve) => resolve(new Set(['example1', 'example2']))),
      );
      expect(mockNewEntry).toHaveBeenCalledWith(queryParams.query!, [
        1n,
        2n,
        3n,
      ]);
    });
  });
});
