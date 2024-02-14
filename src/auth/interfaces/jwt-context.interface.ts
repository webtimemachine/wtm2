import { User, Session } from '@prisma/client';
import { JWTPayload } from './jwt.interface';

export interface JwtContext {
  payload: JWTPayload;
  accessToken?: string;
  refreshToken?: string;
  verificationToken?: string;
  recoveryToken?: string;
  user: User;
  session?: Session;
}
