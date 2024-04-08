import {
  INestApplication,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private logger = new Logger('PrismaService');

  constructor() {
    super();
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.$on('query', async (e) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.logger.log(`${e.query} ${e.params}`);
    });
  }

  async enableShutdownHooks(app: INestApplication): Promise<void> {
    process.on('beforeExit', async () => {
      await app.close();
    });
  }
}
