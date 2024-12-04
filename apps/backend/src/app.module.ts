import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { NavigationModule } from './navigation/navigation.module';
import { ExplicitFilterModule } from './filter/filter.module';
import { SystemModule } from './system/system.module';

@Module({
  imports: [
    CommonModule,
    UserModule,
    NavigationModule,
    ExplicitFilterModule,
    SystemModule,
  ],
})
export class AppModule {}
