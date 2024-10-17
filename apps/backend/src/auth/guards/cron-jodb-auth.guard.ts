import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class CronJobAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (authHeader === `Bearer ${process.env.CRON_SECRET}`) {
      return true;
    }

    throw new UnauthorizedException('Authentication failed');
  }
}
