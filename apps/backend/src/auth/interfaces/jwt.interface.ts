import { UserType } from '@prisma/client';

export interface JWTPayload {
  iat?: number;
  exp?: number;
  sub: string;
  userId: number;
  userType: UserType;
  sessionId?: number | undefined;
}
