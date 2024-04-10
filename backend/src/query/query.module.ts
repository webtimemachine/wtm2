import { Module } from '@nestjs/common';
import { QueryService } from './services/';
import { QueyController } from './controllers';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  providers: [QueryService],
  controllers: [QueyController],
  exports: [QueryService],
})
export class QueryModule {}
