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
import { CompleteNavigationEntry, RawCompleteNavigationEntry } from '../types';
import { NavigationEntryService } from './navigation-entry.service';

import { JWTPayload, JwtContext } from '../../auth/interfaces';
import { CompleteUser } from '../../user/types';

jest.mock('../../common/services/prisma.service');

const mockJWTPayload: JWTPayload = {
  sub: 'mock-subject',
  userId: 123,
  userType: UserType.MEMBER,
  sessionId: 456,
};

const existingUser: CompleteUser = {
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
  displayname: 'test',
  passChangedAt: new Date(),
  profilePicture: 'profilePicture',
  userPreferences: {
    id: BigInt(1),
    userId: BigInt(1),
    enableNavigationEntryExpiration: false,
    navigationEntryExpirationInDays: 120,
    enableImageEncoding: true,
    enableExplicitContentFilter: true,
    enableStopTracking: true,
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
  url: 'https://example.com',
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
  url: 'https://example.com',
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
  aiGeneratedContent: 'AI Generated Content',
  tags: [],
};

const mockedEntry: CompleteNavigationEntry = {
  id: BigInt(1),
  url: 'example1.com',
  title: 'Example Title 1',
  titleLower: 'example title 1',
  liteMode: true,
  navigationDate: new Date('2024-02-09T12:00:00Z'),
  userId: BigInt(1),
  userDeviceId: BigInt(1),
  createdAt: new Date('2024-02-09T12:00:00Z'),
  aiGeneratedContent: 'AI Generated Content 1',
  updateAt: null,
  imageCaptions: [],
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

const mockedRawEntry: RawCompleteNavigationEntry = {
  navigationEntryId: BigInt(1),
  navigationEntryUrl: 'example1.com',
  navigationEntryTitle: 'Example Title 1',
  navigationEntryTitleLower: 'example title 1',
  navigationEntryLiteMode: true,
  navigationEntryNavigationDate: new Date('2024-02-09T12:00:00Z'),
  navigationEntryUserId: BigInt(1),
  navigationEntryUserDeviceId: BigInt(1),
  navigationEntryCreatedAt: new Date('2024-02-09T12:00:00Z'),
  navigationEntryAIGeneratedContent: 'AI Generated Content 1',
  navigationEntryUpdateAt: null,
  userDeviceId: BigInt(1),
  userDeviceUserId: BigInt(1),
  userDeviceDeviceId: BigInt(1),
  userDeviceDeviceAlias: 'Personal Computer',
  userDeviceCreatedAt: new Date(),
  userDeviceUpdateAt: new Date(),

  deviceId: BigInt(1),
  deviceDeviceKey: '123',
  deviceUserAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  deviceUserAgentData:
    '{"brands":[{"brand":"Chromium","version":"124"},{"brand":"Google Chrome","version":"124"},{"brand":"Not-A.Brand","version":"99"}],"mobile":false,"platform":"Windows"}',
  deviceCreatedAt: new Date(),
  deviceUpdateAt: new Date(),

  entryTagId: null,
  entryTagEntryId: null,
  entryTagTagId: null,
  tagId: null,
  tagName: null,
};

const mockedEntries: CompleteNavigationEntry[] = [
  mockedEntry,
  { ...mockedEntry, id: BigInt(2) },
  { ...mockedEntry, id: BigInt(3) },
];

const mockedRawEntries: RawCompleteNavigationEntry[] = [
  mockedRawEntry,
  { ...mockedRawEntry, navigationEntryId: BigInt(2) },
  { ...mockedRawEntry, navigationEntryId: BigInt(3) },
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

jest.mock('@langchain/openai', () => {
  return {
    OpenAI: jest.fn().mockImplementation(() => {
      return {
        invoke: jest.fn().mockResolvedValue(
          JSON.stringify({
            data: {
              content: 'relevant content',
              tags: [],
              source: 'example1.com',
            },
          }),
        ),
      };
    }),
    ChatOpenAI: jest.fn().mockImplementation(() => {
      return {
        call: jest.fn(() => Promise.resolve({})),
      };
    }),
  };
});

describe('NavigationEntryService', () => {
  let navigationEntryService: NavigationEntryService;
  let prismaService: PrismaService;
  let explicitFilterService: ExplicitFilterService;

  const prismaClient = new PrismaClient();

  beforeEach(async () => {
    const commonTestModule = CommonTestingModule.forTest(prismaClient);
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        commonTestModule,
        ExplicitFilterTestingModule.forTest(commonTestModule),
      ],
      providers: [NavigationEntryService],
    }).compile();

    navigationEntryService = module.get<NavigationEntryService>(
      NavigationEntryService,
    );
    prismaService = module.get<PrismaService>(PrismaService);
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

  it('explicitFilterService should be defined', () => {
    expect(explicitFilterService).toBeDefined();
  });

  describe('createNavigationEntry', () => {
    it('should create a new navigation entry successfully', async () => {
      const mockCreateMany = jest.fn();
      const mockFilter = jest
        .spyOn(explicitFilterService, 'filter')
        .mockImplementation();
      prismaService.tag.createMany = mockCreateMany;
      prismaService.tag.findMany = jest.fn().mockReturnValue([{ id: 1 }]);
      prismaService.entryTag.createMany = jest.fn();
      prismaService.navigationEntry.findFirst = jest
        .fn()
        .mockReturnValue(mockedEntry);
      prismaService.$transaction = jest
        .fn()
        .mockImplementation(async (callback) => {
          prismaService.navigationEntry.create = jest
            .fn()
            .mockResolvedValueOnce(createdNavigationEntry);

          prismaService.navigationEntry.count = jest.fn().mockReturnValue(1);

          return callback(prismaService);
        });
      prismaService.userPreferences.findFirst = jest.fn().mockResolvedValue({
        enableImageEncoding: true,
        enableExplicitContentFilter: true,
      });
      await navigationEntryService.createNavigationEntry(
        jwtContext,
        createNavigationEntryInputDto,
      );
      expect(mockFilter).toHaveBeenCalledWith(
        'Test content',
        'https://example.com',
      );
    });

    it('should create a new navigation entry successfully on repetitive entry', async () => {
      const mockFilter = jest
        .spyOn(explicitFilterService, 'filter')
        .mockImplementation();
      prismaService.navigationEntry.findFirst = jest
        .fn()
        .mockReturnValue(createdNavigationEntry);
      prismaService.$transaction = jest
        .fn()
        .mockImplementation(async (callback) => {
          prismaService.navigationEntry.update = jest
            .fn()
            .mockResolvedValueOnce(createdNavigationEntry);

          prismaService.entryTag.deleteMany = jest
            .fn()
            .mockResolvedValueOnce({ count: 1 });

          prismaService.navigationEntry.create = jest
            .fn()
            .mockResolvedValueOnce(createdNavigationEntry);

          return callback(prismaService);
        });

      prismaService.userPreferences.findFirst = jest.fn().mockResolvedValue({
        enableImageEncoding: true,
        enableExplicitContentFilter: true,
      });
      await navigationEntryService.createNavigationEntry(
        jwtContext,
        createNavigationEntryInputDto,
      );
      expect(mockFilter).toHaveBeenCalledWith(
        'Test content',
        'https://example.com',
      );
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

      prismaService.$queryRawUnsafe = jest.fn((query: string) => {
        if (query.toLocaleLowerCase().includes('count')) {
          return Promise.resolve([{ count: mockedRawEntries.length }]);
        }

        if (query.toLocaleLowerCase().includes('select')) {
          return Promise.resolve(mockedRawEntries);
        }

        return Promise.reject(new Error(`Unexpected query: ${query}`));
      }) as unknown as typeof prismaService.$queryRawUnsafe;

      const result = await navigationEntryService.getNavigationEntry(
        jwtContext,
        queryParams,
      );

      expect(result).toBeDefined();
      expect(result).toEqual(expectedResponse);
    });
  });
});
