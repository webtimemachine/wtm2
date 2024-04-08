import { ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserType } from '@prisma/client';

import { EmailService, PrismaService } from '../../common/services';
import { LocalStrategy } from '../strategies';
import { AuthService } from './auth.service';
import { LoginResponseDto, SignUpResponseDto } from '../dtos';
import { MailerService } from '@nestjs-modules/mailer';

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
  });
});
