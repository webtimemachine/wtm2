import { Test, TestingModule } from '@nestjs/testing';
import { CommonTestingModule } from '../../common/common.testing.module';
import { PrismaService } from '../../common/services';
import { PrismaClient, UserType } from '@prisma/client';
import { NavigationEntryService } from './navigation-entry.service';
import { JWTPayload, JwtContext } from 'src/auth/interfaces';
import {
  CompleteNavigationEntryDto,
  CreateNavigationEntryInputDto,
} from '../dtos';
import { PaginationResponse } from 'src/common/dtos';
import { GetNavigationEntryDto } from '../dtos/get-navigation-entry.dto';
import { CompleteNavigationEntry } from '../types';
import { ExplicitFilterService } from '../../filter/services';
import { SemanticProcessor } from '../../semanticSearch/services';
import { SemanticSearchTestingModule } from '../../semanticSearch/semanticSearch.testing.module';
import { ExplicitFilterTestingModule } from '../../filter/filter.testing.module';

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
  userType: UserType.MEMBER,
  createdAt: new Date(),
  updateAt: new Date(),
  deletedAt: null,
  userPreferences: {
    id: BigInt(1),
    userId: BigInt(1),
    enableNavigationEntryExpiration: false,
    navigationEntryExpirationInDays: 120,
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
      userAgent: 'Chrome/121.0.6167.161',
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
  userDevice: {
    id: 1,
    userId: 1,
    deviceId: 1,
    deviceAlias: 'Personal Computer',
    isCurrentDevice: true,
    device: {
      id: 1,
      deviceKey: '123',
      userAgent: 'Chrome/121.0.6167.161',
    },
  },
  navigationDate,
};

const mockedEntry = {
  id: BigInt(1),
  url: 'example1.com',
  title: 'Example Title 1',
  content: 'Content 1',
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
      userAgent: 'Chrome/121.0.6167.161',
      createdAt: new Date(),
      updateAt: new Date(),
    },
  },
};

const mockedEntries: CompleteNavigationEntry[] = [
  mockedEntry,
  mockedEntry,
  mockedEntry,
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
  let semanticProcessor: SemanticProcessor;
  let explicitFilterService: ExplicitFilterService;

  const prismaClient = new PrismaClient();

  beforeEach(async () => {
    const commonTestModule = CommonTestingModule.forTest(prismaClient);
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        commonTestModule,
        SemanticSearchTestingModule.forTest(commonTestModule),
        ExplicitFilterTestingModule.forTest(commonTestModule),
      ],
      providers: [NavigationEntryService],
    }).compile();

    navigationEntryService = module.get<NavigationEntryService>(
      NavigationEntryService,
    );
    prismaService = module.get<PrismaService>(PrismaService);
    semanticProcessor = module.get<SemanticProcessor>(SemanticProcessor);
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

  it('semanticProcessor should be defined', () => {
    expect(semanticProcessor).toBeDefined();
  });

  it('explicitFilterService should be defined', () => {
    expect(explicitFilterService).toBeDefined();
  });

  describe('createNavigationEntry', () => {
    it('should create a new navigation entry successfully', async () => {
      const mockIndex = jest
        .spyOn(semanticProcessor, 'index')
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

      const result = await navigationEntryService.createNavigationEntry(
        jwtContext,
        createNavigationEntryInputDto,
      );

      expect(result).toBeDefined();
      expect(result).toEqual(createdNavigationEntry);
      expect(mockIndex).toHaveBeenCalledWith('Test content', 'example.com', 1n);
      expect(mockFilter).toHaveBeenCalledWith('Test content', 'example.com');
    });

    it('should create a new navigation entry successfully on repetitive entry', async () => {
      const mockIndex = jest
        .spyOn(semanticProcessor, 'index')
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

      const result = await navigationEntryService.createNavigationEntry(
        jwtContext,
        createNavigationEntryInputDto,
      );

      expect(result).toBeDefined();
      expect(result).toEqual(createdNavigationEntry);
      expect(mockIndex).toHaveBeenCalledWith('Test content', 'example.com', 1n);
      expect(mockFilter).toHaveBeenCalledWith('Test content', 'example.com');
    });
  });

  describe('getNavigationEntry', () => {
    it('should get navigation entries successfully', async () => {
      const mockSearch = jest
        .spyOn(semanticProcessor, 'search')
        .mockImplementation()
        .mockReturnValue(
          new Promise((resolve) => resolve(new Set(['example1', 'example2']))),
        );

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
    });
  });
});
