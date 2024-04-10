import { Module } from '@nestjs/common';
import { ExplicitFilterService } from './services';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  providers: [ExplicitFilterService],
  exports: [ExplicitFilterService],
})
export class ExplicitFilterModule {}
