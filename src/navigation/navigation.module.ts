import { Module } from '@nestjs/common';
import { NavigationEntryController } from './controllers';
import { NavigationEntryService } from './services';
import { CommonModule } from 'src/common/common.module';
import { SemanticSearchModule } from 'src/semanticSearch/semanticSearch.module';
import { QueryModule } from 'src/query/query.module';

@Module({
  imports: [CommonModule, SemanticSearchModule, QueryModule],
  controllers: [NavigationEntryController],
  providers: [NavigationEntryService],
})
export class NavigationModule {}
