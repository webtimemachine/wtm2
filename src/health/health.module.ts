import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './controllers';

@Module({
  imports: [CommonModule, TerminusModule],
  controllers: [HealthController],
})
export class HealthModule {}
