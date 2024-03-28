import { Module } from '@nestjs/common';
import { NavigationEntryController } from './controllers';
import { NavigationEntryService } from './services';
import { CommonModule } from 'src/common/common.module';
import { SemanticSearchModule } from 'src/semanticSearch/semanticSearch.module';
import { ExplicitFilterModule } from 'src/filter/filter.module';

@Module({
  imports: [CommonModule, SemanticSearchModule, ExplicitFilterModule],
  controllers: [NavigationEntryController],
  providers: [NavigationEntryService],
})
export class NavigationModule {}
