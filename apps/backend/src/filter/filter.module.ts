import { Module } from '@nestjs/common';
import { ExplicitFilterService } from './services';
import { CommonModule } from '../common/common.module';
import { OpenAIModule } from 'src/openai/openai.module';

@Module({
  imports: [CommonModule, OpenAIModule],
  providers: [ExplicitFilterService],
  exports: [ExplicitFilterService],
})
export class ExplicitFilterModule {}
