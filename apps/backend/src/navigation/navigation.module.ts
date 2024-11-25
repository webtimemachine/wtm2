import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { EncoderModule } from '../encoder/encoder.module';
import { ExplicitFilterModule } from '../filter/filter.module';

import { NavigationEntryController } from './controllers';
import { NavigationEntryService } from './services';

@Module({
  imports: [CommonModule, EncoderModule, ExplicitFilterModule],
  controllers: [NavigationEntryController],
  providers: [NavigationEntryService],
})
export class NavigationModule {}
