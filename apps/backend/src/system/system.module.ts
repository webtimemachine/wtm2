import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { CommonModule } from '../common/common.module';
import { SystemController } from './controllers';
import { SystemService } from './services';

@Module({
  imports: [CommonModule, TerminusModule],
  providers: [SystemService],
  controllers: [SystemController],
})
export class SystemModule {}
