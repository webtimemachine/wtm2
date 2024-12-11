import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { JwtContext } from '../interfaces';

import { WebTMLogger } from '../../common/helpers/webtm-logger';

@Injectable()
export class UserTypesGuard implements CanActivate {
  private readonly logger = new WebTMLogger(UserTypesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(
    executionContext: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const userTypes = this.reflector.get<string[]>(
      'userTypes',
      executionContext.getHandler(),
    );
    if (userTypes.length === 0) {
      return true;
    }

    const request = executionContext.switchToHttp().getRequest();

    const context: JwtContext = request?.user;

    if (!context || !context.user) {
      const error = new UnauthorizedException(
        'Unable to obtain context from request',
      );
      this.logger.error(error);
      throw error;
    }

    const { payload } = context;

    if (!userTypes.includes(payload.userType)) {
      const error = new ForbiddenException(
        'Forbidden interaction because of missing permissions',
      );
      this.logger.error(error);
      throw error;
    }

    return true;
  }
}
