import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtContext, JWTPayload } from '../interfaces';
import { AuthService } from '../services';
import { appEnv } from '../../config';

@Injectable()
export class JWTAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access-token',
) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appEnv.JWT_ACCESS_SECRET,
    });
  }

  async validate(payload: JWTPayload): Promise<JwtContext> {
    try {
      const { user, session } =
        await this.authService.validateJwtAccessPayloadOrThrow(payload);

      return {
        payload,
        user,
        session,
      };
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
