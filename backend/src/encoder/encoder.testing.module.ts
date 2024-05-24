import { DynamicModule, Module } from '@nestjs/common';
import { IndexerService } from './services';

@Module({})
export class EncoderTestingModule {
  static forTest(testingModule: any): DynamicModule {
    return {
      module: EncoderTestingModule,
      imports: [testingModule],
      providers: [IndexerService],
      exports: [IndexerService],
    };
  }
}
