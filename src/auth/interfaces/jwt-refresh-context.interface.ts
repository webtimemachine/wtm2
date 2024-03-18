import { JWTPayload } from './jwt.interface';
import { CompleteUser } from 'src/user/types';

export interface JwtRefreshContext {
  payload: JWTPayload;
  accessToken?: string;
  refreshToken?: string;
  verificationToken?: string;
  recoveryToken?: string;
  user: CompleteUser;
}
