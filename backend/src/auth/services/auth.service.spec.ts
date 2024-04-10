import { ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserType } from '@prisma/client';

import { EmailService, PrismaService } from '../../common/services';
import { LocalStrategy } from '../strategies';
import { AuthService } from './auth.service';
import { LoginResponseDto, SignUpResponseDto } from '../dtos';
import { MailerService } from '@nestjs-modules/mailer';
import { CompleteSession } from 'src/user/types';
import { CompleteSessionDto } from '../dtos/complete-session.dto';
import { plainToInstance } from 'class-transformer';
import { JwtContext } from '../interfaces';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

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
    verificationCode: '1234',
    userPreferences: {
      id: BigInt(1),
      userId: BigInt(1),
      enableNavigationEntryExpiration: true,
      navigationEntryExpirationInDays: 120,
      createdAt: new Date(),
      updateAt: new Date(),
    },
  };

  const nonVerifiedUser = {
    id: BigInt(1),
    email: 'test@example.com',
    password: 'hashedPassword',
    userType: UserType.MEMBER,
    createdAt: new Date(),
    updateAt: new Date(),
    deletedAt: null,
    recoveryCode: null,
    verified: false,
    verificationCode: '1234',
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
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        LocalStrategy,
        EmailService,
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
        PrismaService,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
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

      if (result instanceof LoginResponseDto) {
        expect(result.accessToken).toBeDefined();
        expect(result.refreshToken).toBeDefined();
      } else {
        fail('Expected result to be an instance of LoginResponseDto');
      }
    });

    it('should return SignUpResponseDto when user is not verified', async () => {
      prismaService.$transaction = jest.fn().mockReturnValue(signUpResult);

      const { deviceKey, userAgent } = loginRequestDto;
      (jwtService.sign as jest.Mock).mockReturnValue('mockedToken');
      const result = await authService.login(
        deviceKey,
        userAgent,
        nonVerifiedUser,
      );

      if (result instanceof SignUpResponseDto) {
        expect(result.id).toBeDefined();
        expect(result.email).toEqual(loginRequestDto.email);
        expect(result.partialToken).toBeDefined();
      } else {
        fail('Expected result to be an instance of SignUpResponseDto');
      }
    });

    it('should return active sessions', async () => {
      const jwtContext: JwtContext = {
        payload: {
          sub: 'test@test.com',
          userId: 1,
          userType: 'MEMBER',
          sessionId: 1,
          iat: 1712672751,
          exp: 1712701551,
        },
        user: {
          id: BigInt(1),
          userType: 'MEMBER',
          email: 'test@test.com',
          password: '****',
          recoveryCode: null,
          verified: true,
          verificationCode: null,
          createdAt: new Date('2024-04-08T16:58:29.000Z'),
          updateAt: new Date('2024-04-08T19:50:40.000Z'),
          deletedAt: null,
          userPreferences: {
            id: BigInt(1),
            userId: BigInt(1),
            enableNavigationEntryExpiration: false,
            navigationEntryExpirationInDays: null,
            createdAt: new Date('2024-04-08T16:58:29.000Z'),
            updateAt: new Date('2024-04-08T16:58:29.000Z'),
          },
        },
        session: {
          id: BigInt(1),
          refreshToken: 'refreshToken',
          userDeviceId: BigInt(1),
          expiration: new Date('2024-05-09T14:25:51.000Z'),
          createdAt: new Date('2024-04-09T14:25:20.000Z'),
          updateAt: new Date('2024-04-09T14:25:52.000Z'),
          userDevice: {
            id: BigInt(1),
            deviceAlias: null,
            userId: BigInt(1),
            deviceId: BigInt(1),
            createdAt: new Date('2024-04-09T14:25:20.000Z'),
            updateAt: new Date('2024-04-09T14:25:20.000Z'),
            device: {
              id: BigInt(1),
              deviceKey: 'local',
              userAgent:
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
              createdAt: new Date('2024-04-09T14:25:20.000Z'),
              updateAt: new Date('2024-04-09T14:25:20.000Z'),
            },
          },
        },
      };

      const completeSession: CompleteSession = {
        id: BigInt(1),
        refreshToken: 'refreshToken',
        userDeviceId: BigInt(1),
        expiration: new Date('2024-05-09T14:23:46.000Z'),
        createdAt: new Date('2024-04-09T14:23:46.000Z'),
        updateAt: new Date('2024-04-09T14:23:46.000Z'),
        userDevice: {
          id: BigInt(1),
          deviceAlias: null,
          userId: BigInt(1),
          deviceId: BigInt(1),
          createdAt: new Date('2024-04-08T16:58:34.000Z'),
          updateAt: new Date('2024-04-08T16:58:34.000Z'),
          device: {
            id: BigInt(1),
            deviceKey: 'local',
            userAgent:
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
            createdAt: new Date('2024-04-08T16:58:34.000Z'),
            updateAt: new Date('2024-04-09T14:23:46.000Z'),
          },
        },
      };

      const expectedDto: CompleteSessionDto = plainToInstance(
        CompleteSessionDto,
        {
          id: 1,
          userDeviceId: 1,
          expiration: new Date('2024-05-09T14:23:46.000Z'),
          createdAt: new Date('2024-04-09T14:23:46.000Z'),
          updateAt: new Date('2024-04-09T14:23:46.000Z'),
          userDevice: {
            id: 1,
            userId: 1,
            deviceId: 1,
            isCurrentDevice: true,
            deviceAlias: null,
            device: {
              id: 1,
              deviceKey: 'local',
              userAgent:
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
            },
          },
        },
      );

      prismaService.session.findMany = jest
        .fn()
        .mockResolvedValueOnce([completeSession]);

      const result = await authService.getActiveSessions(jwtContext);

      expect(result).toEqual([expectedDto]);
      expect(prismaService.session.findMany).toHaveBeenCalledWith({
        where: { userDevice: { userId: jwtContext.user.id } },
        include: expect.any(Object),
      });
    });
  });
});
