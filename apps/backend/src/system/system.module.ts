import { Module } from '@nestjs/common';
import { SystemController } from './controllers';
import { SystemService } from './services';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  providers: [SystemService],
  controllers: [SystemController],
})
export class SystemModule {}
