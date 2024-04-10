import { JWTPayload } from './jwt.interface';
import { CompleteSession, CompleteUser } from '../../user/types';

export interface JwtContext {
  payload: JWTPayload;
  accessToken?: string;
  refreshToken?: string;
  verificationToken?: string;
  recoveryToken?: string;
  user: CompleteUser;
  session: CompleteSession;
}

export interface PartialJwtContext {
  payload: JWTPayload;
  verificationToken?: string;
  user: CompleteUser;
}

export interface RecoveryJwtContext {
  payload: JWTPayload;
  accessToken?: string;
  refreshToken?: string;
  verificationToken?: string;
  recoveryToken?: string;
  user: CompleteUser;
}
