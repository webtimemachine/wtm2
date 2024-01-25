import { Module } from '@nestjs/common';
import { PrismaService } from './services';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class CommonModule {}
