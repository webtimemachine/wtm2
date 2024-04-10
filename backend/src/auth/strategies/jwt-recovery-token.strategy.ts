import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../common/services';
import { appEnv } from '../../config';
import { completeUserInclude } from '../../user/types';
import { JWTPayload } from '../interfaces';
import { RecoveryJwtContext } from '../interfaces/jwt-context.interface';

const jwtFromRequest = ExtractJwt.fromExtractors([
  ExtractJwt.fromAuthHeaderAsBearerToken(),
]);

@Injectable()
export class JwtRecoveryTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-recovery-token',
) {
  private readonly logger = new Logger(JwtRecoveryTokenStrategy.name);

  constructor(private readonly prismaService: PrismaService) {
    super({
      jwtFromRequest,
      secretOrKey: appEnv.JWT_RECOVERY_TOKEN_SECRET,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  async validate(
    request: any,
    payload: JWTPayload,
  ): Promise<RecoveryJwtContext> {
    const recoveryToken: string = jwtFromRequest(request) as string;
    const user = await this.prismaService.user.findFirstOrThrow({
      where: {
        id: payload.userId,
        deletedAt: null,
      },
      include: completeUserInclude,
    });

    return {
      payload,
      recoveryToken,
      user,
    };
  }
}
