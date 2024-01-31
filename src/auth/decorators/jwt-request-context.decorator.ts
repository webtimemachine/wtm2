import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtContext } from '../interfaces';

export const JwtRequestContext = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const jwtReqContext: JwtContext = request.user;
    return jwtReqContext;
  },
);
