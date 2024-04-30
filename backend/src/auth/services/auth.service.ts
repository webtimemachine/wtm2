import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import {
  JWTPayload,
  JwtContext,
  JwtRefreshContext,
  PartialJwtContext,
} from '../interfaces';

import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { createHash } from 'crypto';

import { Device, Session, UserDevice, UserType } from '@prisma/client';

import { UserService } from '../../user/services';
import {
  CompleteSession,
  CompleteUser,
  completeSessionInclude,
  completeUserDeviceInclude,
  completeUserInclude,
} from '../../user/types';

import {
  LoginResponseDto,
  RecoverPasswordDto,
  RecoveryValidationResponseDto,
  RestorePasswordDto,
  SignUpRequestDto,
  SignUpResponseDto,
  ValidateRecoveryCodeDto,
  VerifyAccountDto,
} from '../dtos';

import { RefreshResponseDto } from '../dtos';

import { hashValue } from '../../common/helpers/bcryptjs.helper';
import { EmailService, PrismaService } from '../../common/services';

import { MessageResponse } from '../../common/dtos';
import { generateNumericCode } from '../../common/helpers';
import { appEnv } from '../../config';
import { CompleteSessionDto } from '../dtos/complete-session.dto';
import { LogoutSessionInputDto } from '../dtos/logout-session.input.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  static completeSessionToDto(
    jwtContext: JwtContext,
    completeSession: CompleteSession,
  ): CompleteSessionDto {
    const userDeviceDto = UserService.userDeviceToDto(
      jwtContext,
      completeSession.userDevice,
    );

    const completeSessionDto = plainToInstance(CompleteSessionDto, {
      ...completeSession,
      id: Number(completeSession.id),
      userDeviceId: Number(completeSession.userDeviceId),
    });
    completeSessionDto.userDevice = userDeviceDto;
    return completeSessionDto;
  }

  static completeSessionsToDtos(
    jwtContext: JwtContext,
    completeSession: CompleteSession[],
  ): CompleteSessionDto[] {
    return completeSession.map((completeSession) =>
      AuthService.completeSessionToDto(jwtContext, completeSession),
    );
  }

  private hashIt(payload: string): string {
    return createHash('sha256').update(payload).digest('hex');
  }

  private buildRefreshToken(payload: JWTPayload): string {
    return this.jwtService.sign(payload, {
      secret: appEnv.JWT_REFRESH_SECRET,
      ...(payload?.exp ? {} : { expiresIn: appEnv.JWT_REFRESH_EXPIRATION }),
    });
  }

  private buildAccessToken(payload: JWTPayload): string {
    return this.jwtService.sign(payload, {
      secret: appEnv.JWT_ACCESS_SECRET,
      expiresIn: appEnv.JWT_ACCESS_EXPIRATION,
    });
  }

  private getPartialToken(payload: JWTPayload) {
    return this.jwtService.sign(payload, {
      secret: appEnv.JWT_PARTIAL_SECRET,
      expiresIn: appEnv.JWT_PARTIAL_EXPIRATION,
    });
  }

  private buildRecoveryToken(payload: JWTPayload): string {
    return this.jwtService.sign(payload, {
      secret: appEnv.JWT_RECOVERY_TOKEN_SECRET,
      expiresIn: appEnv.JWT_RECOVERY_TOKEN_EXPIRATION,
    });
  }

  async signup(requestSignupDto: SignUpRequestDto): Promise<SignUpResponseDto> {
    const { password, email } = requestSignupDto;
    const hashedPassword = hashValue(password);
    const verificationCode = generateNumericCode(6);

    try {
      const { responseDto } = await this.prismaService.$transaction(
        async (prismaClient) => {
          const createdUser = await prismaClient.user.create({
            data: {
              email,
              verificationCode: hashValue(verificationCode),
              verified: false,
              password: hashedPassword,
              userType: UserType.MEMBER,
              userPreferences: {
                create: {},
              },
            },
          });

          const verificationPayload: JWTPayload = {
            userId: Number(createdUser.id),
            sub: createdUser.email,
            userType: 'MEMBER',
          };
          const partialToken = this.getPartialToken(verificationPayload);

          const responseDto: SignUpResponseDto = plainToInstance(
            SignUpResponseDto,
            {
              id: Number(createdUser.id),
              email: createdUser.email,
              partialToken,
            },
          );

          return { responseDto };
        },
      );

      await this.emailService.sendVerificationCodeEmail(
        email,
        verificationCode,
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
    deviceKey: string,
    userAgent: string | undefined,
    userAgentData: string | undefined,
    user: CompleteUser,
  ): Promise<LoginResponseDto | SignUpResponseDto> {
    if (!user.verified) {
      const verificationPayload: JWTPayload = {
        userId: Number(user.id),
        sub: user.email,
        userType: user.userType,
      };
      const partialToken = this.getPartialToken(verificationPayload);
      return plainToInstance(SignUpResponseDto, {
        id: Number(user.id),
        email: user.email,
        partialToken,
      });
    }

    const { accessToken, refreshToken, session, payload } =
      await this.prismaService.$transaction(async (prismaClient) => {
        //
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
              userAgentData,
            },
          });
        } else {
          if (
            (userAgent && userAgent !== '') ||
            (userAgentData && userAgentData !== '')
          ) {
            device = await prismaClient.device.update({
              where: {
                deviceKey,
              },
              data: {
                userAgent,
                userAgentData,
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
                deviceKey,
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

  async logout(jwtContext: JwtContext): Promise<MessageResponse> {
    const deletedSession = await this.prismaService.session.delete({
      where: {
        id: jwtContext.session.id,
      },
    });

    if (deletedSession) {
      return plainToInstance(MessageResponse, {
        message: 'Logout successfully',
      });
    } else {
      throw new NotFoundException();
    }
  }

  async refreshToken(context: JwtRefreshContext): Promise<RefreshResponseDto> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { iat, exp, ...rest } = context.payload;
    const accessToken = this.buildAccessToken(rest);
    const refreshToken = this.buildRefreshToken({ ...rest, exp });

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

  async recoverPassword(
    recoverPasswordDto: RecoverPasswordDto,
  ): Promise<MessageResponse> {
    const { email } = recoverPasswordDto;
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException();
    }

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

    return plainToInstance(MessageResponse, {
      message: 'Recovery code sent to your email',
    });
  }

  async validateRecoveryCode(
    validateRecoveryCodeDto: ValidateRecoveryCodeDto,
  ): Promise<RecoveryValidationResponseDto> {
    const { email, recoveryCode } = validateRecoveryCodeDto;
    const user = await this.prismaService.user.findUnique({
      where: { email, deletedAt: null },
    });

    if (
      !user ||
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

    return plainToInstance(RecoveryValidationResponseDto, {
      recoveryToken,
    });
  }

  async restorePassword(
    jwtContext: JwtContext,
    restorePasswordDto: RestorePasswordDto,
  ): Promise<LoginResponseDto | SignUpResponseDto> {
    const { user } = jwtContext;
    const {
      password,
      verificationPassword,
      deviceKey,
      userAgent,
      userAgentData,
    } = restorePasswordDto;

    if (password !== verificationPassword) throw new ForbiddenException();
    const hashedPassword = bcrypt.hashSync(password, appEnv.BCRYPT_SALT);
    const { updatedUser } = await this.prismaService.$transaction(
      async (prismaClient) => {
        await prismaClient.session.deleteMany({
          where: {
            userDevice: {
              userId: user.id,
            },
          },
        });

        const updatedUser: CompleteUser = await prismaClient.user.update({
          where: {
            id: user.id,
          },
          data: {
            recoveryCode: null,
            password: hashedPassword,
          },
          include: completeUserInclude,
        });

        return { updatedUser };
      },
    );

    return await this.login(deviceKey, userAgent, userAgentData, updatedUser);
  }

  async verifyAccount(
    jwtContext: PartialJwtContext,
    verifyEmailDto: VerifyAccountDto,
  ): Promise<LoginResponseDto> {
    let { user } = jwtContext;
    if (user.verified) {
      throw new BadRequestException('Email already verified');
    }
    const {
      verificationCode: bodyCode,
      deviceKey,
      userAgent,
      userAgentData,
    } = verifyEmailDto;
    const databaseCode = user.verificationCode || '';

    if (!bcrypt.compareSync(bodyCode, databaseCode)) {
      throw new BadRequestException('Invalid verification code');
    }

    user = await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        verified: true,
        verificationCode: null,
      },
      include: completeUserInclude,
    });

    const loginResponse: LoginResponseDto = (await this.login(
      deviceKey,
      userAgent,
      userAgentData,
      user,
    )) as LoginResponseDto;
    return loginResponse;
  }

  async resendVerificationEmail(
    jwtContext: PartialJwtContext,
  ): Promise<MessageResponse> {
    const { user } = jwtContext;
    if (user.verified) throw new ConflictException('Account already verified');
    const verificationCode = generateNumericCode(6);
    const verificationCodeHash = bcrypt.hashSync(
      verificationCode,
      appEnv.BCRYPT_SALT,
    );
    await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        verificationCode: verificationCodeHash,
      },
    });
    await this.emailService.sendVerificationCodeEmail(
      user.email,
      verificationCode,
    );
    return plainToInstance(MessageResponse, {
      message: 'Verification code email succesfully sent',
    });
  }

  async getActiveSessions(
    jwtContext: JwtContext,
  ): Promise<CompleteSessionDto[]> {
    const completeSessions: CompleteSession[] =
      await this.prismaService.session.findMany({
        where: {
          userDevice: {
            userId: jwtContext.user.id,
          },
        },
        include: completeSessionInclude,
        orderBy: {
          createdAt: 'desc',
        },
      });

    return AuthService.completeSessionsToDtos(jwtContext, completeSessions);
  }

  async logoutSession(
    logoutSessionInputDto: LogoutSessionInputDto,
  ): Promise<MessageResponse> {
    const { sessionIds } = logoutSessionInputDto;

    const { deletedSessions } = await this.prismaService.$transaction(
      async (prismaClient) => {
        const deletedSessions: Session[] = [];
        for (const sessionId of sessionIds) {
          const deletedSession = await prismaClient.session.delete({
            where: {
              id: sessionId,
            },
          });
          deletedSessions.push(deletedSession);
        }
        return { deletedSessions };
      },
    );

    if (deletedSessions?.length > 0) {
      return plainToInstance(MessageResponse, {
        message: 'Logout successfully',
      });
    } else {
      throw new NotFoundException();
    }
  }
}
