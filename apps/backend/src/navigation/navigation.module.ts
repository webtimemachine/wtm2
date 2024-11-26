import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { ExplicitFilterModule } from '../filter/filter.module';

import { NavigationEntryController } from './controllers';
import { NavigationEntryService } from './services';

@Module({
  imports: [CommonModule, ExplicitFilterModule],
  controllers: [NavigationEntryController],
  providers: [NavigationEntryService],
})
export class NavigationModule {}
