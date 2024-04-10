import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtRefreshContext, JWTPayload } from '../interfaces';
import { AuthService } from '../services';
import { appEnv } from '../../config';

@Injectable()
export class JWTRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  private static jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: JWTRefreshStrategy.jwtFromRequest,
      ignoreExpiration: false,
      secretOrKey: appEnv.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(
    request: any, // eslint-disable-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    payload: JWTPayload,
  ): Promise<JwtRefreshContext> {
    try {
      const refreshToken: string | null =
        JWTRefreshStrategy.jwtFromRequest(request);

      if (!refreshToken) throw new Error();

      const user = await this.authService.validateJwtRefreshPayloadOrThrow(
        payload,
        refreshToken,
      );
      return {
        payload,
        user,
      };
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
