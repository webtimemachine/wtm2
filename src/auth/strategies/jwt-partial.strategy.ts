import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JWTPayload, PartialJwtContext } from '../interfaces';
import { PrismaService } from '../../common/services';
import { appEnv } from '../../config';

const jwtFromRequest = ExtractJwt.fromExtractors([
  ExtractJwt.fromAuthHeaderAsBearerToken(),
]);

@Injectable()
export class JwtVerificationTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-partial-token',
) {
  private readonly logger = new Logger(JwtVerificationTokenStrategy.name);

  constructor(private readonly prismaService: PrismaService) {
    super({
      jwtFromRequest,
      secretOrKey: appEnv.JWT_PARTIAL_SECRET,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  async validate(
    request: any,
    payload: JWTPayload,
  ): Promise<PartialJwtContext> {
    const verificationToken: string = jwtFromRequest(request) as string;
    const user = await this.prismaService.user.findFirst({
      where: {
        id: payload.userId,
        deletedAt: null,
      },
    });

    if (!user) {
      this.logger.error(
        `Could not validate user from access token sub ${payload.sub}`,
      );
      throw new UnauthorizedException('Authentication failed');
    }

    return {
      payload,
      verificationToken,
      user,
    };
  }
}
