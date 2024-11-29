import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JWTPayload, PartialJwtContext } from '../interfaces';
import { PrismaService } from '../../common/services';
import { appEnv } from '../../config';

import { WebTMLogger } from '../../common/helpers/webtm-logger';

const jwtFromRequest = ExtractJwt.fromExtractors([
  ExtractJwt.fromAuthHeaderAsBearerToken(),
]);

@Injectable()
export class JwtVerificationTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-partial-token',
) {
  private readonly logger = new WebTMLogger(JwtVerificationTokenStrategy.name);

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
      const error = new UnauthorizedException(
        `Could not validate user from access token sub ${payload.sub}`,
      );
      this.logger.error(error);
      throw error;
    }

    return {
      payload,
      verificationToken,
      user,
    };
  }
}
