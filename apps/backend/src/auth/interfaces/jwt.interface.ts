import { UserType } from '@prisma/client';
import z from 'zod';

export interface JWTPayload {
  iat?: number;
  exp?: number;
  sub: string;
  userId: number;
  userType: UserType;
  sessionId?: number | undefined;
}

export const jwtExternalClientPayloadSchema = z.object({
  externalClientName: z.string(),
  deviceKey: z.string(),
  userAgent: z.string(),
  userAgentData: z.string(),
});

export type JwtExternalClientPayload = z.infer<
  typeof jwtExternalClientPayloadSchema
>;
