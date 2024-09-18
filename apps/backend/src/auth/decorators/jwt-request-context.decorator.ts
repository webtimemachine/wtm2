import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtRefreshContext } from '../interfaces';

export const JwtRequestContext = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const jwtReqContext: JwtRefreshContext = request.user;
    return jwtReqContext;
  },
);
