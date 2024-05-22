import { Module } from '@nestjs/common';
import { IndexerService } from './services';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  providers: [IndexerService],
  exports: [IndexerService],
})
export class EncoderModule {}
