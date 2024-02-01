import { Module } from '@nestjs/common';
import { NavigationEntryController } from './controllers';
import { NavigationEntryService } from './services';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [NavigationEntryController],
  providers: [NavigationEntryService],
})
export class NavigationModule {}
