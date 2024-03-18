import { JWTPayload } from './jwt.interface';
import { CompleteSession, CompleteUser } from 'src/user/types';

export interface JwtContext {
  payload: JWTPayload;
  accessToken?: string;
  refreshToken?: string;
  verificationToken?: string;
  recoveryToken?: string;
  user: CompleteUser;
  session: CompleteSession;
}
