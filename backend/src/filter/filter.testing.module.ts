import { DynamicModule, Module } from '@nestjs/common';
import { ExplicitFilterService } from './services';

@Module({})
export class ExplicitFilterTestingModule {
  static forTest(testingModule: any): DynamicModule {
    return {
      module: ExplicitFilterTestingModule,
      imports: [testingModule],
      providers: [ExplicitFilterService],
      exports: [ExplicitFilterService],
    };
  }
}
