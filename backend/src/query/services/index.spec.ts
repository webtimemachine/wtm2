import { PrismaClient, UserType } from '@prisma/client';

import { QueryService, toDtos } from '../services';
import { QueryResultDto } from '../dtos';
import { QueryResult } from '../types';
import { Test, TestingModule } from '@nestjs/testing';

import { CommonTestingModule } from '../../common/common.testing.module';
import { PaginationResponse } from '../../common/dtos';
import { PrismaService } from '../../common/services';

import { JWTPayload, JwtContext } from '../../auth/interfaces';

jest.mock('../../common/services/prisma.service');

const mockJWTPayload: JWTPayload = {
  sub: 'mock-subject',
  userId: 123,
  userType: UserType.MEMBER,
  sessionId: 456,
};

const queryParams = {
  limit: 10,
  offset: 0,
  query: 'foobar',
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

const jwtContext: JwtContext = {
  user: existingUser,
  session: mockedSession,
  payload: mockJWTPayload,
};

const mockedQueryResult: QueryResult = {
  id: BigInt(1),
  query: 'foobar',
  createdAt: new Date(),
  navigationEntries: [
    {
      navigationEntry: {
        url: 'foobar1.com',
        title: 'foobar1 title',
        navigationDate: new Date(),
      },
    },
    {
      navigationEntry: {
        url: 'foobar2.com',
        title: 'foobar2 title',
        navigationDate: new Date(),
      },
    },
    {
      navigationEntry: {
        url: 'foobar3.com',
        title: 'foobar3 title',
        navigationDate: new Date(),
      },
    },
  ],
};

const mockedQueryResults: QueryResult[] = [
  mockedQueryResult,
  { ...mockedQueryResult, id: BigInt(2) },
  { ...mockedQueryResult, id: BigInt(3) },
];

const queryResultDtos = toDtos(mockedQueryResults);

const expectedResponse: PaginationResponse<QueryResultDto> = {
  offset: 0,
  limit: 10,
  count: mockedQueryResults.length,
  items: queryResultDtos,
};

describe('QueryService', () => {
  let prismaService: PrismaService;
  let queryService: QueryService;

  const prismaClient = new PrismaClient();

  beforeEach(async () => {
    const commonTestModule = CommonTestingModule.forTest(prismaClient);
    const module: TestingModule = await Test.createTestingModule({
      imports: [commonTestModule],
      providers: [QueryService],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
    queryService = module.get<QueryService>(QueryService);
  });

  it('prismaService should be defined', () => {
    expect(prismaService).toBeDefined();
  });

  it('queryService should be defined', () => {
    expect(queryService).toBeDefined();
  });

  describe('New entries', () => {
    it('New entry when the given query does not exist yet', async () => {
      const mockUnique = jest.fn().mockResolvedValue(null);
      const mockCreate = jest.fn().mockResolvedValue({ id: 1 });
      const mockCreateMany = jest.fn();
      prismaService.query.findUnique = mockUnique;
      prismaService.query.create = mockCreate;
      prismaService.navigationEntryQuery.createMany = mockCreateMany;

      await queryService.newEntry('foobar', [1n, 2n]);

      expect(mockUnique).toHaveBeenCalledWith({ where: { query: 'foobar' } });
      expect(mockCreate).toHaveBeenCalledWith({ data: { query: 'foobar' } });
      expect(mockCreateMany).toHaveBeenCalledWith({
        data: [
          { queryId: 1, navigationEntryId: 1n },
          { queryId: 1, navigationEntryId: 2n },
        ],
        skipDuplicates: true,
      });
    });

    it('New entry when the given query already exist', async () => {
      const mockUnique = jest.fn().mockResolvedValue({ id: 1 });
      const mockCreateMany = jest.fn();
      prismaService.query.findUnique = mockUnique;
      prismaService.navigationEntryQuery.createMany = mockCreateMany;

      await queryService.newEntry('foobar', [1n, 2n]);

      expect(mockUnique).toHaveBeenCalledWith({ where: { query: 'foobar' } });
      expect(mockCreateMany).toHaveBeenCalledWith({
        data: [
          { queryId: 1, navigationEntryId: 1n },
          { queryId: 1, navigationEntryId: 2n },
        ],
        skipDuplicates: true,
      });
    });
  });

  describe('Get Queries', () => {
    it('Get queries successfully', async () => {
      const mockCount = jest.fn().mockResolvedValue(3);
      const mockFindMany = jest.fn().mockResolvedValue(mockedQueryResults);
      const mockCreateMany = jest.fn();

      prismaService.query.count = mockCount;
      prismaService.query.findMany = mockFindMany;
      prismaService.navigationEntryQuery.createMany = mockCreateMany;

      const queryResults = await queryService.getQueries(
        jwtContext,
        queryParams,
      );

      expect(queryResults).toEqual(expectedResponse);
      expect(mockCount).toHaveBeenCalled();
      expect(mockFindMany).toHaveBeenCalled();
    });
  });
});
