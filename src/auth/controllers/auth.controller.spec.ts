import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';

import { AuthController } from './auth.controller';
import { AuthService } from '../services';
import { CommonTestingModule } from '../../common/common.testing.module';

describe('AuthController', () => {
  let authService: AuthService;
  let authController: AuthController;

  const prismaClient = new PrismaClient();

  const mockAuthService = {
    login: jest.fn(),
    signup: jest.fn(),
  };

  const accessToken = 'accessToken';
  const refreshToken = 'refreshToken';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CommonTestingModule.forTest(prismaClient)],
      controllers: [AuthController],
      providers: [AuthService, JwtService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    authService = module.get<AuthService>(AuthService);
    authController = module.get<AuthController>(AuthController);
  });

  it('authController should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('authService should be defined', () => {
    expect(authService).toBeDefined();
  });

  /**
   * SIGNUP TESTS
   */
  describe('signup', () => {
    it('should call authController.signup and return the result', async () => {
      const signUpDtoRequest = {
        email: 'example@email.com',
        password: '123456',
      };

      const signUpResult = {
        id: 1,
        email: 'example@email.com',
      };

      mockAuthService.signup.mockResolvedValue(signUpResult);

      const result = await authController.signup(signUpDtoRequest);

      expect(mockAuthService.signup).toHaveBeenCalledWith(signUpDtoRequest);
      expect(result).toEqual(signUpResult);
    });
  });

  /**
   * LOGIN TESTS
   */
  describe('login', () => {
    it('should call authController.login and return the result', async () => {
      const loginRequestDto = {
        email: 'email@email.com',
        password: '123456',
        deviceKey: '123456',
        userAgent: undefined,
      };

      const loginResponseDto = {
        id: 1,
        email: 'email@email.com',
        accessToken,
        refreshToken,
      };

      const req = {
        user: {
          id: 1,
          email: 'email@email.com',
        },
      };

      mockAuthService.login.mockResolvedValue(loginResponseDto);

      const result = await authController.login(req, loginRequestDto);

      expect(mockAuthService.login).toHaveBeenCalledWith(
        loginRequestDto.deviceKey,
        loginRequestDto.userAgent,
        req.user,
      );
      expect(result).toEqual(loginResponseDto);
    });
  });
});
