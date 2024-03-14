import { Module } from '@nestjs/common';
import { NavigationEntryController } from './controllers';
import { NavigationEntryService } from './services';
import { CommonModule } from 'src/common/common.module';
import { SemanticSearchModule } from 'src/semanticSearch/semanticSearch.module'


@Module({
  imports: [CommonModule, SemanticSearchModule],
  controllers: [NavigationEntryController],
  providers: [NavigationEntryService],
})
export class NavigationModule { }
