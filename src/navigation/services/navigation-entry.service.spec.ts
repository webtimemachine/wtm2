import { Test, TestingModule } from '@nestjs/testing';
import { CommonTestingModule } from '../../common/common.testing.module';
import { PrismaService } from '../../common/services';
import { NavigationEntry, PrismaClient, UserType } from '@prisma/client';
import { NavigationEntryService } from './navigation-entry.service';
import { JWTPayload, JwtContext } from 'src/auth/interfaces';
import { CreateNavigationEntryInputDto, NavigationEntryDto } from '../dtos';
import { PaginationResponse } from 'src/common/dtos';
import { GetNavigationEntryDto } from '../dtos/get-navigation-entry.dto';
import { plainToInstance } from 'class-transformer';

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
};

const createNavigationEntryInputDto: CreateNavigationEntryInputDto = {
  url: 'example.com',
  title: 'Example Title',
  navigationDate: new Date(),
};

const jwtContext: JwtContext = { user: existingUser, payload: mockJWTPayload };

const createdNavigationEntry: NavigationEntryDto = {
  id: 1,
  url: 'example.com',
  title: 'Example Title',
  userId: 1,
  userAgent: 'Chrome/121.0.6167.161',
  navigationDate: new Date(),
};

const mockedEntry = {
  id: BigInt(1),
  url: 'example1.com',
  title: 'Example Title 1',
  content: 'Content 1',
  navigationDate: new Date('2024-02-09T12:00:00Z'),
  userId: BigInt(1),
  userAgent: 'Chrome/121.0.6167.161',
  createdAt: new Date('2024-02-09T12:00:00Z'),
  updateAt: null,
};

const mockedEntries: NavigationEntry[] = [
  mockedEntry,
  mockedEntry,
  mockedEntry,
];

const navigationEntryDtos = plainToInstance(
  NavigationEntryDto,
  mockedEntries.map((navigationEntry) => ({
    ...navigationEntry,
    id: Number(navigationEntry.id),
    userId: Number(navigationEntry.userId),
  })),
);

const expectedResponse: PaginationResponse<NavigationEntryDto> = {
  offset: 0,
  limit: 10,
  count: mockedEntries.length,
  items: navigationEntryDtos,
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
