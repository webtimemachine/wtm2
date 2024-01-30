import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { HttpExceptionMessages } from '../../common/enums';
import { appEnv } from '../../config';
import { JwtContext, JWTPayload } from '../interfaces';
import { AuthService } from '../services';

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
      const user = await this.authService.validateJwtAccessPayloadOrThrow(
        payload,
      );

      return {
        payload,
        user,
      };
    } catch (err) {
      throw new UnauthorizedException(HttpExceptionMessages.UNAUTHORIZED);
    }
  }
}
