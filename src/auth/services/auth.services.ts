import { Injectable, Logger } from '@nestjs/common';

import { PrismaService } from '../../common/services';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly prismaService: PrismaService) {}
}
