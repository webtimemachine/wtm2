import { DynamicModule, Module } from '@nestjs/common';
import { SemanticProcessor } from './services';

@Module({})
export class SemanticSearchTestingModule {
  static forTest(testingModule: any): DynamicModule {
    return {
      module: SemanticSearchTestingModule,
      imports: [testingModule],
      providers: [SemanticProcessor],
      exports: [SemanticProcessor],
    };
  }
}
