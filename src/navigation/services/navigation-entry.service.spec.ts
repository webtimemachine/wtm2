import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient, UserType } from '@prisma/client';
import { JWTPayload, JwtContext } from 'src/auth/interfaces';
import { PaginationResponse } from 'src/common/dtos';
import { CommonTestingModule } from '../../common/common.testing.module';
import { PrismaService } from '../../common/services';
import {
  CompleteNavigationEntryDto,
  CreateNavigationEntryInputDto,
} from '../dtos';
import { GetNavigationEntryDto } from '../dtos/get-navigation-entry.dto';
import { CompleteNavigationEntry } from '../types';
import { NavigationEntryService } from './navigation-entry.service';

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
  recoveryCode: null,
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
};

describe('NavigationEntryService', () => {
  let navigationEntryService: NavigationEntryService;
  let prismaService: PrismaService;

  const prismaClient = new PrismaClient();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CommonTestingModule.forTest(prismaClient)],
      providers: [NavigationEntryService],
    }).compile();

    navigationEntryService = module.get<NavigationEntryService>(
      NavigationEntryService,
    );
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('navigationEntryService should be defined', () => {
    expect(navigationEntryService).toBeDefined();
  });

  it('prismaService should be defined', () => {
    expect(prismaService).toBeDefined();
  });

  describe('createNavigationEntry', () => {
    it('should create a new navigation entry successfully', async () => {
      prismaService.navigationEntry.findFirst = jest.fn().mockReturnValue(null);
      prismaService.navigationEntry.create = jest
        .fn()
        .mockReturnValue(createdNavigationEntry);

      const result = await navigationEntryService.createNavigationEntry(
        jwtContext,
        createNavigationEntryInputDto,
      );

      expect(result).toBeDefined();
      expect(result).toEqual(createdNavigationEntry);
    });

    it('should create a new navigation entry successfully on repetitive entry', async () => {
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
    });
  });

  describe('getNavigationEntry', () => {
    it('should get navigation entries successfully', async () => {
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
    });
  });
});
