import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { JwtContext } from '../interfaces';

@Injectable()
export class UserTypesGuard implements CanActivate {
  private readonly logger = new Logger(UserTypesGuard.name);

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
    if (!context) {
      this.logger.error('Unable to obtain context from request');
      throw new UnauthorizedException();
    }

    const { user, payload } = context;

    if (!user) {
      this.logger.error('Unable to obtain user from context');
      throw new UnauthorizedException();
    }

    if (!userTypes.includes(payload.userType)) {
      throw new ForbiddenException();
    }

    return true;
  }
}
