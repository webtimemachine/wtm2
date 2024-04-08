import { ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient, UserType } from '@prisma/client';
import { CommonTestingModule } from '../../common/common.testing.module';
import { PrismaService } from '../../common/services';
import { LocalStrategy } from '../strategies';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  const prismaClient = new PrismaClient();

  const mockConflictException = new ConflictException();

  const accessToken = 'accessToken';
  const refreshToken = 'refreshToken';

  const existingUser = {
    id: BigInt(1),
    email: 'test@example.com',
    password: 'hashedPassword',
    userType: UserType.MEMBER,
    createdAt: new Date(),
    updateAt: new Date(),
    deletedAt: null,
    recoveryCode: null,
    verified: true,
    verificationCode: null,
    userPreferences: {
      id: BigInt(1),
      userId: BigInt(1),
      enableNavigationEntryExpiration: true,
      navigationEntryExpirationInDays: 120,
      createdAt: new Date(),
      updateAt: new Date(),
    },
  };

  const signUpDtoRequest = {
    email: 'test@example.com',
    password: 'password123',
  };

  const signUpResult = {
    id: 1,
    email: 'test@example.com',
  };

  const loginRequestDto = {
    email: existingUser.email,
    password: 'password123',
    deviceKey: '1234',
    userAgent: undefined,
  };

  const loginResult = {
    accessToken,
    refreshToken,
    user: {
      id: 1,
      email: 'test@example.com',
    },
    session: {
      userDevice: {
        id: 1,
        userId: 1,
        deviceId: 1,
        isCurrentDevice: true,
        deviceAlias: null,
        device: {
          id: 1,
          deviceKey: '1234',
        },
      },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CommonTestingModule.forTest(prismaClient)],
      providers: [AuthService, JwtService, LocalStrategy],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('authService should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('prismaService should be defined', () => {
    expect(prismaService).toBeDefined();
  });

  describe('signup', () => {
    it('should create a new user successfully', async () => {
      prismaService.$transaction = jest
        .fn()
        .mockReturnValue({ responseDto: signUpResult });

      const result = await authService.signup(signUpDtoRequest);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.email).toEqual(signUpDtoRequest.email);
    });

    it('should throw ConflictException when user already exists', async () => {
      prismaService.$transaction = jest
        .fn()
        .mockRejectedValue(mockConflictException);

      await expect(authService.signup(signUpDtoRequest)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    it('should login successfully and return tokens', async () => {
      prismaService.$transaction = jest.fn().mockReturnValue(loginResult);

      const { deviceKey, userAgent } = loginRequestDto;

      const result = await authService.login(
        deviceKey,
        userAgent,
        existingUser,
      );

      expect(result).toBeDefined();
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });
  });
});
