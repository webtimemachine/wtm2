import { DynamicModule, Module } from '@nestjs/common';
import { OpenAIService } from './service';

@Module({})
export class OpenAITestingModule {
  static forTest(): DynamicModule {
    return {
      module: OpenAITestingModule,
      providers: [OpenAIService],
      exports: [OpenAIService],
    };
  }
}
