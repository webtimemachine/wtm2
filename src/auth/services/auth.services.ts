import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

import { PrismaService } from '../../common/services';
import {
  LoginRequestDto,
  LoginResponseDto,
  SignUpRequestDto,
  SignUpResponseDto,
} from '../dtos';
import { hashValue } from '../../common/helpers/bcryptjs.helper';
import { Session, User, UserType } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { JWTPayload } from '../interfaces';
import { appEnv } from '../../config';
import { JwtService } from '@nestjs/jwt';
import { createHash } from 'crypto';

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
              createdAt: new Date(),
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
      async (prismaService) => {
        await prismaService.session.deleteMany({
          where: { userId: BigInt(user.id) },
        });

        const session: Session = await prismaService.session.create({
          data: {
            userId: BigInt(user.id),
            deviceId: body.deviceId,
            refreshToken: '',
            createdAt: new Date(),
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

        await prismaService.session.update({
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
    return {
      accessToken,
      refreshToken,
      user: { email: user.email, id: Number(user.id) },
    };
  }

  async validateUserOrThrow(loginRequestDto: LoginRequestDto): Promise<User> {
    const user = await this.prismaService.user.findFirst({
      where: {
        email: loginRequestDto.email,
        deletedAt: null,
      },
    });

    if (!user) {
      this.logger.error('Unauthorized');
      throw new UnauthorizedException();
    }

    const passwordMatch = bcrypt.compareSync(
      loginRequestDto.password,
      user.password,
    );

    if (!passwordMatch) {
      this.logger.error('Unauthorized');
      throw new UnauthorizedException();
    }

    return {
      ...user,
    };
  }

  async validateJwtAccessPayloadOrThrow(payload: JWTPayload): Promise<User> {
    const user = await this.prismaService.user.findFirstOrThrow({
      where: { id: payload.userId, deletedAt: null },
    });
    return user;
  }

  async validateJwtRefreshPayloadOrThrow(
    payload: JWTPayload,
    refreshToken: string,
  ): Promise<User> {
    const user = await this.prismaService.user.findFirstOrThrow({
      where: { id: payload.userId, deletedAt: null },
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
