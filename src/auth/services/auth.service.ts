import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

import { PrismaService } from '../../common/services';
import { Device, Session, User, UserDevice, UserType } from '@prisma/client';

import {
  CompleteSession,
  CompleteUser,
  completeSessionInclude,
  completeUserInclude,
} from '../../user/types';

import {
  LoginRequestDto,
  LoginResponseDto,
  SignUpRequestDto,
  SignUpResponseDto,
} from '../dtos';

import { plainToInstance } from 'class-transformer';
import { JWTPayload, JwtRefreshContext } from '../interfaces';
import { JwtService } from '@nestjs/jwt';
import { createHash } from 'crypto';
import { RefreshResponseDto } from '../dtos';

import { hashValue } from '../../common/helpers/bcryptjs.helper';
import * as bcrypt from 'bcrypt';

import { appEnv } from '../../config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
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

  async login(body: LoginRequestDto, user: User): Promise<LoginResponseDto> {
    const { accessToken, refreshToken } = await this.prismaService.$transaction(
      async (prismaClient) => {
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

        const session: Session = await prismaClient.session.create({
          data: {
            refreshToken: '',
            userDevice: {
              connect: {
                id: userDevice.id,
              },
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

        await prismaClient.session.update({
          where: {
            id: session.id,
          },
          data: {
            expiration: new Date(expiration * 1000),
            refreshToken: this.hashIt(refreshToken),
            updateAt: new Date(),
          },
        });

        return { accessToken, refreshToken };
      },
    );

    return plainToInstance(LoginResponseDto, {
      accessToken,
      refreshToken,
      user: { email: user.email, id: Number(user.id) },
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

  async validateUserOrThrow(email: string, password: string): Promise<User> {
    const user = await this.prismaService.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
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

    return {
      ...user,
    };
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
}
