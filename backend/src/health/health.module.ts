import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { CommonModule } from '../common/common.module';
import { HealthController } from './controllers';

@Module({
  imports: [CommonModule, TerminusModule],
  controllers: [HealthController],
})
export class HealthModule {}
