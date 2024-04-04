import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { JWTPayload, JwtContext, JwtRefreshContext } from '../interfaces';

import * as bcrypt from 'bcrypt';
import { plainToClassFromExist, plainToInstance } from 'class-transformer';
import { createHash } from 'crypto';

import { Device, UserDevice, UserType } from '@prisma/client';

import { UserService } from '../../user/services';
import {
  CompleteSession,
  CompleteUser,
  completeSessionInclude,
  completeUserDeviceInclude,
  completeUserInclude,
} from '../../user/types';

import {
  InitiatePasswordRecoveryDto,
  LoginRequestDto,
  LoginResponseDto,
  PasswordRecoveryCheckDto,
  RecoverNewPasswordDto,
  RecoveryResponseDto,
  SignUpRequestDto,
  SignUpResponseDto,
} from '../dtos';

import { RefreshResponseDto } from '../dtos';

import { hashValue } from '../../common/helpers/bcryptjs.helper';
import { EmailService, PrismaService } from '../../common/services';

import { DataResponse, MessageResponse } from '../../common/dtos';
import { generateNumericCode } from '../../common/helpers';
import { appEnv } from '../../config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async signup(requestSignupDto: SignUpRequestDto): Promise<SignUpResponseDto> {
    const { password, email } = requestSignupDto;

    const hashedPassword = hashValue(password);

    try {
      const { responseDto } = await this.prismaService.$transaction(
        async (prismaClient) => {
          const createdUser = await prismaClient.user.create({
            data: {
              email,
              password: hashedPassword,
              userType: UserType.MEMBER,
              userPreferences: {
                create: {},
              },
            },
          });

          const responseDto: SignUpResponseDto = plainToInstance(
            SignUpResponseDto,
            createdUser,
          );

          return { responseDto };
        },
      );

      return responseDto;
    } catch (error) {
      if (error?.code === 'P2002') {
        throw new ConflictException();
      } else {
        throw error;
      }
    }
  }

  async login(
    body: LoginRequestDto,
    user: CompleteUser,
  ): Promise<LoginResponseDto> {
    const { accessToken, refreshToken, session, payload } =
      await this.prismaService.$transaction(async (prismaClient) => {
        //

        let device: Device | null = await prismaClient.device.findUnique({
          where: {
            deviceKey: body.deviceKey,
          },
        });

        if (!device) {
          device = await prismaClient.device.create({
            data: {
              deviceKey: body.deviceKey,
              userAgent: body.userAgent,
            },
          });
        } else {
          if (body.userAgent && body.userAgent !== '') {
            device = await prismaClient.device.update({
              where: {
                deviceKey: body.deviceKey,
              },
              data: {
                userAgent: body.userAgent,
              },
            });
          }
        }

        let userDevice: UserDevice | null =
          await prismaClient.userDevice.findUnique({
            where: {
              userId_deviceId: {
                userId: user.id,
                deviceId: device.id,
              },
            },
          });

        if (!userDevice) {
          userDevice = await prismaClient.userDevice.create({
            data: {
              userId: user.id,
              deviceId: device.id,
            },
          });
        }

        await prismaClient.session.deleteMany({
          where: {
            userDevice: {
              device: {
                deviceKey: body.deviceKey,
              },
            },
          },
        });

        let session: CompleteSession = await prismaClient.session.create({
          data: {
            refreshToken: '',
            userDevice: {
              connect: {
                id: userDevice.id,
              },
            },
          },
          include: {
            userDevice: {
              include: completeUserDeviceInclude,
            },
          },
        });

        const payload: JWTPayload = {
          sub: user.email,
          userId: Number(user.id),
          userType: user.userType,
          sessionId: Number(session.id),
        };

        const accessToken = this.buildAccessToken(payload);
        const refreshToken = this.buildRefreshToken(payload);

        const { exp: expiration } = this.jwtService.decode(refreshToken) as {
          exp: number;
        };

        session = await prismaClient.session.update({
          where: {
            id: session.id,
          },
          data: {
            expiration: new Date(expiration * 1000),
            refreshToken: this.hashIt(refreshToken),
            updateAt: new Date(),
          },
          include: {
            userDevice: {
              include: completeUserDeviceInclude,
            },
          },
        });

        return { accessToken, refreshToken, payload, session };
      });

    return plainToInstance(LoginResponseDto, {
      accessToken,
      refreshToken,
      user: { email: user.email, id: Number(user.id) },
      userDevice: UserService.userDeviceToDto(
        {
          payload,
          session,
          user,
        },
        session.userDevice,
      ),
    });
  }

  async refreshToken(context: JwtRefreshContext): Promise<RefreshResponseDto> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { iat, exp, ...rest } = context.payload;
    const accessToken = this.buildAccessToken(rest);
    const refreshToken = this.buildRefreshToken(rest);

    const { exp: expiration } = this.jwtService.decode(refreshToken) as {
      exp: number;
    };

    await this.prismaService.session.update({
      where: {
        id: rest.sessionId,
      },
      data: {
        expiration: new Date(expiration * 1000),
        refreshToken: this.hashIt(refreshToken),
      },
    });
    return plainToInstance(RefreshResponseDto, {
      accessToken,
      refreshToken,
    });
  }

  async validateUserOrThrow(
    email: string,
    password: string,
  ): Promise<CompleteUser> {
    const user = await this.prismaService.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
      include: completeUserInclude,
    });

    if (!user) {
      this.logger.error('Unauthorized');
      throw new UnauthorizedException();
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      this.logger.error('Unauthorized');
      throw new UnauthorizedException();
    }

    return user;
  }

  async validateJwtAccessPayloadOrThrow(payload: JWTPayload) {
    const user: CompleteUser = await this.prismaService.user.findFirstOrThrow({
      where: { id: payload.userId, deletedAt: null },
      include: completeUserInclude,
    });

    if (!user.userPreferences) {
      const userPreferences = await this.prismaService.userPreferences.create({
        data: {
          userId: user.id,
        },
      });
      user.userPreferences = userPreferences;
    }

    const session: CompleteSession =
      await this.prismaService.session.findFirstOrThrow({
        where: { id: payload.sessionId },
        include: completeSessionInclude,
      });

    return { user, session };
  }

  async validateJwtRefreshPayloadOrThrow(
    payload: JWTPayload,
    refreshToken: string,
  ): Promise<CompleteUser> {
    const user: CompleteUser = await this.prismaService.user.findFirstOrThrow({
      where: { id: payload.userId, deletedAt: null },
      include: completeUserInclude,
    });

    if (!user) {
      this.logger.error('User does not exist');
      throw new UnauthorizedException();
    }

    await this.prismaService.session.findFirstOrThrow({
      where: { id: payload.sessionId, refreshToken: this.hashIt(refreshToken) },
    });

    return user;
  }

  async initiatePasswordRecovery(
    initiatePasswordRecoveryDto: InitiatePasswordRecoveryDto,
  ): Promise<MessageResponse> {
    const { email } = initiatePasswordRecoveryDto;
    const user = await this.prismaService.user.findFirstOrThrow({
      where: { email },
    });

    const recoveryCode = generateNumericCode(6);
    const hashedRecoveryCode = bcrypt.hashSync(
      recoveryCode,
      appEnv.BCRYPT_SALT,
    );

    await this.prismaService.$transaction(async (prismaClient) => {
      await prismaClient.user.update({
        where: {
          id: user.id,
        },
        data: {
          recoveryCode: hashedRecoveryCode,
        },
      });

      await prismaClient.session.deleteMany({
        where: {
          userDevice: {
            userId: user.id,
          },
        },
      });
    });

    await this.emailService.sendPasswordResetEmail(user.email, recoveryCode);

    return plainToClassFromExist(new MessageResponse(), {
      message: 'Password reset initialized',
    });
  }

  async validatePasswordRecovery(
    passwordRecoveryCheckDto: PasswordRecoveryCheckDto,
  ): Promise<DataResponse<RecoveryResponseDto>> {
    const { email, recoveryCode } = passwordRecoveryCheckDto;
    const user = await this.prismaService.user.findFirstOrThrow({
      where: { email, deletedAt: null },
    });

    if (
      !user.recoveryCode ||
      !bcrypt.compareSync(recoveryCode, user.recoveryCode)
    ) {
      throw new ForbiddenException();
    }
    await this.prismaService.$transaction(async (prismaClient) => {
      await prismaClient.user.update({
        where: {
          id: user.id,
        },
        data: {
          recoveryCode: null,
        },
      });

      await prismaClient.session.deleteMany({
        where: {
          userDevice: {
            userId: user.id,
          },
        },
      });
    });

    const recoveryPayload: JWTPayload = {
      sub: user.email,
      userType: user.userType,
      userId: Number(user.id),
    };

    const recoveryToken = this.buildRecoveryToken(recoveryPayload);

    return plainToClassFromExist(
      new DataResponse<RecoveryResponseDto>(RecoveryResponseDto),
      {
        data: { recoveryToken },
      },
    );
  }

  async completePasswordRecovery(
    context: JwtContext,
    recoverNewPasswordDto: RecoverNewPasswordDto,
  ): Promise<DataResponse<LoginResponseDto>> {
    const { password, verificationPassword, deviceKey, userAgent } =
      recoverNewPasswordDto;
    const { user } = context;
    if (password !== verificationPassword) throw new ForbiddenException();
    const hashedPassword = bcrypt.hashSync(password, appEnv.BCRYPT_SALT);
    const updatedUser = await this.prismaService.$transaction(
      async (prismaClient) => {
        await prismaClient.user.update({
          where: {
            id: user.id,
          },
          data: {
            recoveryCode: null,
            password: hashedPassword,
          },
        });

        await prismaClient.session.deleteMany({
          where: {
            userDevice: {
              userId: user.id,
            },
          },
        });
      },
    );
    const { accessToken, refreshToken } = await this.performLoginTransaction(
      deviceKey,
      userAgent,
      user,
    );

    return plainToClassFromExist(
      new DataResponse<LoginResponseDto>(LoginResponseDto),
      {
        data: {
          accessToken,
          refreshToken,
          user: updatedUser,
        },
      },
    );
  }

  private hashIt(payload: string): string {
    return createHash('sha256').update(payload).digest('hex');
  }

  private buildRefreshToken(payload: JWTPayload): string {
    return this.jwtService.sign(payload, {
      secret: appEnv.JWT_REFRESH_SECRET,
      expiresIn: appEnv.JWT_REFRESH_EXPIRATION,
    });
  }

  private buildAccessToken(payload: JWTPayload): string {
    return this.jwtService.sign(payload, {
      secret: appEnv.JWT_ACCESS_SECRET,
      expiresIn: appEnv.JWT_ACCESS_EXPIRATION,
    });
  }

  private buildRecoveryToken(payload: JWTPayload): string {
    return this.jwtService.sign(payload, {
      secret: appEnv.JWT_RECOVERY_TOKEN_SECRET,
      expiresIn: appEnv.JWT_RECOVERY_TOKEN_EXPIRATION,
    });
  }

  private async performLoginTransaction(
    deviceKey: string,
    userAgent: string | undefined,
    user: CompleteUser,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    session: CompleteSession;
    payload: JWTPayload;
  }> {
    return await this.prismaService.$transaction(async (prismaClient) => {
      let device: Device | null = await prismaClient.device.findUnique({
        where: {
          deviceKey,
        },
      });

      if (!device) {
        device = await prismaClient.device.create({
          data: {
            deviceKey,
            userAgent,
          },
        });
      } else {
        if (userAgent && userAgent !== '') {
          device = await prismaClient.device.update({
            where: {
              deviceKey,
            },
            data: {
              userAgent,
            },
          });
        }
      }

      let userDevice: UserDevice | null =
        await prismaClient.userDevice.findUnique({
          where: {
            userId_deviceId: {
              userId: user.id,
              deviceId: device.id,
            },
          },
        });

      if (!userDevice) {
        userDevice = await prismaClient.userDevice.create({
          data: {
            userId: user.id,
            deviceId: device.id,
          },
        });
      }

      await prismaClient.session.deleteMany({
        where: {
          userDevice: {
            device: {
              deviceKey: deviceKey,
            },
          },
        },
      });

      let session: CompleteSession = await prismaClient.session.create({
        data: {
          refreshToken: '',
          userDevice: {
            connect: {
              id: userDevice.id,
            },
          },
        },
        include: {
          userDevice: {
            include: completeUserDeviceInclude,
          },
        },
      });

      const payload: JWTPayload = {
        sub: user.email,
        userId: Number(user.id),
        userType: user.userType,
        sessionId: Number(session.id),
      };

      const accessToken = this.buildAccessToken(payload);
      const refreshToken = this.buildRefreshToken(payload);

      const { exp: expiration } = this.jwtService.decode(refreshToken) as {
        exp: number;
      };

      session = await prismaClient.session.update({
        where: {
          id: session.id,
        },
        data: {
          expiration: new Date(expiration * 1000),
          refreshToken: this.hashIt(refreshToken),
          updateAt: new Date(),
        },
        include: {
          userDevice: {
            include: completeUserDeviceInclude,
          },
        },
      });

      return { accessToken, refreshToken, payload, session };
    });
  }
}
