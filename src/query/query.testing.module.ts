import { DynamicModule, Module } from '@nestjs/common';
import { QueryService } from './services';

@Module({})
export class QueryTestingModule {
  static forTest(testingModule: any): DynamicModule {
    return {
      module: QueryTestingModule,
      imports: [testingModule],
      providers: [QueryService],
      exports: [QueryService],
    };
  }
}
