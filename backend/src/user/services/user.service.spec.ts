import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient, UserType } from '@prisma/client';

import { JWTPayload, JwtContext } from '../../auth/interfaces';

import { PrismaService } from '../../common/services';
import { CommonTestingModule } from '../../common/common.testing.module';

import { UserService } from './user.service';

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

const jwtContext: JwtContext = {
  user: existingUser,
  session: mockedSession,
  payload: mockJWTPayload,
};

const expectResponse = {
  statusCode: undefined,
  message: 'User deleted',
  error: undefined,
};

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;

  const prismaClient = new PrismaClient();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CommonTestingModule.forTest(prismaClient)],
      providers: [UserService],
    }).compile();

    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('navigationEntryService should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('prismaService should be defined', () => {
    expect(prismaService).toBeDefined();
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      prismaService.userPreferences.deleteMany = jest
        .fn()
        .mockResolvedValue(true);
      prismaService.navigationEntry.deleteMany = jest
        .fn()
        .mockResolvedValue(true);
      prismaService.session.deleteMany = jest.fn().mockResolvedValue(true);
      prismaService.userDevice.deleteMany = jest.fn().mockResolvedValue(true);
      prismaService.user.deleteMany = jest.fn().mockResolvedValue(true);
      prismaService.device.findMany = jest
        .fn()
        .mockResolvedValue([{ id: 'device1' }]);
      prismaService.device.deleteMany = jest.fn().mockResolvedValue(true);

      const result = await userService.delete(jwtContext);

      expect(result).toBeDefined();
      expect(result).toEqual(expectResponse);
    });
  });
});
